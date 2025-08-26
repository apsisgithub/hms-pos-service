import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
} from "@nestjs/common";
import { MasterBusinessAgentsService } from "./master-business-agents.service";
import { CreateMasterBusinessAgentDto } from "./dto/create-master-business-agent.dto";
import { UpdateMasterBusinessAgentDto } from "./dto/update-master-business-agent.dto";
import { GetBusinessAgentsDto } from "./dto/get-business-agents.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

@ApiTags("Business Agents")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("master-business-agents")
export class MasterBusinessAgentsController {
    constructor(
        private readonly masterBusinessAgentsService: MasterBusinessAgentsService
    ) {}

    @Post()
    create(@Body() createMasterBusinessAgentDto: CreateMasterBusinessAgentDto) {
        return this.masterBusinessAgentsService.create(
            createMasterBusinessAgentDto
        );
    }

    @Get()
    findAll(@Query() dto: GetBusinessAgentsDto) {
        return this.masterBusinessAgentsService.findAll(dto);
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.masterBusinessAgentsService.findOne(+id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateMasterBusinessAgentDto: UpdateMasterBusinessAgentDto
    ) {
        return this.masterBusinessAgentsService.update(
            +id,
            updateMasterBusinessAgentDto
        );
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.masterBusinessAgentsService.remove(+id);
    }
}
