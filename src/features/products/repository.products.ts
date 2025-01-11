import {productsCollection} from "../../db/mongodb";
import {ProductType} from "../../types/types";
import {ObjectId} from 'mongodb'

export const repositoryProducts = {
    async getAllProductsFromDB (){
        return await productsCollection.find({}).toArray()
    },
    async createProduct(newProduct:ProductType){
        return await productsCollection.insertOne(newProduct)
    },
    async findProduct(productId:ObjectId){
        return await productsCollection.findOne({_id: productId})
    },
    async increaseProduct (productId:string,increaseOn:number){
        return await productsCollection
            .findOneAndUpdate({_id:new ObjectId(productId)},{ $inc: {stock:increaseOn} },{returnDocument: "after"})
    },
    async decreaseProduct (productId:string,decreaseOn:number){
        return await productsCollection
            .findOneAndUpdate({_id:new ObjectId(productId)},{ $inc: {stock:-decreaseOn} },{returnDocument: "after"})
    }
}