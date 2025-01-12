import {ordersCollection, productsCollection} from "../../db/mongodb";
import {ObjectId} from "mongodb";
import {OrderType} from "../../types/types";
import {CreateOrderModel} from "../../features/orders/model/CreateOrderModel";

export const repositoryOrders ={
    async createOrder (newOrder: CreateOrderModel){
        return await ordersCollection.insertOne(newOrder)
    },
    async findOrderById(id:ObjectId){
        return await ordersCollection.findOne({_id:id})
    },
    async findAllProductsForOrder (productIds:ObjectId[]){

        return await productsCollection.find({ _id: { $in: productIds } }).toArray()

    },
    async findProductById (id:string){
        return await productsCollection.findOne({_id:new ObjectId(id)})
    }
}