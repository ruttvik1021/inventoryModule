import express, { Request, Response } from "express";
import { productApiEndPoints } from "../../constants/constants";
import { TokenValidator } from "../../middlewares/token-handler";
import { Product } from "../../modals/products";
import { messages } from "./constants";
import { Category } from "../../modals/category";

const router = express.Router();

router.delete(
  productApiEndPoints.deleteProduct,
  TokenValidator,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (id === "undefined" || id === "null")
      return res.status(400).send({ message: messages.productIdNotPresent });

    const product = await Product.findOneAndDelete({ _id: id });

    if (!product) {
      return res.status(400).send({
        message: messages.productDoesNotExist,
      });
    }

    const updatedCategory = await Category.findOneAndUpdate(
      { _id: product.categoryId },
      { $inc: { productsCount: -1 } },
      { new: true }
    );

    console.log("updatedCategory", updatedCategory);

    if (!product) {
      return res.status(400).send({ message: messages.productDoesNotExist });
    }

    res.status(200).send({ message: messages.productDeleted });
  }
);

export { router as DeleteProductByIdRoute };
