import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  UnauthorizedException,
  NotFoundException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
  ApiBody,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { getCurrentUser } from "src/common/utils/user.util";
import { ComboMealService } from "./combo-meal.service";
import { CreateComboMealDto } from "./dto/create-combo-meal.dto";
import { ComboMeal } from "src/entities/pos/combo_meals.entity";
import { FilterComboMealDto } from "./dto/filter-combo-meal.dto";
import { PaginatedResult } from "src/common/utils/paginated_result";
import { UpdateComboMealDto } from "./dto/update-combo-meal.dto";

@ApiTags("Combo Meals")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("combos")
export class ComboMealController {
  constructor(private readonly service: ComboMealService) {}

  @Post()
  @ApiOperation({ summary: "Create a new combo meal" })
  @ApiBody({ type: CreateComboMealDto })
  async create(@Body() dto: CreateComboMealDto): Promise<ComboMeal> {
    const userId = getCurrentUser("user_id");
    if (!userId) throw new UnauthorizedException(`Unauthorized`);
    return this.service.create(dto, +userId);
  }

  @Get()
  @ApiOperation({ summary: "Get all products" })
  @ApiResponse({ status: 200, type: [ComboMeal] })
  async findAll(
    @Query() filter: FilterComboMealDto
  ): Promise<PaginatedResult<ComboMeal> | any> {
    try {
      return await this.service.findAll(filter);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get(":uuid")
  @ApiOperation({ summary: "Get combo meal by uuid" })
  async findOne(@Param("uuid") uuid: string): Promise<ComboMeal> {
    return this.service.findOne(uuid);
  }

  @Patch(":uuid")
  @ApiOperation({ summary: "Update combo meal by uuid" })
  @ApiBody({ type: UpdateComboMealDto })
  async update(@Param("uuid") uuid: string, @Body() dto: UpdateComboMealDto) {
    const userId = getCurrentUser("user_id");
    if (!userId) throw new UnauthorizedException(`Unauthorized`);
    return this.service.update(uuid, dto, +userId);
  }

  @Delete(":uuid")
  @ApiOperation({ summary: "Soft delete combo meal by ID" })
  async softDelete(@Param("uuid") uuid: string) {
    const userId = getCurrentUser("user_id");
    if (!userId) throw new UnauthorizedException(`Unauthorized`);
    return this.service.softDelete(uuid, +userId);
  }

  @Put(":uuid/restore")
  @ApiOperation({ summary: "Restore soft-deleted combo meal" })
  async restore(@Param("uuid") uuid: string) {
    const userId = getCurrentUser("user_id");
    if (!userId) throw new UnauthorizedException(`Unauthorized`);
    return this.service.restore(uuid, +userId);
  }

  @Delete(":uuid/hard")
  @ApiOperation({ summary: "Hard delete combo meal by ID" })
  async hardDelete(@Param("uuid") uuid: string) {
    return this.service.hardDelete(uuid);
  }
}
