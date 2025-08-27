import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestSetup } from '../test-setup';
import { TestData } from '../test-data';

describe('Discounts (e2e)', () => {
  let app: INestApplication;
  let createdDiscountId: number;

  beforeAll(async () => {
    app = await TestSetup.createTestApp();
  });

  afterAll(async () => {
    await TestSetup.closeTestApp();
  });

  describe('POST /discounts', () => {
    it('should create a new discounts with valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/discounts')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.discounts.valid)
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

      createdDiscountId = response.body.data.id;
    });

    it('should create another discounts with different valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/discounts')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.discounts.validSecond)
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

    it('should return 400 for invalid discounts data', async () => {
      const response = await request(app.getHttpServer())
        .post('/discounts')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.discounts.invalid)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('validation');
    });

    it('should return 401 without authentication token', async () => {
      await request(app.getHttpServer())
        .post('/discounts')
        .send(TestData.discounts.valid)
        .expect(401);
    });
  });

  describe('GET /discounts', () => {
    it('should return list of discounts with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/discounts')
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

    it('should return all discounts without pagination when limit is not provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/discounts')
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

  describe('GET /discounts/:id', () => {
    it('should return a specific discounts by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/discounts/${createdDiscountId}`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.objectContaining({
          id: createdDiscountId,
        }),
      });
    });

    it('should return 404 for non-existent discounts ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/discounts/99999')
        .set('Authorization', TestData.mockAuthToken)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('PATCH /discounts/:id', () => {
    it('should update a discounts with valid data', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/discounts/${createdDiscountId}`)
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.discounts.update)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
      });
    });

    it('should return 404 when updating non-existent discounts', async () => {
      const response = await request(app.getHttpServer())
        .patch('/discounts/99999')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.discounts.update)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /discounts/:id', () => {
    it('should soft delete a discounts', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/discounts/${createdDiscountId}`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.stringContaining('deleted successfully'),
      });
    });

    it('should return 404 when deleting non-existent discounts', async () => {
      const response = await request(app.getHttpServer())
        .delete('/discounts/99999')
        .set('Authorization', TestData.mockAuthToken)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});