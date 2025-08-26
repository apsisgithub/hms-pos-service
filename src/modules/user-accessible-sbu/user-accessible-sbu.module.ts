import { Module } from "@nestjs/common";
import { UserAccessibleSbuService } from "./user-accessible-sbu.service";
import { UserAccessibleSbuController } from "./user-accessible-sbu.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserAccessibleSbu } from "./entities/user-accessible-sbu.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserAccessibleSbu])],
    controllers: [UserAccessibleSbuController],
    providers: [UserAccessibleSbuService],
})
export class UserAccessibleSbuModule {}
