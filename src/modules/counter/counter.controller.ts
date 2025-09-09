import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CounterService } from "./counter.service";
import { PosCounter } from "src/entities/pos/counter.entity";
import { CreateCounterDto } from "./dto/create-counter.dto";
import { getCurrentUser } from "src/common/utils/user.util";
import { UpdateCounterDto } from "./dto/update-counter.dto";
import { CounterFilterDto } from "./dto/filter-counter.dto";
import { PaginatedResult } from "src/common/utils/paginated_result";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";

@ApiTags("Counter")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("counters")
export class CounterController {
  constructor(private readonly counterService: CounterService) {}

  @Post()
  @ApiOperation({ summary: "Create a POS counter" })
  @ApiResponse({ status: 201, type: PosCounter })
  async create(@Body() dto: CreateCounterDto): Promise<PosCounter> {
    try {
      const userId = getCurrentUser("user_id");
      if (!userId) {
        throw new UnauthorizedException(`Sorry! unauthorized`);
      }
      return await this.counterService.create(dto, +userId);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: "List POS counters" })
  @ApiResponse({ status: 200, type: [PosCounter] })
  async findAll(
    @Query() filter: CounterFilterDto
  ): Promise<PaginatedResult<PosCounter> | any> {
    try {
      return await this.counterService.findAll(filter);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get(":uuid")
  @ApiOperation({ summary: "Get a POS counter by UUID" })
  @ApiResponse({ status: 200, type: PosCounter })
  async findOne(@Param("uuid") uuid: string): Promise<PosCounter> {
    try {
      return await this.counterService.findOne(uuid);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Patch(":uuid")
  @ApiOperation({ summary: "Update a POS counter by UUID" })
  @ApiResponse({ status: 200, type: PosCounter })
  async update(
    @Param("uuid") uuid: string,
    @Body() dto: UpdateCounterDto
  ): Promise<PosCounter> {
    try {
      const userId = getCurrentUser("user_id");
      if (!userId) {
        throw new UnauthorizedException(`Sorry! unauthorized`);
      }
      return await this.counterService.update(uuid, dto, +userId);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @Delete(":uuid")
  @ApiOperation({ summary: "Soft delete a POS counter" })
  async softDelete(@Param("uuid") uuid: string): Promise<void> {
    try {
      const userId = getCurrentUser("user_id");
      if (!userId) {
        throw new UnauthorizedException(`Sorry! unauthorized`);
      }
      return await this.counterService.softDelete(uuid, +userId);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @Put(":uuid/restore")
  @ApiOperation({ summary: "Restore a soft-deleted POS counter" })
  async restore(@Param("uuid") uuid: string): Promise<void> {
    try {
      const userId = getCurrentUser("user_id");
      if (!userId) {
        throw new UnauthorizedException(`Sorry! unauthorized`);
      }
      return await this.counterService.restore(uuid, +userId);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @Delete(":uuid/hard")
  @ApiOperation({ summary: "Hard delete a POS counter (permanent)" })
  async hardDelete(@Param("uuid") uuid: string): Promise<void> {
    return await this.counterService.hardDelete(uuid);
  }
}
