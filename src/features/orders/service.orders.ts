import {ProductType} from "../../types/types";
import {repositoryOrders} from "../../features/orders/repository.orders";
import {ObjectId} from "mongodb";

export const serviceOrders = {
    async createOrder(customerId: string, productsInOrder: ProductType[]) {


        const productIds = productsInOrder.map(product => new ObjectId(product.id))

        const productsInStock = await repositoryOrders.findAllProductsForOrder(productIds)

        const stockMap = productsInStock.reduce((map, product) => {
            map[product._id.toString()] = product.stock;
            return map;
        }, {} as Record<string, number>)

        const insufficientStock = productsInOrder.filter(product => {
            const stock = stockMap[product.stock];
            return stock === undefined || stock < product.stock;
        });

        if(insufficientStock.length>0){
            return null
        }

        const newOrder = {
            customerId,
            products:productsInOrder
        }

        const result = await repositoryOrders.createOrder(newOrder)

        return result
    }

}