import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestSetup } from '../test-setup';
import { TestData } from '../test-data';

describe('Payment Modes (e2e)', () => {
  let app: INestApplication;
  let createdPaymentModeId: number;

  beforeAll(async () => {
    app = await TestSetup.createTestApp();
  });

  afterAll(async () => {
    await TestSetup.closeTestApp();
  });

  describe('POST /payment-modes', () => {
    it('should create a new payment mode with valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/payment-modes')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.paymentModes.valid)
        .expect(201);

      expect(response.body).toMatchObject({
        status: 201,
        success: true,
        message: 'Success',
        data: expect.objectContaining({
          id: expect.any(Number),
          name: TestData.paymentModes.valid.name,
          sbu_id: TestData.paymentModes.valid.sbu_id,
          description: TestData.paymentModes.valid.description,
          status: TestData.paymentModes.valid.status,
          created_by: expect.any(Number),
          created_at: expect.any(String),
        }),
      });

      createdPaymentModeId = response.body.data.id;
    });

    it('should create another payment mode with different valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/payment-modes')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.paymentModes.validSecond)
        .expect(201);

      expect(response.body).toMatchObject({
        status: 201,
        success: true,
        message: 'Success',
        data: expect.objectContaining({
          id: expect.any(Number),
          name: TestData.paymentModes.validSecond.name,
          sbu_id: TestData.paymentModes.validSecond.sbu_id,
          description: TestData.paymentModes.validSecond.description,
          status: TestData.paymentModes.validSecond.status,
        }),
      });
    });

    it('should return 400 for invalid payment mode data', async () => {
      const response = await request(app.getHttpServer())
        .post('/payment-modes')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.paymentModes.invalid)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('validation');
    });

    it('should return 401 without authentication token', async () => {
      await request(app.getHttpServer())
        .post('/payment-modes')
        .send(TestData.paymentModes.valid)
        .expect(401);
    });
  });

  describe('GET /payment-modes', () => {
    it('should return list of payment modes with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/payment-modes')
        .set('Authorization', TestData.mockAuthToken)
        .query({ page_number: 1, limit: 10 })
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.any(Array),
        pagination: expect.objectContaining({
          total: expect.any(Number),
          page: 1,
          limit: 10,
          totalPages: expect.any(Number),
        }),
      });

      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        sbu_id: expect.any(Number),
        status: expect.any(String),
        created_at: expect.any(String),
      });
    });

    it('should return all payment modes without pagination when limit is not provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/payment-modes')
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.any(Array),
      });

      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.pagination).toBeUndefined();
    });
  });

  describe('GET /payment-modes/:id', () => {
    it('should return a specific payment mode by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/payment-modes/${createdPaymentModeId}`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.objectContaining({
          id: createdPaymentModeId,
          name: expect.any(String),
          sbu_id: expect.any(Number),
          status: expect.any(String),
        }),
      });
    });

    it('should return 404 for non-existent payment mode ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/payment-modes/99999')
        .set('Authorization', TestData.mockAuthToken)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('PATCH /payment-modes/:id', () => {
    it('should update a payment mode with valid data', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/payment-modes/${createdPaymentModeId}`)
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.paymentModes.update)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
      });

      // Verify the update by fetching the payment mode
      const getResponse = await request(app.getHttpServer())
        .get(`/payment-modes/${createdPaymentModeId}`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(getResponse.body.data.name).toBe(TestData.paymentModes.update.name);
      expect(getResponse.body.data.description).toBe(TestData.paymentModes.update.description);
    });

    it('should return 404 when updating non-existent payment mode', async () => {
      const response = await request(app.getHttpServer())
        .patch('/payment-modes/99999')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.paymentModes.update)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /payment-modes/:id', () => {
    it('should soft delete a payment mode', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/payment-modes/${createdPaymentModeId}`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.stringContaining('deleted successfully'),
      });
    });

    it('should return 404 when deleting non-existent payment mode', async () => {
      const response = await request(app.getHttpServer())
        .delete('/payment-modes/99999')
        .set('Authorization', TestData.mockAuthToken)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});