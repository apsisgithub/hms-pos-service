import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CreateComboMealDto } from "./dto/create-combo-meal.dto";
import { UpdateComboMealDto } from "./dto/update-combo-meal.dto";
import { FilterComboMealDto } from "./dto/filter-combo-meal.dto";
import { PaginatedResult } from "src/common/utils/paginated_result";
import { ComboMeal } from "src/entities/pos/combo_meals.entity";
import { ComboMealProduct } from "src/entities/pos/combo_meal_products.entity";

@Injectable()
export class ComboMealService {
  constructor(
    @InjectRepository(ComboMeal)
    private readonly comboRepo: Repository<ComboMeal>,

    @InjectRepository(ComboMealProduct)
    private readonly comboProductRepo: Repository<ComboMealProduct>,

    private readonly dataSource: DataSource
  ) {}

  // ---------- CREATE ----------
  async create(dto: CreateComboMealDto, userId: number): Promise<ComboMeal> {
    const combo = this.comboRepo.create({
      ...dto,
      created_by: userId,
    });
    await this.comboRepo.save(combo);

    // Save combo products
    if (dto.items && dto.items.length > 0) {
      const comboProducts = dto.items.map((p) =>
        this.comboProductRepo.create({
          combo: combo,
          product_id: p.product_id,
        })
      );
      await this.comboProductRepo.save(comboProducts);
      combo.items = comboProducts;
    }

    return combo;
  }

  // ---------- FIND ALL ----------
  async findAll(
    filter: FilterComboMealDto
  ): Promise<PaginatedResult<ComboMeal>> {
    const { page = 1, limit = 10, search, is_active, is_deleted } = filter;

    const query = this.comboRepo
      .createQueryBuilder("combo")
      .leftJoinAndSelect("combo.items", "cmp")
      .leftJoinAndSelect("cmp.product", "product")
      .where("1=1");

    if (search && search.trim() !== "") {
      query.andWhere("combo.name LIKE :search", { search: `%${search}%` });
    }

    if (is_active === "Yes") {
      query.andWhere("combo.is_active = :is_active", { is_active: 1 });
    } else if (is_active === "No") {
      query.andWhere("combo.is_active = :is_active", { is_active: 0 });
    }

    if (is_deleted === "Yes") {
      query.withDeleted().andWhere("combo.deleted_at IS NOT NULL");
    } else {
      query.andWhere("combo.deleted_at IS NULL");
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("combo.created_at", "DESC")
      .getManyAndCount();

    return {
      records: data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ---------- FIND ONE ----------
  async findOne(uuid: string): Promise<ComboMeal> {
    const combo = await this.comboRepo.findOne({
      where: { uuid },
      relations: [
        "items",
        "items.product",
        "items.product.variants",
        "items.product.addons",
      ],
    });
    if (!combo) throw new NotFoundException(`ComboMeal ${uuid} not found`);
    return combo;
  }

  // ---------- UPDATE ----------
  async update(
    uuid: string,
    dto: UpdateComboMealDto,
    userId: number
  ): Promise<ComboMeal> {
    const combo = await this.comboRepo.findOne({ where: { uuid } });
    if (!combo) throw new NotFoundException(`ComboMeal ${uuid} not found`);

    return this.dataSource.transaction(async (manager) => {
      const comboId = combo.id;

      // Update combo
      await manager.getRepository(ComboMeal).update(comboId, {
        name: dto.name,
        description: dto.description,
        is_active: dto.is_active,
        updated_by: userId,
      });

      // Remove old products
      await manager
        .getRepository(ComboMealProduct)
        .delete({ combo_id: comboId });

      // Insert/update products
      if (dto.items?.length) {
        const comboProducts = dto.items.map((p) =>
          manager.getRepository(ComboMealProduct).create({
            combo_id: comboId,
            product_id: p.product_id,
          })
        );
        await manager.getRepository(ComboMealProduct).save(comboProducts);
      }

      // Return updated combo
      const updated = await manager.getRepository(ComboMeal).findOne({
        where: { id: comboId },
        relations: ["items", "items.product"],
      });

      if (!updated)
        throw new NotFoundException(`ComboMeal ${uuid} not found after update`);
      return updated;
    });
  }

  // ---------- SOFT DELETE ----------
  async softDelete(uuid: string, userId: number): Promise<void> {
    const combo = await this.comboRepo.findOne({ where: { uuid } });
    if (!combo) throw new NotFoundException(`ComboMeal ${uuid} not found`);

    await this.comboRepo.update(combo.id, {
      deleted_at: new Date(),
      deleted_by: userId,
    });
  }

  // ---------- RESTORE ----------
  async restore(uuid: string, userId: number): Promise<void> {
    const combo = await this.comboRepo.findOne({ where: { uuid } });
    if (!combo) throw new NotFoundException(`ComboMeal ${uuid} not found`);

    await this.comboRepo.update(combo.id, {
      deleted_at: null,
      deleted_by: null,
      updated_by: userId,
    });
  }

  // ---------- HARD DELETE ----------
  async hardDelete(uuid: string): Promise<void> {
    const combo = await this.comboRepo.findOne({ where: { uuid } });
    if (!combo) throw new NotFoundException(`ComboMeal ${uuid} not found`);

    await this.dataSource.transaction(async (manager) => {
      await manager
        .getRepository(ComboMealProduct)
        .delete({ combo_id: combo.id });
      await manager.getRepository(ComboMeal).delete(combo.id);
    });
  }
}
