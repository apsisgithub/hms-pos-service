import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Kitchen } from "src/entities/pos/kitchen.entity";
import { FilterKitchenDto } from "./dto/filter-kitchen.dto";
import { PaginatedResult } from "src/common/utils/paginated_result";
import { CreateKitchenDto } from "./dto/create-kitchen.dto";
import { UpdateKitchenDto } from "./dto/update-kitchen.dto";

@Injectable()
export class KitchenService {
  constructor(
    @InjectRepository(Kitchen)
    private readonly kitchenRepo: Repository<Kitchen>,
    private readonly dataSource: DataSource
  ) {}

  // Create
  async create(dto: CreateKitchenDto, userId: number): Promise<Kitchen> {
    const kitchen = this.kitchenRepo.create({
      name: dto.name,
      type: dto.type ?? "KITCHEN",
      outlet_id: dto.outlet_id ?? null,
      is_active: dto.is_active ?? true,
      created_by: userId,
    });
    return this.kitchenRepo.save(kitchen);
  }

  // Find all with pagination + filters
  async findAll(filter: FilterKitchenDto): Promise<PaginatedResult<Kitchen>> {
    const { page = 1, limit = 10, search, is_deleted, is_active } = filter;

    const query = this.kitchenRepo.createQueryBuilder("kitchen").where("1=1");

    if (search && search.trim() !== "") {
      query.andWhere("kitchen.name LIKE :search", { search: `%${search}%` });
    }

    if (is_active === "Yes") {
      query.andWhere("kitchen.is_active = :is_active", { is_active: 1 });
    } else if (is_active === "No") {
      query.andWhere("kitchen.is_active = :is_active", { is_active: 0 });
    }

    if (is_deleted === "Yes") {
      query.withDeleted().andWhere("kitchen.deleted_at IS NOT NULL");
    } else {
      query.andWhere("kitchen.deleted_at IS NULL");
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("kitchen.created_at", "DESC")
      .getManyAndCount();

    return {
      records: data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Find one by uuid
  async findOne(uuid: string): Promise<Kitchen> {
    const kitchen = await this.kitchenRepo.findOne({ where: { uuid } });
    if (!kitchen) throw new NotFoundException(`Kitchen ${uuid} not found`);
    return kitchen;
  }

  // Update
  async update(
    uuid: string,
    dto: UpdateKitchenDto,
    userId: number
  ): Promise<Kitchen> {
    const kitchen = await this.kitchenRepo.findOne({ where: { uuid } });
    if (!kitchen) throw new NotFoundException(`Kitchen ${uuid} not found`);

    return this.dataSource.transaction(async (manager) => {
      await manager.getRepository(Kitchen).update(kitchen.id, {
        name: dto.name ?? kitchen.name,
        type: dto.type ?? kitchen.type,
        outlet_id: dto.outlet_id ?? kitchen.outlet_id,
        is_active: dto.is_active ?? kitchen.is_active,
        updated_by: userId,
      });

      const updated = await manager
        .getRepository(Kitchen)
        .findOne({ where: { id: kitchen.id } });
      if (!updated)
        throw new NotFoundException(`Kitchen ${uuid} not found after update`);
      return updated;
    });
  }

  // Soft delete
  async softDelete(uuid: string, userId: number): Promise<void> {
    const kitchen = await this.kitchenRepo.findOne({ where: { uuid } });
    if (!kitchen) throw new NotFoundException(`Kitchen ${uuid} not found`);

    await this.kitchenRepo.update(kitchen.id, {
      deleted_at: new Date(),
      deleted_by: userId,
    });
  }

  // Restore
  async restore(uuid: string, userId: number): Promise<void> {
    const kitchen = await this.kitchenRepo.findOne({
      where: { uuid },
      withDeleted: true,
    });
    if (!kitchen) throw new NotFoundException(`Kitchen ${uuid} not found`);

    await this.kitchenRepo.update(kitchen.id, {
      deleted_at: null,
      deleted_by: null,
      updated_by: userId,
    });
  }

  // Hard delete
  async hardDelete(uuid: string): Promise<void> {
    const kitchen = await this.kitchenRepo.findOne({
      where: { uuid },
      withDeleted: true,
    });
    if (!kitchen) throw new NotFoundException(`Kitchen ${uuid} not found`);

    await this.dataSource.transaction(async (manager) => {
      await manager.getRepository(Kitchen).delete(kitchen.id);
    });
  }
}
