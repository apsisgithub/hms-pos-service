import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
  UnauthorizedException,
  Query,
  Patch,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { CreateOutletDto } from "./dto/create-outlet.dto";
import { UpdateOutletDto } from "./dto/update-outlet.dto";
import { OutletService } from "./outlet.service";
import { Outlet } from "src/entities/pos/outlet.entity";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { getCurrentUser } from "src/common/utils/user.util";
import { OutletFilterDto } from "./dto/outlet-filter.dto";
import { PaginatedResult } from "src/common/utils/paginated_result";
import { OutletDropdownDto } from "./dto/outlet-dropdown.dto";

@ApiTags("Outlets")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("outlets")
export class OutletController {
  constructor(private readonly service: OutletService) {}

  @Post()
  @ApiOperation({ summary: "Create a new POS outlet" })
  @ApiResponse({ status: 201, description: "Outlet created", type: Outlet })
  async create(@Body() dto: CreateOutletDto): Promise<Outlet> {
    const userId = getCurrentUser("user_id");
    if (!userId) {
      throw new UnauthorizedException(`Sorry! unauthorized`);
    }
    return await this.service.create(dto, +userId);
  }

  @Get()
  @ApiOperation({ summary: "Get all POS outlets" })
  @ApiResponse({ status: 200, type: [Outlet] })
  async findAll(
    @Query() filter: OutletFilterDto
  ): Promise<PaginatedResult<Outlet>> {
    return this.service.findAll(filter);
  }

  @Get("/dropdown")
  async dropdown(@Query() filter: OutletDropdownDto): Promise<any> {
    return await this.service.getOutletDropdown(filter);
  }

  @Get(":uuid")
  @ApiOperation({ summary: "Get outlet by UUID" })
  @ApiResponse({ status: 200, description: "Outlet found", type: Outlet })
  @ApiResponse({ status: 404, description: "Outlet not found" })
  findOne(@Param("uuid") uuid: string) {
    return this.service.findOne(uuid);
  }

  @Patch(":uuid")
  @ApiOperation({ summary: "Update outlet by UUID" })
  @ApiResponse({ status: 200, description: "Outlet updated", type: Outlet })
  async update(
    @Param("uuid") uuid: string,
    @Body() dto: UpdateOutletDto
  ): Promise<Outlet> {
    const userId = getCurrentUser("user_id");
    if (!userId) {
      throw new UnauthorizedException(`Sorry! unauthorized`);
    }
    return this.service.update(uuid, dto, +userId);
  }

  @Delete(":uuid/soft")
  @ApiOperation({ summary: "Soft delete outlet" })
  async softDelete(@Param("uuid") uuid: string): Promise<void> {
    const userId = getCurrentUser("user_id");
    if (!userId) {
      throw new UnauthorizedException(`Sorry! unauthorized`);
    }
    return this.service.softDelete(uuid, +userId);
  }

  @Put(":uuid/restore")
  @ApiOperation({ summary: "Restore soft-deleted outlet" })
  async restore(
    @Param("uuid") uuid: string,
    @Body("userId") userId: number
  ): Promise<void> {
    return this.service.restore(uuid, userId);
  }

  @Delete(":uuid/hard")
  @ApiOperation({ summary: "Hard delete outlet" })
  async hardDelete(@Param("uuid") uuid: string): Promise<any> {
    return this.service.hardDelete(uuid);
  }
}
