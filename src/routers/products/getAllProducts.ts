import express, { Request, Response } from "express";
import { productApiEndPoints } from "../../constants/constants";
import { TokenValidator } from "../../middlewares/token-handler";
import { Product } from "../../modals/products";

const router = express.Router();

router.get(
  productApiEndPoints.getAllProducts,
  TokenValidator,
  async (req: Request, res: Response) => {
    const { organizationId, userId } = req.body.details;
    const productList = await Product.find({ organizationId, userId }).sort({
      updatedAt: -1,
    });

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

    res.status(200).send({
      products: responseProductList,
      totalproducts: productList.length,
    });
  }
);

export { router as GetAllProductsRoute };
