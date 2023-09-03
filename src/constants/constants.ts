export const JWT_KEY = "UnV0dHZpazEwMjE=";

export const categoryApiEndPoints = {
  createCategory: "/api/create/category",
  getAllCategories: "/api/getAll/category",
  updateCategory: "/api/update/category",
  deleteCategory: "/api/delete/category/:id",
  getCategoryByID: "/api/getCategory/:id",
};

export const productApiEndPoints = {
  addProduct: "/api/add/product",
  updateProduct: "/api/update/product/:id",
  getAllProducts: "/api/getAll/Products",
  getProductByID: "/api/getProduct/:id",
  getProductByCategory: "/api/getProduct/category/:id",
  deleteProduct: "/api/delete/product/:id",
};

export const baseUrls = {
  authModule: "http://localhost:3001",
  inventoryModule: "http://localhost:3002",
};
