import {ProductType} from "../../../types/types";

export type ProductsInOrderType = {
    id: string
    quantity:number
}


export type CreateOrderModel = {
    customerId: string
    products:ProductsInOrderType[]
}