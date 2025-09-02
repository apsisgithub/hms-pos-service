import { Injectable, NotFoundException } from "@nestjs/common";
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
    const slug = await this.generateUniqueSlug(dto.name);

    const category = this.categoryRepo.create({
      uuid: uuidv4(),
      slug,
      name: dto.name,
      createdById: userId,
    });

    if (dto.parentId) {
      const parent = await this.categoryRepo.findOne({
        where: { id: dto.parentId },
      });
      if (!parent) throw new NotFoundException("Parent category not found");
      category.parent = parent;
    }

    return this.categoryRepo.save(category);
  }

  async findList(
    filter: CategoryFilterDto
  ): Promise<PaginatedResult<Category>> {
    const { page = 1, limit = 10, search, parentId } = filter;

    const query = this.categoryRepo
      .createQueryBuilder("category")
      .leftJoinAndSelect("category.children", "children")
      .leftJoinAndSelect("category.parent", "parent")
      .where("1=1");

    if (search) {
      query.andWhere("category.name LIKE :search", { search: `%${search}%` });
    }

    if (parentId !== undefined) {
      query.andWhere("category.parentId = :parentId", { parentId });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("category.createdAt", "DESC")
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

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepo.findOne({
      where: { id },
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
    id: number,
    dto: UpdateCategoryDto,
    userId: number
  ): Promise<Category> {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new Error("Category not found");

    let slug = category.slug;
    if (dto.name && dto.name !== category.name) {
      slug = await this.generateUniqueSlug(dto.name, id);
    }

    Object.assign(category, {
      ...dto,
      slug,
      updatedById: userId,
    });

    return this.categoryRepo.save(category);
  }

  async softDelete(id: number, userId: number): Promise<void> {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException("Category not found");

    category.deletedById = userId;
    await this.categoryRepo.save(category);

    await this.categoryRepo.softDelete(id);
  }

  async restore(id: number, userId: number): Promise<void> {
    const category = await this.categoryRepo.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!category) throw new NotFoundException("Category not found");

    category.deletedById = null; // reset deletedById
    category.updatedById = userId; // track who restored
    await this.categoryRepo.save(category);

    await this.categoryRepo.restore(id);
  }

  async hardDelete(id: number): Promise<void> {
    await this.categoryRepo.delete(id);
  }
}
