import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateCashierDto } from "./dto/create-cashier.dto";
import { UpdateCashierDto } from "./dto/update-cashier.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { CashierFilterDto } from "./dto/filter-cashier.dto";
import { PaginatedResult } from "src/common/utils/paginated_result";
import { PosCashier } from "src/entities/pos/cashier.entity";

@Injectable()
export class CashierService {
  constructor(
    @InjectRepository(PosCashier)
    private readonly cashierRepo: Repository<PosCashier>
  ) {}

  async create(dto: CreateCashierDto, userId: number): Promise<PosCashier> {
    try {
      //prepare object
      const cashier = this.cashierRepo.create({
        ...dto,
        uuid: uuidv4(),
        created_by: userId,
      });

      // Save to DB
      return await this.cashierRepo.save(cashier);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(
    filter: CashierFilterDto
  ): Promise<PaginatedResult<PosCashier>> {
    const { page = 1, limit = 10, search } = filter;

    const query = this.cashierRepo
      .createQueryBuilder("cashier")
      .leftJoinAndSelect("cashier.profile", "profile")
      .leftJoinAndSelect("cashier.outlet", "outlet")
      .leftJoinAndSelect("cashier.sbu", "sbu")
      .where("1=1");

    if (search) {
      query.andWhere("cashier.name LIKE :search", { search: `%${search}%` });
    }

    if (filter.sbu_id) {
      query.andWhere("cashier.sbu_id = :sbu_id", { sbu_id: filter.sbu_id });
    }

    if (filter.outlet_id) {
      query.andWhere("cashier.outlet_id = :outlet_id", {
        outlet_id: filter.outlet_id,
      });
    }

    if (filter.is_deleted && filter.is_deleted === "Yes") {
      query.withDeleted().andWhere("cashier.deleted_at IS NOT NULL");
    } else {
      query.andWhere("cashier.deleted_at IS NULL");
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("cashier.created_at", "DESC")
      .getManyAndCount();

    return {
      records: data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(uuid: string): Promise<PosCashier> {
    const cashier = await this.cashierRepo.findOne({
      where: { uuid },
      relations: ["outlet", "sbu"],
      withDeleted: true,
    });
    if (!cashier) throw new NotFoundException("cashier not found");
    return cashier;
  }

  async update(
    uuid: string,
    dto: UpdateCashierDto,
    userId: number
  ): Promise<PosCashier> {
    try {
      const cashier = await this.cashierRepo.findOne({ where: { uuid } });
      if (!cashier) {
        throw new NotFoundException("cashier not found");
      }

      // Merge DTO into entity and track updater
      Object.assign(cashier, {
        ...dto,
        updated_by: userId, // Track who updated
      });

      // Save updated entity
      return await this.cashierRepo.save(cashier);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async softDelete(uuid: string, userId: number): Promise<any | void> {
    // Find the entity to soft delete
    const cashier = await this.cashierRepo.findOne({ where: { uuid } });

    if (!cashier) {
      throw new NotFoundException("cashier not found");
    }

    // Track who deleted it
    cashier.deleted_by = userId;
    await this.cashierRepo.save(cashier);

    // Perform soft delete
    await this.cashierRepo.softDelete(cashier.id);
  }

  async restore(uuid: string, userId: number): Promise<void> {
    // Find soft-deleted entity
    const cashier = await this.cashierRepo.findOne({
      where: { uuid },
      withDeleted: true, // include soft-deleted records
    });

    if (!cashier) {
      throw new NotFoundException("cashier not found");
    }

    // Reset deleted_by and track who restored
    cashier.deleted_by = null;
    cashier.updated_by = userId;

    // Save the updated fields first
    await this.cashierRepo.save(cashier);

    // Restore soft-deleted entity
    await this.cashierRepo.restore(cashier.id);
  }

  async hardDelete(uuid: string): Promise<void> {
    // cashier check if the record exists first
    const cashier = await this.cashierRepo.findOne({ where: { uuid } });
    if (!cashier) {
      throw new NotFoundException(`cashier with uuid ${uuid} not found`);
    }

    // Permanently delete
    await this.cashierRepo.delete(cashier.id);
  }
}
