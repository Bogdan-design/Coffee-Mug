import {ordersCollection} from "../../db/mongodb";
import {ObjectId} from "mongodb";
import {CreateOrderModel} from "../../features/orders/model/CreateOrderModel";

export const repositoryOrders ={
    async createOrder (newOrder: CreateOrderModel){
        return await ordersCollection.insertOne(newOrder)
    },
    async findOrderById(id:ObjectId){
        return await ordersCollection.findOne({_id:id})
    },
    async findAllOrders (){
        return await ordersCollection.find({}).toArray()
    },
}