import express, { Response, Request } from "express";
import { categoryApiEndPoints } from "../../constants/constants";
import { TokenValidator } from "../../middlewares/token-handler";
import { Category } from "../../modals/category";
import { messages } from "./constants";

const router = express.Router();

router.get(
  categoryApiEndPoints.getCategoryByID,
  TokenValidator,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const category = await Category.findOne({ _id: id });

    if (!category) {
      return res.status(400).send({ message: messages.categoryDoesNotExist });
    }

    const responseObject = {
      id: category._id,
      categoryName: category.categoryName,
    };

    res.status(200).send({ category: responseObject });
  }
);

export { router as GetCategoryByIdRoute };
