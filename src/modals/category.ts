import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
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
    productsCount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

interface ICategory {
  categoryName: string;
  organizationId?: string;
  userId?: string;
  productsCount: number;
}

interface ICategoryDoc extends mongoose.Document {
  categoryName: string;
  organizationId?: string;
  userId?: string;
  productsCount: number;
}

interface ICategoryModel extends mongoose.Model<ICategoryDoc> {
  build(attributes: ICategory): ICategoryDoc;
}

categorySchema.statics.build = (attributes: ICategory) => {
  return new Category(attributes);
};

export const Category = mongoose.model<ICategoryDoc, ICategoryModel>(
  "Category",
  categorySchema
);
