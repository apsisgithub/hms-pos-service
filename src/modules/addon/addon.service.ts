import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { ProductAddon } from "src/entities/pos/product_addons.entity";
import { CreateAddonDto } from "./dto/create-addon.dto";
import { UpdateAddonDto } from "./dto/update-addon.dto";
import { FilterAddonDto } from "./dto/filter-addon.dto";
import { PaginatedResult } from "src/common/utils/paginated_result";
import { Addon } from "src/entities/pos/addons.entity";

@Injectable()
export class AddonService {
  constructor(
    @InjectRepository(Addon)
    private readonly repo: Repository<Addon>,
    private readonly dataSource: DataSource
  ) {}

  // ---------- CREATE ----------
  async create(dto: CreateAddonDto, userId: number): Promise<Addon> {
    try {
      const entity = this.repo.create({
        ...dto,
        price: dto.price ?? 0,
        created_by: userId,
      });

      return await this.repo.save(entity);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ---------- FIND ALL ----------
  async findAll(filter: FilterAddonDto): Promise<PaginatedResult<Addon>> {
    try {
      const page = filter.page ?? 1;
      const limit = filter.limit ?? 10;

      const query = this.repo
        .createQueryBuilder("addon")
        .leftJoinAndSelect("addon.product", "product")
        .leftJoinAndSelect("addon.addon", "addon_item")
        .where("1=1");

      if (filter.search && filter.search.trim() !== "") {
        query.andWhere(
          "addon_item.name LIKE :search OR product.name LIKE :search",
          {
            search: `%${filter.search}%`,
          }
        );
      }

      if (filter.is_deleted === "Yes") {
        query.withDeleted().andWhere("addon.deleted_at IS NOT NULL");
      } else {
        query.andWhere("addon.deleted_at IS NULL");
      }

      if (filter.is_active === "Yes") {
        query.andWhere("addon.is_active = :is_active", { is_active: 1 });
      } else if (filter.is_active === "No") {
        query.andWhere("addon.is_active = :is_active", { is_active: 0 });
      }

      const [data, total] = await query
        .skip((page - 1) * limit)
        .take(limit)
        .orderBy("addon.created_at", "DESC")
        .getManyAndCount();

      return {
        records: data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ---------- FIND ONE ----------
  async findOne(uuid: string): Promise<Addon> {
    try {
      const entity = await this.repo.findOne({
        where: { uuid },
        relations: ["product", "addon"],
      });
      if (!entity)
        throw new NotFoundException(`Product Addon ${uuid} not found`);
      return entity;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  // ---------- UPDATE ----------
  async update(
    uuid: string,
    dto: UpdateAddonDto,
    userId: number
  ): Promise<Addon> {
    try {
      const entity = await this.repo.findOne({ where: { uuid } });
      if (!entity)
        throw new NotFoundException(`Product Addon ${uuid} not found`);

      await this.repo.update(uuid, { ...dto, updated_by: userId });
      return this.findOne(uuid);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ---------- SOFT DELETE ----------
  async softDelete(uuid: string, userId: number): Promise<boolean> {
    try {
      const entity = await this.repo.findOne({ where: { uuid } });
      if (!entity) return false;

      await this.repo.update(uuid, {
        deleted_at: new Date(),
        deleted_by: userId,
      });
      return true;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ---------- RESTORE ----------
  async restore(uuid: string, userId: number): Promise<boolean> {
    try {
      const entity = await this.repo.findOne({ where: { uuid } });
      if (!entity) return false;

      await this.repo.update(uuid, {
        deleted_at: null,
        deleted_by: null,
        updated_by: userId,
      });
      return true;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // ---------- HARD DELETE ----------
  async hardDelete(uuid: string): Promise<boolean> {
    try {
      const entity = await this.repo.findOne({ where: { uuid } });
      if (!entity) return false;

      await this.dataSource.transaction(async (manager) => {
        await manager.getRepository(ProductAddon).delete(uuid);
      });

      return true;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
