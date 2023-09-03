import mongoose from "mongoose";

enum discountType {
  AMOUNT = "AMOUNT",
  PERCENTAGE = "PERCENTAGE",
}

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    categoryId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    organizationId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    discountType: {
      type: String,
      enum: [discountType.AMOUNT, discountType.PERCENTAGE],
    },
    discount: {
      type: Number,
    },
    purchasePrice: {
      type: Number,
    },
    openingStock: {
      type: Number,
    },
    stockDate: {
      type: Date,
    },
    notifyWhenLow: {
      type: Boolean,
    },
    lowQuantity: {
      type: Number,
    },
    images: {
      type: Array<String>,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

interface IProduct {
  productName: string;
  categoryId: string;
  userId: string;
  organizationId: string;
  price?: number;
  discountType?: string;
  discount?: number;
  purchasePrice?: number;
  openingStock?: number;
  stockDate?: any;
  notifyWhenLow: boolean;
  lowQuantity?: number;
  images?: Array<string>;
  description?: string;
}

export interface IProductRequest {
  newCategoryName?: string;
  newCategory: boolean;
  productName: string;
  categoryId: string;
  userId: string;
  organizationId: string;
  price?: number;
  discountType?: string;
  discount?: number;
  purchasePrice?: number;
  openingStock?: number;
  stockDate?: any;
  notifyWhenLow: boolean;
  lowQuantity?: number;
  images?: Array<string>;
  description?: string;
}

interface IProductDoc extends mongoose.Document {
  productName: string;
  categoryId: string;
  userId?: string;
  organizationId?: string;
  price?: string;
  discountType?: string;
  discount?: number;
  purchasePrice?: number;
  openingStock?: number;
  stockDate?: any;
  notifyWhenLow: boolean;
  lowQuantity?: number;
  images?: Array<string>;
  description?: string;
}

interface IProductModel extends mongoose.Model<IProductDoc> {
  build(attributes: IProduct): IProductDoc;
}

productSchema.statics.build = (attributes: IProduct) => {
  return new Product(attributes);
};

export const Product = mongoose.model<IProductDoc, IProductModel>(
  "Products",
  productSchema
);
