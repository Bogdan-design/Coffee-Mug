import {repositoryOrders} from "../../features/orders/repository.orders";
import {CreateOrderModel, ProductsInOrderType} from "../../features/orders/model/CreateOrderModel";
import {repositoryProducts} from "../../features/products/repository.products";
import {OrderType} from "../../types/types";
import {WithId,InsertOneResult} from "mongodb";

export const serviceOrders = {
    async createOrder(customerId: string, productsInOrder: ProductsInOrderType[]): Promise<{
        order: WithId<OrderType>,
        result:InsertOneResult<OrderType>
    }> {


        for (const product of productsInOrder) {
            const result = await repositoryProducts.decreaseProduct(product.id, product.quantity)

            if (!result) {
                throw new Error('Something going wrong')
            }
        }


        const newOrder: CreateOrderModel = {
            customerId,
            products: productsInOrder,
            createdAt: new Date().toISOString()
        }

        const result = await repositoryOrders.createOrder(newOrder)
        const order = await repositoryOrders.findOrderById(result.insertedId)

        if (!order) {
            throw new Error('Something going wrong')
        }

        return {result, order}
    }

}