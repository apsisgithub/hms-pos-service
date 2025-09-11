import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Kitchen } from "src/entities/pos/kitchen.entity";
import { FilterKitchenDto } from "./dto/filter-kitchen.dto";
import { PaginatedResult } from "src/common/utils/paginated_result";
import { CreateKitchenDto } from "./dto/create-kitchen.dto";
import { UpdateKitchenDto } from "./dto/update-kitchen.dto";
import { KitchenDropdownDto } from "./dto/dropdown-kitchen.dto";

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
      ...dto,
      created_by: userId,
    });
    return this.kitchenRepo.save(kitchen);
  }

  // Find all with pagination + filters
  async findAll(filter: FilterKitchenDto): Promise<PaginatedResult<Kitchen>> {
    const {
      page = 1,
      limit = 10,
      search,
      is_deleted,
      is_open,
      status,
      type,
      printer_enabled,
    } = filter;

    const query = this.kitchenRepo
      .createQueryBuilder("kitchen")
      .leftJoinAndSelect("kitchen.outlet", "outlet")
      .leftJoinAndSelect("kitchen.sbu", "sbu")
      .select([
        "kitchen.id",
        "kitchen.uuid",
        "kitchen.sbu_id",
        "kitchen.outlet_id",
        "kitchen.name",
        "kitchen.location",
        "kitchen.type",
        "kitchen.is_open",
        "kitchen.opened_at",
        "kitchen.closed_at",
        "kitchen.printer_name",
        "kitchen.printer_ip",
        "kitchen.printer_port",
        "kitchen.printer_enabled",
        "kitchen.status",
        "kitchen.created_at",
        "kitchen.updated_at",
        "outlet.name",
        "outlet.phone",
        "outlet.location",
        "outlet.logo",
        "sbu.name",
        "sbu.address",
        "sbu.email",
        "sbu.logo_name",
      ])
      .where("1=1");

    if (search && search.trim() !== "") {
      query.andWhere("kitchen.name LIKE :search", { search: `%${search}%` });
    }

    if (is_open === "Yes") {
      query.andWhere("kitchen.is_open = :is_open", { is_open: 1 });
    } else if (is_open === "No") {
      query.andWhere("kitchen.is_open = :is_open", { is_open: 0 });
    }

    if (is_deleted === "Yes") {
      query.withDeleted().andWhere("kitchen.deleted_at IS NOT NULL");
    } else {
      query.andWhere("kitchen.deleted_at IS NULL");
    }

    if (status) {
      query.andWhere("kitchen.status = :status", { status });
    }

    if (type) {
      query.andWhere("kitchen.type = :type", { type });
    }

    if (printer_enabled === "Yes") {
      query.andWhere("kitchen.printer_enabled = :printer_enabled", {
        printer_enabled: 1,
      });
    } else if (printer_enabled === "No") {
      query.andWhere("kitchen.printer_enabled = :printer_enabled", {
        printer_enabled: 0,
      });
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
  async findOne(uuid: string): Promise<any> {
    const kitchen = this.kitchenRepo
      .createQueryBuilder("kitchen")
      .leftJoinAndSelect("kitchen.outlet", "outlet")
      .leftJoinAndSelect("kitchen.sbu", "sbu")
      .where("kitchen.uuid = :uuid", { uuid })
      .select([
        "kitchen.id",
        "kitchen.uuid",
        "kitchen.sbu_id",
        "kitchen.outlet_id",
        "kitchen.name",
        "kitchen.location",
        "kitchen.type",
        "kitchen.is_open",
        "kitchen.opened_at",
        "kitchen.closed_at",
        "kitchen.printer_name",
        "kitchen.printer_ip",
        "kitchen.printer_port",
        "kitchen.printer_enabled",
        "kitchen.status",
        "kitchen.created_at",
        "kitchen.updated_at",
        "outlet.name",
        "outlet.phone",
        "outlet.location",
        "outlet.logo",
        "sbu.name",
        "sbu.address",
        "sbu.email",
        "sbu.logo_name",
      ])
      .getOne();
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
      await manager
        .getRepository(Kitchen)
        .update(kitchen.id, { ...dto, updated_by: userId });

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

  async dropdown(filter: KitchenDropdownDto): Promise<any[]> {
    const { sbu_id, outlet_id, search, type } = filter;

    const query = this.kitchenRepo
      .createQueryBuilder("kitchen")
      .where("kitchen.deleted_at IS NULL");

    if (sbu_id) {
      query.andWhere("kitchen.sbu_id = :sbu_id", { sbu_id });
    }

    if (outlet_id) {
      query.andWhere("kitchen.outlet_id = :outlet_id", { outlet_id });
    }
    if (type) {
      query.andWhere("kitchen.type = :type", { type });
    }

    if (search) {
      query.andWhere("kitchen.name LIKE :search", { search: `%${search}%` });
    }

    return await query.orderBy("kitchen.name", "ASC").getMany();
  }
}
