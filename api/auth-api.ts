import { APIRequestContext, test } from '@playwright/test';

export class AuthApi {
  readonly request: APIRequestContext;
  private readonly baseUrl = 'https://restful-booker.herokuapp.com';

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async createToken(username = 'admin', password = 'password123'): Promise<string> {
    return await test.step('POST /auth - Generate auth token', async () => {
      const response = await this.request.post(`${this.baseUrl}/auth`, {
        data: { username, password },
      });
      const body = await response.json();
      return body.token;
    });
  }
}