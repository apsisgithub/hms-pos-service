const fs = require('fs');
const path = require('path');

// Module configurations for test generation
const modules = [
  {
    name: 'currencies',
    endpoint: 'currencies',
    displayName: 'Currencies',
    testDataKey: 'currencies',
    idField: 'createdCurrencyId'
  },
  {
    name: 'departments',
    endpoint: 'departments',
    displayName: 'Departments',
    testDataKey: 'departments',
    idField: 'createdDepartmentId'
  },
  {
    name: 'floors',
    endpoint: 'floors',
    displayName: 'Floors',
    testDataKey: 'floors',
    idField: 'createdFloorId'
  },
  {
    name: 'room-types',
    endpoint: 'room-types',
    displayName: 'Room Types',
    testDataKey: 'roomTypes',
    idField: 'createdRoomTypeId'
  },
  {
    name: 'taxes',
    endpoint: 'taxes',
    displayName: 'Taxes',
    testDataKey: 'taxes',
    idField: 'createdTaxId'
  },
  {
    name: 'seasons',
    endpoint: 'seasons',
    displayName: 'Seasons',
    testDataKey: 'seasons',
    idField: 'createdSeasonId'
  },
  {
    name: 'guests',
    endpoint: 'guests',
    displayName: 'Guests',
    testDataKey: 'guests',
    idField: 'createdGuestId'
  },
  {
    name: 'roles',
    endpoint: 'roles',
    displayName: 'Roles',
    testDataKey: 'roles',
    idField: 'createdRoleId'
  },
  {
    name: 'sbu',
    endpoint: 'sbu',
    displayName: 'SBU',
    testDataKey: 'sbu',
    idField: 'createdSbuId'
  },
  {
    name: 'discounts',
    endpoint: 'discounts',
    displayName: 'Discounts',
    testDataKey: 'discounts',
    idField: 'createdDiscountId'
  }
];

// Template for generating E2E tests
const generateTestTemplate = (config) => {
  return `import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestSetup } from './test-setup';
import { TestData } from './test-data';

describe('${config.displayName} (e2e)', () => {
  let app: INestApplication;
  let ${config.idField}: number;

  beforeAll(async () => {
    app = await TestSetup.createTestApp();
  });

  afterAll(async () => {
    await TestSetup.closeTestApp();
  });

  describe('POST /${config.endpoint}', () => {
    it('should create a new ${config.name.replace('-', ' ')} with valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/${config.endpoint}')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.${config.testDataKey}.valid)
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

      ${config.idField} = response.body.data.id;
    });

    it('should create another ${config.name.replace('-', ' ')} with different valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/${config.endpoint}')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.${config.testDataKey}.validSecond)
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

    it('should return 400 for invalid ${config.name.replace('-', ' ')} data', async () => {
      const response = await request(app.getHttpServer())
        .post('/${config.endpoint}')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.${config.testDataKey}.invalid)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('validation');
    });

    it('should return 401 without authentication token', async () => {
      await request(app.getHttpServer())
        .post('/${config.endpoint}')
        .send(TestData.${config.testDataKey}.valid)
        .expect(401);
    });
  });

  describe('GET /${config.endpoint}', () => {
    it('should return list of ${config.name.replace('-', ' ')} with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/${config.endpoint}')
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

    it('should return all ${config.name.replace('-', ' ')} without pagination when limit is not provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/${config.endpoint}')
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

  describe('GET /${config.endpoint}/:id', () => {
    it('should return a specific ${config.name.replace('-', ' ')} by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(\`/${config.endpoint}/\${${config.idField}}\`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.objectContaining({
          id: ${config.idField},
        }),
      });
    });

    it('should return 404 for non-existent ${config.name.replace('-', ' ')} ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/${config.endpoint}/99999')
        .set('Authorization', TestData.mockAuthToken)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('PATCH /${config.endpoint}/:id', () => {
    it('should update a ${config.name.replace('-', ' ')} with valid data', async () => {
      const response = await request(app.getHttpServer())
        .patch(\`/${config.endpoint}/\${${config.idField}}\`)
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.${config.testDataKey}.update)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
      });
    });

    it('should return 404 when updating non-existent ${config.name.replace('-', ' ')}', async () => {
      const response = await request(app.getHttpServer())
        .patch('/${config.endpoint}/99999')
        .set('Authorization', TestData.mockAuthToken)
        .send(TestData.${config.testDataKey}.update)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /${config.endpoint}/:id', () => {
    it('should soft delete a ${config.name.replace('-', ' ')}', async () => {
      const response = await request(app.getHttpServer())
        .delete(\`/${config.endpoint}/\${${config.idField}}\`)
        .set('Authorization', TestData.mockAuthToken)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 200,
        success: true,
        message: 'Success',
        data: expect.stringContaining('deleted successfully'),
      });
    });

    it('should return 404 when deleting non-existent ${config.name.replace('-', ' ')}', async () => {
      const response = await request(app.getHttpServer())
        .delete('/${config.endpoint}/99999')
        .set('Authorization', TestData.mockAuthToken)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});`;
};

// Generate test files for all modules
modules.forEach(config => {
  const testContent = generateTestTemplate(config);
  const fileName = `${config.name}.e2e-spec.ts`;
  const filePath = path.join(__dirname, fileName);
  
  fs.writeFileSync(filePath, testContent);
  console.log(`Generated test file: ${fileName}`);
});

console.log('All E2E test files generated successfully!');