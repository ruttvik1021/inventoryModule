import express, { Request, Response } from "express";
import { productApiEndPoints } from "../../constants/constants";
import { body, validationResult } from "express-validator";
import { messages, parameters } from "./constants";
import { ProductStock } from "../../modals/productStock";
import { TokenValidator } from "../../middlewares/token-handler";

const router = express.Router();

router.post(
  productApiEndPoints.getStockHistoryByProduct,
  TokenValidator,
  [
    body(parameters.fromDate).isDate().withMessage("Must be valid date"),
    body(parameters.toDate).isDate().withMessage("Must be valid date"),
  ],
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { fromDate, toDate } = req.body;
    const { userId, organizationId } = req.body.details;

    if (!id)
      return res.status(400).send({ message: messages.productDoesNotExist });

    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).send({ message: errors.array()[0].msg });

    const history = await ProductStock.find({
      $and: [
        { productId: id, userId: userId, organizationId: organizationId },
        {
          createdAt: {
            $gt: new Date(`${fromDate}T00:00:00.000Z`),
            $lt: new Date(`${toDate}T23:59:59.999Z`),
          },
        },
      ],
    }).sort({
      updatedAt: -1,
    });

    res.status(200).send({
      history,
    });
  }
);

export { router as GetStockHistoryByProductRoute };
