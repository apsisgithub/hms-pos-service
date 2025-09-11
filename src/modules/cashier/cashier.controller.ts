import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UnauthorizedException,
  BadRequestException,
  Query,
  Put,
  UseGuards,
} from "@nestjs/common";

import { CreateCashierDto } from "./dto/create-cashier.dto";
import { UpdateCashierDto } from "./dto/update-cashier.dto";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { getCurrentUser } from "src/common/utils/user.util";
import { CashierFilterDto } from "./dto/filter-cashier.dto";
import { PaginatedResult } from "src/common/utils/paginated_result";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { CashierService } from "./cashier.service";
import { PosCashier } from "src/entities/pos/cashier.entity";

@ApiTags("Cashier Mapping")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("cashiers")
export class CashierController {
  constructor(private readonly cashierService: CashierService) {}

  @Post()
  // @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiResponse({
    status: 201,
    description: "cashier created successfully",
    type: PosCashier,
  })
  async create(@Body() dto: CreateCashierDto): Promise<any> {
    try {
      const userId = getCurrentUser("user_id");
      if (!userId) {
        throw new UnauthorizedException(`Sorry! unauthorized`);
      }
      return await this.cashierService.create(dto, +userId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  // @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  async findAll(
    @Query() filter: CashierFilterDto
  ): Promise<PaginatedResult<PosCashier>> {
    return await this.cashierService.findAll(filter);
  }

  @Get(":uuid")
  @ApiOperation({ summary: "Get a call status by ID" })
  @ApiParam({
    name: "uuid",
    description: "uuid of the Call",
    required: true,
  })
  async findOne(@Param("uuid") uuid: string): Promise<PosCashier | any> {
    return await this.cashierService.findOne(uuid);
  }

  @Patch(":uuid")
  @ApiOperation({ summary: "Get a call status by ID" })
  async update(
    @Param("uuid") uuid: string,
    @Body() updateDto: UpdateCashierDto
  ): Promise<PosCashier | any> {
    const userId = getCurrentUser("user_id");
    if (!userId) {
      throw new UnauthorizedException(`Sorry! unauthorized`);
    }

    return this.cashierService.update(uuid, updateDto, +userId);
  }

  @Delete(":uuid")
  async softDelete(@Param("uuid") uuid: string): Promise<any> {
    const userId = getCurrentUser("user_id");
    if (!userId) {
      throw new UnauthorizedException(`Sorry! unauthorized`);
    }
    return await this.cashierService.softDelete(uuid, +userId);
  }

  @Put(":uuid/restore")
  async restore(@Param("uuid") uuid: string): Promise<any> {
    const userId = getCurrentUser("user_id");
    if (!userId) {
      throw new UnauthorizedException(`Sorry! unauthorized`);
    }
    return await this.cashierService.restore(uuid, +userId);
  }

  @Delete(":uuid/hard")
  async hardDelete(@Param("uuid") uuid: string): Promise<any> {
    return await this.cashierService.hardDelete(uuid);
  }
}
