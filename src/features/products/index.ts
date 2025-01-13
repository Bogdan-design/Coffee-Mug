import {Request, Response, Router} from "express";
import {WithId} from 'mongodb'
import {HTTP_STATUSES} from "../../status.code";
import {serviceProducts} from "./service.products";
import {ProductType, RequestWithBody, RequestWithParamsAndBody} from "../../types/types";
import {CreateProductModel} from "../../features/products/models/CreatePoductModel";
import {
    decreaseInputValidationMiddleware,
    increaseInputValidationMiddleware,
    productsInputValidationMiddleware
} from "../../middlewares/errorsMiddleware";


export const productsRouter = Router()

const getProductsViewModel = (productsDB: WithId<ProductType>) => {
    return {
        id: productsDB._id.toString(),
        name: productsDB.name,
        description: productsDB.description,
        price: productsDB.price,
        stock: productsDB.stock
    }
}

export const productsController = {
    async getAllProducts(req: Request<void>, res: Response<ProductType[] | string>) {

        try {

            const products = await serviceProducts.getAllProducts()

            res
                .status(HTTP_STATUSES.OK_200)
                .json(products.map(getProductsViewModel))
            return

        } catch (e) {
            console.log(e)
            res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500).json(
                'Server error'
            )
            return
        }


    },
    async createProduct(req: RequestWithBody<CreateProductModel>, res: Response<ProductType | string>) {
        try {
            const data = req.body


            const {product, result} = await serviceProducts.createProduct(data)

            if (!result.insertedId) {
                res
                    .sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
                return
            }
            if (!product) {
                res
                    .sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
                return
            }

            res
                .status(HTTP_STATUSES.CREATED_201)
                .json(getProductsViewModel(product))
            return

        } catch (e) {
            console.log(e)
            res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500).json(
                `Server error${e}`
            )
            return
        }

    },
    async stockIncrement(req: RequestWithParamsAndBody<{ id: string }, { increase: string }>, res: Response<ProductType | string>) {

        try {

            const productId: string = req.params.id
            const increaseOn: number = +req.body.increase

            const updatedProduct: WithId<ProductType> | null = await serviceProducts.stockIncrementForProductById(productId, increaseOn)

            if (!updatedProduct) {
                res.status(HTTP_STATUSES.NOT_FOUND_404).json(
                    'Product not found'
                )
                return
            }

            res
                .status(HTTP_STATUSES.OK_200)
                .json(getProductsViewModel(updatedProduct))
            return

        } catch (e) {
            console.log(e)
            res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500).json(
                `Server error${e}`
            )
            return
        }

    },
    async stockDecrement(req: RequestWithParamsAndBody<{ id: string }, { decrease: string }>, res: Response<ProductType | string>) {

        try {

            const productId: string = req.params.id
            const decreaseOn: number = +req.body.decrease

            const updatedProduct: WithId<ProductType> | null = await serviceProducts
                .stockDecrementForProductById(productId, decreaseOn)

            if (!updatedProduct) {
                res.status(HTTP_STATUSES.NOT_FOUND_404).json(
                    'Product not found'
                )
                return
            }

            res
                .status(HTTP_STATUSES.OK_200)
                .json(getProductsViewModel(updatedProduct))
            return

        } catch (e) {
            console.log(e)
            res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500).json(
                `Server error${e}`
            )
            return
        }

    }

}


productsRouter.get('/', productsController.getAllProducts)
productsRouter.post('/', productsInputValidationMiddleware, productsController.createProduct)
productsRouter.post('/:id/restock',increaseInputValidationMiddleware, productsController.stockIncrement)
productsRouter.post('/:id/sell',decreaseInputValidationMiddleware, productsController.stockDecrement)
