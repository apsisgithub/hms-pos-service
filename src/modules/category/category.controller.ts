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
import { apsisDecrypt, apsisEncrypt } from "src/common/utils/apsis-crypto.util";
import { PaginatedResult } from "src/common/utils/paginated_result";
import { DecryptPipe } from "src/common/pipe/apsisDecryptor.pipe";

@ApiTags("Category")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
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

  @Get(":id")
  @ApiOperation({ summary: "Get a call status by ID" })
  @ApiParam({
    name: "id",
    description: "Encrypted ID of the Call",
    required: true,
    example: "2e",
  })
  async findOne(
    @Param("id", new DecryptPipe({ key: "id" })) id: string
  ): Promise<Category | any> {
    return await this.categoryService.findOne(+id);
  }

  @Get(":slug/findBySlug")
  async findBySlug(@Param("slug") slug: string): Promise<Category> {
    return await this.categoryService.findBySlug(slug);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Get a call status by ID" })
  @ApiParam({
    name: "id",
    description: "Encrypted ID of the Call",
    required: true,
    example: "2e",
  })
  async update(
    @Param("id", new DecryptPipe({ key: "id" })) id: string,
    @Body() updateDto: UpdateCategoryDto
  ): Promise<Category | any> {
    const userId = getCurrentUser("user_id");
    if (!userId) {
      throw new UnauthorizedException(`Sorry! unauthorized`);
    }

    return this.categoryService.update(+id, updateDto, +userId);
  }

  @Delete("soft/:id")
  @ApiParam({
    name: "id",
    description: "Encrypted ID of the Call",
    required: true,
    example: "2e",
  })
  softDelete(@Param("id", new DecryptPipe({ key: "id" })) id: string) {
    const userId = getCurrentUser("user_id");
    if (!userId) {
      throw new UnauthorizedException(`Sorry! unauthorized`);
    }
    return this.categoryService.softDelete(+id, +userId);
  }

  @Put("restore/:id")
  @ApiParam({
    name: "id",
    description: "Encrypted ID of the Call",
    required: true,
    example: "2e",
  })
  restore(@Param("id", new DecryptPipe({ key: "id" })) id: string) {
    const userId = getCurrentUser("user_id");
    if (!userId) {
      throw new UnauthorizedException(`Sorry! unauthorized`);
    }
    return this.categoryService.restore(+id, +userId);
  }

  @Delete("hard/:id")
  @ApiParam({
    name: "id",
    description: "Encrypted ID of the Call",
    required: true,
    example: "2e",
  })
  hardDelete(@Param("id", new DecryptPipe({ key: "id" })) id: string) {
    return this.categoryService.hardDelete(+id);
  }

  @Get("encrypt/:value")
  async encryptTest(@Param("value") value: string) {
    const encrypted = apsisEncrypt(value);
    return { original: value, encrypted };
  }

  @Get("decrypt/:value")
  async decryptTest(@Param("value") value: string) {
    try {
      const decrypted = apsisDecrypt(value);
      return { encrypted: value, decrypted };
    } catch (error) {
      return { error: "Failed to decrypt" };
    }
  }
}
