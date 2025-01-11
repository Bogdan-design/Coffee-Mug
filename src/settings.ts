import {config} from 'dotenv'
config()


export const SETTINGS = {

    PORT: process.env.PORT || 3000,
    PATH: {
        PRODUCTS: '/products',
        ORDERS: '/orders',
    },
    MONGO_URI: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
    DB_NAME: 'Coffee_mug',
    PRODUCTS_COLLECTION_NAME: 'products',
    ORDERS_COLLECTION_NAME: 'orders',
}