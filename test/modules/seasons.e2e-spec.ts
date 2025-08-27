import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestSetup } from '../test-setup';
import { TestData } from '../test-data';

describe('Seasons (e2e)', () => {
  let app: INestApplication;
  let createdSeasonId: number;

  beforeAll(async () => {
    app = await TestSetup.createTestApp();
  });

  afterAll(async () => {
    await TestSetup.closeTestApp();
  });

  describe('POST /seasons', () => {
    it('should create a new seasons with valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/seasons')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.seasons.valid)
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

      createdSeasonId = response.body.data.id;
    });

    it('should create another seasons with different valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/seasons')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.seasons.validSecond)
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

    it('should return 400 for invalid seasons data', async () => {
      const response = await request(app.getHttpServer())
        .post('/seasons')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.seasons.invalid)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('validation');
    });

    it('should return 401 without authentication token', async () => {
      await request(app.getHttpServer())
        .post('/seasons')
        .send(TestData.seasons.valid)
        .expect(401);
    });
  });

  describe('GET /seasons', () => {
    it('should return list of seasons with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/seasons')
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

    it('should return all seasons without pagination when limit is not provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/seasons')
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

  describe('GET /seasons/:id', () => {
    it('should return a specific seasons by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/seasons/${createdSeasonId}`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.objectContaining({
          id: createdSeasonId,
        }),
      });
    });

    it('should return 404 for non-existent seasons ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/seasons/99999')
        .set('Authorization', TestData.mockAuthToken)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('PATCH /seasons/:id', () => {
    it('should update a seasons with valid data', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/seasons/${createdSeasonId}`)
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.seasons.update)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
      });
    });

    it('should return 404 when updating non-existent seasons', async () => {
      const response = await request(app.getHttpServer())
        .patch('/seasons/99999')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.seasons.update)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /seasons/:id', () => {
    it('should soft delete a seasons', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/seasons/${createdSeasonId}`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.stringContaining('deleted successfully'),
      });
    });

    it('should return 404 when deleting non-existent seasons', async () => {
      const response = await request(app.getHttpServer())
        .delete('/seasons/99999')
        .set('Authorization', TestData.mockAuthToken)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});