import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestSetup } from './test-setup';
import { TestData } from './test-data';

describe('Taxes (e2e)', () => {
  let app: INestApplication;
  let createdTaxId: number;

  beforeAll(async () => {
    app = await TestSetup.createTestApp();
  });

  afterAll(async () => {
    await TestSetup.closeTestApp();
  });

  describe('POST /taxes', () => {
    it('should create a new taxes with valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/taxes')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.taxes.valid)
        .expect(201);

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

      createdTaxId = response.body.data.id;
    });

    it('should create another taxes with different valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/taxes')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.taxes.validSecond)
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

    it('should return 400 for invalid taxes data', async () => {
      const response = await request(app.getHttpServer())
        .post('/taxes')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.taxes.invalid)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('validation');
    });

    it('should return 401 without authentication token', async () => {
      await request(app.getHttpServer())
        .post('/taxes')
        .send(TestData.taxes.valid)
        .expect(401);
    });
  });

  describe('GET /taxes', () => {
    it('should return list of taxes with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/taxes')
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

    it('should return all taxes without pagination when limit is not provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/taxes')
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

  describe('GET /taxes/:id', () => {
    it('should return a specific taxes by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/taxes/${createdTaxId}`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.objectContaining({
          id: createdTaxId,
        }),
      });
    });

    it('should return 404 for non-existent taxes ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/taxes/99999')
        .set('Authorization', TestData.mockAuthToken)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('PATCH /taxes/:id', () => {
    it('should update a taxes with valid data', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/taxes/${createdTaxId}`)
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.taxes.update)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
      });
    });

    it('should return 404 when updating non-existent taxes', async () => {
      const response = await request(app.getHttpServer())
        .patch('/taxes/99999')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.taxes.update)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /taxes/:id', () => {
    it('should soft delete a taxes', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/taxes/${createdTaxId}`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.stringContaining('deleted successfully'),
      });
    });

    it('should return 404 when deleting non-existent taxes', async () => {
      const response = await request(app.getHttpServer())
        .delete('/taxes/99999')
        .set('Authorization', TestData.mockAuthToken)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});