import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductRequest } from './dto/create-product.request';
import { CurrentUser } from '../auth/current-user.decorator';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor( private readonly productsService: ProductsService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    async createProduct(
        @Body() body:CreateProductRequest,
        @CurrentUser() user:TokenPayload,
    ) {
        return this.productsService.createProduct(body, user.userId)
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getProducts() {
        return this.productsService.getProducts()
    }

}
