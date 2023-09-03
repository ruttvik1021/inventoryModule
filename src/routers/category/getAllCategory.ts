import express, { Request, Response } from "express";
import { categoryApiEndPoints } from "../../constants/constants";
import { TokenValidator } from "../../middlewares/token-handler";
import { Category } from "../../modals/category";
import { Product } from "../../modals/products";

const router = express.Router();

router.get(
  categoryApiEndPoints.getAllCategories,
  TokenValidator,
  async (req: Request, res: Response) => {
    const { organizationId, userId } = req.body.details;
    const categoryList = await Category.find({ organizationId, userId }).sort({
      updatedAt: -1,
    });

    const responseCategoryList = categoryList.map((item) => {
      // const productsCount = await getProductsCount(item.id);
      return {
        categoryName: item.categoryName,
        productsCount: item.productsCount,
        id: item._id,
      };
    });
    res.status(200).send({ categories: responseCategoryList });
  }
);

export { router as GetAllCategoriesRoute };
