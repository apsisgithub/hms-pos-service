import { Module } from "@nestjs/common";
import { MasterEmailTemplatesService } from "./master-email-templates.service";
import { MasterEmailTemplatesController } from "./master-email-templates.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterEmailTemplate } from "./entities/master_email_templates.entity";

@Module({
    imports: [TypeOrmModule.forFeature([MasterEmailTemplate])],
    controllers: [MasterEmailTemplatesController],
    providers: [MasterEmailTemplatesService],
})
export class MasterEmailTemplatesModule {}
