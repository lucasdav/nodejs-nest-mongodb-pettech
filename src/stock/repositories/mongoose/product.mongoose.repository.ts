import { InjectModel } from '@nestjs/mongoose';
import { IProduct } from '../../schemas/models/product.interface';
import { ProductRepository } from '../product.repository';
import { Product } from '../../schemas/product.schema';
import { Model } from 'mongoose';

export class ProductMongooseRepository extends ProductRepository {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {
    super();
  }

  getAllStock(limit: number, page: number): Promise<IProduct[]> {
    const offset = (page - 1) * limit;
    return this.productModel.find().skip(offset).limit(limit).exec();
  }

  getStock(productId: string): Promise<IProduct> {
    return this.productModel.findById(productId).exec();
  }

  async createStock(product: IProduct): Promise<void> {
    const createdProduct = new this.productModel(product);

    await createdProduct.save();
  }

  async updateStock(productId: string, stock: number): Promise<void> {
    await this.productModel
      .updateOne({ _id: productId }, { quantity: stock })
      .exec();
  }

  async deleteStock(productId: string): Promise<void> {
    await this.productModel.deleteOne({ _id: productId }).exec();
  }
}