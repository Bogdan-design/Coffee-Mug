import express from 'express'
import cors from 'cors'
import {SETTINGS} from "./settings";
import {productsRouter} from "./features/products";
import {ordersRouter} from "./features/orders";
import {testRouter} from "../__tests__/testing";


export const app = express()


app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use(SETTINGS.PATH.PRODUCTS, productsRouter)
app.use(SETTINGS.PATH.ORDERS, ordersRouter);
app.use(SETTINGS.PATH.TESTS, testRouter);