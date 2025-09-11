import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Order } from "src/entities/pos/order.entity";
import { OrderItem } from "src/entities/pos/order_items.entity";
import { OrderToken, TokenType } from "src/entities/pos/order_token.entity";
import { PaginatedResult } from "src/common/utils/paginated_result";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { FilterOrderDto } from "./dto/filter-order.dto";
import { OrderValidator } from "./validator.service";
import { OrderItemAddon } from "src/entities/pos/order_item_addons.entity";
import { TokenService } from "./token.service";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly itemRepo: Repository<OrderItem>,
    @InjectRepository(OrderToken)
    private readonly tokenRepo: Repository<OrderToken>,
    private readonly dataSource: DataSource
  ) {}

  // Create Order with optional items & tokens
  async create(dto: CreateOrderDto, userId: number): Promise<any> {
    return this.dataSource.transaction(async (manager) => {
      // Order Amount validation
      OrderValidator.validateOrderTotals(dto);

      // Destructure order info and items
      const { items, ...orderInfo } = dto;

      // Crete Order
      const order = manager.create(Order, { ...orderInfo, created_by: userId });
      await manager.save(order);

      // Generate Kitchen Order Token (KOT)
      const tokenNumber = await TokenService.generateTokenNumber(
        this.dataSource,
        orderInfo.outlet_id,
        TokenType.KOT
      );
      // Store Token information
      const kot = manager.create(OrderToken, {
        order_id: order.id,
        token_number: tokenNumber,
        type: TokenType.KOT,
        created_by: userId,
      });
      await manager.save(kot);

      for (const itemDto of items) {
        const { addons, ...itemInfo } = itemDto;
        const orderItem = manager.create(OrderItem, {
          ...itemInfo,
          token_id: kot.id,
          order_id: order.id,
          created_by: userId,
        });

        //store order item
        await manager.save(orderItem);

        if (addons?.length) {
          const itemAddons = addons.map((addon) =>
            manager.create(OrderItemAddon, {
              ...addon,
              item_id: orderItem.id,
            })
          );

          //store order item addons information
          await manager.save(itemAddons);
        }
      }

      //return order data
      return manager.findOne(Order, {
        where: { id: order.id },
        relations: ["items", "items.addons"],
      });
    });
  }

  // Find all Orders with pagination + filters
  async findAll(filter: FilterOrderDto): Promise<PaginatedResult<Order>> {
    const { page = 1, limit = 10, search, status, order_type } = filter;

    const query = this.orderRepo.createQueryBuilder("order").where("1=1");

    if (search)
      query.andWhere("order.order_no LIKE :search", { search: `%${search}%` });
    if (status) query.andWhere("order.status = :status", { status });
    if (order_type)
      query.andWhere("order.order_type = :order_type", { order_type });

    query.andWhere("order.deleted_at IS NULL");

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy("order.created_at", "DESC")
      .leftJoinAndSelect("order.items", "items")
      .leftJoinAndSelect("order.tokens", "tokens")
      .leftJoinAndSelect("order.posTable", "posTable")
      .leftJoinAndSelect("order.waiter", "waiter")
      .leftJoinAndSelect("order.room", "room")
      .leftJoinAndSelect("order.customer", "customer")
      .getManyAndCount();

    return {
      records: data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Find one Order by UUID
  async findOne(uuid: string): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { uuid },
      relations: ["items", "tokens", "posTable", "waiter", "room", "customer"],
    });
    if (!order) throw new NotFoundException(`Order ${uuid} not found`);
    return order;
  }

  // Update Order + nested items & tokens
  async update(
    uuid: string,
    dto: UpdateOrderDto,
    userId: number
  ): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { uuid } });
    if (!order) throw new NotFoundException(`Order ${uuid} not found`);

    return this.dataSource.transaction(async (manager) => {
      // await manager
      //   .getRepository(Order)
      //   .update(order.id, { ...dto, updated_by: userId });

      // if (dto.items?.length) {
      //   // Replace old items with new
      //   await manager.getRepository(OrderItem).delete({ order_id: order.id });
      //   const items = dto.items.map((i) =>
      //     manager.getRepository(OrderItem).create({ ...i, order_id: order.id })
      //   );
      //   await manager.getRepository(OrderItem).save(items);
      // }

      // if (dto.tokens?.length) {
      //   // Replace old tokens with new
      //   await manager.getRepository(OrderToken).delete({ order_id: order.id });
      //   const tokens = dto.tokens.map((t) =>
      //     manager.getRepository(OrderToken).create({ ...t, order_id: order.id })
      //   );
      //   await manager.getRepository(OrderToken).save(tokens);
      // }

      return this.findOne(uuid);
    });
  }

  // Soft delete Order
  async softDelete(uuid: string, userId: number): Promise<void> {
    const order = await this.orderRepo.findOne({ where: { uuid } });
    if (!order) throw new NotFoundException(`Order ${uuid} not found`);

    await this.orderRepo.update(order.id, {
      deleted_at: new Date(),
      deleted_by: userId,
    });
  }

  // Restore soft-deleted Order
  async restore(uuid: string, userId: number): Promise<void> {
    const order = await this.orderRepo.findOne({
      where: { uuid },
      withDeleted: true,
    });
    if (!order) throw new NotFoundException(`Order ${uuid} not found`);

    await this.orderRepo.update(order.id, {
      deleted_at: null,
      deleted_by: null,
      updated_by: userId,
    });
  }

  // Hard delete Order
  async hardDelete(uuid: string): Promise<void> {
    const order = await this.orderRepo.findOne({
      where: { uuid },
      withDeleted: true,
    });
    if (!order) throw new NotFoundException(`Order ${uuid} not found`);

    await this.dataSource.transaction(async (manager) => {
      await manager.getRepository(Order).delete(order.id);
    });
  }
}
