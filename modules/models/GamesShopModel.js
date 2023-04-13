const { Schema, model } = require("mongoose");

const gameShopSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    category: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);
gameShopSchema.index({ name: 1 }, { unique: true });

module.exports = model("TallerGame", gameShopSchema);
