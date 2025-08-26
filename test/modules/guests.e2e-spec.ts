import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestSetup } from '../test-setup';
import { TestData } from '../test-data';

describe('Guests (e2e)', () => {
  let app: INestApplication;
  let createdGuestId: number;

  beforeAll(async () => {
    app = await TestSetup.createTestApp();
  });

  afterAll(async () => {
    await TestSetup.closeTestApp();
  });

  describe('POST /guests', () => {
    it('should create a new guests with valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/guests')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.guests.valid)
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

      createdGuestId = response.body.data.id;
    });

    it('should create another guests with different valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/guests')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.guests.validSecond)
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

    it('should return 400 for invalid guests data', async () => {
      const response = await request(app.getHttpServer())
        .post('/guests')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.guests.invalid)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('validation');
    });

    it('should return 401 without authentication token', async () => {
      await request(app.getHttpServer())
        .post('/guests')
        .send(TestData.guests.valid)
        .expect(401);
    });
  });

  describe('GET /guests', () => {
    it('should return list of guests with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/guests')
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

    it('should return all guests without pagination when limit is not provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/guests')
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

  describe('GET /guests/:id', () => {
    it('should return a specific guests by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/guests/${createdGuestId}`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.objectContaining({
          id: createdGuestId,
        }),
      });
    });

    it('should return 404 for non-existent guests ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/guests/99999')
        .set('Authorization', TestData.mockAuthToken)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('PATCH /guests/:id', () => {
    it('should update a guests with valid data', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/guests/${createdGuestId}`)
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.guests.update)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
      });
    });

    it('should return 404 when updating non-existent guests', async () => {
      const response = await request(app.getHttpServer())
        .patch('/guests/99999')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.guests.update)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /guests/:id', () => {
    it('should soft delete a guests', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/guests/${createdGuestId}`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.stringContaining('deleted successfully'),
      });
    });

    it('should return 404 when deleting non-existent guests', async () => {
      const response = await request(app.getHttpServer())
        .delete('/guests/99999')
        .set('Authorization', TestData.mockAuthToken)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});