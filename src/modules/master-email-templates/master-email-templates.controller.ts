import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
} from "@nestjs/common";
import { MasterEmailTemplatesService } from "./master-email-templates.service";
import { CreateMasterEmailTemplateDto } from "./dto/create-master-email-template.dto";
import { UpdateMasterEmailTemplateDto } from "./dto/update-master-email-template.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { RoleName } from "src/common/enums/role-name.enum";
import { GetEmailTemplatesDto } from "./dto/get-email-templates.dto";

@ApiTags("Email Templates")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("master-email-templates")
export class MasterEmailTemplatesController {
    constructor(
        private readonly masterEmailTemplatesService: MasterEmailTemplatesService
    ) {}

    @Post()
    create(@Body() createMasterEmailTemplateDto: CreateMasterEmailTemplateDto) {
        return this.masterEmailTemplatesService.createEmailTemplate(
            createMasterEmailTemplateDto
        );
    }

    @Get()
    findAll(@Query() dto: GetEmailTemplatesDto) {
        return this.masterEmailTemplatesService.findAllEmailTemplates(dto);
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.masterEmailTemplatesService.findEmailTemplateById(+id);
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateMasterEmailTemplateDto: UpdateMasterEmailTemplateDto
    ) {
        return this.masterEmailTemplatesService.updateEmailTemplate(
            +id,
            updateMasterEmailTemplateDto
        );
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.masterEmailTemplatesService.removeEmailTemplate(+id);
    }
}
