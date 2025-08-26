import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RequestMiddleware } from "./common/middleware/request.middleware";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./auth/jwt.strategy";
// import { TypeOrmModule } from "@nestjs/typeorm";
// import { getDatabaseConfig } from "./config/typeorm.config";
import { MasterSbuModule } from "./modules/master-sbu/master_sbu.module";
import { MasterRolesModule } from "./modules/master-roles/master-roles.module";
import { BuildingsModule } from "./modules/master-buildings/buildings.module";
import { FloorsModule } from "./modules/master-floors/floors.module";
import { MasterRoomTypesModule } from "./modules/master-room-types/master-room-types.module";
import { MasterRoomsModule } from "./modules/master-rooms/master-rooms.module";
import { MasterRateTypesModule } from "./modules/master-rate-types/master-rate-types.module";
import { MasterSeasonsModule } from "./modules/master-seasons/master-seasons.module";
import { MasterTaxesModule } from "./modules/master-taxes/master-taxes.module";
import { MasterCurrenciesModule } from "./modules/master-currencies/master-currencies.module";
import { MasterDiscountsModule } from "./modules/master-discounts/master-discounts.module";
import { MasterRoomRatesModule } from "./modules/master-room-rates/master-room-rates.module";
import { MasterDisplaySettingsModule } from "./modules/master-display-settings/master-display-settings.module";
import { MasterTransportationModeModule } from "./modules/master-transportation-mode/master-transportation-mode.module";
import { BusinessSourcesModule } from "./modules/master-business-sources/business-sources.module";
import { MasterEmailTemplatesModule } from "./modules/master-email-templates/master-email-templates.module";
import { MasterDepartmentsModule } from "./modules/master-departments/master-departments.module";
import { MasterMeasurementUnitModule } from "./modules/master-measurement-unit/master-measurement-unit.module";
import { MasterPaymentModesModule } from "./modules/master-payment-modes/master-payment-modes.module";
import { UtilityModule } from "./common/utils/utility.module";
import { TypeOrmModule } from "./config/typeorm.module";
import { MasterReservationModule } from "./modules/master-reservation/master-reservation.module";
import { MasterGuestsModule } from "./modules/master-guests/master-guests.module";
import { MasterBusinessAgentsModule } from "./modules/master-business-agents/master-business-agents.module";
import { UserAccessibleSbuModule } from "./modules/user-accessible-sbu/user-accessible-sbu.module";
import { MasterReservationBillingInfoModule } from "./modules/master-reservation-billing-info/master-reservation-billing-info.module";
import { MasterUserModule } from "./modules/master-users/master-user.module";
// import { MasterPermissionModule } from "./modules/master-permission-action-module/master-permission.module";
// import { MasterReportsModule } from "./modules/master-reports/master-reports.module";
import { MasterCompaniesModule } from './modules/master-companies/master-companies.module';
import { MasterExtraChargesModule } from './modules/master-extra-charges/master-extra-charges.module';
import { HousekeepingModule } from "./modules/housekeeping/housekeeping.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
        }),
        TypeOrmModule,
        UtilityModule,
        PassportModule.register({ defaultStrategy: "jwt" }),
        MasterSbuModule,
        MasterRolesModule,
        BuildingsModule,
        FloorsModule,
        MasterRoomTypesModule,
        MasterRoomsModule,
        MasterRateTypesModule,
        MasterSeasonsModule,
        MasterTaxesModule,
        MasterCurrenciesModule,
        MasterDiscountsModule,
        MasterRoomRatesModule,
        MasterDisplaySettingsModule,
        MasterTransportationModeModule,
        BusinessSourcesModule,
        MasterEmailTemplatesModule,
        MasterDepartmentsModule,
        MasterMeasurementUnitModule,
        MasterPaymentModesModule,
        MasterReservationModule,
        MasterGuestsModule,
        MasterBusinessAgentsModule,
        UserAccessibleSbuModule,
        MasterReservationBillingInfoModule,
        MasterUserModule,
        MasterCompaniesModule,
        MasterExtraChargesModule,
        HousekeepingModule
        // MasterPermissionModule,
        // MasterReportsModule,
    ],
    controllers: [],
    providers: [AppService, JwtStrategy],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestMiddleware).forRoutes("*");
    }
}
