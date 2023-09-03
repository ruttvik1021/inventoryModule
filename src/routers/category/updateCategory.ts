import express, { Response, Request } from "express";
import { categoryApiEndPoints } from "../../constants/constants";
import { TokenValidator } from "../../middlewares/token-handler";
import { Category } from "../../modals/category";
import { messages, parameters } from "./constants";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.put(
  categoryApiEndPoints.updateCategory,
  [
    body(parameters.categoryName)
      .isString()
      .notEmpty()
      .withMessage(messages.categoryNameRequired),
  ],
  TokenValidator,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ message: errors.array()[0].msg });
    }
    const { categoryName, id } = req.body;

    const category = await Category.findOneAndUpdate(
      { _id: id },
      { categoryName },
      { returnOriginal: false }
    );

    if (!category) {
      return res.status(400).send({ message: messages.categoryDoesNotExist });
    }

    const responseObject = {
      id: category._id,
      categoryName: category.categoryName,
    };

    res
      .status(200)
      .send({ message: messages.categoryUpdated, category: responseObject });
  }
);

export { router as UpdateCategoryByIdRoute };
