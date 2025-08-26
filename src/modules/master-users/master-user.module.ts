import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterUser } from "./entities/master_user.entity";
import { MasterUserController } from "./master-user.controller";
import { MasterUserService } from "./master-user.service";

@Module({
    imports: [TypeOrmModule.forFeature([MasterUser])],
    controllers: [MasterUserController],
    providers: [MasterUserService],
})
export class MasterUserModule {}
