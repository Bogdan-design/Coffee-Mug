import express from "express";
import {HTTP_STATUSES} from "../src/status.code";
import {ordersCollection, productsCollection} from "../src/db/mongodb";

export const testRouter = express.Router()

export const testingController = {
    async deleteAllData  (req: any, res:any){
        try{
            await Promise.all([
                productsCollection.deleteMany(),
                ordersCollection.deleteMany()
            ])

            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            return

        } catch(err){
            console.log(err)
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return
        }
    }
}


testRouter.delete('/all-data', testingController.deleteAllData)