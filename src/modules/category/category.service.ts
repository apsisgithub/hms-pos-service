import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Not, Repository } from "typeorm";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Category } from "src/entities/pos/category.entity";
import { v4 as uuidv4 } from "uuid";
import { slugify } from "transliteration";
import { CategoryFilterDto } from "./dto/filter-category.dto";
import { PaginatedResult } from "src/common/utils/paginated_result";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>
  ) {}

  private async generateUniqueSlug(
    name: string,
    excludeId?: number
  ): Promise<string> {
    const baseSlug = slugify(name).toLowerCase();
    let slug = baseSlug;
    let count = 1;

    while (true) {
      const where: any = { slug };
      if (excludeId) {
        where.id = Not(excludeId);
      }

      const existing = await this.categoryRepo.findOne({ where });
      if (!existing) break;

      slug = `${baseSlug}-${count}`;
      count++;
    }

    return slug;
  }

  async create(dto: CreateCategoryDto, userId: number): Promise<Category> {
    // Generate a unique slug based on name
    const slug = await this.generateUniqueSlug(dto.name);

    // Create new category entity
    const category = this.categoryRepo.create({
      uuid: uuidv4(),
      slug,
      name: dto.name,
      created_by: userId,
    });

    // Handle parent category if provided
    if (dto.parent_id && dto.parent_id > 0) {
      const parent = await this.categoryRepo.findOne({
        where: { id: dto.parent_id },
      });
      if (!parent) throw new NotFoundException("Parent category not found");

      category.parent = parent;
    }

    // Save to DB
    return await this.categoryRepo.save(category);
  }

  async findList(
    filter: CategoryFilterDto
  ): Promise<PaginatedResult<Category>> {
    const { page = 1, limit = 10, search, parent_id } = filter;

    const query = this.categoryRepo
      .createQueryBuilder("category")
      .leftJoinAndSelect("category.children", "children")
      .leftJoinAndSelect("category.parent", "parent")
      .where("1=1");

    if (search) {
      query.andWhere("category.name LIKE :search", { search: `%${search}%` });
    }

    if (parent_id !== undefined) {
      query.andWhere("category.parent_id = :parent_id", { parent_id });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("category.created_at", "DESC")
      .getManyAndCount();

    return {
      records: data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepo.find({
      where: { parent: IsNull() },
      relations: ["children", "parent"],
    });
  }

  async findSubCategories(parentId: number): Promise<Category[]> {
    const parent = await this.categoryRepo.findOne({
      where: { id: parentId },
      relations: ["children"],
    });
    if (!parent) throw new NotFoundException("Parent category not found");
    return parent.children;
  }

  async findOne(uuid: string): Promise<Category> {
    const category = await this.categoryRepo.findOne({
      where: { uuid },
      relations: ["parent", "children"],
      withDeleted: true,
    });
    if (!category) throw new NotFoundException("Category not found");
    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepo.findOne({
      where: { slug },
      relations: ["parent", "children"],
      withDeleted: true,
    });
    if (!category) throw new NotFoundException("Category not found");
    return category;
  }

  async update(
    uuid: string,
    dto: UpdateCategoryDto,
    userId: number
  ): Promise<Category> {
    try {
      const { parent_id, ...rest } = dto;
      // Find the existing category
      const category = await this.categoryRepo.findOne({ where: { uuid } });
      if (!category) {
        throw new NotFoundException("Category not found");
      }

      // Generate new slug if name changed
      let slug = category.slug;
      if (dto.name && dto.name !== category.name) {
        slug = await this.generateUniqueSlug(dto.name, category.id);
      }

      // Merge DTO into entity and track updater
      Object.assign(category, {
        ...rest,
        slug,
        updated_by: userId, // Track who updated
      });

      if (parent_id !== undefined && parent_id > 0) {
        const parent = await this.categoryRepo.findOne({
          where: { id: parent_id },
        });
        if (!parent) throw new NotFoundException("Parent category not found");
        category.parent = parent;
      } else {
        category.parent = null;
      }

      // Save updated entity
      return await this.categoryRepo.save(category);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async softDelete(uuid: string, userId: number): Promise<void> {
    // Find the entity to soft delete
    const category = await this.categoryRepo.findOne({ where: { uuid } });

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    // Track who deleted it
    category.deleted_by = userId;
    await this.categoryRepo.save(category);

    // Perform soft delete
    await this.categoryRepo.softDelete(uuid);
  }

  async restore(uuid: string, userId: number): Promise<void> {
    // Find soft-deleted entity
    const category = await this.categoryRepo.findOne({
      where: { uuid },
      withDeleted: true, // include soft-deleted records
    });

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    // Reset deleted_by and track who restored
    category.deleted_by = null;
    category.updated_by = userId;

    // Save the updated fields first
    await this.categoryRepo.save(category);

    // Restore soft-deleted entity
    await this.categoryRepo.restore(uuid);
  }

  async hardDelete(uuid: string): Promise<void> {
    // category check if the record exists first
    const category = await this.categoryRepo.findOne({ where: { uuid } });
    if (!category) {
      throw new NotFoundException(`category with uuid ${uuid} not found`);
    }

    // Permanently delete
    await this.categoryRepo.delete(category.id);
  }
}
