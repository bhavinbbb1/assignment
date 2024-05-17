import { test, expect, Response, APIResponse} from '@playwright/test';

export class ProductVerification {
    async verifyProduct(response: APIResponse){
        const product = await response.json();
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('title');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('description');
        expect(product).toHaveProperty('category');
        expect(product).toHaveProperty('image');
        expect(product).toHaveProperty('rating');
        expect(product.id).toBeGreaterThanOrEqual(1);
        expect(product.title).toEqual(expect.any(String));
        expect(product.price).toEqual(expect.any(Number));
        expect(product.description).toEqual(expect.any(String));
        expect(product.category).toEqual(expect.any(String));
        expect(product.image).toEqual(expect.any(String));
        expect(product.rating.rate).toEqual(expect.any(Number));
        expect(product.rating.count).toEqual(expect.any(Number));
    }
    async verifyProducts(response: APIResponse){
        const products = await response.json();
        products.forEach(product => {
            this.verifyProduct(product);
        });
    }
}
    
