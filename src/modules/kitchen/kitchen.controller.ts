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
import { Kitchen } from "src/entities/pos/kitchen.entity";
import { PaginatedResult } from "src/common/utils/paginated_result";
import { FilterKitchenDto } from "./dto/filter-kitchen.dto";
import { KitchenService } from "./kitchen.service";
import { CreateKitchenDto } from "./dto/create-kitchen.dto";
import { UpdateKitchenDto } from "./dto/update-kitchen.dto";

@ApiTags("Kitchens/Stations")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("pos_kitchens")
export class KitchenController {
  constructor(private readonly service: KitchenService) {}

  @Post()
  @ApiOperation({ summary: "Create a new kitchen/station" })
  @ApiBody({ type: CreateKitchenDto })
  @ApiResponse({ status: 201, type: Kitchen })
  async create(@Body() dto: CreateKitchenDto): Promise<Kitchen> {
    const userId = getCurrentUser("user_id");
    if (!userId) throw new UnauthorizedException("Unauthorized");
    return this.service.create(dto, +userId);
  }

  @Get()
  @ApiOperation({ summary: "Get all kitchens (paged)" })
  @ApiResponse({ status: 200, type: [Kitchen] })
  async findAll(
    @Query() filter: FilterKitchenDto
  ): Promise<PaginatedResult<Kitchen> | any> {
    return this.service.findAll(filter);
  }

  @Get(":uuid")
  @ApiOperation({ summary: "Get kitchen by UUID" })
  @ApiParam({ name: "uuid", type: String })
  async findOne(@Param("uuid") uuid: string): Promise<Kitchen> {
    return this.service.findOne(uuid);
  }

  @Patch(":uuid")
  @ApiOperation({ summary: "Update kitchen by UUID" })
  @ApiBody({ type: UpdateKitchenDto })
  async update(@Param("uuid") uuid: string, @Body() dto: UpdateKitchenDto) {
    const userId = getCurrentUser("user_id");
    if (!userId) throw new UnauthorizedException("Unauthorized");
    return this.service.update(uuid, dto, +userId);
  }

  @Delete(":uuid")
  @ApiOperation({ summary: "Soft delete kitchen by UUID" })
  async softDelete(@Param("uuid") uuid: string) {
    const userId = getCurrentUser("user_id");
    if (!userId) throw new UnauthorizedException("Unauthorized");
    return this.service.softDelete(uuid, +userId);
  }

  @Put(":uuid/restore")
  @ApiOperation({ summary: "Restore soft-deleted kitchen" })
  async restore(@Param("uuid") uuid: string) {
    const userId = getCurrentUser("user_id");
    if (!userId) throw new UnauthorizedException("Unauthorized");
    return this.service.restore(uuid, +userId);
  }

  @Delete(":uuid/hard")
  @ApiOperation({ summary: "Hard delete kitchen by UUID" })
  async hardDelete(@Param("uuid") uuid: string) {
    return this.service.hardDelete(uuid);
  }
}
