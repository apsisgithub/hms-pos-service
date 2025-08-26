import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as basicAuth from "express-basic-auth";
import { Logger, ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./filters/http-exception.filter";
import { CustomResponseInterceptor } from "./interceptors/custom-response.interceptor";

declare const module: any;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: "*",
        allowedHeaders: "*",
        credentials: true,
    });

    const config = new DocumentBuilder()
        .setTitle("Hotel Management")
        .setDescription("")
        .setVersion("1.0")
        .addTag("HMS API LIST")

        .addBearerAuth({
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            in: "header",
            name: "Authorization",
            description: "Enter your Bearer token",
        })
        .addSecurityRequirements("bearer")
        .addServer("/core")
        .build();
    const document = SwaggerModule.createDocument(app, config, {
        ignoreGlobalPrefix: false,
    });

    const swaggerAuth = basicAuth({
        users: { admin: "password" },
        challenge: true,
        unauthorizedResponse: "Unauthorized",
    });
    app.use("/api/docs", swaggerAuth);
    SwaggerModule.setup("api/docs", app, document, {
        swaggerOptions: {
            docExpansion: "none",
            persistAuthorization: false,
        },
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        })
    );

    app.useGlobalInterceptors(new CustomResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());

    app.setGlobalPrefix("core");

    const PORT = process.env.PORT || 3001;
    await app.listen(PORT);
    Logger.log(`🚀Application is Running on: http://localhost:${PORT}`);
    Logger.log(
        `🚀Swagger Documentation is Running on: http://localhost:${PORT}/api/docs`
    );

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

bootstrap();
