import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
  Put,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { getCurrentUser } from "src/common/utils/user.util";
import { ProductAddon } from "src/entities/pos/product_addons.entity";
import { PaginatedResult } from "src/common/utils/paginated_result";
import { CreateAddonDto } from "./dto/create-addon.dto";
import { Addon } from "src/entities/pos/addons.entity";
import { AddonService } from "./addon.service";
import { FilterAddonDto } from "./dto/filter-addon.dto";
import { UpdateAddonDto } from "./dto/update-addon.dto";

@ApiTags("Addons")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("addons")
export class AddonController {
  constructor(private readonly service: AddonService) {}

  @Post()
  @ApiOperation({ summary: "Create a new Product Addon" })
  @ApiResponse({ status: 201, type: Addon })
  async create(@Body() dto: CreateAddonDto) {
    try {
      const user: any = getCurrentUser();
      if (!user) {
        throw new UnauthorizedException(
          "You must be logged in to create a Product Addon"
        );
      }

      return await this.service.create(dto, user.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: "Get all Product Addons" })
  @ApiResponse({ status: 200, type: [ProductAddon] })
  async findAll(
    @Query() filter: FilterAddonDto
  ): Promise<PaginatedResult<Addon> | any> {
    try {
      return await this.service.findAll(filter);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get(":uuid")
  @ApiOperation({ summary: "Get a single Product Addon by ID" })
  @ApiResponse({ status: 200, type: ProductAddon })
  async findOne(@Param("uuid") uuid: string) {
    try {
      const data = await this.service.findOne(uuid);
      if (!data) throw new NotFoundException("Product Addon not found");
      return data;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Patch(":uuid")
  @ApiOperation({ summary: "Update a Addon" })
  @ApiResponse({ status: 200, type: Addon })
  async update(@Param("uuid") uuid: string, @Body() dto: UpdateAddonDto) {
    try {
      const user: any = getCurrentUser();
      if (!user) {
        throw new UnauthorizedException(
          "You must be logged in to update a  Addon"
        );
      }

      const updated = await this.service.update(uuid, dto, user.id);
      if (!updated) throw new NotFoundException("Addon not found");

      return updated;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(":uuid")
  @ApiOperation({ summary: "Soft delete a Product Addon" })
  @ApiResponse({ status: 200, description: "Soft deleted successfully" })
  async softDelete(@Param("uuid") uuid: string) {
    try {
      const user: any = getCurrentUser();
      if (!user) throw new UnauthorizedException("You must be logged in");

      const deleted = await this.service.softDelete(uuid, user.id);
      if (!deleted) throw new NotFoundException("Product Addon not found");
      return { message: "Soft deleted successfully" };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Put(":uuid/restore")
  @ApiOperation({ summary: "Restore a soft-deleted Product Addon" })
  @ApiResponse({ status: 200, description: "Restored successfully" })
  async restore(@Param("uuid") uuid: string) {
    try {
      const user: any = getCurrentUser();
      if (!user) throw new UnauthorizedException("You must be logged in");

      const restored = await this.service.restore(uuid, user.id);
      if (!restored) throw new NotFoundException("Product Addon not found");
      return { message: "Restored successfully" };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Delete(":uuid/hard")
  @ApiOperation({ summary: "Hard delete a Product Addon permanently" })
  @ApiResponse({ status: 200, description: "Deleted permanently" })
  async hardDelete(@Param("uuid") uuid: string) {
    try {
      const deleted = await this.service.hardDelete(uuid);
      if (!deleted) throw new NotFoundException("Product Addon not found");
      return { message: "Deleted permanently" };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
