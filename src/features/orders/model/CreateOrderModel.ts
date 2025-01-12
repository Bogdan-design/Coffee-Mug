export type ProductsInOrderType = {
    id: string
    quantity:number
}


export type CreateOrderModel = {
    customerId: string
    products:ProductsInOrderType[]
    createdAt:string
}