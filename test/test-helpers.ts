import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { TestData } from './test-data';

export class TestHelpers {
  /**
   * Create a resource and return its ID
   */
  static async createResource(
    app: INestApplication,
    endpoint: string,
    data: any,
    authToken: string = TestData.mockAuthToken
  ): Promise<number> {
    const response = await request(app.getHttpServer())
      .post(`/${endpoint}`)
      .set('Authorization', authToken)
      .send(data)
      .expect(201);

    return response.body.data.id;
  }

  /**
   * Get a resource by ID
   */
  static async getResource(
    app: INestApplication,
    endpoint: string,
    id: number,
    authToken: string = TestData.mockAuthToken
  ) {
    return request(app.getHttpServer())
      .get(`/${endpoint}/${id}`)
      .set('Authorization', authToken)
      .expect(200);
  }

  /**
   * Update a resource by ID
   */
  static async updateResource(
    app: INestApplication,
    endpoint: string,
    id: number,
    data: any,
    authToken: string = TestData.mockAuthToken
  ) {
    return request(app.getHttpServer())
      .patch(`/${endpoint}/${id}`)
      .set('Authorization', authToken)
      .send(data)
      .expect(200);
  }

  /**
   * Delete a resource by ID
   */
  static async deleteResource(
    app: INestApplication,
    endpoint: string,
    id: number,
    authToken: string = TestData.mockAuthToken
  ) {
    return request(app.getHttpServer())
      .delete(`/${endpoint}/${id}`)
      .set('Authorization', authToken)
      .expect(200);
  }

  /**
   * Get list of resources with pagination
   */
  static async getResourceList(
    app: INestApplication,
    endpoint: string,
    query: any = {},
    authToken: string = TestData.mockAuthToken
  ) {
    return request(app.getHttpServer())
      .get(`/${endpoint}`)
      .set('Authorization', authToken)
      .query(query)
      .expect(200);
  }

  /**
   * Test invalid data scenarios
   */
  static async testInvalidData(
    app: INestApplication,
    endpoint: string,
    invalidData: any,
    authToken: string = TestData.mockAuthToken
  ) {
    return request(app.getHttpServer())
      .post(`/${endpoint}`)
      .set('Authorization', authToken)
      .send(invalidData)
      .expect(400);
  }

  /**
   * Test unauthorized access
   */
  static async testUnauthorized(
    app: INestApplication,
    endpoint: string,
    data: any
  ) {
    return request(app.getHttpServer())
      .post(`/${endpoint}`)
      .send(data)
      .expect(401);
  }

  /**
   * Test not found scenarios
   */
  static async testNotFound(
    app: INestApplication,
    endpoint: string,
    id: number = 99999,
    authToken: string = TestData.mockAuthToken
  ) {
    return request(app.getHttpServer())
      .get(`/${endpoint}/${id}`)
      .set('Authorization', authToken)
      .expect(404);
  }

  /**
   * Generate random test data
   */
  static generateRandomString(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate random email
   */
  static generateRandomEmail(): string {
    return `test${this.generateRandomString(5)}@example.com`;
  }

  /**
   * Generate random phone number
   */
  static generateRandomPhone(): string {
    return `+1-555-${Math.floor(Math.random() * 9000) + 1000}`;
  }

  /**
   * Wait for a specified amount of time
   */
  static async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Validate response structure
   */
  static validateSuccessResponse(response: any, expectedData?: any) {
    expect(response.body).toMatchObject({
      status: expect.any(Number),
      success: true,
      message: 'Success',
      data: expectedData || expect.any(Object),
    });
  }

  /**
   * Validate error response structure
   */
  static validateErrorResponse(response: any) {
    expect(response.body).toMatchObject({
      success: false,
      message: expect.any(String),
    });
  }

  /**
   * Validate pagination response
   */
  static validatePaginationResponse(response: any) {
    expect(response.body).toMatchObject({
      status: 200,
      success: true,
      message: 'Success',
      data: expect.any(Array),
      pagination: expect.objectContaining({
        total: expect.any(Number),
        page: expect.any(Number),
        limit: expect.any(Number),
        totalPages: expect.any(Number),
      }),
    });
  }

  /**
   * Clean up test data by IDs
   */
  static async cleanupResources(
    app: INestApplication,
    endpoint: string,
    ids: number[],
    authToken: string = TestData.mockAuthToken
  ) {
    for (const id of ids) {
      try {
        await this.deleteResource(app, endpoint, id, authToken);
      } catch (error) {
        // Ignore errors during cleanup
        console.warn(`Failed to cleanup resource ${endpoint}/${id}:`, error);
      }
    }
  }

  /**
   * Performance test helper
   */
  static async measurePerformance<T>(
    operation: () => Promise<T>,
    maxDurationMs: number = 5000
  ): Promise<{ result: T; duration: number }> {
    const startTime = Date.now();
    const result = await operation();
    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(maxDurationMs);
    
    return { result, duration };
  }
}