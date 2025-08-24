# Event‑Driven Microservices Starter (NestJS + Prisma + PostgreSQL + NATS)

A minimal, production‑minded starter showing:

- **NestJS** microservices with **NATS** transport (publish/subscribe + request/reply)
- **Prisma** with **PostgreSQL** per service (database‑per‑service)
- **Outbox pattern** to emit reliable domain events after DB commits
- **Docker Compose** for local dev (NATS, Postgres for each service, services themselves)
- **Shared contract** package (TypeScript types + zod validation) to avoid event drift

> Services in this example: **orders** and **payments** plus an **api‑gateway** (HTTP) and **contracts** package.

---

## 1) Repo layout (Yarn workspaces or npm workspaces)

```
root/
  package.json
  tsconfig.base.json
  docker-compose.yml
  .env
  packages/
    contracts/            # shared event contracts (types + zod schemas)
  services/
    api-gateway/
      src/
      package.json
      tsconfig.json
    orders/
      prisma/
        schema.prisma
      src/
        main.ts
        app.module.ts
        orders.module.ts
        orders.controller.ts
        orders.service.ts
        outbox.publisher.ts
      package.json
      tsconfig.json
    payments/
      prisma/
        schema.prisma
      src/
        main.ts
        app.module.ts
        payments.module.ts
        payments.controller.ts
        payments.service.ts
      package.json
      tsconfig.json
```

**root/package.json** (workspaces)

```json
{
  "name": "event-driven-ms-starter",
  "private": true,
  "workspaces": ["packages/*", "services/*"],
  "devDependencies": {
    "typescript": "^5.5.0"
  }
}
```

**tsconfig.base.json**

```json
{
  "compilerOptions": {
    "target": "es2021",
    "module": "commonjs",
    "lib": ["es2021"],
    "declaration": true,
    "strict": true,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "baseUrl": "."
  }
}
```

---

## 2) Docker Compose

**docker-compose.yml**

```yaml
version: '3.9'
services:
  nats:
    image: nats:2.10-alpine
    ports: ['4222:4222', '8222:8222']
    command: ['-js', '-m', '8222'] # enable JetStream + monitoring

  orders-db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: orders
      POSTGRES_PASSWORD: orders
      POSTGRES_DB: orders
    ports: ['5433:5432']

  payments-db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: payments
      POSTGRES_PASSWORD: payments
      POSTGRES_DB: payments
    ports: ['5434:5432']

  orders:
    build: ./services/orders
    environment:
      DATABASE_URL: postgres://orders:orders@orders-db:5432/orders
      NATS_URL: nats://nats:4222
      SERVICE_NAME: orders
    depends_on: [nats, orders-db]

  payments:
    build: ./services/payments
    environment:
      DATABASE_URL: postgres://payments:payments@payments-db:5432/payments
      NATS_URL: nats://nats:4222
      SERVICE_NAME: payments
    depends_on: [nats, payments-db]

  api-gateway:
    build: ./services/api-gateway
    environment:
      NATS_URL: nats://nats:4222
      PORT: 3000
    ports: ['3000:3000']
    depends_on: [nats, orders, payments]
```

**.env** (local defaults)

```
NATS_URL=nats://localhost:4222
ORDERS_DB_URL=postgres://orders:orders@localhost:5433/orders
PAYMENTS_DB_URL=postgres://payments:payments@localhost:5434/payments
PORT=3000
```

---

## 3) Contracts package

**packages/contracts/src/index.ts**

```ts
import { z } from 'zod';

// Topics (subjects)
export const Subjects = {
  OrderCreated: 'order.created',
  PaymentReceived: 'payment.received',
} as const;
export type Subject = (typeof Subjects)[keyof typeof Subjects];

// Schemas
export const OrderCreated = z.object({
  orderId: z.string().uuid(),
  customerId: z.string().uuid(),
  total: z.number().positive(),
  currency: z.string().length(3),
  createdAt: z.string(),
});
export type OrderCreated = z.infer<typeof OrderCreated>;

export const PaymentReceived = z.object({
  paymentId: z.string().uuid(),
  orderId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().length(3),
  provider: z.string(),
  receivedAt: z.string(),
});
export type PaymentReceived = z.infer<typeof PaymentReceived>;
```

**packages/contracts/package.json**

```json
{
  "name": "@app/contracts",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc -p tsconfig.json"
  },
  "dependencies": { "zod": "^3.23.8" }
}
```

---

## 4) Orders service

**services/orders/package.json**

```json
{
  "name": "orders",
  "private": true,
  "scripts": {
    "start:dev": "nest start --watch",
    "build": "nest build",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev"
  },
  "dependencies": {
    "@nestjs/common": "^10",
    "@nestjs/core": "^10",
    "@nestjs/microservices": "^10",
    "nats": "^2.18.0",
    "@prisma/client": "^5",
    "prisma": "^5",
    "date-fns": "^3",
    "@app/contracts": "*"
  },
  "devDependencies": { "@nestjs/cli": "^10", "typescript": "^5.5" }
}
```

**services/orders/prisma/schema.prisma**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Order {
  id          String   @id @default(uuid())
  customerId  String
  total       Decimal
  currency    String   @db.Char(3)
  status      String   @default("CREATED")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  // Outbox relation
  outboxEvents OutboxEvent[]
}

model OutboxEvent {
  id        String   @id @default(uuid())
  topic     String
  payload   Json
  createdAt DateTime @default(now())
  published Boolean  @default(false)
  // optional linkage
  orderId   String?
  Order     Order?   @relation(fields: [orderId], references: [id])

  @@index([published, createdAt])
}
```

**services/orders/src/main.ts**

```ts
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: { servers: [process.env.NATS_URL || 'nats://localhost:4222'] },
    },
  );
  await app.listen();
}
bootstrap();
```

**services/orders/src/app.module.ts**

```ts
import { Module } from '@nestjs/common';
import { OrdersModule } from './orders.module';

@Module({ imports: [OrdersModule] })
export class AppModule {}
```

**services/orders/src/orders.module.ts**

```ts
import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaClient } from '@prisma/client';
import { OutboxPublisher } from './outbox.publisher';

@Module({
  providers: [
    OrdersService,
    OutboxPublisher,
    { provide: 'PRISMA', useValue: new PrismaClient() },
  ],
  controllers: [OrdersController],
})
export class OrdersModule {}
```

**services/orders/src/orders.controller.ts**

```ts
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { Subjects } from '@app/contracts';

@Controller()
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  // Example subscription (if any other service emits something orders cares about)
  @EventPattern('payment.received')
  async handlePayment(@Payload() data: any) {
    await this.service.markPaid(data.orderId);
  }
}
```

**services/orders/src/orders.service.ts**

```ts
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { OutboxPublisher } from './outbox.publisher';
import { formatISO } from 'date-fns';

@Injectable()
export class OrdersService {
  constructor(
    private readonly outbox: OutboxPublisher,
    private readonly prisma: PrismaClient,
  ) {}

  async create(dto: { customerId: string; total: number; currency: string }) {
    const created = await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          customerId: dto.customerId,
          total: dto.total,
          currency: dto.currency,
        },
      });

      await this.outbox.enqueue(tx, 'order.created', {
        orderId: order.id,
        customerId: order.customerId,
        total: Number(order.total),
        currency: order.currency,
        createdAt: formatISO(order.createdAt),
      });

      return order;
    });

    return created;
  }

  async markPaid(orderId: string) {
    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'PAID' },
    });
  }
}
```

**services/orders/src/outbox.publisher.ts**

```ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { connect, NatsConnection, StringCodec } from 'nats';

@Injectable()
export class OutboxPublisher implements OnModuleInit {
  private nc: NatsConnection;
  private sc = StringCodec();

  constructor(private prisma: PrismaClient) {}

  async onModuleInit() {
    this.nc = await connect({
      servers: process.env.NATS_URL || 'nats://localhost:4222',
    });
    // Background publisher loop; for production, prefer a separate worker
    this.startPublisherLoop();
  }

  async enqueue(tx: Prisma.TransactionClient, topic: string, payload: any) {
    await tx.outboxEvent.create({ data: { topic, payload } });
  }

  private async startPublisherLoop() {
    // naive poller; use LISTEN/NOTIFY or job queue in prod
    setInterval(async () => {
      const batch = await this.prisma.outboxEvent.findMany({
        where: { published: false },
        take: 50,
        orderBy: { createdAt: 'asc' },
      });
      for (const evt of batch) {
        await this.nc.publish(
          evt.topic,
          this.sc.encode(JSON.stringify(evt.payload)),
        );
        await this.prisma.outboxEvent.update({
          where: { id: evt.id },
          data: { published: true },
        });
      }
    }, 1000);
  }
}
```

---

## 5) Payments service

**services/payments/package.json** (similar deps)

```json
{
  "name": "payments",
  "private": true,
  "scripts": {
    "start:dev": "nest start --watch",
    "build": "nest build",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev"
  },
  "dependencies": {
    "@nestjs/common": "^10",
    "@nestjs/core": "^10",
    "@nestjs/microservices": "^10",
    "nats": "^2.18.0",
    "@prisma/client": "^5",
    "prisma": "^5",
    "date-fns": "^3",
    "@app/contracts": "*"
  },
  "devDependencies": { "@nestjs/cli": "^10", "typescript": "^5.5" }
}
```

**services/payments/prisma/schema.prisma**

```prisma
generator client { provider = "prisma-client-js" }

datasource db { provider = "postgresql" url = env("DATABASE_URL") }

model Payment {
  id        String   @id @default(uuid())
  orderId   String
  amount    Decimal
  currency  String   @db.Char(3)
  provider  String
  status    String   @default("RECEIVED")
  receivedAt DateTime @default(now())
}
```

**services/payments/src/main.ts**

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: { servers: [process.env.NATS_URL || 'nats://localhost:4222'] },
    },
  );
  await app.listen();
}
bootstrap();
```

**services/payments/src/app.module.ts**

```ts
import { Module } from '@nestjs/common';
import { PaymentsModule } from './payments.module';

@Module({ imports: [PaymentsModule] })
export class AppModule {}
```

**services/payments/src/payments.module.ts**

```ts
import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [
    PaymentsService,
    { provide: 'PRISMA', useValue: new PrismaClient() },
  ],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
```

**services/payments/src/payments.controller.ts**

```ts
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PaymentsService } from './payments.service';

@Controller()
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @EventPattern('order.created')
  async onOrderCreated(@Payload() data: any) {
    // Optionally pre-authorize, etc.
  }
}
```

**services/payments/src/payments.service.ts**

```ts
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { connect, StringCodec } from 'nats';
import { formatISO } from 'date-fns';

@Injectable()
export class PaymentsService {
  private sc = StringCodec();

  constructor(private prisma: PrismaClient) {}

  async receive(dto: {
    orderId: string;
    amount: number;
    currency: string;
    provider: string;
  }) {
    const payment = await this.prisma.payment.create({ data: dto });

    // Emit event immediately (no outbox shown here for brevity)
    const nc = await connect({
      servers: process.env.NATS_URL || 'nats://localhost:4222',
    });
    await nc.publish(
      'payment.received',
      this.sc.encode(
        JSON.stringify({
          paymentId: payment.id,
          orderId: payment.orderId,
          amount: Number(payment.amount),
          currency: payment.currency,
          provider: payment.provider,
          receivedAt: formatISO(payment.receivedAt),
        }),
      ),
    );
    await nc.flush();
    await nc.close();

    return payment;
  }
}
```

---

## 6) API Gateway (HTTP -> NATS request/reply or command emit)

**services/api-gateway/package.json**

```json
{
  "name": "api-gateway",
  "private": true,
  "scripts": { "start:dev": "nest start --watch", "build": "nest build" },
  "dependencies": {
    "@nestjs/common": "^10",
    "@nestjs/core": "^10",
    "@nestjs/microservices": "^10",
    "nats": "^2.18.0",
    "@app/contracts": "*"
  },
  "devDependencies": { "@nestjs/cli": "^10", "typescript": "^5.5" }
}
```

**services/api-gateway/src/main.ts**

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}
bootstrap();
```

**services/api-gateway/src/app.module.ts**

```ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NATS',
        transport: Transport.NATS,
        options: { servers: [process.env.NATS_URL || 'nats://localhost:4222'] },
      },
    ]),
  ],
  controllers: [AppController],
})
export class AppModule {}
```

**services/api-gateway/src/app.controller.ts**

```ts
import { Body, Controller, Post } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  private nats: ClientProxy = ClientProxyFactory.create({
    transport: Transport.NATS,
    options: { servers: [process.env.NATS_URL || 'nats://localhost:4222'] },
  });

  @Post('/orders')
  async createOrder(
    @Body() dto: { customerId: string; total: number; currency: string },
  ) {
    // fire-and-forget command (publish)
    await this.nats.emit('order.create.command', dto).toPromise();
    return { status: 'queued' };
  }

  @Post('/payments')
  async createPayment(
    @Body()
    dto: {
      orderId: string;
      amount: number;
      currency: string;
      provider: string;
    },
  ) {
    await this.nats.emit('payment.receive.command', dto).toPromise();
    return { status: 'queued' };
  }
}
```

> Optionally, implement **request/reply** patterns (e.g., `send()` instead of `emit()`) if the client needs immediate responses.

---

## 7) Wiring command handlers in services

Add these handlers to services to react to gateway commands.

**orders/src/orders.controller.ts** (add):

```ts
import { Ctx, EventPattern, Payload, NatsContext } from '@nestjs/microservices';

@EventPattern('order.create.command')
async create(@Payload() dto: any, @Ctx() ctx: NatsContext) {
  await this.service.create(dto);
}
```

**payments/src/payments.controller.ts** (add):

```ts
import { Ctx, EventPattern, Payload, NatsContext } from '@nestjs/microservices';

@EventPattern('payment.receive.command')
async receive(@Payload() dto: any, @Ctx() ctx: NatsContext) {
  await this.service.receive(dto);
}
```

---

## 8) Setup & Run

```bash
# at repo root
corepack enable
npm i # or yarn

# build contracts first
npm run -w packages/contracts build

# for each service: generate prisma and migrate
npm run -w services/orders prisma:generate
npm run -w services/orders prisma:migrate --name init
npm run -w services/payments prisma:generate
npm run -w services/payments prisma:migrate --name init

# run infra + services
docker compose up -d --build
```

Now test:

```bash
curl -X POST http://localhost:3000/orders \
  -H 'Content-Type: application/json' \
  -d '{"customerId":"c1111111-1111-1111-1111-111111111111","total":1999,"currency":"BDT"}'

curl -X POST http://localhost:3000/payments \
  -H 'Content-Type: application/json' \
  -d '{"orderId":"<ORDER_ID>","amount":1999,"currency":"BDT","provider":"bkash"}'
```

---

## 9) Notes on Reliability

- **Outbox pattern** used in `orders` ensures events are not lost if the service crashes after DB commit.
- Consider moving publisher loop to a **dedicated worker** (same DB, separate process) and use **LISTEN/NOTIFY** or a job queue for immediate wakeups.
- Enable **NATS JetStream** with streams/consumers for durable delivery and replay when needed.
- Add **idempotency keys** on handlers to avoid double‑processing.

---

## 10) Production Hardening Checklist

- Config management with `@nestjs/config` and schema validation
- Health endpoints (`@godaddy/terminus` or Nest Terminus)
- Observability (OpenTelemetry, logs with pino, tracing)
- Migrations in CI/CD before deploy
- Separate databases per service (already shown)
- Versioned event contracts
- Retry & DLQ (JetStream consumers with maxDeliver, backoff)
- Security: TLS for NATS, secrets via vault/KMS

---

## 11) Extras (Optional)

- Replace NATS with Kafka by switching Nest transport to `Transport.KAFKA` and using `kafkajs`
- Use **Prisma Partial Indexes** and **JSON** columns for flexible aggregates
- Saga/Process Manager for cross‑service workflows (e.g., order → payment → fulfillment)

---

---

# 12) Tailoring to Restaurant/POS (Offline‑First, Multi‑Branch)

Below is a concrete adaptation for a Restaurant/POS domain with **branches**, **counters**, **products**, **inventory**, **sales**, and **kitchen tickets**. It keeps NATS (JetStream) and the outbox pattern.

## 12.1 Domain + Events

**Entities**: Branch, Counter, Product, Inventory, Sale, SaleItem, StockMovement, Refund, KitchenTicket

**Key Events** (contracts):

- `sale.completed`
- `payment.received` (already)
- `inventory.decremented`
- `inventory.incremented` (refund, purchase, manual adjust)
- `kitchen.ticket.created`

## 12.2 Contracts additions

**packages/contracts/src/index.ts** (append)

```ts
export const Subjects = {
  OrderCreated: 'order.created',
  PaymentReceived: 'payment.received',
  // POS additions
  SaleCompleted: 'sale.completed',
  InventoryDecremented: 'inventory.decremented',
  InventoryIncremented: 'inventory.incremented',
  KitchenTicketCreated: 'kitchen.ticket.created',
} as const;

export const SaleCompleted = z.object({
  saleId: z.string().uuid(),
  branchId: z.string().uuid(),
  counterId: z.string().uuid(),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      qty: z.number().positive(),
      price: z.number().nonnegative(),
    }),
  ),
  subtotal: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  total: z.number().nonnegative(),
  currency: z.string().length(3),
  completedAt: z.string(),
});
export type SaleCompleted = z.infer<typeof SaleCompleted>;

export const InventoryDecremented = z.object({
  branchId: z.string().uuid(),
  productId: z.string().uuid(),
  qty: z.number().positive(),
  reason: z.enum(['SALE', 'ADJUSTMENT', 'TRANSFER_OUT', 'WASTE']),
  refId: z.string().uuid().optional(),
  occurredAt: z.string(),
});
export type InventoryDecremented = z.infer<typeof InventoryDecremented>;

export const InventoryIncremented = z.object({
  branchId: z.string().uuid(),
  productId: z.string().uuid(),
  qty: z.number().positive(),
  reason: z.enum(['REFUND', 'ADJUSTMENT', 'TRANSFER_IN', 'PURCHASE']),
  refId: z.string().uuid().optional(),
  occurredAt: z.string(),
});
export type InventoryIncremented = z.infer<typeof InventoryIncremented>;

export const KitchenTicketCreated = z.object({
  ticketId: z.string().uuid(),
  saleId: z.string().uuid(),
  branchId: z.string().uuid(),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      name: z.string(),
      qty: z.number().positive(),
      notes: z.string().optional(),
    }),
  ),
  createdAt: z.string(),
});
export type KitchenTicketCreated = z.infer<typeof KitchenTicketCreated>;
```

## 12.3 POS Service (replaces `orders` with `sales`)

**services/sales/prisma/schema.prisma**

```prisma
generator client { provider = "prisma-client-js" }

datasource db { provider = "postgresql" url = env("DATABASE_URL") }

model Branch { id String @id @default(uuid()) name String counters Counter[] inventories Inventory[] }
model Counter { id String @id @default(uuid()) branchId String branch Branch @relation(fields: [branchId], references: [id]) name String }

model Product {
  id        String   @id @default(uuid())
  sku       String   @unique
  name      String
  price     Decimal
  isKitchen Boolean  @default(false)  // send to KOT?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  inventories Inventory[]
}

model Inventory {
  id        String   @id @default(uuid())
  branchId  String
  productId String
  qty       Int      @default(0)
  updatedAt DateTime @updatedAt
  branch    Branch   @relation(fields: [branchId], references: [id])
  product   Product  @relation(fields: [productId], references: [id])
  @@unique([branchId, productId])
}

model Sale {
  id         String   @id @default(uuid())
  branchId   String
  counterId  String
  subtotal   Decimal
  discount   Decimal  @default(0)
  total      Decimal
  currency   String   @db.Char(3)
  status     String   @default("COMPLETED")
  completedAt DateTime @default(now())
  items      SaleItem[]
  outbox     OutboxEvent[]
}

model SaleItem {
  id        String   @id @default(uuid())
  saleId    String
  productId String
  qty       Int
  price     Decimal
  sale      Sale     @relation(fields: [saleId], references: [id])
  product   Product  @relation(fields: [productId], references: [id])
}

model StockMovement {
  id        String   @id @default(uuid())
  branchId  String
  productId String
  qty       Int
  type      String   // DECREMENT/INCREMENT
  reason    String
  refId     String?
  createdAt DateTime @default(now())
}

model OutboxEvent {
  id        String   @id @default(uuid())
  topic     String
  payload   Json
  createdAt DateTime @default(now())
  published Boolean  @default(false)
  saleId    String?
  Sale      Sale?    @relation(fields: [saleId], references: [id])
  @@index([published, createdAt])
}
```

**services/sales/src/sales.service.ts** (core transaction with stock checks)

```ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { OutboxPublisher } from './outbox.publisher';
import { formatISO } from 'date-fns';

@Injectable()
export class SalesService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly outbox: OutboxPublisher,
  ) {}

  async completeSale(dto: {
    branchId: string;
    counterId: string;
    currency: string;
    items: { productId: string; qty: number; price: number }[];
    discount?: number;
  }) {
    const discount = dto.discount ?? 0;
    const subtotal = dto.items.reduce((s, it) => s + it.qty * it.price, 0);
    const total = subtotal - discount;

    return this.prisma.$transaction(async (tx) => {
      // check and decrement stock per item
      for (const it of dto.items) {
        const inv = await tx.inventory.findUnique({
          where: {
            branchId_productId: {
              branchId: dto.branchId,
              productId: it.productId,
            },
          },
        });
        if (!inv || inv.qty < it.qty)
          throw new BadRequestException(
            `Insufficient stock for product ${it.productId}`,
          );
        await tx.inventory.update({
          where: {
            branchId_productId: {
              branchId: dto.branchId,
              productId: it.productId,
            },
          },
          data: { qty: { decrement: it.qty } },
        });
        await tx.stockMovement.create({
          data: {
            branchId: dto.branchId,
            productId: it.productId,
            qty: it.qty,
            type: 'DECREMENT',
            reason: 'SALE',
          },
        });
        await this.outbox.enqueue(tx, 'inventory.decremented', {
          branchId: dto.branchId,
          productId: it.productId,
          qty: it.qty,
          reason: 'SALE',
          occurredAt: formatISO(new Date()),
        });
      }

      const sale = await tx.sale.create({
        data: {
          branchId: dto.branchId,
          counterId: dto.counterId,
          subtotal,
          discount,
          total,
          currency: dto.currency,
          items: {
            create: dto.items.map((i) => ({
              productId: i.productId,
              qty: i.qty,
              price: i.price,
            })),
          },
        },
        include: { items: true },
      });

      await this.outbox.enqueue(tx, 'sale.completed', {
        saleId: sale.id,
        branchId: sale.branchId,
        counterId: sale.counterId,
        items: sale.items.map((i) => ({
          productId: i.productId,
          qty: i.qty,
          price: Number(i.price),
        })),
        subtotal,
        discount,
        total,
        currency: dto.currency,
        completedAt: formatISO(sale.completedAt),
      });

      // Create kitchen ticket if any item isKitchen
      const kitchenItems = await tx.saleItem.findMany({
        where: { saleId: sale.id, product: { isKitchen: true } },
        include: { product: true },
      });
      if (kitchenItems.length) {
        await this.outbox.enqueue(tx, 'kitchen.ticket.created', {
          ticketId: sale.id, // reuse id; in real world, separate id
          saleId: sale.id,
          branchId: sale.branchId,
          items: kitchenItems.map((ki) => ({
            productId: ki.productId,
            name: ki.product.name,
            qty: ki.qty,
          })),
          createdAt: formatISO(new Date()),
        });
      }

      return sale;
    });
  }
}
```

**services/sales/src/sales.controller.ts** (subscribe to commands)

```ts
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SalesService } from './sales.service';

@Controller()
export class SalesController {
  constructor(private readonly service: SalesService) {}

  @EventPattern('sale.complete.command')
  async complete(@Payload() dto: any) {
    await this.service.completeSale(dto);
  }
}
```

> The **payments** service stays as‑is; it listens to `sale.completed` (optional) and emits `payment.received`. A **receipt** service could merge sale + payment for printable receipts.

## 12.4 Kitchen (KOT) microservice

**services/kitchen/src/kitchen.controller.ts**

```ts
import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class KitchenController {
  private readonly logger = new Logger(KitchenController.name);

  @EventPattern('kitchen.ticket.created')
  async printKOT(@Payload() data: any) {
    // Render to ESC/POS or push to a WebSocket for an on‑prem KDS
    this.logger.log(`KOT for sale ${data.saleId}, items: ${data.items.length}`);
  }
}
```

## 12.5 API Gateway endpoints for POS

**services/api-gateway/src/app.controller.ts** (add)

```ts
@Post('/sales')
async completeSale(@Body() dto: { branchId: string; counterId: string; currency: string; items: { productId: string; qty: number; price: number }[]; discount?: number }) {
  await this.nats.emit('sale.complete.command', dto).toPromise();
  return { status: 'queued' };
}
```

## 12.6 Offline‑First Sync (Local Counter → Server)

Add a new **sync** microservice exposing HTTP endpoints for mobile/desktop POS clients.

**Principles**

- Each entity has `updatedAt` and optional `version` (integer). Server returns changes **since a cursor**.
- Client keeps a per‑entity `lastSyncedAt`.
- **Push:** client sends local mutations with **clientMutationId** (idempotency). Server applies and stores mapping `clientMutationId → result`.
- **Pull:** `GET /sync/changes?since=2025-08-01T00:00:00Z&branchId=...` returns arrays per entity.
- Conflicts: **last‑write‑wins within a day**, or domain rules (e.g., stock cannot go below zero; merge line items by incrementing qty).

**Example DTOs**

```ts
// push
POST /sync/push
{
  clientId: string,
  mutations: Array<{ id: string; type: 'SALE'|'REFUND'|'ADJUST_STOCK'; payload: any; happenedAt: string }>
}

// pull
GET /sync/changes?since=ISO_INSTANT&branchId=UUID
```

On successful `SALE` push, the sync service forwards a `sale.complete.command` to NATS. This keeps one authoritative path for writes while still allowing offline capture.

## 12.7 NATS JetStream (durable consumers)

Enable JetStream in compose (already on). Create streams programmatically or via nats CLI:

```bash
nats stream add POS --subjects "sale.*" --retention limits --max-msgs=-1 --max-bytes=-1 --dupe-window 2m
nats stream add INV --subjects "inventory.*" --retention limits
nats consumer add POS sales-worker --filter "sale.completed" --deliver all --ack explicit
```

Consumers in services can use JetStream (nats.js `jetstream()`), ensuring replay after outages.

## 12.8 Refund flow

- Client requests refund → API emits `refund.create.command` → Sales service validates and **increments** inventory, emits `inventory.incremented` and `refund.processed` (add if needed).

## 12.9 Seed & Demo

- Seed `Branch`, `Counter`, `Product`, `Inventory` with initial stock.
- Test with `POST /sales` then `POST /payments`.

---

---

# 13) Kafka Transport (drop‑in alternative to NATS)

This section shows how to **swap NATS for Kafka** with minimal code changes. Keep both in repo and choose via env.

## 13.1 Docker Compose (Kafka KRaft)

Add to `docker-compose.yml`:

```yaml
kafka:
  image: bitnami/kafka:3.7
  ports: ['9092:9092']
  environment:
    - KAFKA_ENABLE_KRAFT=yes
    - KAFKA_CFG_PROCESS_ROLES=broker,controller
    - KAFKA_CFG_NODE_ID=1
    - KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=1@kafka:9093
    - KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093
    - KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://kafka:9092
    - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT
    - KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER
    - KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE=true
```

Env flags:

```
BROKER_URL=kafka:9092
TRANSPORT=kafka # or nats
```

## 13.2 NestJS transport factory

Create `libs/transport/src/index.ts` (shared helper):

```ts
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

export function createClient(transport: 'nats' | 'kafka'): ClientProxy {
  if (transport === 'kafka') {
    return ClientProxyFactory.create({
      transport: Transport.KAFKA,
      options: {
        client: { brokers: [process.env.BROKER_URL || 'localhost:9092'] },
        consumer: { groupId: process.env.SERVICE_NAME || 'app' },
      },
    });
  }
  // default NATS
  return ClientProxyFactory.create({
    transport: Transport.NATS,
    options: { servers: [process.env.NATS_URL || 'nats://localhost:4222'] },
  });
}
```

Gateway usage (`api-gateway/src/app.controller.ts`):

```ts
import { Controller, Post, Body } from '@nestjs/common';
import { createClient } from '@app/transport';

@Controller()
export class AppController {
  private bus = createClient((process.env.TRANSPORT as any) || 'nats');

  @Post('/sales')
  async completeSale(@Body() dto: any) {
    await this.bus.emit('sale.complete.command', dto).toPromise();
    return { status: 'queued' };
  }
}
```

Service bootstrap (`sales/src/main.ts`):

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const transport = (process.env.TRANSPORT || 'nats') as 'nats' | 'kafka';
  const options: MicroserviceOptions =
    transport === 'kafka'
      ? {
          transport: Transport.KAFKA,
          options: {
            client: { brokers: [process.env.BROKER_URL || 'localhost:9092'] },
            consumer: { groupId: process.env.SERVICE_NAME || 'sales' },
          },
        }
      : {
          transport: Transport.NATS,
          options: {
            servers: [process.env.NATS_URL || 'nats://localhost:4222'],
          },
        };

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    options,
  );
  await app.listen();
}
bootstrap();
```

### Topics mapping

- For **Kafka**, use topics like `sale.complete.command`, `sale.completed`, `inventory.decremented` (same names). Kafka ignores `.` semantics; just treat them as plain topic strings.

---

# 14) NATS JetStream Consumer (durable, at‑least‑once)

Convert the naive poller to JetStream durable consumers with explicit acks.

## 14.1 Create streams & consumers (once)

```bash
nats stream add POS --subjects "sale.*" --retention limits
nats consumer add POS sales-worker --filter "sale.completed" --deliver all --ack explicit --max-deliver 10 --backoff 1s,5s,30s
```

## 14.2 Consume in Kitchen service

**services/kitchen/src/kitchen.jetstream.ts**

```ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { connect, StringCodec } from 'nats';

@Injectable()
export class KitchenJetStream implements OnModuleInit {
  private readonly log = new Logger(KitchenJetStream.name);
  private sc = StringCodec();

  async onModuleInit() {
    const nc = await connect({
      servers: process.env.NATS_URL || 'nats://localhost:4222',
    });
    const js = nc.jetstream();

    const sub = await js.subscribe('sale.completed', {
      durable: 'kitchen-worker',
      manualAck: true,
      mack: true, // manual ack (alias in nats.js v2)
      deliver_policy: 'all',
    } as any);

    (async () => {
      for await (const m of sub) {
        try {
          const data = JSON.parse(this.sc.decode(m.data));
          this.log.log(`KOT for sale ${data.saleId}`);
          // do work ...
          m.ack();
        } catch (e) {
          this.log.error(e);
          // no ack -> redeliver
        }
      }
    })();
  }
}
```

Wire into module:

```ts
import { Module } from '@nestjs/common';
import { KitchenJetStream } from './kitchen.jetstream';
import { KitchenController } from './kitchen.controller';

@Module({ providers: [KitchenJetStream], controllers: [KitchenController] })
export class KitchenModule {}
```

> This gives **durable**, **at-least-once** processing with backoff/redelivery handled by JetStream.

---

# 15) CI/CD, Health Checks, Observability

## 15.1 Health (NestJS Terminus)

Install: `@nestjs/terminus`, `@nestjs/axios`

**api-gateway/src/health.module.ts**

```ts
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

@Module({ imports: [TerminusModule], controllers: [HealthController] })
export class HealthModule {}
```

**api-gateway/src/health.controller.ts**

```ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(private health: HealthCheckService) {}
  @Get()
  @HealthCheck()
  readiness() {
    return this.health.check([]);
  }
}
```

Register `HealthModule` in `AppModule`. Repeat similarly for `sales`/`payments` and include light checks (DB ping).

## 15.2 Observability (OpenTelemetry + Prometheus)

- Install: `@opentelemetry/api`, `@opentelemetry/sdk-node`, `@opentelemetry/auto-instrumentations-node`, `prom-client`.
- Add `otlp-collector` or export directly to Prometheus via `/metrics`.

**common/telemetry.ts**

```ts
import { Meter, metrics } from '@opentelemetry/api';
import client from 'prom-client';

export const register = new client.Registry();
client.collectDefaultMetrics({ register });

export const counters = {
  salesCompleted: new client.Counter({
    name: 'sales_completed_total',
    help: 'Total completed sales',
  }),
};
```

Expose metrics (gateway):

```ts
import { Controller, Get } from '@nestjs/common';
import { register } from '@app/telemetry';

@Controller('metrics')
export class MetricsController {
  @Get()
  async get() {
    return register.metrics();
  }
}
```

Increment where appropriate, e.g. in `SalesService` after success.

## 15.3 GitHub Actions (build, test, docker, push)

**.github/workflows/ci.yml**

```yaml
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: corepack enable
      - run: npm i
      - run: npm run -w packages/contracts build
      - run: npm run -w services/sales build
      - run: npm run -w services/payments build
      - run: npm run -w services/api-gateway build
      - name: Docker login
        uses: docker/login-action@v3
        with: { username: ${{ secrets.DOCKER_USERNAME }}, password: ${{ secrets.DOCKER_PASSWORD }} }
      - name: Build & push images
        run: |
          docker build -t ${{ secrets.DOCKER_USERNAME }}/pos-sales:latest services/sales
          docker push ${{ secrets.DOCKER_USERNAME }}/pos-sales:latest
          docker build -t ${{ secrets.DOCKER_USERNAME }}/pos-gateway:latest services/api-gateway
          docker push ${{ secrets.DOCKER_USERNAME }}/pos-gateway:latest
```

Add a `deploy.yml` for your target (Kubernetes, Docker Swarm, or VPS SSH).

---

# 16) Offline PWA Counter App (Next.js + IndexedDB)

Goals:

- Works offline, captures sales locally (IndexedDB)
- Background Sync to server (`/sync/push`) when online
- Pull updates (`/sync/changes`) on start or timer

## 16.1 Next.js app (App Router)

**apps/counter/next.config.js**

```js
module.exports = { experimental: { ppr: true } };
```

**apps/counter/public/manifest.webmanifest**

```json
{
  "name": "POS Counter",
  "short_name": "Counter",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "icons": []
}
```

**apps/counter/public/sw\.js** (very small SW)

```js
self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => self.clients.claim());
self.addEventListener('fetch', (e) => {
  // basic offline: try network then fallback to cache
});
```

**IndexedDB helper** (use `idb`)

```ts
// apps/counter/src/lib/db.ts
import { openDB } from 'idb';
export const dbp = openDB('pos', 1, {
  upgrade(db) {
    db.createObjectStore('sales', { keyPath: 'id' });
    db.createObjectStore('queue', { keyPath: 'id' });
  },
});
```

**Create sale offline**

```ts
import { dbp } from './lib/db';
export async function createLocalSale(sale) {
  const db = await dbp;
  const id = crypto.randomUUID();
  const record = {
    id,
    ...sale,
    status: 'PENDING',
    happenedAt: new Date().toISOString(),
  };
  await db.put('sales', record);
  await db.put('queue', { id, type: 'SALE', payload: record });
  return id;
}
```

**Sync worker**

```ts
export async function syncNow() {
  const db = await dbp;
  const all = await db.getAll('queue');
  if (!all.length) return;
  const resp = await fetch('/sync/push', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientId: 'counter-1',
      mutations: all.map((m) => ({
        id: m.id,
        type: m.type,
        payload: m.payload,
        happenedAt: m.payload.happenedAt,
      })),
    }),
  });
  if (resp.ok) {
    for (const m of all) await db.delete('queue', m.id);
  }
}
```

Trigger `syncNow()` on network regain (`online` event) and on an interval.

---

## What to pick?

- **Default**: Keep **NATS + JetStream** (now durable) for microservices.
- Use **Kafka** only if you need long‑term retention + big analytics.
- Ship the **PWA Counter** regardless—it dramatically improves resilience at stores.

---

### Done. The canvas now includes: Kafka swap, JetStream durable consumer code, CI/CD + health/metrics, and a working outline for the Offline PWA Counter app with IndexedDB + sync. Want me to wire the exact sync endpoints in the `sync` service and add e2e tests next?
