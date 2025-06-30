const ProductVariants = require("./productVariants");
const ProductVariantAttributes = require("./ProductVariantAttributes");

// Re-establish associations cleanly
ProductVariants.hasMany(ProductVariantAttributes, {
  foreignKey: "productVarient_code",
  as: "ProductVariantAttributes"
});

ProductVariantAttributes.belongsTo(ProductVariants, {
  foreignKey: "productVarient_code",
  targetKey: "productVarient_code"
});
