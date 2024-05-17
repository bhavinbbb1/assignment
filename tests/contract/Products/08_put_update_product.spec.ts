// @ts-check
import updateData from '../../../test-data/update-product-details.json'
import { getAuthAPIClient } from '../../../core/authentication-api';
import Ajv from 'ajv';
import APIConstants from '../../../constants/APIconstants';
import Endpoints from '../../../constants/Endpoints';
import { expect, test } from '@playwright/test';
import schemaData from '../../../schema-data/product-schema.json'

test('should be able to update existing product', async ({ request }) => {
    const PRODUCT_ID = 7;
    const authClient = await getAuthAPIClient();
    const token = await authClient.getAuthToken();
    console.log('Token:'+token);
    const requestHeader = new Map<string, string>();
    requestHeader.set(APIConstants.CONTENT_TYPE, APIConstants.CONTENT_JSON);
    requestHeader.set(APIConstants.ACCEPT, APIConstants.CONTENT_JSON);
    requestHeader.set(APIConstants.COOKIE, `token=${token}`);
    const response = await request.put(Endpoints.PRODUCTS+'/'+PRODUCT_ID, {
        headers: Object.fromEntries(requestHeader),
        data: updateData.correct_data
    });
    console.log(await response.json());
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(APIConstants.HTTP_OK);
    expect(response.headers()[APIConstants.CONTENT_TYPE]).toContain(APIConstants.CONTENT_JSON);
    const product = await response.json();
    const ajv = new Ajv({strict: false});
    const valid = ajv.validate(schemaData, product);
    expect(valid).toBe(true);
    expect(product.id).toBe(PRODUCT_ID);
    expect(product.title).toBe(updateData.correct_data.title);
    expect(product.price).toBe(updateData.correct_data.price);
    expect(product.description).toBe(updateData.correct_data.description);
    expect(product.image).toBe(updateData.correct_data.image);
    expect(product.category).toBe(updateData.correct_data.category);
});
