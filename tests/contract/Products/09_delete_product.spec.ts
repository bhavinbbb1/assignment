// @ts-check
import Ajv from 'ajv';
import APIConstants from '../../../constants/APIconstants';
import Endpoints from '../../../constants/Endpoints';
import { expect, test } from '@playwright/test';
import schemaData from '../../../schema-data/product-schema.json'

test('should be delete product', async ({ request }) => {
    const PRODUCT_ID = 6;
    const response = await request.delete(Endpoints.PRODUCTS+'/'+PRODUCT_ID);
    console.log(await response.json());
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(APIConstants.HTTP_OK);
    expect(response.headers()[APIConstants.CONTENT_TYPE]).toContain(APIConstants.CONTENT_JSON);
    const product = await response.json();
    const ajv = new Ajv({strict: false});
    const valid = ajv.validate(schemaData, product);
    expect(valid).toBe(true);
    expect(product.id).toBe(PRODUCT_ID);
});
