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
import { Order } from "src/entities/pos/order.entity";
import { PaginatedResult } from "src/common/utils/paginated_result";
import { FilterOrderDto } from "./dto/filter-order.dto";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";

@ApiTags("Orders")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("pos_orders")
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Post()
  @ApiOperation({ summary: "Create a new order" })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, type: Order })
  async create(@Body() dto: CreateOrderDto): Promise<Order> {
    const userId = getCurrentUser("user_id");
    if (!userId) throw new UnauthorizedException("Unauthorized");
    return this.service.create(dto, +userId);
  }

  @Get()
  @ApiOperation({ summary: "Get all orders (paged)" })
  @ApiResponse({ status: 200, type: [Order] })
  async findAll(
    @Query() filter: FilterOrderDto
  ): Promise<PaginatedResult<Order>> {
    return this.service.findAll(filter);
  }

  @Get(":uuid")
  @ApiOperation({ summary: "Get order by UUID" })
  @ApiParam({ name: "uuid", type: String })
  async findOne(@Param("uuid") uuid: string): Promise<Order> {
    return this.service.findOne(uuid);
  }

  @Patch(":uuid")
  @ApiOperation({ summary: "Update order by UUID" })
  @ApiBody({ type: UpdateOrderDto })
  async update(@Param("uuid") uuid: string, @Body() dto: UpdateOrderDto) {
    const userId = getCurrentUser("user_id");
    if (!userId) throw new UnauthorizedException("Unauthorized");
    return this.service.update(uuid, dto, +userId);
  }

  @Delete(":uuid")
  @ApiOperation({ summary: "Soft delete order by UUID" })
  async softDelete(@Param("uuid") uuid: string) {
    const userId = getCurrentUser("user_id");
    if (!userId) throw new UnauthorizedException("Unauthorized");
    return this.service.softDelete(uuid, +userId);
  }

  @Put(":uuid/restore")
  @ApiOperation({ summary: "Restore soft-deleted order" })
  async restore(@Param("uuid") uuid: string) {
    const userId = getCurrentUser("user_id");
    if (!userId) throw new UnauthorizedException("Unauthorized");
    return this.service.restore(uuid, +userId);
  }

  @Delete(":uuid/hard")
  @ApiOperation({ summary: "Hard delete order by UUID" })
  async hardDelete(@Param("uuid") uuid: string) {
    return this.service.hardDelete(uuid);
  }
}
