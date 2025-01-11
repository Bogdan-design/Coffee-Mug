import {Collection, Db, MongoClient} from "mongodb";
import {OrderType, ProductType} from "../types/types";
import {SETTINGS} from "../settings";

const client: MongoClient = new MongoClient(SETTINGS.MONGO_URI)
export const db: Db = client.db(SETTINGS.DB_NAME);

export const productsCollection: Collection<ProductType> = db.collection<ProductType>(SETTINGS.PRODUCTS_COLLECTION_NAME)
export const ordersCollection: Collection<OrderType> = db.collection<OrderType>(SETTINGS.ORDERS_COLLECTION_NAME)


export const connectToDB = async () => {
    try {
        await client.connect()
        console.log('connected to db')
        return true
    } catch (e) {
        console.log(e)
        await client.close()
        return false
    }
}