// @ts-check
import Ajv from 'ajv';
import APIConstants from '../../../constants/APIconstants';
import Endpoints from '../../../constants/Endpoints';
import { expect, test } from '@playwright/test';
import schemaData from '../../../schema-data/product-schema.json'

test('should be get products sorted deceding order', async ({ request }) => {
    const response = await request.get(Endpoints.PRODUCTS_SORT+'desc');
    console.log(await response.json());
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(APIConstants.HTTP_OK);
    expect(response.headers()[APIConstants.CONTENT_TYPE]).toContain(APIConstants.CONTENT_JSON);
    const products = await response.json();
    expect(products.length).toBeGreaterThanOrEqual(1);
    const ajv = new Ajv({strict: false});
    const valid = ajv.validate(schemaData, products);
    expect(valid).toBe(true);
    let product_ids = new Array<number>;
    let expected_product_ids = new Array<number>;
    for(let product of products){
        product_ids.push(product.id);
        expected_product_ids.push(product.id);
    }
    expected_product_ids.sort().reverse();
    expect(JSON.stringify(expected_product_ids) === JSON.stringify(product_ids)).toBeTruthy;
});

test('should be get products sorted asceding order', async ({ request }) => {
    const response = await request.get(Endpoints.PRODUCTS_SORT+'asc');
    console.log(await response.json());
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(APIConstants.HTTP_OK);
    expect(response.headers()[APIConstants.CONTENT_TYPE]).toContain(APIConstants.CONTENT_JSON);
    const products = await response.json();
    expect(products.length).toBeGreaterThanOrEqual(1);
    const ajv = new Ajv({strict: false});
    const valid = ajv.validate(schemaData, products);
    expect(valid).toBe(true);
    let product_ids = new Array<number>;
    let expected_product_ids = new Array<number>;
    for(let product of products){
        product_ids.push(product.id);
        expected_product_ids.push(product.id);
    }
    expected_product_ids.sort();
    expect(JSON.stringify(expected_product_ids) === JSON.stringify(product_ids)).toBeTruthy;
});
