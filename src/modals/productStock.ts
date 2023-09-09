import mongoose from "mongoose";

export type ActionTypes = "ADD" | "REMOVE";

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
    quantityModified: {
      type: Number,
    },
    actionType: {
      type: String,
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
  quantityModified: number;
  actionType: ActionTypes;
}

interface IProductStockDoc extends mongoose.Document {
  productId: string;
  organizationId?: string;
  userId?: string;
  quantityModified: number;
  actionType: ActionTypes;
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
>("ProductStockLogs", productStockSchema);
