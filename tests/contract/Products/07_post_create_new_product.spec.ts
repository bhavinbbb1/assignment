// @ts-check
import dataFile from '../../../test-data/create-product-details.json';
import { getAuthAPIClient } from '../../../core/authentication-api';
import Ajv from 'ajv';
import APIConstants from '../../../constants/APIconstants';
import Endpoints from '../../../constants/Endpoints';
import { expect, test } from '@playwright/test';
import schemaData from '../../../schema-data/product-schema.json';

test('should be able to create new product with correct data', async ({ request }) => {
    const authClient = await getAuthAPIClient();
    const token = await authClient.getAuthToken();
    console.log('Token:'+token);
    const requestHeader = new Map<string, string>();
    requestHeader.set(APIConstants.CONTENT_TYPE, APIConstants.CONTENT_JSON);
    requestHeader.set(APIConstants.ACCEPT, APIConstants.CONTENT_JSON);
    requestHeader.set(APIConstants.COOKIE, `token=${token}`);
    const response = await request.post(Endpoints.PRODUCTS, {
        headers: Object.fromEntries(requestHeader),
        data: dataFile.correct_data
    });
    console.log(await response.json());
    expect(response.status()).toBe(APIConstants.HTTP_OK);
    expect(response.ok()).toBeTruthy();
    expect(response.headers()[APIConstants.CONTENT_TYPE]).toContain(APIConstants.CONTENT_JSON);
    const product = await response.json();
    const ajv = new Ajv({strict: false});
    const valid = ajv.validate(schemaData, product);
    expect(valid).toBe(true);
    expect(product.id).toBeGreaterThan(1);
    expect(product.title).toBe(dataFile.correct_data.title);
    expect(product.price).toBe(dataFile.correct_data.price);
    expect(product.description).toBe(dataFile.correct_data.description);
    expect(product.image).toBe(dataFile.correct_data.image);
    expect(product.category).toBe(dataFile.correct_data.category);
});
