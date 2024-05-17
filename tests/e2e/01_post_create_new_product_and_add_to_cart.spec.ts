// @ts-check
import productDataFile from '../../test-data/create-product-details.json';
import { getAuthAPIClient } from '../../core/authentication-api';
import Ajv from 'ajv';
import APIConstants from '../../constants/APIconstants';
import Endpoints from '../../constants/Endpoints';
import { expect, test } from '@playwright/test';
import schemaData from '../../schema-data/product-schema.json'

test('should be able to create new product and add to cart', async ({ request }) => {
    // Get Admin and End User Via API
    const responseUser = await request.get(Endpoints.USERS);
    const userData = await responseUser.json();
    const ADMIN_NAME = userData[1].username;
    const ADMIN_PASSWORD = userData[1].password;
    const USER_ID = userData[0].userId;

    //Authenticate for Admin
    const authClient = await getAuthAPIClient();
    const token = await authClient.getAuthTokenWithUser(ADMIN_NAME, ADMIN_PASSWORD);
    console.log('Token:'+token);

    //Create New Product
    const requestHeader = new Map<string, string>();
    requestHeader.set(APIConstants.CONTENT_TYPE, APIConstants.CONTENT_JSON);
    requestHeader.set(APIConstants.ACCEPT, APIConstants.CONTENT_JSON);
    requestHeader.set(APIConstants.COOKIE, `token=${token}`);
    const response = await request.post(Endpoints.PRODUCTS, {
        headers: Object.fromEntries(requestHeader),
        data: productDataFile.correct_data
    });
    console.log('New Product Created:');
    console.log(await response.json());
    expect(response.status()).toBe(APIConstants.HTTP_OK);
    expect(response.ok()).toBeTruthy();
    expect(response.headers()[APIConstants.CONTENT_TYPE]).toContain(APIConstants.CONTENT_JSON);
    const product = await response.json();
    const ajv = new Ajv({strict: false});
    const valid = ajv.validate(schemaData, product);
    expect(valid).toBe(true);
    const PRODUCT_ID = product.id;
    
    //Add newly created product to the cart for end user 
    const todayDate = new Date()
    const formattedDate = todayDate.toISOString().split('T')[0];
    const quantity = 5;
    const dataPayLoad = {
        userId: USER_ID,
        date: formattedDate,
        products:[{productId:PRODUCT_ID,quantity:quantity}]
    }
    const responseCart = await request.post(Endpoints.CARTS, {
        headers: Object.fromEntries(requestHeader),
        data: dataPayLoad
    });
    console.log('New Cart with new product Created:');
    const cartData = await responseCart.json();
    console.log(cartData);
    expect(cartData.id).toBeGreaterThan(1);
    expect(cartData.date).toBe(formattedDate);
    expect(cartData.products[0].productId).toBe(PRODUCT_ID);
    expect(cartData.products[0].quantity).toBe(quantity);
});
