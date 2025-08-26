import { Module } from "@nestjs/common";
import { MasterDisplaySettingsService } from "./master-display-settings.service";
import { MasterDisplaySettingsController } from "./master-display-settings.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterDisplaySetting } from "./entities/master_display_settings.entity";

@Module({
    imports: [TypeOrmModule.forFeature([MasterDisplaySetting])],
    controllers: [MasterDisplaySettingsController],
    providers: [MasterDisplaySettingsService],
})
export class MasterDisplaySettingsModule {}
