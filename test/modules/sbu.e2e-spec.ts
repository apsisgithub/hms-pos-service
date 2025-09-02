import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestSetup } from '../test-setup';
import { TestData } from '../test-data';

describe('SBU (e2e)', () => {
  let app: INestApplication;
  let createdSbuId: number;

  beforeAll(async () => {
    app = await TestSetup.createTestApp();
  });

  afterAll(async () => {
    await TestSetup.closeTestApp();
  });

  describe('POST /sbu', () => {
    it('should create a new sbu with valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/sbu')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.sbu.valid)
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

      createdSbuId = response.body.data.id;
    });

    it('should create another sbu with different valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/sbu')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.sbu.validSecond)
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

    it('should return 400 for invalid sbu data', async () => {
      const response = await request(app.getHttpServer())
        .post('/sbu')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.sbu.invalid)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('validation');
    });

    it('should return 401 without authentication token', async () => {
      await request(app.getHttpServer())
        .post('/sbu')
        .send(TestData.sbu.valid)
        .expect(401);
    });
  });

  describe('GET /sbu', () => {
    it('should return list of sbu with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/sbu')
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

    it('should return all sbu without pagination when limit is not provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/sbu')
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

  describe('GET /sbu/:id', () => {
    it('should return a specific sbu by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/sbu/${createdSbuId}`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.objectContaining({
          id: createdSbuId,
        }),
      });
    });

    it('should return 404 for non-existent sbu ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/sbu/99999')
        .set('Authorization', TestData.mockAuthToken)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('PATCH /sbu/:id', () => {
    it('should update a sbu with valid data', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/sbu/${createdSbuId}`)
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.sbu.update)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
      });
    });

    it('should return 404 when updating non-existent sbu', async () => {
      const response = await request(app.getHttpServer())
        .patch('/sbu/99999')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.sbu.update)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /sbu/:id', () => {
    it('should soft delete a sbu', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/sbu/${createdSbuId}`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.stringContaining('deleted successfully'),
      });
    });

    it('should return 404 when deleting non-existent sbu', async () => {
      const response = await request(app.getHttpServer())
        .delete('/sbu/99999')
        .set('Authorization', TestData.mockAuthToken)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});