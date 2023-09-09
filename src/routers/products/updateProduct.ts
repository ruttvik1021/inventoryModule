import express, { Request, Response } from "express";
import { productApiEndPoints } from "../../constants/constants";
import { body, validationResult } from "express-validator";
import { messages, parameters } from "./constants";
import { Product } from "../../modals/products";
import { Category } from "../../modals/category";
import { TokenValidator } from "../../middlewares/token-handler";

const router = express.Router();

router.put(
  productApiEndPoints.updateProduct,
  TokenValidator,
  [
    body(parameters.productName)
      .isString()
      .notEmpty()
      .withMessage(messages.productNameRequired),
    body(parameters.newCategory).isBoolean(),
    body(parameters.newCategoryName)
      .if((value, { req }) => req.body.newCategory)
      .isString()
      .notEmpty()
      .withMessage(messages.newCategoryNameRequired),
    body(parameters.categoryId)
      .if((value, { req }) => !req.body.newCategory)
      .notEmpty()
      .withMessage(messages.categoryRequired),
    body(parameters.categoryId)
      .if((value, { req }) => req.body.newCategory)
      .isEmpty()
      .withMessage(messages.categoryMustNotBeSelected),
    body(parameters.purchasePrice)
      .isNumeric()
      .withMessage(messages.invalidPurchasePrice),
    body(parameters.price).isNumeric().withMessage(messages.invalidPrice),
    body(parameters.discountType)
      .isString()
      .withMessage(messages.invalidDiscountType),
    body(parameters.discount).isNumeric().withMessage(messages.invalidDiscount),
    body(parameters.openingStock)
      .isNumeric()
      .withMessage(messages.invalidOpeningStock),
    body(parameters.notifyWhenLow).isBoolean(),
    body(parameters.lowQuantity)
      .if((value, { req }) => req.body.notifyWhenLow)
      .isNumeric()
      .isLength({ min: 0 })
      .withMessage(messages.invalidLowStock),
    body(parameters.stockDate).isString(),
    body(parameters.images)
      .isArray()
      .custom((value) => {
        if (
          Array.isArray(value) &&
          value.every((item) => typeof item === "string")
        ) {
          return true;
        } else {
          throw new Error("Images must be an array of strings");
        }
      }),
  ],
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { categoryId } = req.body;
    const errors = validationResult(req);
    if (!id) return res.status(400).send({ message: messages.invalidId });
    if (!errors.isEmpty())
      return res.status(400).send({ message: errors.array()[0].msg });

    const product = await Product.findOne({ _id: id });

    if (!product)
      return res.status(400).send({ message: messages.productDoesNotExist });

    const previousCategory = await Category.findOne({
      _id: product.categoryId,
    });
    const newCategory = await Category.findOne({ _id: categoryId });

    if (previousCategory !== newCategory) {
      await Category.findOneAndUpdate(
        { _id: product.categoryId },
        { $inc: { productsCount: -1 } },
        { new: true }
      );
      await Category.findOneAndUpdate(
        { _id: categoryId },
        { $inc: { productsCount: 1 } },
        { new: true }
      );
    }
    await Product.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { returnOriginal: true }
    );

    res.status(200).send({ message: messages.productUpdated });
  }
);

export { router as UpdateProductByIdRoute };
