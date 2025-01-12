import {Request, Response, NextFunction} from "express";
import {body, FieldValidationError, param, validationResult} from "express-validator";
import {HTTP_STATUSES} from "../status.code";
import {ObjectId} from "mongodb";
import {productsCollection} from "../db/mongodb";
import {repositoryOrders} from "../features/orders/repository.orders";
import {ProductsInOrderType} from "../features/orders/model/CreateOrderModel";
import {repositoryProducts} from "../features/products/repository.products";


export const productParamsValidation = param("id").notEmpty().isString().custom(
    async (id: string) => {

        const res = await productsCollection.findOne({_id: new ObjectId(id)})
        if (!res) {
            throw new Error("productId not found")
        }
        return true
    }).withMessage("Wrong productId")




export const errorsMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const fieldErrors = errors.array({onlyFirstError: true}).map((error: any) => ({
            message: error.msg,
            field: error.path
        }));


        res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
            errorsMessages: fieldErrors
        });
        return
    } else {
        next()
    }

}

export const ordersInputValidationMiddleware = [
    body('customerId')
        .trim()
        .notEmpty().withMessage('Customer ID is required')
        .isString().withMessage('Customer ID must be a string'),
    body('products')
        .isArray({min: 1}).withMessage('Products must be a non-empty array')
        .custom(async (products:ProductsInOrderType[]) => {
            if (!Array.isArray(products)) {
                throw new Error('Products must be an array');
            }

            for (const product of products) {

                if (!product.id) {
                    throw new Error('Each product must have an id');
                }


                const productFromDb = await repositoryProducts.findProduct(new ObjectId(product.id));
                if (!productFromDb) {
                    throw new Error(`Product with id ${product.id} does not exist`);
                }


                if (productFromDb.stock < product.quantity) {
                    throw new Error(`Product with id ${product.id} is out of stock`);
                }
            }
            return true
        }),
    errorsMiddleware
]

export const increaseInputValidationMiddleware = [
    productParamsValidation,
    body('increase')
        .trim()
        .notEmpty().withMessage("Increase value is required")
        .isFloat({min: 0}).withMessage("Increase must be a positive number or zero"),
    errorsMiddleware

]

export const decreaseInputValidationMiddleware = [
    productParamsValidation,
    body('decrease')
        .trim()
        .notEmpty().withMessage("Decrease value is required")
        .isFloat({min: 0}).withMessage("Decrease must be a positive number or zero"),
    errorsMiddleware
]


export const productsInputValidationMiddleware = [

    body("name")
        .trim()
        .notEmpty().withMessage("Name is required")
        .isString().withMessage("Name must be a string")
        .isLength({max: 50}).withMessage("Name must not exceed 50 characters"),
    body('description')
        .trim()
        .notEmpty().withMessage("Description is required")
        .isString().withMessage("Description must be a string")
        .isLength({max: 50}).withMessage("Description must not exceed 50 characters"),
    body('price')
        .trim()
        .notEmpty().withMessage('Price is required')
        .isFloat({min: 0}).withMessage('Price must be a positive number or zero'),
    body('stock').trim()
        .notEmpty().withMessage("Stock is required")
        .isInt({min: 0}).withMessage("Stock must be a non-negative integer"),
    errorsMiddleware
]