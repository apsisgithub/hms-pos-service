import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestSetup } from '../test-setup';
import { TestData } from '../test-data';

describe('Roles (e2e)', () => {
  let app: INestApplication;
  let createdRoleId: number;

  beforeAll(async () => {
    app = await TestSetup.createTestApp();
  });

  afterAll(async () => {
    await TestSetup.closeTestApp();
  });

  describe('POST /roles', () => {
    it('should create a new roles with valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.roles.valid)
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

      createdRoleId = response.body.data.id;
    });

    it('should create another roles with different valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.roles.validSecond)
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

    it('should return 400 for invalid roles data', async () => {
      const response = await request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.roles.invalid)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('validation');
    });

    it('should return 401 without authentication token', async () => {
      await request(app.getHttpServer())
        .post('/roles')
        .send(TestData.roles.valid)
        .expect(401);
    });
  });

  describe('GET /roles', () => {
    it('should return list of roles with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/roles')
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

    it('should return all roles without pagination when limit is not provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/roles')
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

  describe('GET /roles/:id', () => {
    it('should return a specific roles by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/roles/${createdRoleId}`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.objectContaining({
          id: createdRoleId,
        }),
      });
    });

    it('should return 404 for non-existent roles ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/roles/99999')
        .set('Authorization', TestData.mockAuthToken)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('PATCH /roles/:id', () => {
    it('should update a roles with valid data', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/roles/${createdRoleId}`)
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.roles.update)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
      });
    });

    it('should return 404 when updating non-existent roles', async () => {
      const response = await request(app.getHttpServer())
        .patch('/roles/99999')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.roles.update)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /roles/:id', () => {
    it('should soft delete a roles', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/roles/${createdRoleId}`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.stringContaining('deleted successfully'),
      });
    });

    it('should return 404 when deleting non-existent roles', async () => {
      const response = await request(app.getHttpServer())
        .delete('/roles/99999')
        .set('Authorization', TestData.mockAuthToken)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});