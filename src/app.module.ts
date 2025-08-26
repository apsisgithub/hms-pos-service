import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppService } from "./app.service";
import { RequestMiddleware } from "./common/middleware/request.middleware";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule } from "@nestjs/config";
import { JwtStrategy } from "./auth/jwt.strategy";
import { UtilityModule } from "./common/utils/utility.module";
import { TypeOrmModule } from "./config/typeorm.module";
import { CategoryModule } from "./modules/pos-category/category.module";
import { TableModule } from "./modules/table/table.module";
import { AppController } from "./app.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule,
    UtilityModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    CategoryModule,
    TableModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestMiddleware).forRoutes("*");
  }
}
