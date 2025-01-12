import {Response, Router} from "express";
import {HTTP_STATUSES} from "../../status.code";
import {OrderType, ProductType, RequestWithBody} from "../../types/types";
import {serviceOrders} from "../../features/orders/service.orders";
import {ordersInputValidationMiddleware} from "../../middlewares/errorsMiddleware";
import {CreateOrderModel} from "../../features/orders/model/CreateOrderModel";

export const ordersRouter = Router()

export const ordersController = {
    async createOrder(req: RequestWithBody<CreateOrderModel>, res: Response<any>) {
        try {
            const customerId: string = req.body.customerId
            const productsInOrder = req.body.products

            const {order,result} = await serviceOrders.createOrder(customerId, productsInOrder)

            if (!result.acknowledged) {
                res
                    .status(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
                    .json(
                        'Not enough in stock'
                    )
            }

            if (!order) {
                res
                    .status(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
                    .json(
                        'Not enough in stock'
                    )
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

ordersRouter.post('/',ordersInputValidationMiddleware, ordersController.createOrder)