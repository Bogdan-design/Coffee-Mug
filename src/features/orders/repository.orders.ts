import {ordersCollection, productsCollection} from "../../db/mongodb";
import {ObjectId} from "mongodb";
import {OrderType} from "../../types/types";

export const repositoryOrders ={
    async createOrder (newOrder: OrderType){
        return await ordersCollection.insertOne(newOrder)
    },
    async findAllProductsForOrder (productIds:ObjectId[]){

        return await productsCollection.find({ _id: { $in: productIds } }).toArray()

    }
}