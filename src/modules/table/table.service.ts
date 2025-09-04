import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PaginatedResult } from "src/common/utils/paginated_result";
import { CreateTableDto } from "./dto/create-table.dto";
import { UpdateTableDto } from "./dto/update-table.dto";
import { TableFilterDto } from "./dto/filter-table.dto";
import { PosTable } from "src/entities/pos/table.entity";
// import { getCurrentUser } from "src/common/utils/user.util";

@Injectable()
export class PosTableService {
  constructor(
    @InjectRepository(PosTable)
    private readonly posTable: Repository<PosTable>
  ) {}

  async create(dto: CreateTableDto, userId: number): Promise<PosTable> {
    try {
      const newTable = this.posTable.create({
        ...dto,
        created_by: +userId,
      });

      return this.posTable.save(newTable);
    } catch (error) {
      throw new NotFoundException("Table not found");
    }
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

    const query = this.posTable
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

  async findOne(uuid: string): Promise<PosTable | null> {
    const table = await this.posTable.findOne({
      where: { uuid },
      // relations: ["sbu", "outlet", "floor"],
      withDeleted: true,
    });
    if (!table) {
      throw new NotFoundException("Table not found");
    }
    return table;
  }

  async findByName(tableName: string): Promise<PosTable> {
    const table = await this.posTable.findOne({
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
    uuid: string,
    dto: UpdateTableDto,
    userId
  ): Promise<PosTable | null> {
    try {
      const table = await this.posTable.findOne({ where: { uuid } });
      if (!table) {
        throw new NotFoundException("Table not found");
      }

      Object.assign(table, {
        ...dto,
        updated_by: +userId,
      });

      return this.posTable.save(table);
    } catch (error) {
      throw new NotFoundException("Table not found");
    }
  }

  async softDelete(uuid: string, userId: number): Promise<void> {
    try {
      const table = await this.posTable.findOne({ where: { uuid } });
      if (!table) {
        throw new NotFoundException("Table not found");
      }

      table.deleted_by = userId;
      await this.posTable.save(table);

      await this.posTable.softDelete(table.id);
    } catch (error) {
      throw new NotFoundException("Table not found");
    }
  }

  async restore(uuid: string, userId: number): Promise<void> {
    try {
      const table = await this.posTable.findOne({
        where: { uuid },
        withDeleted: true,
      });

      if (!table) {
        throw new NotFoundException("Table not found");
      }

      table.deleted_by = null;
      table.deleted_at = null;
      table.updated_by = userId;
      await this.posTable.save(table);

      await this.posTable.restore(table.id);
    } catch (error) {
      throw new NotFoundException("Table not found");
    }
  }

  async hardDelete(uuid: string): Promise<void> {
    const table = await this.posTable.findOne({ where: { uuid } });
    if (!table) {
      throw new NotFoundException(`table with uuid ${uuid} not found`);
    }

    // Permanently delete
    await this.posTable.delete(table.id);
  }
}
