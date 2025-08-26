import { Module } from "@nestjs/common";
import { MasterDiscountsService } from "./master-discounts.service";
import { MasterDiscountsController } from "./master-discounts.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterDiscount } from "./entities/master_discount.entity";

@Module({
    imports: [TypeOrmModule.forFeature([MasterDiscount])],
    controllers: [MasterDiscountsController],
    providers: [MasterDiscountsService],
})
export class MasterDiscountsModule {}
