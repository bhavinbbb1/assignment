// @ts-check
import Ajv from 'ajv';
import APIConstants from '../../../constants/APIconstants';
import Endpoints from '../../../constants/Endpoints';
import { expect, test } from '@playwright/test';
import schemaData from '../../../schema-data/product-schema.json'

test('should be get in product category details', async ({ request }) => {
    const category_type = 'jewelery';
    const response = await request.get(Endpoints.PRODUCTS_CATEGORY+'/'+category_type);
    console.log(await response.json());
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(APIConstants.HTTP_OK);
    expect(response.headers()[APIConstants.CONTENT_TYPE]).toContain(APIConstants.CONTENT_JSON);
    const products = await response.json();
    const ajv = new Ajv({strict: false});
    const valid = ajv.validate(schemaData, products);
    expect(valid).toBe(true);
    products.forEach(product => {
        expect(product.category).toBe(category_type);
    });
});
