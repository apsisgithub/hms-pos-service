import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestSetup } from '../test-setup';
import { TestData } from '../test-data';

describe('Room Types (e2e)', () => {
  let app: INestApplication;
  let createdRoomTypeId: number;

  beforeAll(async () => {
    app = await TestSetup.createTestApp();
  });

  afterAll(async () => {
    await TestSetup.closeTestApp();
  });

  describe('POST /room-types', () => {
    it('should create a new room types with valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/room-types')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.roomTypes.valid)
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

      createdRoomTypeId = response.body.data.id;
    });

    it('should create another room types with different valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/room-types')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.roomTypes.validSecond)
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

    it('should return 400 for invalid room types data', async () => {
      const response = await request(app.getHttpServer())
        .post('/room-types')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.roomTypes.invalid)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('validation');
    });

    it('should return 401 without authentication token', async () => {
      await request(app.getHttpServer())
        .post('/room-types')
        .send(TestData.roomTypes.valid)
        .expect(401);
    });
  });

  describe('GET /room-types', () => {
    it('should return list of room types with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/room-types')
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

    it('should return all room types without pagination when limit is not provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/room-types')
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

  describe('GET /room-types/:id', () => {
    it('should return a specific room types by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/room-types/${createdRoomTypeId}`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.objectContaining({
          id: createdRoomTypeId,
        }),
      });
    });

    it('should return 404 for non-existent room types ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/room-types/99999')
        .set('Authorization', TestData.mockAuthToken)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('PATCH /room-types/:id', () => {
    it('should update a room types with valid data', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/room-types/${createdRoomTypeId}`)
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.roomTypes.update)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
      });
    });

    it('should return 404 when updating non-existent room types', async () => {
      const response = await request(app.getHttpServer())
        .patch('/room-types/99999')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.roomTypes.update)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /room-types/:id', () => {
    it('should soft delete a room types', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/room-types/${createdRoomTypeId}`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.stringContaining('deleted successfully'),
      });
    });

    it('should return 404 when deleting non-existent room types', async () => {
      const response = await request(app.getHttpServer())
        .delete('/room-types/99999')
        .set('Authorization', TestData.mockAuthToken)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});