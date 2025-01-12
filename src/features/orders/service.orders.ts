import {ProductType} from "../../types/types";
import {repositoryOrders} from "../../features/orders/repository.orders";
import {ObjectId} from "mongodb";
import {CreateOrderModel, ProductsInOrderType} from "../../features/orders/model/CreateOrderModel";

export const serviceOrders = {
    async createOrder(customerId: string, productsInOrder: ProductsInOrderType[]) {


        // const productIds = productsInOrder.map(product => new ObjectId(product.id))
        //
        // const productsInStock = await repositoryOrders.findAllProductsForOrder(productIds)
        //
        // const stockMap = productsInStock.reduce((map, product) => {
        //     map[product._id.toString()] = product.stock;
        //     return map;
        // }, {} as Record<string, number>)
        //
        // const insufficientStock = productsInOrder.filter(product => {
        //     const stock = stockMap[product.quantity];
        //     return stock === undefined || stock < product.quantity;
        // });
        //
        // if(insufficientStock.length>0){
        //     return null
        // }

        const newOrder: CreateOrderModel = {
            customerId,
            products:productsInOrder
        }

        const result = await repositoryOrders.createOrder(newOrder)
        const order = await repositoryOrders.findOrderById(result.insertedId)

        return {result,order}
    }

}