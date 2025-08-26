import { Module } from "@nestjs/common";
import { MasterBusinessSourceService } from "./business-sources.service";
import { BusinessSourcesController } from "./business-sources.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterBusinessSource } from "./entities/master_business_sources.entity";
import { MasterMarketCode } from "./entities/master_market_code.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([MasterBusinessSource, MasterMarketCode]),
    ],
    controllers: [BusinessSourcesController],
    providers: [MasterBusinessSourceService],
})
export class BusinessSourcesModule {}
