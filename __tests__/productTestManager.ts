import {req} from "./test.helpers";
import {HTTP_STATUSES} from "../src/status.code";
import {SETTINGS} from "../src/settings";
import {CreateProductModel} from "../src/features/products/models/CreatePoductModel";
import {ProductType} from "../src/types/types";

export const productTestManager = {
    async createProduct() : Promise<ProductType> {

        const validProductModel: CreateProductModel = {
            name: 'Product Name',
            description: 'Product Description',
            stock: 10,
            price: 100
        };

        const res = await req
            .post(SETTINGS.PATH.PRODUCTS)
            .send(validProductModel)
            .expect(HTTP_STATUSES.CREATED_201);

        return res.body
    }

}