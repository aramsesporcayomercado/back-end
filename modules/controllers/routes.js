const { userRouter } = require("./person/PersonController");
const { productRouter } = require("./product/ProductController");
const { categoryRouter } = require("./category/CategoryController");
const { signRouter } = require("./auth/AuthController");
const { buyRouter } = require("./buy/BuyController");
const { worksShop } = require("./worksShop/WorkController");
module.exports = {
  userRouter,
  productRouter,
  categoryRouter,
  signRouter,
  buyRouter,
  worksShop,
};
