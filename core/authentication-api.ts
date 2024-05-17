import APIConstants from '../constants/APIconstants';
import authDataFile from '../test-data/auth-data.json'
import Endpoints from '../constants/Endpoints';
import { request, expect } from '@playwright/test';

class AuthAPIClient {
   async getAuthToken(){
    // Create a context that will issue http requests.
    const context = await request.newContext({
        baseURL: authDataFile.base_url,
      });  
    const response = await context.post(Endpoints.AUTH_LOGIN, {
        data:{
            username: authDataFile.username,
            password: authDataFile.password
        }
    });
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(APIConstants.HTTP_OK);
    const responseBody = await response.json();
    const token = responseBody.token;
    return token;
  }
  async getAuthTokenWithUser(username, password){
    // Create a context that will issue http requests.
    const context = await request.newContext({
      baseURL: authDataFile.base_url,
    });  
  const response = await context.post(Endpoints.AUTH_LOGIN, {
      data:{
          username: username,
          password: password
      }
  });
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(APIConstants.HTTP_OK);
  const responseBody = await response.json();
  const token = responseBody.token;
  return token;
  }
}

export const getAuthAPIClient = async (): Promise<AuthAPIClient> => {
  return new AuthAPIClient();
};
