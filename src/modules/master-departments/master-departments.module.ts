import { Module } from "@nestjs/common";
import { MasterDepartmentsService } from "./master-departments.service";
import { MasterDepartmentsController } from "./master-departments.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterDepartment } from "./entities/master_departments.entity";

@Module({
    imports: [TypeOrmModule.forFeature([MasterDepartment])],
    controllers: [MasterDepartmentsController],
    providers: [MasterDepartmentsService],
})
export class MasterDepartmentsModule {}
