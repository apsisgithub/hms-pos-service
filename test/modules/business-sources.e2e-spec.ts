import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestSetup } from './test-setup';
import { TestData } from './test-data';

describe('Business Sources (e2e)', () => {
  let app: INestApplication;
  let createdBusinessSourceId: number;

  beforeAll(async () => {
    app = await TestSetup.createTestApp();
  });

  afterAll(async () => {
    await TestSetup.closeTestApp();
  });

  describe('POST /business-sources', () => {
    it('should create a new business source with valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/business-sources')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.businessSources.valid)
        .expect(201);

      expect(response.body).toMatchObject({
        status: 201,
        success: true,
        message: 'Success',
        data: expect.objectContaining({
          id: expect.any(Number),
          name: TestData.businessSources.valid.name,
          sbu_id: TestData.businessSources.valid.sbu_id,
          code: TestData.businessSources.valid.code,
          bin: TestData.businessSources.valid.bin,
          address: TestData.businessSources.valid.address,
          color_tag: TestData.businessSources.valid.color_tag,
          status: TestData.businessSources.valid.status,
          created_by: expect.any(Number),
          created_at: expect.any(String),
        }),
      });

      createdBusinessSourceId = response.body.data.id;
    });

    it('should create another business source with different valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/business-sources')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.businessSources.validSecond)
        .expect(201);

      expect(response.body).toMatchObject({
        status: 201,
        success: true,
        message: 'Success',
        data: expect.objectContaining({
          id: expect.any(Number),
          name: TestData.businessSources.validSecond.name,
          sbu_id: TestData.businessSources.validSecond.sbu_id,
          code: TestData.businessSources.validSecond.code,
          bin: TestData.businessSources.validSecond.bin,
          address: TestData.businessSources.validSecond.address,
          color_tag: TestData.businessSources.validSecond.color_tag,
          status: TestData.businessSources.validSecond.status,
        }),
      });
    });

    it('should return 400 for invalid business source data', async () => {
      const response = await request(app.getHttpServer())
        .post('/business-sources')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.businessSources.invalid)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('validation');
    });

    it('should return 401 without authentication token', async () => {
      await request(app.getHttpServer())
        .post('/business-sources')
        .send(TestData.businessSources.valid)
        .expect(401);
    });
  });

  describe('GET /business-sources', () => {
    it('should return list of business sources with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/business-sources')
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

    it('should return all business sources without pagination when limit is not provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/business-sources')
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

  describe('GET /business-sources/:id', () => {
    it('should return a specific business source by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/business-sources/${createdBusinessSourceId}`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.objectContaining({
          id: createdBusinessSourceId,
          name: expect.any(String),
          sbu_id: expect.any(Number),
          code: expect.any(String),
          status: expect.any(String),
        }),
      });
    });

    it('should return 404 for non-existent business source ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/business-sources/99999')
        .set('Authorization', TestData.mockAuthToken)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('PATCH /business-sources/:id', () => {
    it('should update a business source with valid data', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/business-sources/${createdBusinessSourceId}`)
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.businessSources.update)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
      });

      // Verify the update by fetching the business source
      const getResponse = await request(app.getHttpServer())
        .get(`/business-sources/${createdBusinessSourceId}`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(getResponse.body.data.name).toBe(TestData.businessSources.update.name);
      expect(getResponse.body.data.code).toBe(TestData.businessSources.update.code);
      expect(getResponse.body.data.address).toBe(TestData.businessSources.update.address);
      expect(getResponse.body.data.color_tag).toBe(TestData.businessSources.update.color_tag);
    });

    it('should return 404 when updating non-existent business source', async () => {
      const response = await request(app.getHttpServer())
        .patch('/business-sources/99999')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.businessSources.update)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /business-sources/:id', () => {
    it('should soft delete a business source', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/business-sources/${createdBusinessSourceId}`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.stringContaining('deleted successfully'),
      });
    });

    it('should return 404 when deleting non-existent business source', async () => {
      const response = await request(app.getHttpServer())
        .delete('/business-sources/99999')
        .set('Authorization', TestData.mockAuthToken)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});