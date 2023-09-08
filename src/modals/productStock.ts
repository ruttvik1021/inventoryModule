import mongoose from "mongoose";

const productStockSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    organizationId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    currentQuantity: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

interface IProductStock {
  productId: string;
  organizationId?: string;
  userId?: string;
  currentQuantity: number;
}

interface IProductStockDoc extends mongoose.Document {
  productId: string;
  organizationId?: string;
  userId?: string;
  currentQuantity: number;
}

interface IProductStockModel extends mongoose.Model<IProductStockDoc> {
  build(attributes: IProductStock): IProductStockDoc;
}

productStockSchema.statics.build = (attributes: IProductStock) => {
  return new ProductStock(attributes);
};

export const ProductStock = mongoose.model<
  IProductStockDoc,
  IProductStockModel
>("ProductStock", productStockSchema);
