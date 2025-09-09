import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCounterDto } from "./dto/create-counter.dto";
import { PosCounter } from "src/entities/pos/counter.entity";
import { UpdateCounterDto } from "./dto/update-counter.dto";
import { CounterFilterDto } from "./dto/filter-counter.dto";
import { PaginatedResult } from "src/common/utils/paginated_result";

@Injectable()
export class CounterService {
  constructor(
    @InjectRepository(PosCounter)
    private readonly counterRepo: Repository<PosCounter>
  ) {}

  async create(dto: CreateCounterDto, userId: number): Promise<PosCounter> {
    const counter = this.counterRepo.create({
      ...dto,
      created_by: userId,
    });

    return this.counterRepo.save(counter);
  }

  async findAll(
    filter: CounterFilterDto
  ): Promise<PaginatedResult<PosCounter> | any> {
    const { page = 1, limit = 10, search } = filter;

    const query = this.counterRepo
      .createQueryBuilder("counter")
      .leftJoinAndSelect("counter.outlet", "outlet")
      .leftJoinAndSelect("counter.sbu", "sbu")
      .where("1=1");

    if (search && search.trim() !== "") {
      query.andWhere("counter.name LIKE :search", { search: `%${search}%` });
    }

    if (filter.sbu_id && filter.sbu_id > 0) {
      query.andWhere("counter.sbu_id = :sbu_id", { sbu_id: filter.sbu_id });
    }

    if (filter.outlet_id && filter.outlet_id > 0) {
      query.andWhere("counter.outlet_id = :outlet_id", {
        outlet_id: filter.outlet_id,
      });
    }

    if (filter.is_deleted === true) {
      query.withDeleted().andWhere("counter.deleted_at IS NOT NULL");
    } else {
      query.andWhere("counter.deleted_at IS NULL");
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("counter.created_at", "DESC")
      .getManyAndCount();

    return {
      records: data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(uuid: string): Promise<PosCounter> {
    const counter = await this.counterRepo.findOne({
      where: { uuid },
      relations: ["sbu", "outlet"],
    });
    if (!counter) throw new NotFoundException(`Counter ${uuid} not found`);
    return counter;
  }

  async update(
    uuid: string,
    dto: UpdateCounterDto,
    userId: number
  ): Promise<PosCounter> {
    const counter = await this.findOne(uuid);
    Object.assign(counter, { ...dto, updated_by: userId });
    return this.counterRepo.save(counter);
  }

  async softDelete(uuid: string, userId: number): Promise<void> {
    const counter = await this.findOne(uuid);

    if (!counter) {
      throw new NotFoundException(`Counter ${uuid} not found`);
    }

    counter.deleted_by = userId;

    await this.counterRepo.save(counter);
    await this.counterRepo.softDelete({ uuid });
  }

  async restore(uuid: string, userId: number): Promise<void> {
    const counter = await this.counterRepo.findOne({
      where: { uuid },
      withDeleted: true,
    });
    if (!counter) throw new NotFoundException(`Counter ${uuid} not found`);

    counter.deleted_by = null;
    counter.updated_by = userId;
    await this.counterRepo.save(counter);

    await this.counterRepo.restore({ uuid });
  }

  async hardDelete(uuid: string): Promise<void> {
    const counter = await this.counterRepo.findOne({
      where: { uuid },
      withDeleted: true,
    });
    if (!counter) throw new NotFoundException(`Counter ${uuid} not found`);

    // Hard delete: remove the entity to ensure permanent deletion
    await this.counterRepo.remove(counter);
  }
}
