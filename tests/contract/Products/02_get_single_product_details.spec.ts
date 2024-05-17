// @ts-check
import APIConstants from "../../../constants/APIconstants"
import Ajv from 'ajv';
import { expect, test } from '@playwright/test';
import Endpoints from "../../../constants/Endpoints";
import schemaData from '../../../schema-data/product-schema.json'

test('should be get one product', async ({ request }) => {
    const PRODUCT_ID = 1;
    const response = await request.get(Endpoints.PRODUCTS+'/'+PRODUCT_ID);
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(APIConstants.HTTP_OK);
    expect(response.headers()[APIConstants.CONTENT_TYPE]).toContain(APIConstants.CONTENT_JSON);
    const product = await response.json();
    const ajv = new Ajv({strict: false});
    const valid = ajv.validate(schemaData, product);
    expect(valid).toBe(true);
    expect(product.id).toBe(PRODUCT_ID);
});
