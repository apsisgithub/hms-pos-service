import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateWaiterDto } from "./dto/create-waiter.dto";
import { UpdateWaiterDto } from "./dto/update-waiter.dto";
import { Waiter } from "src/entities/pos/waiter.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { WaiterFilterDto } from "./dto/filter-waiter.dto";
import { PaginatedResult } from "src/common/utils/paginated_result";

@Injectable()
export class WaiterService {
  constructor(
    @InjectRepository(Waiter)
    private readonly waiterRepo: Repository<Waiter>
  ) {}

  async create(dto: CreateWaiterDto, userId: number): Promise<Waiter> {
    try {
      //prepare object
      const waiter = this.waiterRepo.create({
        ...dto,
        uuid: uuidv4(),
        created_by: userId,
      });

      // Save to DB
      return await this.waiterRepo.save(waiter);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(filter: WaiterFilterDto): Promise<PaginatedResult<Waiter>> {
    const { page = 1, limit = 10, search } = filter;

    const query = this.waiterRepo
      .createQueryBuilder("waiter")
      .leftJoinAndSelect("waiter.profile", "profile")
      .leftJoinAndSelect("waiter.outlet", "outlet")
      .leftJoinAndSelect("waiter.sbu", "sbu")
      .select([
        "waiter.id",
        "waiter.uuid",
        "waiter.sbu_id",
        "waiter.outlet_id",
        "waiter.user_id",
        "waiter.created_at",
        "waiter.updated_at",
        "profile.name",
        "profile.user_name",
        "profile.address",
        "profile.email",
        "profile.mobile_no",
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

    if (search) {
      query.andWhere("profile.name LIKE :search", {
        search: `%${search}%`,
      });
    }

    if (filter.sbu_id) {
      query.andWhere("waiter.sbu_id = :sbu_id", { sbu_id: filter.sbu_id });
    }

    if (filter.outlet_id) {
      query.andWhere("waiter.outlet_id = :outlet_id", {
        outlet_id: filter.outlet_id,
      });
    }

    if (filter.is_deleted && filter.is_deleted === "Yes") {
      query.withDeleted().andWhere("waiter.deleted_at IS NOT NULL");
    } else {
      query.andWhere("waiter.deleted_at IS NULL");
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("waiter.created_at", "DESC")
      .getManyAndCount();

    return {
      records: data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(uuid: string): Promise<Waiter> {
    const waiter = await this.waiterRepo
      .createQueryBuilder("waiter")
      .leftJoin("waiter.profile", "profile")
      .leftJoin("waiter.outlet", "outlet")
      .leftJoin("waiter.sbu", "sbu")
      .where("waiter.uuid = :uuid", { uuid })
      .withDeleted()
      .select([
        "waiter.id",
        "waiter.uuid",
        "waiter.sbu_id",
        "waiter.outlet_id",
        "waiter.user_id",
        "waiter.created_at",
        "waiter.updated_at",
        "profile.name",
        "profile.user_name",
        "profile.address",
        "profile.email",
        "profile.mobile_no",
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
    if (!waiter) throw new NotFoundException("Waiter not found");
    return waiter;
  }

  async update(
    uuid: string,
    dto: UpdateWaiterDto,
    userId: number
  ): Promise<Waiter> {
    try {
      const waiter = await this.waiterRepo.findOne({ where: { uuid } });
      if (!waiter) {
        throw new NotFoundException("Waiter not found");
      }

      // Merge DTO into entity and track updater
      Object.assign(waiter, {
        ...dto,
        updated_by: userId, // Track who updated
      });

      // Save updated entity
      return await this.waiterRepo.save(waiter);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async softDelete(uuid: string, userId: number): Promise<any | void> {
    // Find the entity to soft delete
    const waiter = await this.waiterRepo.findOne({ where: { uuid } });

    if (!waiter) {
      throw new NotFoundException("waiter not found");
    }

    // Track who deleted it
    waiter.deleted_by = userId;
    await this.waiterRepo.save(waiter);

    // Perform soft delete
    await this.waiterRepo.softDelete(waiter.id);
  }

  async restore(uuid: string, userId: number): Promise<void> {
    // Find soft-deleted entity
    const waiter = await this.waiterRepo.findOne({
      where: { uuid },
      withDeleted: true, // include soft-deleted records
    });

    if (!waiter) {
      throw new NotFoundException("Waiter not found");
    }

    // Reset deleted_by and track who restored
    waiter.deleted_by = null;
    waiter.updated_by = userId;

    // Save the updated fields first
    await this.waiterRepo.save(waiter);

    // Restore soft-deleted entity
    await this.waiterRepo.restore(waiter.id);
  }

  async hardDelete(uuid: string): Promise<void> {
    // waiter check if the record exists first
    const waiter = await this.waiterRepo.findOne({ where: { uuid } });
    if (!waiter) {
      throw new NotFoundException(`waiter with uuid ${uuid} not found`);
    }

    // Permanently delete
    await this.waiterRepo.delete(waiter.id);
  }
}
