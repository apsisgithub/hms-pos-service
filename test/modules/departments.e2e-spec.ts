import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestSetup } from '../test-setup';
import { TestData } from '../test-data';

describe('Departments (e2e)', () => {
  let app: INestApplication;
  let createdDepartmentId: number;

  beforeAll(async () => {
    app = await TestSetup.createTestApp();
  });

  afterAll(async () => {
    await TestSetup.closeTestApp();
  });

  describe('POST /departments', () => {
    it('should create a new departments with valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/departments')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.departments.valid)
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

      createdDepartmentId = response.body.data.id;
    });

    it('should create another departments with different valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/departments')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.departments.validSecond)
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

    it('should return 400 for invalid departments data', async () => {
      const response = await request(app.getHttpServer())
        .post('/departments')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.departments.invalid)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('validation');
    });

    it('should return 401 without authentication token', async () => {
      await request(app.getHttpServer())
        .post('/departments')
        .send(TestData.departments.valid)
        .expect(401);
    });
  });

  describe('GET /departments', () => {
    it('should return list of departments with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/departments')
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

    it('should return all departments without pagination when limit is not provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/departments')
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

  describe('GET /departments/:id', () => {
    it('should return a specific departments by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/departments/${createdDepartmentId}`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.objectContaining({
          id: createdDepartmentId,
        }),
      });
    });

    it('should return 404 for non-existent departments ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/departments/99999')
        .set('Authorization', TestData.mockAuthToken)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('PATCH /departments/:id', () => {
    it('should update a departments with valid data', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/departments/${createdDepartmentId}`)
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.departments.update)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
      });
    });

    it('should return 404 when updating non-existent departments', async () => {
      const response = await request(app.getHttpServer())
        .patch('/departments/99999')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.departments.update)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /departments/:id', () => {
    it('should soft delete a departments', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/departments/${createdDepartmentId}`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.stringContaining('deleted successfully'),
      });
    });

    it('should return 404 when deleting non-existent departments', async () => {
      const response = await request(app.getHttpServer())
        .delete('/departments/99999')
        .set('Authorization', TestData.mockAuthToken)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});