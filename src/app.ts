import express from "express";
import bodyParser from "body-parser";
import { CreateCategoryRoute } from "./routers/category/createCategory";
import cors from "cors";
import { GetAllCategoriesRoute } from "./routers/category/getAllCategory";
import mongoose from "mongoose";
import { DeleteCategoryByIdRoute } from "./routers/category/deleteCategory";
import { GetCategoryByIdRoute } from "./routers/category/getCategoryById";
import { UpdateCategoryByIdRoute } from "./routers/category/updateCategory";
import { CreateProductRoute } from "./routers/products/addProduct";
import { GetAllProductsRoute } from "./routers/products/getAllProducts";
import { GetProductByIdRoute } from "./routers/products/getProductById";
import { GetProductByCategoryRoute } from "./routers/products/getProductByCategory";
import { UpdateProductByIdRoute } from "./routers/products/updateProduct";
import { DeleteProductByIdRoute } from "./routers/products/deleteProduct";
import { AddStockRoute } from "./routers/productStocks/addProductStock";
import { RemoveStockRoute } from "./routers/productStocks/removeProductStock";
import { GetStockHistoryByProductRoute } from "./routers/productStocks/getStockHistoryByProduct";
const PORT = process.env.PORT || 3002;

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ limit: "1mb", extended: true }));
app.use(CreateCategoryRoute);
app.use(GetAllCategoriesRoute);
app.use(GetCategoryByIdRoute);
app.use(DeleteCategoryByIdRoute);
app.use(UpdateCategoryByIdRoute);

app.use(CreateProductRoute);
app.use(GetAllProductsRoute);
app.use(GetProductByIdRoute);
app.use(GetProductByCategoryRoute);
app.use(UpdateProductByIdRoute);
app.use(DeleteProductByIdRoute);
app.use(AddStockRoute);
app.use(RemoveStockRoute);

app.use(GetStockHistoryByProductRoute);

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://rkhollam21:Aad8JbZdn59A00lN@inventory.djfmbpy.mongodb.net/?retryWrites=true&w=majority"
    );
  } catch (error) {
    console.error(error);
  }
};

start();
