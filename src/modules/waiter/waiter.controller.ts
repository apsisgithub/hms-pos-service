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

import { WaiterService } from "./waiter.service";
import { CreateWaiterDto } from "./dto/create-waiter.dto";
import { UpdateWaiterDto } from "./dto/update-waiter.dto";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Waiter } from "src/entities/pos/waiter.entity";
import { getCurrentUser } from "src/common/utils/user.util";
import { WaiterFilterDto } from "./dto/filter-waiter.dto";
import { PaginatedResult } from "src/common/utils/paginated_result";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
@ApiTags("Waiter")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("waiters")
export class WaiterController {
  constructor(private readonly waiterService: WaiterService) {}

  @Post()
  // @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiResponse({
    status: 201,
    description: "Waiter created successfully",
    type: Waiter,
  })
  async create(@Body() dto: CreateWaiterDto): Promise<any> {
    try {
      const userId = getCurrentUser("user_id");
      if (!userId) {
        throw new UnauthorizedException(`Sorry! unauthorized`);
      }
      return await this.waiterService.create(dto, +userId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  // @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  async findAll(
    @Query() filter: WaiterFilterDto
  ): Promise<PaginatedResult<Waiter>> {
    return await this.waiterService.findAll(filter);
  }

  @Get(":uuid")
  @ApiOperation({ summary: "Get a call status by ID" })
  @ApiParam({
    name: "uuid",
    description: "uuid of the Call",
    required: true,
  })
  async findOne(@Param("uuid") uuid: string): Promise<Waiter | any> {
    return await this.waiterService.findOne(uuid);
  }

  @Patch(":uuid")
  @ApiOperation({ summary: "Get a call status by ID" })
  async update(
    @Param("uuid") uuid: string,
    @Body() updateDto: UpdateWaiterDto
  ): Promise<Waiter | any> {
    const userId = getCurrentUser("user_id");
    if (!userId) {
      throw new UnauthorizedException(`Sorry! unauthorized`);
    }

    return this.waiterService.update(uuid, updateDto, +userId);
  }

  @Delete(":uuid")
  async softDelete(@Param("uuid") uuid: string): Promise<any> {
    const userId = getCurrentUser("user_id");
    if (!userId) {
      throw new UnauthorizedException(`Sorry! unauthorized`);
    }
    return await this.waiterService.softDelete(uuid, +userId);
  }

  @Put(":uuid/restore")
  async restore(@Param("uuid") uuid: string): Promise<any> {
    const userId = getCurrentUser("user_id");
    if (!userId) {
      throw new UnauthorizedException(`Sorry! unauthorized`);
    }
    return await this.waiterService.restore(uuid, +userId);
  }

  @Delete(":uuid/hard")
  async hardDelete(@Param("uuid") uuid: string): Promise<any> {
    return await this.waiterService.hardDelete(uuid);
  }
}
