import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UnauthorizedException,
  Query,
  Put,
} from "@nestjs/common";
import { RolesGuard } from "src/common/guards/roles.guard";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { RoleName } from "src/common/enums/role-name.enum";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { getCurrentUser, getUser } from "src/common/utils/user.util";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Category } from "src/entities/pos/category.entity";
import { CategoryFilterDto } from "./dto/filter-category.dto";
import { PaginatedResult } from "src/common/utils/paginated_result";
import { CategoryDropdownDto } from "./dto/dropdown.dto";
// import { apsisDecrypt, apsisEncrypt } from "src/common/utils/apsis-crypto.util";
// import { DecryptPipe } from "src/common/pipe/apsisDecryptor.pipe";

@ApiTags("Category")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  // @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiResponse({
    status: 201,
    description: "Category created successfully",
    type: Category,
  })
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<any> {
    const userId = getCurrentUser("user_id");
    if (!userId) {
      throw new UnauthorizedException(`Sorry! unauthorized`);
    }
    return await this.categoryService.create(createCategoryDto, +userId);
  }

  @Get()
  async findList(
    @Query() filter: CategoryFilterDto
  ): Promise<PaginatedResult<Category>> {
    return await this.categoryService.findList(filter);
  }

  @Get("/dropdown")
  async dropdown(@Query() filter: CategoryDropdownDto): Promise<any> {
    return await this.categoryService.getCategoryDropdown(filter);
  }

  @Get(":uuid")
  @ApiOperation({ summary: "Get a call status by ID" })
  @ApiParam({
    name: "uuid",
    description: "uuid of the Call",
    required: true,
  })
  async findOne(@Param("uuid") uuid: string): Promise<Category | any> {
    return await this.categoryService.findOne(uuid);
  }

  @Get(":slug/findBySlug")
  async findBySlug(@Param("slug") slug: string): Promise<Category> {
    return await this.categoryService.findBySlug(slug);
  }

  @Patch(":uuid")
  @ApiOperation({ summary: "Get a call status by ID" })
  async update(
    @Param("uuid") uuid: string,
    @Body() updateDto: UpdateCategoryDto
  ): Promise<Category | any> {
    const userId = getCurrentUser("user_id");
    if (!userId) {
      throw new UnauthorizedException(`Sorry! unauthorized`);
    }

    return this.categoryService.update(uuid, updateDto, +userId);
  }

  @Delete(":uuid")
  async softDelete(@Param("uuid") uuid: string): Promise<void | any> {
    const userId = getCurrentUser("user_id");
    if (!userId) {
      throw new UnauthorizedException(`Sorry! unauthorized`);
    }
    return this.categoryService.softDelete(uuid, +userId);
  }

  @Put(":uuid/restore")
  async restore(@Param("uuid") uuid: string): Promise<Category | any> {
    const userId = getCurrentUser("user_id");
    if (!userId) {
      throw new UnauthorizedException(`Sorry! unauthorized`);
    }
    return this.categoryService.restore(uuid, +userId);
  }

  @Delete(":uuid/hard")
  async hardDelete(@Param("uuid") uuid: string): Promise<void> {
    return await this.categoryService.hardDelete(uuid);
  }
}
