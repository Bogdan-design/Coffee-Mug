import {repositoryProducts} from "./repository.products";
import {ProductType} from "../../types/types";
import {CreateProductModel} from "../../features/products/models/CreatePoductModel";
import {ObjectId} from "mongodb";


export const serviceProducts = {
    async getAllProducts() {

        const products = await repositoryProducts.getAllProductsFromDB()

        return products

    },
    async createProduct({name, description, price, stock}: CreateProductModel) {
        const newProduct: ProductType = {
            name,
            description,
            price: +price,
            stock: +stock
        }

        const result = await repositoryProducts.createProduct(newProduct)
        const product = await repositoryProducts.findProduct(result.insertedId)

        return {result,product}
    },
    async stockIncrementForProductById(productId:string,increaseOn:number) {

        const result = await repositoryProducts.increaseProduct(productId,increaseOn)
        return result

    },
    async stockDecrementForProductById(productId:string,decreaseOn:number) {
        const product = await repositoryProducts.findProduct(new ObjectId(productId))
        if (!product) {
            throw new Error("Product not found");
        }

        if (product.stock < decreaseOn) {
            throw new Error("Insufficient stock");
        }

        const result = await repositoryProducts.decreaseProduct(productId,decreaseOn)
        return result

    }

}


