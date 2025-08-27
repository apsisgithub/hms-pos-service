import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestSetup } from '../test-setup';
import { TestData } from '../test-data';

describe('Buildings (e2e)', () => {
  let app: INestApplication;
  let createdBuildingId: number;

  beforeAll(async () => {
    app = await TestSetup.createTestApp();
    // Initialize auth token from hms-auth-service
    await TestData.initializeAuth();
  });

  afterAll(async () => {
    await TestSetup.closeTestApp();
  });

  describe('POST /buildings', () => {
    it('should create a new building with valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/buildings')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.buildings.valid)
        .expect(201);

      expect(response.body).toMatchObject({
        status: 201,
        success: true,
        message: 'Success',
        data: expect.objectContaining({
          id: expect.any(Number),
          name: TestData.buildings.valid.name,
          sbu_id: TestData.buildings.valid.sbu_id,
          description: TestData.buildings.valid.description,
          status: TestData.buildings.valid.status,
          created_by: expect.any(Number),
          created_at: expect.any(String),
        }),
      });

      createdBuildingId = response.body.data.id;
    });

    it('should create another building with different valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/buildings')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.buildings.validSecond)
        .expect(201);

      expect(response.body).toMatchObject({
        status: 201,
        success: true,
        message: 'Success',
        data: expect.objectContaining({
          id: expect.any(Number),
          name: TestData.buildings.validSecond.name,
          sbu_id: TestData.buildings.validSecond.sbu_id,
          description: TestData.buildings.validSecond.description,
          status: TestData.buildings.validSecond.status,
        }),
      });
    });

    it('should return 400 for invalid building data', async () => {
      const response = await request(app.getHttpServer())
        .post('/buildings')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.buildings.invalid)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('validation');
    });

    it('should return 401 without authentication token', async () => {
      await request(app.getHttpServer())
        .post('/buildings')
        .send(TestData.buildings.valid)
        .expect(401);
    });
  });

  describe('GET /buildings', () => {
    it('should return list of buildings with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/buildings')
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

    it('should return all buildings without pagination when limit is not provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/buildings')
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

  describe('GET /buildings/:id', () => {
    it('should return a specific building by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/buildings/${createdBuildingId}`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.objectContaining({
          id: createdBuildingId,
          name: expect.any(String),
          sbu_id: expect.any(Number),
          status: expect.any(String),
        }),
      });
    });

    it('should return 404 for non-existent building ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/buildings/99999')
        .set('Authorization', TestData.mockAuthToken)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('PATCH /buildings/:id', () => {
    it('should update a building with valid data', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/buildings/${createdBuildingId}`)
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.buildings.update)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
      });

      // Verify the update by fetching the building
      const getResponse = await request(app.getHttpServer())
        .get(`/buildings/${createdBuildingId}`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(getResponse.body.data.name).toBe(TestData.buildings.update.name);
      expect(getResponse.body.data.description).toBe(TestData.buildings.update.description);
    });

    it('should return 404 when updating non-existent building', async () => {
      const response = await request(app.getHttpServer())
        .patch('/buildings/99999')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.buildings.update)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /buildings/:id', () => {
    it('should soft delete a building', async () => {
      console.log('createdBuildingId:',createdBuildingId);
      const response = await request(app.getHttpServer())
        .delete(`/buildings/${createdBuildingId}`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.stringContaining('deleted successfully'),
      });
    });

    it('should return 404 when deleting non-existent building', async () => {
      const response = await request(app.getHttpServer())
        .delete('/buildings/99999')
        .set('Authorization', TestData.mockAuthToken)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});