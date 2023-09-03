import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { categoryApiEndPoints } from "../../constants/constants";
import { TokenValidator } from "../../middlewares/token-handler";
import { Category } from "../../modals/category";
import { messages, parameters } from "./constants";
const router = express.Router();

router.post(
  categoryApiEndPoints.createCategory,
  [
    body(parameters.categoryName)
      .isString()
      .isLength({ max: 25 })
      .withMessage(messages.categoryNameNotValid),
  ],
  TokenValidator,
  async (req: Request, res: Response) => {
    const { categoryName } = req.body;
    const { organizationId, userId } = req.body.details;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0]?.msg });
    }

    const categoryExist = await Category.findOne({
      categoryName: categoryName,
      organizationId: organizationId,
      userId: userId,
    });

    if (categoryExist) {
      return res.status(404).send({ message: messages.categoryExist });
    }

    const newCategory = Category.build({
      categoryName: categoryName,
      organizationId: organizationId,
      userId: userId,
      productsCount: 0,
    });

    await newCategory.save();

    delete newCategory.__v;
    delete newCategory._id;
    delete newCategory.organizationId;
    delete newCategory.userId;

    res.status(201).send({ message: messages.categoryCreated, newCategory });
  }
);

export { router as CreateCategoryRoute };
