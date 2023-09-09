import express, { Request, Response } from "express";
import { productApiEndPoints } from "../../constants/constants";
import { Product } from "../../modals/products";
import { messages, parameters } from "./constants";
import { body, validationResult } from "express-validator";
import { ProductStock } from "../../modals/productStock";
import { TokenValidator } from "../../middlewares/token-handler";

const router = express.Router();

router.put(
  productApiEndPoints.addStocks,
  TokenValidator,
  [body(parameters.quantityToAdd).isNumeric().withMessage("Must be a number")],
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { quantityToAdd } = req.body;
    const { userId, organizationId } = req.body.details;
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).send({ message: errors.array()[0].msg });

    if (!id) return res.status(400).send({ message: "Product Id invalid" });

    const product = await Product.findOneAndUpdate(
      { _id: id },
      { $inc: { currentStock: +quantityToAdd } },
      { returnOriginal: false }
    );

    if (!product)
      return res.status(400).send({ message: messages.productDoesNotExist });

    const history = ProductStock.build({
      productId: id,
      quantityModified: quantityToAdd,
      userId: userId,
      organizationId: organizationId,
      actionType: "ADD",
    });

    await history.save();

    res.status(200).send({ product });
  }
);

export { router as AddStockRoute };
