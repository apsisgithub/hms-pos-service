import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestSetup } from '../test-setup';
import { TestData } from '../test-data';

describe('Floors (e2e)', () => {
  let app: INestApplication;
  let createdFloorId: number;

  beforeAll(async () => {
    app = await TestSetup.createTestApp();
  });

  afterAll(async () => {
    await TestSetup.closeTestApp();
  });

  describe('POST /floors', () => {
    it('should create a new floors with valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/floors')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.floors.valid)
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

      createdFloorId = response.body.data.id;
    });

    it('should create another floors with different valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/floors')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.floors.validSecond)
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

    it('should return 400 for invalid floors data', async () => {
      const response = await request(app.getHttpServer())
        .post('/floors')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.floors.invalid)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('validation');
    });

    it('should return 401 without authentication token', async () => {
      await request(app.getHttpServer())
        .post('/floors')
        .send(TestData.floors.valid)
        .expect(401);
    });
  });

  describe('GET /floors', () => {
    it('should return list of floors with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/floors')
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

    it('should return all floors without pagination when limit is not provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/floors')
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

  describe('GET /floors/:id', () => {
    it('should return a specific floors by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/floors/${createdFloorId}`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.objectContaining({
          id: createdFloorId,
        }),
      });
    });

    it('should return 404 for non-existent floors ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/floors/99999')
        .set('Authorization', TestData.mockAuthToken)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('PATCH /floors/:id', () => {
    it('should update a floors with valid data', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/floors/${createdFloorId}`)
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.floors.update)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
      });
    });

    it('should return 404 when updating non-existent floors', async () => {
      const response = await request(app.getHttpServer())
        .patch('/floors/99999')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.floors.update)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /floors/:id', () => {
    it('should soft delete a floors', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/floors/${createdFloorId}`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.stringContaining('deleted successfully'),
      });
    });

    it('should return 404 when deleting non-existent floors', async () => {
      const response = await request(app.getHttpServer())
        .delete('/floors/99999')
        .set('Authorization', TestData.mockAuthToken)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});