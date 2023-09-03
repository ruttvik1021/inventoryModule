import express, { Response, Request } from "express";
import { categoryApiEndPoints } from "../../constants/constants";
import { TokenValidator } from "../../middlewares/token-handler";
import { Category } from "../../modals/category";
import { messages } from "./constants";
import { Product } from "../../modals/products";

const router = express.Router();

router.delete(
  categoryApiEndPoints.deleteCategory,
  TokenValidator,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const category = await Category.findById({ _id: id });

    if (!category) {
      return res.status(400).send({ message: messages.categoryDoesNotExist });
    }

    const productsInCategory = await Product.find({ categoryId: category._id });

    if (category && !productsInCategory.length) {
      await Category.findByIdAndDelete({ _id: id });
    } else {
      return res.status(404).send({ message: "Category Have products" });
    }

    res.status(200).send({ message: messages.categoryDeleted });
  }
);

export { router as DeleteCategoryByIdRoute };
