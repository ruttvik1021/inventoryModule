export const descriptionLimit = {
  max: 255,
};

export const parameters = {
  productName: "productName",
  categoryId: "categoryId",
  newCategory: "newCategory",
  newCategoryName: "newCategoryName",
  price: "price",
  discountType: "discountType",
  discount: "discount",
  purchasePrice: "purchasePrice",
  openingStock: "openingStock",
  stockDate: "stockDate",
  notifyWhenLow: "notifyWhenLow",
  lowQuantity: "lowQuantity",
  images: "images",
  description: "description",
};

export const messages = {
  productDescriptionLimit: `Product description limit exceeds ${descriptionLimit.max}`,
  productNameRequired: "Product name required",
  categoryRequired: "Category required",
  invalidPrice: "Invalid price",
  invalidPurchasePrice: "Invalid purchase price",
  invalidDiscount: "Invalid discount",
  invalidDiscountType: "Invalid discount type",
  categoryMustNotBeSelected: "Category must not be selected",
  newCategoryNameRequired: "New category name required",
  invalidOpeningStock: "Invalid opening stock",
  invalidLowStock: "Invalid low stock",
  invalidDate: "Invalid date",
  invalidId: "Invalid id",
  productIdNotPresent: "Product Id not present",
  categoryIdNotPresent: "Category Id not present",

  productDoesNotExist: "Product does not exist",
  productAdded: "Product added",
  productDeleted: "Product deleted",
  productUpdated: "Product updated",
  categoryDoesNotExist: "Category does not exist",

  categoryExist: "Category exist",
  productWithinCategoryExist: "Product already in the category",
};
