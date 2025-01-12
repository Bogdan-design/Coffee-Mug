import request from 'supertest';
import {OrderType} from "../src/types/types";
import {repositoryOrders} from "../src/features/orders/repository.orders";
import {app} from "../src/app";
import {HTTP_STATUSES} from "../src/status.code";
import {CreateOrderModel} from "../src/features/orders/model/CreateOrderModel";
import {serviceOrders} from "../src/features/orders/service.orders";


jest.mock('../../features/orders/repository.orders');
jest.mock('../../features/orders/service.orders');

describe('/orders', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /orders', () => {
        it('+ Should return all orders with status 200', async () => {
            const mockOrders: OrderType[] = [
                {
                    id: 'order1',
                    customerId: 'customer1',
                    products: [
                        {productId: 'product1', quantity: 2},
                        {productId: 'product2', quantity: 3},
                    ],
                    total: 100,
                    createdAt: new Date().toISOString(),
                },
            ];

            (repositoryOrders.findAllOrders as jest.Mock).mockResolvedValue(mockOrders);

            const response = await request(app).get('/orders').expect(HTTP_STATUSES.OK_200);

            expect(response.body).toEqual(mockOrders);
            expect(repositoryOrders.findAllOrders).toHaveBeenCalledTimes(1);
        });

        it('- Should return 500 if there is an internal server error', async () => {
            (repositoryOrders.findAllOrders as jest.Mock).mockImplementation(() => {
                throw new Error('Database error');
            });

            const response = await request(app).get('/orders').expect(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);

            expect(response.body).toEqual('Server errorError: Database error');
        });
    });

    describe('POST /orders', () => {
        it('+ Should create an order with valid input and return status 201', async () => {
            const mockOrder: OrderType = {
                id: 'order1',
                customerId: 'customer1',
                products: [
                    {productId: 'product1', quantity: 2},
                    {productId: 'product2', quantity: 3},
                ],
                total: 100,
                createdAt: new Date().toISOString(),
            };

            const mockResult = {acknowledged: true};

            const createOrderData: CreateOrderModel = {
                customerId: 'customer1',
                products: [
                    {productId: 'product1', quantity: 2},
                    {productId: 'product2', quantity: 3},
                ],
            };

            (serviceOrders.createOrder as jest.Mock).mockResolvedValue({
                result: mockResult,
                order: mockOrder,
            });

            const response = await request(app)
                .post('/orders')
                .send(createOrderData)
                .expect(HTTP_STATUSES.CREATED_201);

            expect(response.body).toEqual(mockOrder);
            expect(serviceOrders.createOrder).toHaveBeenCalledWith(
                createOrderData.customerId,
                createOrderData.products
            );
        });

        it('- Should return 500 if creation fails (result.acknowledged is false)', async () => {
            const createOrderData: CreateOrderModel = {
                customerId: 'customer1',
                products: [{productId: 'product1', quantity: 2}],
            };

            (serviceOrders.createOrder as jest.Mock).mockResolvedValue({
                result: {acknowledged: false},
                order: null,
            });

            const response = await request(app)
                .post('/orders')
                .send(createOrderData)
                .expect(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);

            expect(response.body).toEqual('Not enough in stock');
        });

        it('- Should return 500 if service throws an error', async () => {
            const createOrderData: CreateOrderModel = {
                customerId: 'customer1',
                products: [{productId: 'product1', quantity: 2}],
            };

            (serviceOrders.createOrder as jest.Mock).mockImplementation(() => {
                throw new Error('Service error');
            });

            const response = await request(app)
                .post('/orders')
                .send(createOrderData)
                .expect(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);

            expect(response.body).toEqual('Server errorError: Service error');
        });

        it('- Should return 400 if input validation fails', async () => {
            const invalidOrderData = {
                customerId: '',
                products: [], // Invalid products array
            };

            const response = await request(app)
                .post('/orders')
                .send(invalidOrderData)
                .expect(HTTP_STATUSES.BAD_REQUEST_400);

            expect(response.body).toHaveProperty('errorsMessages');
        });
    });
});
