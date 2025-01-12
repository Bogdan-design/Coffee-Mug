import {Collection, Db} from "mongodb";
import {getInMemoryDb, stopInMemoryDb} from "./test.db";
import {req} from "./test.helpers";
import {OrderType} from "../src/types/types";
import {SETTINGS} from "../src/settings";
import {HTTP_STATUSES} from "../src/status.code";
import {CreateOrderModel} from "../src/features/orders/model/CreateOrderModel";

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
        it('+ Should return all orders with status 200', async () => {
            const orders: OrderType[] = [
                {
                    id: 'order1',
                    customerId: 'customer1',
                    products: [
                        {id: 'product1', quantity: 2},
                        {id: 'product2', quantity: 3},
                    ],
                    createdAt: new Date().toISOString(),
                },
            ];
            await ordersCollection.insertMany(orders);

            const response = await req
                .get(SETTINGS.PATH.ORDERS)
                .expect(HTTP_STATUSES.OK_200);

            expect(response.body).toEqual(orders);
        });

        it('- Should return 500 if the database operation fails', async () => {
            // Simulate a database error
            jest.spyOn(ordersCollection, 'find').mockImplementationOnce(() => {
                throw new Error('Database error');
            });

            const response = await req
                .get(SETTINGS.PATH.ORDERS)
                .expect(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);

            expect(response.body).toContain('Server error');
        });
    });

    describe('POST /orders', () => {
        it('+ Should create an order with valid input and return status 201', async () => {
            const createOrderData: CreateOrderModel = {
                customerId: 'customer1',
                products: [
                    {id: 'product1', quantity: 2},
                    {id: 'product2', quantity: 3},
                ],
                createdAt: new Date().toString()
            };

            const response = await req
                .post(SETTINGS.PATH.ORDERS)
                .send(createOrderData)
                .expect(HTTP_STATUSES.CREATED_201);

            const createdOrder = await ordersCollection.findOne({id: response.body.id});

            expect(createdOrder).not.toBeNull();
            expect(response.body).toEqual({
                id: response.body.id,
                customerId: createOrderData.customerId,
                products: createOrderData.products,
                total: response.body.total,
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

        it('- Should return 500 if the database operation fails', async () => {
            jest.spyOn(ordersCollection, 'insertOne').mockImplementationOnce(() => {
                throw new Error('Database error');
            });

            const createOrderData: CreateOrderModel = {
                customerId: 'customer1',
                products: [{id: 'product1', quantity: 2}],
                createdAt: new Date().toString()
            };

            const response = await req
                .post(SETTINGS.PATH.ORDERS)
                .send(createOrderData)
                .expect(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);

            expect(response.body).toContain('Server error');
        });
    });
});
