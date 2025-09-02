import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PaginatedResult } from "src/common/utils/paginated_result";
import { CreateTableDto } from "./dto/create-table.dto";
import { UpdateTableDto } from "./dto/update-table.dto";
import { TableFilterDto } from "./dto/filter-table.dto";
import { PosTable } from "src/entities/pos/table.entity";

@Injectable()
export class PosTableService {
  constructor(
    @InjectRepository(PosTable)
    private readonly posTableRepo: Repository<PosTable>
  ) {}

  async create(dto: CreateTableDto, userId: number): Promise<PosTable> {
    const newTable = this.posTableRepo.create({
      ...dto,
      created_by: userId,
    });
    return this.posTableRepo.save(newTable);
  }

  async findList(filter: TableFilterDto): Promise<PaginatedResult<PosTable>> {
    const {
      page = 1,
      limit = 10,
      search,
      sbu_id,
      outlet_id,
      floor_id,
    } = filter;

    const query = this.posTableRepo
      .createQueryBuilder("posTable")
      .leftJoinAndSelect("posTable.sbu", "sbu")
      .leftJoinAndSelect("posTable.outlet", "outlet")
      .leftJoinAndSelect("posTable.floor", "floor")
      .where("1=1");

    if (search) {
      query.andWhere("LOWER(posTable.table_name) LIKE :search", {
        search: `%${search.toLowerCase()}%`,
      });
    }

    if (sbu_id) {
      query.andWhere("posTable.sbu_id = :sbu_id", { sbu_id });
    }

    if (outlet_id) {
      query.andWhere("posTable.outlet_id = :outlet_id", { outlet_id });
    }

    if (floor_id) {
      query.andWhere("posTable.floor_id = :floor_id", { floor_id });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("posTable.created_at", "DESC")
      .getManyAndCount();

    return {
      records: data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<PosTable | null> {
    const table = await this.posTableRepo.findOne({
      where: { id },
      relations: ["sbu", "outlet", "floor"],
      withDeleted: true,
    });
    if (!table) {
      throw new NotFoundException("Table not found");
    }
    return table;
  }

  async findByName(tableName: string): Promise<PosTable> {
    const table = await this.posTableRepo.findOne({
      where: { table_name: tableName },
      relations: ["sbu", "outlet", "floor"],
      withDeleted: true,
    });
    if (!table) {
      throw new NotFoundException(`Table with name "${tableName}" not found`);
    }
    return table;
  }

  async update(
    id: number,
    dto: UpdateTableDto,
    userId: number
  ): Promise<PosTable | null> {
    const table = await this.posTableRepo.findOne({ where: { id } });
    if (!table) {
      throw new NotFoundException("Table not found");
    }

    Object.assign(table, {
      ...dto,
      updated_by: userId,
    });

    return this.posTableRepo.save(table);
  }

  async softDelete(id: number, userId: number): Promise<void> {
    const table = await this.posTableRepo.findOne({ where: { id } });
    if (!table) {
      throw new NotFoundException("Table not found");
    }

    table.deleted_by = userId;
    await this.posTableRepo.save(table);

    await this.posTableRepo.softDelete(id);
  }

  async restore(id: number, userId: number): Promise<void> {
    const table = await this.posTableRepo.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!table) {
      throw new NotFoundException("Table not found");
    }

    table.deleted_by = null;
    table.updated_by = userId;
    await this.posTableRepo.save(table);

    await this.posTableRepo.restore(id);
  }

  async hardDelete(id: number): Promise<void> {
    await this.posTableRepo.delete(id);
  }
}
