import { Injectable } from '@nestjs/common';
import { CreateProductRequest } from './dto/create-product.request';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './products.schema';
import { Model } from 'mongoose'

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name) 
    private readonly productModel: Model<Product>) {
        return 
    }

    async createProduct (
        data: CreateProductRequest,
        userId: string
    ) {
        try {
            const createdProduct = new this.productModel({
                ...data,
                userId
            })
            await createdProduct.save()
            return createdProduct
        } catch (error) {
            
        }
    }

    async getProducts() {
        try {
            const productsList = await this.productModel.find()
            return productsList
        } catch (error) {
            
        }
    }

    async getProductsOfUser(userId: string) {
        try {
            const productsList = await this.productModel.find({ userId })
            return productsList
        } catch (error) {
            
        }
    }
}
