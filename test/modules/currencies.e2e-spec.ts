import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestSetup } from './test-setup';
import { TestData } from './test-data';

describe('Currencies (e2e)', () => {
  let app: INestApplication;
  let createdCurrencyId: number;

  beforeAll(async () => {
    app = await TestSetup.createTestApp();
  });

  afterAll(async () => {
    await TestSetup.closeTestApp();
  });

  describe('POST /currencies', () => {
    it('should create a new currencies with valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/currencies')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.currencies.valid)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 201,
        success: true,
        message: 'Success',
        data: expect.objectContaining({
          id: expect.any(Number),
          created_by: expect.any(Number),
          created_at: expect.any(String),
        }),
      });

      createdCurrencyId = response.body.data.id;
    });

    it('should create another currencies with different valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/currencies')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.currencies.validSecond)
        .expect(201);

      expect(response.body).toMatchObject({
        status: 201,
        success: true,
        message: 'Success',
        data: expect.objectContaining({
          id: expect.any(Number),
        }),
      });
    });

    it('should return 400 for invalid currencies data', async () => {
      const response = await request(app.getHttpServer())
        .post('/currencies')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.currencies.invalid)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('validation');
    });

    it('should return 401 without authentication token', async () => {
      await request(app.getHttpServer())
        .post('/currencies')
        .send(TestData.currencies.valid)
        .expect(401);
    });
  });

  describe('GET /currencies', () => {
    it('should return list of currencies with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/currencies')
        .set('Authorization', TestData.mockAuthToken)
        .query({ page_number: 1, limit: 10 })
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.any(Array),
      });

      if (response.body.data.length > 0) {
        expect(response.body.data[0]).toMatchObject({
          id: expect.any(Number),
          created_at: expect.any(String),
        });
      }
    });

    it('should return all currencies without pagination when limit is not provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/currencies')
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.any(Array),
      });
    });
  });

  describe('GET /currencies/:id', () => {
    it('should return a specific currencies by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/currencies/${createdCurrencyId}`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.objectContaining({
          id: createdCurrencyId,
        }),
      });
    });

    it('should return 404 for non-existent currencies ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/currencies/99999')
        .set('Authorization', TestData.mockAuthToken)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('PATCH /currencies/:id', () => {
    it('should update a currencies with valid data', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/currencies/${createdCurrencyId}`)
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.currencies.update)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
      });
    });

    it('should return 404 when updating non-existent currencies', async () => {
      const response = await request(app.getHttpServer())
        .patch('/currencies/99999')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.currencies.update)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /currencies/:id', () => {
    it('should soft delete a currencies', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/currencies/${createdCurrencyId}`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.stringContaining('deleted successfully'),
      });
    });

    it('should return 404 when deleting non-existent currencies', async () => {
      const response = await request(app.getHttpServer())
        .delete('/currencies/99999')
        .set('Authorization', TestData.mockAuthToken)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});