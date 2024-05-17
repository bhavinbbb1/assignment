// @ts-check
import Ajv from 'ajv';
import APIConstants from '../../../constants/APIconstants';
import Endpoints from '../../../constants/Endpoints';
import { expect, test } from '@playwright/test';
import schemaData from '../../../schema-data/product-schema.json'

test('should be get all product categories details', async ({ request }) => {
    const response = await request.get(Endpoints.PRODUCTS_CATEGORIES);
    console.log(await response.json());
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(APIConstants.HTTP_OK);
    expect(response.headers()[APIConstants.CONTENT_TYPE]).toContain(APIConstants.CONTENT_JSON);
    const products = await response.json();
    expect(products.length).toBeGreaterThanOrEqual(1);
    const ajv = new Ajv({strict: false});
    const valid = ajv.validate(schemaData, products);
    expect(valid).toBe(true);
});
