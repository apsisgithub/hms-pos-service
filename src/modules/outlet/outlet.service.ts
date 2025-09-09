import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateOutletDto } from "./dto/create-outlet.dto";
import { Outlet } from "src/entities/pos/outlet.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { UpdateOutletDto } from "./dto/update-outlet.dto";
import { PaginatedResult } from "src/common/utils/paginated_result";
import { OutletFilterDto } from "./dto/outlet-filter.dto";

@Injectable()
export class OutletService {
  constructor(
    @InjectRepository(Outlet)
    private readonly outletRepo: Repository<Outlet>
  ) {}

  // Create a new outlet
  async create(dto: CreateOutletDto, userId: number): Promise<Outlet> {
    try {
      const outlet = this.outletRepo.create({
        ...dto,
        uuid: uuidv4(),
        created_by: userId,
      });

      return await this.outletRepo.save(outlet);
    } catch (error) {
      throw new BadRequestException(
        `Failed to create outlet: ${error.message}`
      );
    }
  }

  // Get all outlets with relations
  async findAll(filter: OutletFilterDto): Promise<PaginatedResult<Outlet>> {
    const { page = 1, limit = 10, search } = filter;

    const query = this.outletRepo.createQueryBuilder("outlet").where("1=1");

    if (search) {
      query.andWhere("outlet.name LIKE :search", { search: `%${search}%` });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("outlet.created_at", "DESC")
      .getManyAndCount();

    return {
      records: data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Get one outlet by ID
  async findOne(uuid: string): Promise<Outlet> {
    try {
      const outlet = await this.outletRepo.findOne({
        where: { uuid },
        // relations: ["sbu", "tables", "waiters", "counters"],
      });
      if (!outlet) {
        throw new NotFoundException(`Outlet with uuid ${uuid} not found`);
      }
      return outlet;
    } catch (error) {
      throw new NotFoundException(`Failed to create outlet: ${error.message}`);
    }
  }

  // Update outlet
  async update(
    uuid: string,
    dto: UpdateOutletDto,
    userId: number
  ): Promise<Outlet> {
    try {
      const outlet = await this.findOne(uuid);
      Object.assign(outlet, { ...dto, updated_by: userId });
      return this.outletRepo.save(outlet);
    } catch (error) {
      throw new BadRequestException(
        `Failed to update outlet: ${error.message}`
      );
    }
  }

  // Soft delete outlet
  async softDelete(uuid: string, userId: number): Promise<void> {
    try {
      const outlet = await this.findOne(uuid);
      outlet.deleted_by = userId;
      await this.outletRepo.save(outlet);
      await this.outletRepo.softDelete(outlet.id);
    } catch (error) {
      throw new BadRequestException(
        `Failed to delete outlet: ${error.message}`
      );
    }
  }

  // Restore soft-deleted outlet
  async restore(uuid: string, userId: number): Promise<void> {
    const outlet = await this.outletRepo.findOne({
      where: { uuid },
      withDeleted: true,
    });
    if (!outlet) throw new NotFoundException(`Outlet ${uuid} not found`);

    outlet.deleted_by = null;
    outlet.updated_by = userId;

    await this.outletRepo.save(outlet);

    await this.outletRepo.restore(outlet.id);
  }

  // Hard delete outlet
  async hardDelete(uuid: string): Promise<void> {
    const outlet = await this.outletRepo.findOne({
      where: { uuid },
      withDeleted: true,
    });
    if (!outlet) throw new NotFoundException(`Outlet ${uuid} not found`);

    // Hard remove (permanently deletes)
    await this.outletRepo.remove(outlet);
  }
}
