import {Response,Request, Router} from "express";
import {HTTP_STATUSES} from "../../status.code";
import {OrderType, ProductType, RequestWithBody} from "../../types/types";
import {serviceOrders} from "../../features/orders/service.orders";
import {ordersInputValidationMiddleware} from "../../middlewares/errorsMiddleware";
import {CreateOrderModel} from "../../features/orders/model/CreateOrderModel";
import {repositoryOrders} from "../../features/orders/repository.orders";

export const ordersRouter = Router()

export const ordersController = {
    async getAllOrders (req: Request<void>, res: Response<OrderType[] | string>){
        try {

            const allOrders = await repositoryOrders.findAllOrders()

            if (!allOrders) {
                res
                    .status(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
                    .json(
                        'Not enough in stock'
                    )
            }

            res
                .status(HTTP_STATUSES.OK_200)
                .json(allOrders)
            return

        } catch (e) {
            console.log(e)
            res
                .status(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
                .json(
                    `Server error${e}`
                )
            return
        }

    },
    async createOrder(req: RequestWithBody<CreateOrderModel>, res: Response<OrderType | string>) {
        try {
            const customerId: string = req.body.customerId
            const productsInOrder = req.body.products

            const {result, order} = await serviceOrders.createOrder(customerId, productsInOrder)



            if (!result.acknowledged) {
                res
                    .status(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
                    .json(
                        'Not enough in stock'
                    )
                return
            }

            if (!order) {
                res
                    .status(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
                    .json(
                        'Not enough in stock'
                    )
                return
            }

            res
                .status(HTTP_STATUSES.CREATED_201)
                .json(order)
            return

        } catch (e) {
            console.log(e)
            res
                .status(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
                .json(
                    `Server error${e}`
                )
            return
        }

    }
}

ordersRouter.get('/', ordersController.getAllOrders)
ordersRouter.post('/',ordersInputValidationMiddleware, ordersController.createOrder)