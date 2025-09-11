import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "src/entities/pos/products.entity";
import { PaginatedResult } from "src/common/utils/paginated_result";
import { FilterProductDto } from "./dto/filter-product.dto";
import { ProductVariant } from "src/entities/pos/product-varient.entity";
import { ProductAddon } from "src/entities/pos/product_addons.entity";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,

    @InjectRepository(ProductAddon)
    private readonly addonRepo: Repository<ProductAddon>,

    private readonly dataSource: DataSource
  ) {}

  // ---------- CREATE ----------
  async create(dto: CreateProductDto, userId: number): Promise<Product> {
    // Step 1: Save the main product
    const product = this.productRepo.create({
      ...dto,
      created_by: userId,
    });
    await this.productRepo.save(product);

    // Step 2: Save variants (if any)
    if (dto.variants && dto.variants.length > 0) {
      const variants = dto.variants.map((v) =>
        this.variantRepo.create({ ...v, product })
      );
      await this.variantRepo.save(variants);
      product.variants = variants;
    }

    // Step 3: Save addons (if any)
    if (dto.addons && dto.addons.length > 0) {
      const addons = dto.addons.map((a) =>
        this.addonRepo.create({ ...a, product })
      );
      await this.addonRepo.save(addons);
      product.addons = addons;
    }

    return product;
  }

  // ------------------ FIND ALL WITH PAGINATION ------------------
  async findAll(
    filter: FilterProductDto
  ): Promise<PaginatedResult<Product> | any> {
    try {
      const { page = 1, limit = 10, search } = filter;

      const query = this.productRepo
        .createQueryBuilder("product")
        .leftJoinAndSelect("product.outlet", "outlet")
        .leftJoinAndSelect("product.sbu", "sbu")
        .leftJoinAndSelect("product.category", "category")
        .where("1=1");

      if (search && search.trim() !== "") {
        query.andWhere("product.name LIKE :search", { search: `%${search}%` });
      }

      if (filter.sbu_id && filter.sbu_id > 0) {
        query.andWhere("product.sbu_id = :sbu_id", { sbu_id: filter.sbu_id });
      }

      if (filter.outlet_id && filter.outlet_id > 0) {
        query.andWhere("product.outlet_id = :outlet_id", {
          outlet_id: filter.outlet_id,
        });
      }

      if (filter.category_id && filter.category_id > 0) {
        query.andWhere("product.category_id = :category_id", {
          category_id: filter.category_id,
        });
      }

      if (filter.is_deleted === "Yes") {
        query.withDeleted().andWhere("product.deleted_at IS NOT NULL");
      } else {
        query.andWhere("product.deleted_at IS NULL");
      }

      if (filter.is_special === "Yes") {
        query.andWhere("product.is_special = :is_special", { is_special: 1 });
      } else if (filter.is_special === "No") {
        query.andWhere("product.is_special = :is_special", { is_special: 0 });
      }

      if (filter.offer_is_available === "Yes") {
        query.andWhere("product.offer_is_available = :offer_is_available", {
          offer_is_available: 1,
        });
      } else if (filter.offer_is_available === "No") {
        query.andWhere("product.offer_is_available = :offer_is_available", {
          offer_is_available: 0,
        });
      }

      const [data, total] = await query
        .skip((page - 1) * limit)
        .take(limit)
        .orderBy("product.created_at", "DESC")
        .getManyAndCount();

      return {
        records: data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ------------------ FIND ONE ------------------
  async findOne(uuid: string): Promise<Product> {
    try {
      const product = await this.productRepo.findOne({
        where: { uuid },
        relations: [
          "category",
          "outlet",
          "sbu",
          "variants",
          "addons",
          "addons.addon",
        ],
      });
      if (!product) throw new NotFoundException(`Product ${uuid} not found`);
      return product;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  // ------------------ UPDATE ------------------
  async update(
    uuid: string,
    dto: UpdateProductDto,
    userId: number
  ): Promise<Product> {
    const product = await this.productRepo.findOne({ where: { uuid } });

    if (!product) {
      throw new NotFoundException(`Product ${uuid} not found`);
    }

    return this.dataSource.transaction(async (manager) => {
      const productId = product.id;

      // 1. Update product
      await manager.getRepository(Product).update(productId, {
        sbu_id: dto.sbu_id,
        outlet_id: dto.outlet_id,
        category_id: dto.category_id,
        name: dto.name,
        image: dto.image,
        component: dto.component,
        description: dto.description,
        menu_type: dto.menu_type,
        product_vat: dto.product_vat,
        is_special: dto.is_special,
        offer_is_available: dto.offer_is_available,
        offer_start_date: dto.offer_start_date,
        offer_end_date: dto.offer_end_date,
        position: dto.position,
        kitchen_id: dto.kitchen_id,
        is_group: dto.is_group,
        is_custom_qty: dto.is_custom_qty,
        cooked_time: dto.cooked_time,
        is_active: dto.is_active,
        updated_by: userId,
      });

      // 2. Variants sync
      const variantRepo = manager.getRepository(ProductVariant);

      //remove old variants not in the updated list
      await variantRepo.delete({ product_id: productId });

      //insert or update variants
      if (dto.variants?.length) {
        const variantEntities = dto.variants.map((v) => ({
          product_id: productId,
          variant_name: v.variant_name,
          sku: v.sku,
          price: v.price,
        }));
        await variantRepo.save(variantEntities);
      }

      // 3. Addons sync
      const addonRepo = manager.getRepository(ProductAddon);

      //delete old addons not in the updated list
      await addonRepo.delete({ product_id: productId });

      //insert or update addons
      if (dto.addons?.length) {
        const addonEntities = dto.addons.map((a) => ({
          product_id: productId,
          addon_id: a.addon_id,
          extra_price: a.extra_price,
        }));
        await addonRepo.save(addonEntities);
      }

      // 4. Return updated product (force non-null or throw if missing)
      const updated = await manager.getRepository(Product).findOne({
        where: { id: productId },
        relations: ["category", "variants", "addons", "addons.addon"],
      });

      if (!updated) {
        throw new NotFoundException(`Product ${uuid} not found after update`);
      }

      return updated;
    });
  }

  // ------------------ SOFT DELETE ------------------
  async softDelete(uuid: string, userId: number): Promise<void> {
    const product = await this.productRepo.findOne({ where: { uuid } });
    if (!product) throw new NotFoundException(`Product ${uuid} not found`);

    await this.productRepo.update(product.id, {
      deleted_at: new Date(),
      deleted_by: userId,
    });

    // Optionally, soft delete related variants and addons
    await this.variantRepo.update(
      { product_id: product.id },
      { deleted_at: new Date(), deleted_by: userId }
    );

    await this.addonRepo.update(
      { product_id: product.id },
      { deleted_at: new Date(), deleted_by: userId }
    );
  }

  // ------------------ RESTORE ------------------
  async restore(uuid: string, userId: number): Promise<void> {
    const product = await this.productRepo.findOne({ where: { uuid } });
    if (!product) throw new NotFoundException(`Product ${uuid} not found`);

    await this.productRepo.update(product.id, {
      deleted_at: null,
      deleted_by: null,
      updated_by: userId,
    });

    await this.variantRepo.update(
      { product_id: product.id },
      { deleted_at: null, deleted_by: null }
    );

    await this.addonRepo.update(
      { product_id: product.id },
      { deleted_at: null, deleted_by: null }
    );
  }

  // ------------------ HARD DELETE ------------------
  async hardDelete(uuid: string): Promise<void> {
    const product = await this.productRepo.findOne({ where: { uuid } });
    if (!product) throw new NotFoundException(`Product ${uuid} not found`);

    await this.dataSource.transaction(async (manager) => {
      // Delete variants
      await manager
        .getRepository(ProductVariant)
        .delete({ product_id: product.id });

      // Delete product-addons
      await manager
        .getRepository(ProductAddon)
        .delete({ product_id: product.id });

      // Delete product
      await manager.getRepository(Product).delete(product.id);
    });
  }
}
