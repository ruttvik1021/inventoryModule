import express, { Request, Response } from "express";
import { productApiEndPoints } from "../../constants/constants";
import { TokenValidator } from "../../middlewares/token-handler";
import { Product } from "../../modals/products";
import { messages } from "./constants";
import { Category } from "../../modals/category";

const router = express.Router();

router.get(
  productApiEndPoints.getProductByCategory,
  TokenValidator,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id)
      return res.status(400).send({ message: messages.categoryIdNotPresent });

    const category = await Category.findOne({ _id: id });

    if (!category) return res.status(400).send(messages.categoryDoesNotExist);

    const productList = await Product.find({ categoryId: id });

    const responseProductList =
      productList.length &&
      productList.map((item) => {
        return {
          productName: item.productName,
          categoryId: item.categoryId,
          description: item?.description,
          lowQuantity: item?.lowQuantity,
          openingStock: item?.openingStock,
          currentStock: item?.currentStock,
          id: item._id,
        };
      });

    res.status(200).send({ productList: responseProductList });
  }
);

export { router as GetProductByCategoryRoute };
