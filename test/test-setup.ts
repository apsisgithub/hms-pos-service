import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from "src/filters/http-exception.filter";
import { CustomResponseInterceptor } from '../src/interceptors/custom-response.interceptor';

export class TestSetup {
  private static app: INestApplication | null = null;
  private static moduleFixture: TestingModule | null = null;

  static async createTestApp(): Promise<INestApplication> {
    if (this.app) {
      return this.app;
    }

    this.moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = this.moduleFixture.createNestApplication();

    // Apply the same configuration as main.ts
    this.app.useGlobalFilters(new HttpExceptionFilter());
    this.app.useGlobalInterceptors(new CustomResponseInterceptor());
    this.app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await this.app.init();
    return this.app;
  }

  static async closeTestApp(): Promise<void> {
    if (this.app) {
      await this.app.close();
      this.app = null;
      this.moduleFixture = null;
    }
  }

  static getApp(): INestApplication | null {
    return this.app;
  }
}