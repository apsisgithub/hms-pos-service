import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Patch,
  UseGuards,
  UnauthorizedException,
  NotFoundException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from "@nestjs/swagger";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductService } from "./product.service";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { getCurrentUser } from "src/common/utils/user.util";
import { Product } from "src/entities/pos/products.entity";
import { FilterProductDto } from "./dto/filter-product.dto";
import { PaginatedResult } from "src/common/utils/paginated_result";

@ApiTags("Product")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("products")
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Post()
  @ApiOperation({ summary: "Create a new product" })
  async create(@Body() dto: CreateProductDto): Promise<Product> {
    try {
      const userId = getCurrentUser("user_id");
      if (!userId) {
        throw new UnauthorizedException(`Sorry! unauthorized`);
      }
      return await this.service.create(dto, +userId);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: "Get all products" })
  @ApiResponse({ status: 200, type: [Product] })
  async findAll(
    @Query() filter: FilterProductDto
  ): Promise<PaginatedResult<Product> | any> {
    try {
      return await this.service.findAll(filter);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get(":uuid")
  @ApiOperation({ summary: "Get product by UUID" })
  async findOne(@Param("uuid") uuid: string) {
    return this.service.findOne(uuid);
  }

  @Patch(":uuid")
  @ApiOperation({ summary: "Update product by UUID" })
  async update(@Param("uuid") uuid: string, @Body() dto: UpdateProductDto) {
    const userId = 1;
    return this.service.update(uuid, dto, userId);
  }

  @Delete(":uuid")
  @ApiOperation({ summary: "Soft delete product by UUID" })
  async softDelete(@Param("uuid") uuid: string) {
    const userId = 1;
    return this.service.softDelete(uuid, userId);
  }

  @Put(":uuid/restore")
  @ApiOperation({ summary: "Restore soft-deleted product" })
  async restore(@Param("uuid") uuid: string) {
    const userId = 1;
    return this.service.restore(uuid, userId);
  }

  @Delete(":uuid/hard")
  @ApiOperation({ summary: "Hard delete product by UUID" })
  async hardDelete(@Param("uuid") uuid: string) {
    return this.service.hardDelete(uuid);
  }
}
