import { Module } from "@nestjs/common";
import { MasterBusinessAgentsService } from "./master-business-agents.service";
import { MasterBusinessAgentsController } from "./master-business-agents.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterBusinessAgent } from "./entities/master-business-agent.entity";

@Module({
    imports: [TypeOrmModule.forFeature([MasterBusinessAgent])],
    controllers: [MasterBusinessAgentsController],
    providers: [MasterBusinessAgentsService],
})
export class MasterBusinessAgentsModule {}
