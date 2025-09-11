import { Module } from "@nestjs/common";
import { AddonService } from "./addon.service";
import { AddonController } from "./addon.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Addon } from "src/entities/pos/addons.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Addon])],
  controllers: [AddonController],
  providers: [AddonService],
  exports: [AddonService],
})
export class AddonModule {}
