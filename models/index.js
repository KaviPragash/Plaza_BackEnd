const ProductVariants = require("./productVariants");
const ProductVariantAttributes = require("./ProductVariantAttributes");

// Setup associations
ProductVariants.hasMany(ProductVariantAttributes, {
  foreignKey: "productVarient_code",
  as: "ProductVariantAttributes",
});
ProductVariantAttributes.belongsTo(ProductVariants, {
  foreignKey: "productVarient_code",
});