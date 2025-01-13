import {Collection, Db} from "mongodb";
import {getInMemoryDb, stopInMemoryDb} from "./test.db";
import {req} from "./test.helpers";
import {SETTINGS} from "../src/settings";
import {HTTP_STATUSES} from "../src/status.code";
import {ProductType} from "../src/types/types";
import {CreateProductModel} from "../src/features/products/models/CreatePoductModel";
import {productTestManager} from "./productTestManager";

describe('/products', () => {
    let db: Db;
    let productsCollection: Collection<ProductType>;

    beforeAll(async () => {
        db = await getInMemoryDb();
        productsCollection = db.collection<ProductType>("products");

        // Clear all test data before starting
        await req
            .delete(`${SETTINGS.PATH.TESTS}/all-data`)
            .expect(HTTP_STATUSES.NO_CONTENT_204);
    });

    beforeEach(async () => {
        // Clean up the collection before each test
        await productsCollection.deleteMany({});
    });

    afterAll(async () => {
        // Stop the in-memory database
        await stopInMemoryDb();
    });

    it('+ Should return an empty array with status 200', async () => {
        await req
            .get(SETTINGS.PATH.PRODUCTS)
            .expect(HTTP_STATUSES.OK_200, []);
    });

    it('- POST should not create a product without required or incorrect data (status 400)', async () => {
        const incorrectProductModel: CreateProductModel = {
            name: '',
            description: '',
            stock: 0,
            price: 0
        };

        const res = await req
            .post(SETTINGS.PATH.PRODUCTS)
            .send(incorrectProductModel)
            .expect(HTTP_STATUSES.BAD_REQUEST_400);

        expect(res.body).toEqual({
            errorsMessages: [{field: "name", message: "Name is required"}, {
                field: "description",
                message: "Description is required"
            }]
        });
    });

    it('+ POST should create a product with valid data (status 201)', async () => {
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

        expect(res.body).toEqual({
            id: res.body.id,
            name: validProductModel.name,
            description: validProductModel.description,
            price: validProductModel.price,
            stock: validProductModel.stock,
        });
    });

    it('- GET should return 404 for a non-existent product ID', async () => {
        await req
            .get(`${SETTINGS.PATH.PRODUCTS}/non-existent-id`)
            .expect(HTTP_STATUSES.NOT_FOUND_404);
    });

    it('+ POST should update product details with valid data (status 200)', async () => {
        const product1 = await productTestManager.createProduct()

        const productId = product1.id

        // Update product
        const updatedProductModel = {
            increase: 15,
        };



        const res = await req
            .post(`${SETTINGS.PATH.PRODUCTS}/${productId}/restock`)
            .send(updatedProductModel)
            .expect(HTTP_STATUSES.OK_200);

        expect(res.body.stock).toEqual(25)
    });

});
