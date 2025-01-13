import {Collection, Db} from "mongodb";
import {getInMemoryDb, stopInMemoryDb} from "./test.db";
import {req} from "./test.helpers";
import {OrderType} from "../src/types/types";
import {SETTINGS} from "../src/settings";
import {HTTP_STATUSES} from "../src/status.code";
import {CreateOrderModel} from "../src/features/orders/model/CreateOrderModel";
import {productTestManager} from "./productTestManager";

describe('/orders', () => {
    let db: Db;
    let ordersCollection: Collection<OrderType>;

    beforeAll(async () => {
        db = await getInMemoryDb();
        ordersCollection = db.collection<OrderType>("orders");

        await req
            .delete(`${SETTINGS.PATH.TESTS}/all-data`)
            .expect(HTTP_STATUSES.NO_CONTENT_204);
    });

    beforeEach(async () => {
        await ordersCollection.deleteMany({});
    });

    afterAll(async () => {
        await stopInMemoryDb();
    });

    describe('GET /orders', () => {

        it('+ Should create an order with valid input and return status 201', async () => {

            const product1 = await productTestManager.createProduct()
            const product2 = await productTestManager.createProduct()

            const createOrderData: CreateOrderModel = {
                customerId: 'customer1',
                products: [
                    {id: product1.id as string, quantity: 2},
                    {id: product2.id as string, quantity: 3},
                ],
                createdAt: new Date().toISOString()
            };

            const response = await req
                .post(SETTINGS.PATH.ORDERS)
                .send(createOrderData)
                .expect(HTTP_STATUSES.CREATED_201);

            expect(response.body).toEqual({
                id: response.body.id,
                customerId: createOrderData.customerId,
                products: createOrderData.products,
                createdAt: response.body.createdAt,
            });
        });

        it('- Should return 400 if input validation fails', async () => {
            const invalidOrderData = {
                customerId: '',
                products: [], // Invalid products array
            };

            const response = await req
                .post(SETTINGS.PATH.ORDERS)
                .send(invalidOrderData)
                .expect(HTTP_STATUSES.BAD_REQUEST_400);

            expect(response.body).toHaveProperty('errorsMessages');
        });

    });

});
