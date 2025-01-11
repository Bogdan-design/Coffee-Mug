import {Request} from 'express'


export type ProductType = {
    id?: string
    name: string
    description: string
    price:number
    stock:number
}

export type OrderType = {
    id?: string
    customerId: string
    products:ProductType[]
}

export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithParams<T> = Request<T>
export type RequestWithParamsAndBody<T, B> = Request<T, {}, B>
export type RequestWithParamsAndQuery<T, B> = Request<T, {}, {}, B>