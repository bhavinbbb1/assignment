// @ts-check
import Ajv from 'ajv';
import APIConstants from '../../../constants/APIconstants';
import Endpoints from '../../../constants/Endpoints';
import { expect, test } from '@playwright/test';
import schemaData from '../../../schema-data/product-schema.json'

test('should be products with limit results', async ({ request }) => {
    const limit_count = 5;
    const response = await request.get(Endpoints.PRODUCTS_LIMIT+limit_count);
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(APIConstants.HTTP_OK);
    expect(response.headers()[APIConstants.CONTENT_TYPE]).toContain(APIConstants.CONTENT_JSON);
    const products = await response.json();
    expect(products.length).toBe(limit_count);
    const ajv = new Ajv({strict: false});
    const valid = ajv.validate(schemaData, products);
    expect(valid).toBe(true);
});
