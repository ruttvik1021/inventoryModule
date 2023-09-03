import express, { Request, Response } from "express";
import { productApiEndPoints } from "../../constants/constants";
import { TokenValidator } from "../../middlewares/token-handler";
import { Product } from "../../modals/products";
import { messages } from "./constants";

const router = express.Router();

router.get(
  productApiEndPoints.getProductByID,
  TokenValidator,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (id === "undefined" || id === "null")
      return res.status(400).send({ message: messages.productIdNotPresent });

    const product: any = await Product.findOne({ _id: id });

    if (!product) {
      return res.status(400).send({ message: messages.productDoesNotExist });
    }

    let responseObj = {
      ...product._doc,
      id: product._doc._id,
      newCategory: false,
    };

    delete responseObj._id;
    delete responseObj.__v;
    delete responseObj.organizationId;
    delete responseObj.userId;

    res.status(200).send({ product: responseObj });
  }
);

export { router as GetProductByIdRoute };
