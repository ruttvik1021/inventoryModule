import express, { Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import { productApiEndPoints } from "../../constants/constants";
import { TokenValidator } from "../../middlewares/token-handler";
import { Category } from "../../modals/category";
import { IProductRequest, Product } from "../../modals/products";
import { descriptionLimit, messages, parameters } from "./constants";

const router = express.Router();

router.post(
  productApiEndPoints.addProduct,
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
    body(parameters.description)
      .isString()
      .isLength({ max: descriptionLimit.max })
      .withMessage(messages.productDescriptionLimit),
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
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({
        message: errors.array()[0],
      });
    }

    const {
      productName,
      newCategory,
      newCategoryName,
      categoryId,
      purchasePrice,
      price,
      discount,
      discountType,
      openingStock,
      notifyWhenLow,
      lowQuantity,
      stockDate,
      images,
      description,
    }: IProductRequest = req.body;

    if (newCategory && newCategoryName) {
      const categoryExist = await Category.findOne({
        categoryName: newCategoryName,
      });

      if (categoryExist)
        return res.status(400).send({ message: messages.categoryExist });

      const newCategoryCreated = Category.build({
        categoryName: newCategoryName,
        organizationId: req.body.details.organizationId,
        userId: req.body.details.userId,
        productsCount: 0,
      });

      await newCategoryCreated.save();

      const existingProduct = await Product.findOne({
        productName,
        categoryId,
      });

      if (existingProduct) {
        return res
          .status(400)
          .send({ message: "Product in the category already Exist" });
      }

      const newProduct = Product.build({
        productName: productName,
        categoryId: newCategoryCreated._id,
        userId: req.body.details.userId,
        organizationId: req.body.details.organizationId,
        notifyWhenLow: req.body.notifyWhenLow,
      });

      await newProduct.save();

      return res.status(200).send({ message: newProduct });
    } else {
      const existingProduct = await Product.findOne({
        productName,
        categoryId,
      });

      const category = await Category.findOne({ _id: categoryId });

      if (existingProduct || !category) {
        return res.status(400).send({
          message: existingProduct
            ? messages.productWithinCategoryExist
            : !category
            ? messages.categoryDoesNotExist
            : "",
        });
      }
      const newProduct = Product.build({
        productName: productName,
        categoryId: categoryId,
        userId: req.body.details.userId,
        organizationId: req.body.details.organizationId,
        notifyWhenLow: notifyWhenLow,
        price: price,
        discountType: discountType,
        discount: discount,
        purchasePrice: purchasePrice,
        openingStock: openingStock,
        stockDate: stockDate,
        lowQuantity: lowQuantity,
        images: images,
        description: description,
      });

      await newProduct.save();

      await Category.findOneAndUpdate(
        { _id: categoryId },
        { $inc: { productsCount: 1 } },
        { new: true }
      );

      return res.status(200).send({
        message: messages.productAdded,
        product: {
          productId: newProduct._id,
          categoryId: newProduct.categoryId,
        },
      });
    }
  }
);

export { router as CreateProductRoute };
