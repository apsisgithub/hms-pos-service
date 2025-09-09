import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
  ApiTags,
} from "@nestjs/swagger";
import { getCurrentUser } from "src/common/utils/user.util";
import { DecryptPipe } from "src/common/pipe/apsisDecryptor.pipe";
import { PaginatedResult } from "src/common/utils/paginated_result";
import { TableFilterDto } from "./dto/filter-table.dto";
import { CreateTableDto } from "./dto/create-table.dto";
import { UpdateTableDto } from "./dto/update-table.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";

import { Roles } from "src/common/decorators/roles.decorator";
import { RoleName } from "src/common/enums/role-name.enum";
import { PosTable } from "src/entities/pos/table.entity";
import { PosTableService } from "./table.service";

@ApiTags("Table")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("tables")
export class PosTableController {
  constructor(private readonly tableService: PosTableService) {}

  @Post()
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: "Create a new POS table" })
  @ApiResponse({
    status: 201,
    description: "POS table created successfully",
    type: PosTable,
  })
  async create(@Body() createDto: CreateTableDto): Promise<PosTable> {
    const userId = getCurrentUser("user_id");
    if (!userId) {
      throw new UnauthorizedException(`Sorry! Unauthorized`);
    }
    return await this.tableService.create(createDto, +userId);
  }

  @Get()
  @ApiOperation({ summary: "Get a paginated list of POS tables" })
  @ApiResponse({
    status: 200,
    description: "Successfully retrieved list",
  })
  async findList(
    @Query() filter: TableFilterDto
  ): Promise<PaginatedResult<PosTable>> {
    return await this.tableService.findList(filter);
  }

  @Get(":uuid")
  @ApiOperation({ summary: "Get a POS table by ID" })
  async findOne(@Param("uuid") uuid: string): Promise<PosTable | null> {
    return await this.tableService.findOne(uuid);
  }

  @Get(":tableName/findByName")
  @ApiOperation({ summary: "Get a POS table by its name" })
  @ApiParam({
    name: "tableName",
    description: "Name of the table",
    required: true,
  })
  async findByName(@Param("tableName") tableName: string): Promise<PosTable> {
    return await this.tableService.findByName(tableName);
  }

  @Patch(":uuid")
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: "Update a POS table by ID" })
  async update(
    @Param("uuid") uuid: string,
    @Body() updateDto: UpdateTableDto
  ): Promise<PosTable | null> {
    const userId = getCurrentUser("user_id");
    if (!userId) {
      throw new UnauthorizedException(`Sorry! Unauthorized`);
    }

    return this.tableService.update(uuid, updateDto, +userId);
  }

  @Delete("soft/:uuid")
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: "Soft delete a POS table by ID" })
  async softDelete(@Param("uuid") uuid: string): Promise<void> {
    const userId = getCurrentUser("user_id");
    if (!userId) {
      throw new UnauthorizedException(`Sorry! Unauthorized`);
    }
    return this.tableService.softDelete(uuid, +userId);
  }

  @Put("restore/:uuid")
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: "Restore a soft-deleted POS table by ID" })
  async restore(@Param("uuid") uuid: string): Promise<void> {
    const userId = getCurrentUser("user_id");
    if (!userId) {
      throw new UnauthorizedException(`Sorry! Unauthorized`);
    }
    return this.tableService.restore(uuid, +userId);
  }

  @Delete("hard/:uuid")
  @Roles(RoleName.ADMIN, RoleName.SUPER_ADMIN)
  @ApiOperation({ summary: "Hard delete a POS table by ID" })
  async hardDelete(@Param("uuid") uuid: string): Promise<void> {
    return this.tableService.hardDelete(uuid);
  }
}
