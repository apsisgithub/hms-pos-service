import { Module } from "@nestjs/common";
import { MasterCompaniesService } from "./master-companies.service";
import { MasterCompaniesController } from "./master-companies.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Company } from "./entities/master-companies.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Company])],
    controllers: [MasterCompaniesController],
    providers: [MasterCompaniesService],
})
export class MasterCompaniesModule {}
