import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "src/entities/pos/products.entity";
import { PaginatedResult } from "src/common/utils/paginated_result";
import { FilterProductDto } from "./dto/filter-product.dto";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>
  ) {}

  async create(dto: CreateProductDto, userId: number): Promise<Product> {
    const product = this.productRepo.create({
      ...dto,
      created_by: userId,
    });
    return await this.productRepo.save(product);
  }

  async findAll(
    filter: FilterProductDto
  ): Promise<PaginatedResult<Product> | any> {
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
  }

  async findOne(uuid: string): Promise<Product> {
    try {
      const product = await this.productRepo.findOne({
        where: { uuid },
        relations: ["category"],
      });
      if (!product) throw new NotFoundException(`Product ${uuid} not found`);
      return product;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async update(
    uuid: string,
    dto: UpdateProductDto,
    userId: number
  ): Promise<Product> {
    try {
      const product = await this.findOne(uuid);
      Object.assign(product, { ...dto, updated_by: userId });
      return this.productRepo.save(product);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async softDelete(uuid: string, userId: number): Promise<void> {
    try {
      const product = await this.findOne(uuid);
      product.deleted_by = userId;
      await this.productRepo.save(product);
      await this.productRepo.softDelete(product.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async restore(uuid: string, userId: number): Promise<void> {
    try {
      const product = await this.productRepo.findOne({
        where: { uuid },
        withDeleted: true,
      });
      if (!product) throw new NotFoundException(`Product ${uuid} not found`);
      product.deleted_by = null;
      product.updated_by = userId;
      await this.productRepo.save(product);
      await this.productRepo.restore(product.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async hardDelete(uuid: string): Promise<void> {
    const product = await this.productRepo.findOne({
      where: { uuid },
      withDeleted: true,
    });
    if (!product) throw new NotFoundException(`Product ${uuid} not found`);

    // Hard delete: remove the entity to ensure permanent deletion
    await this.productRepo.remove(product);
  }
}
