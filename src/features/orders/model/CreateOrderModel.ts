import {ProductType} from "../../../types/types";


export type CreateOrderModel = {
    customerId: string
    products:ProductType[]
}