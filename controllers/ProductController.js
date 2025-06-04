const Products = require("../models/products");
const Shops = require("../models/shops");
const ProductVariants = require("../models/productVariants");
const StockBatches = require("../models/StockBatches");
const MainCategory = require("../models/MainCategory");
const SubCategory = require("../models/SubCategory");

exports.AddProducts = async (req,res) => {
    try{
        const {shop_id,product_name, mCategory_code, sCategory_code, product_description, image_url} = req.body;

        if (!product_name) {
            return res.status(400).json({message: "Product name not found"});
        }

        const ShopIdExites = shop_id ? await Shops.findByPk(shop_id): null;
        if (shop_id && !ShopIdExites){
            return res.status(400)({message: "Invalid Shop ID"})
        }

        const mCategoryExites = mCategory_code ? await MainCategory.findByPk(mCategory_code): null;
        if (mCategory_code && !mCategoryExites){
            return res.status(400)({message: "Invalid MainCategory ID"})
        }

        const sCategoryExites = sCategory_code ? await SubCategory.findByPk(sCategory_code): null;
        if (sCategory_code && !sCategoryExites){
            return res.status(400)({message: "Invalid MainCategory ID"})
        }

        await Products.create({
            shop_id,
            product_name,
            mCategory_code,
            sCategory_code,
            product_description,
            image_url
        });

        res.status(200).json({Message: "Product Added Successfully"})
    }
    catch(error){
        res.status(500).json({message: "Internal server Error", error: error.message})
    }
};

exports.AddProductsVariants = async (req,res) => {
    try{
        const {product_code,
            size, 
            selling_price,
            barcode
            } = req.body;

        if (!product_code || !selling_price) {
            return res.status(400).json({message: "product code and price are required"})
        }
            
        const product_codeExites = product_code ? await Products.findByPk(product_code): null;

        if (product_code && !product_codeExites){
            return res.status(400).json({message: "Invalid Product ID"})
        }

        await ProductVariants.create({
            product_code,
            size, 
            barcode,
            selling_price
        });

        res.status(200).json({Message: "Product Varient Added Successfully"})
    }
    catch(error){
        res.status(500).json({message: "internal Server Error", error: error.message})
    }
}

exports.AddStockBatches = async(req, res) => {
    try{
        const {variant_id, quantity, quantityType, base_price, received_at} = req.body;

        if (!variant_id) {
            res.status(400).json({message: "Product varient not found"})
        }

        const product_VarientExites = variant_id ? await ProductVariants.findByPk(variant_id): null;

        if (variant_id && !product_VarientExites){
            return res.status(400).json({message: "Invalid Product varient ID" })
        }

        await StockBatches.create({
            variant_id,
            quantity,
            quantityType,
            base_price,
            received_at
        })

        return res.status(200).json({message: "Stock Added Successfully"})
    }
    catch(error){
       return res.status(500).json({message: "internal Server Error", Error: error.message})
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await ProductVariants.findAll({
            attributes: ["productVarient_code", "product_code", "barcode", "size", "selling_price", "discount_percentage", 
                "is_discount_active","discount_sellingPrice"],
            include: [
                {
                    model: Products,
                    attributes: [
                        "shop_id",
                        "product_name",
                        "mCategory_code",
                        "sCategory_code",
                        "product_description",
                        "image_url"
                    ]
                },
                {
                    model: StockBatches,
                    attributes: ["variant_id", "quantity", "quantityType"]
                }
            ]
        });

        const formattedProducts = products.map((variant) => {
            const totalQuantity = variant.StockBatches.reduce((sum, batch) => sum + batch.quantity, 0);
            const quantityType = variant.StockBatches[0]?.quantityType || null;

            return {
                product_code: variant.product_code,
                productVarient_code: variant.productVarient_code,
                product_name: variant.Product.product_name,
                size: variant.size,
                barcode: variant.barcode,
                shop_id: variant.Product.shop_id,
                mCategory_code: variant.Product.mCategory_code,
                sCategory_code: variant.Product.sCategory_code,
                product_description: variant.Product.product_description,
                image_url: variant.Product.image_url,
                selling_price: variant.selling_price,
                total_quantity: totalQuantity,
                quantity_type: quantityType,
                discount_percentage: variant.discount_percentage,
                is_discount_active: variant.is_discount_active,
                discountSellingPrice: variant.discount_sellingPrice,
            };
        });

        return res.status(200).json({
            message: "Product details retrieved successfully",
            formattedProducts
        });
    } catch (error) {
        console.error("getAllProducts Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

exports.GetProductbyBarcode = async(req, res) => {
    try {
        const { barcode } = req.params;
    
        const product = await ProductVariants.findOne({
            where: { barcode },
            attributes: ["productVarient_code", "product_code", "barcode", "size", "selling_price","discount_percentage", 
                "is_discount_active","discount_sellingPrice"],
            include: [
                {
                    model: Products,
                    attributes: [
                        "shop_id",
                        "product_name",
                        "mCategory_code",
                        "sCategory_code",
                        "product_description",
                        "image_url"
                    ]
                },
                {
                    model: StockBatches,
                    attributes: ["variant_id", "quantity", "quantityType"]
                }
            ]
        });
    
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
    
        const totalQuantity = product.StockBatches?.reduce((sum, batch) => sum + batch.quantity, 0) || 0;
        const quantityType = product.StockBatches?.[0]?.quantityType || null;
    
        const formattedProduct = {
            product_code: product.product_code,
            productVarient_code: product.productVarient_code,
            product_name: product.Product?.product_name,
            size: product.size,
            barcode: product.barcode,
            shop_id: product.Product?.shop_id,
            mCategory_code: product.Product?.mCategory_code,
            sCategory_code: product.Product?.sCategory_code,
            product_description: product.Product?.product_description,
            image_url: product.Product?.image_url,
            selling_price: product.selling_price,
            total_quantity: totalQuantity,
            quantity_type: quantityType,
            discount_percentage: product.discount_percentage,
            is_discount_active: product.is_discount_active,
            discountSellingPrice: product.discount_sellingPrice,
        };
    
        return res.status(200).json({
            message: "Product details retrieved successfully",
            product: formattedProduct
        });
    
    }
    catch(error){
        res.status(500).json({message: "Internal Server Error", error: error.message})
    }
}

exports.UpdateProductVarient = async(req, res) => {
    try{
        const {productVarient_code, product_code, barcode, size, selling_price} = req.body;

        if (!productVarient_code){
            return res.status(400).json({message: "Product Varient ID not found"})
        }

        const UpdateProductVarient = await ProductVariants.findOne({where: {productVarient_code: productVarient_code}})

        if (!UpdateProductVarient){
            return res.status(400).json({message: "product varient not available"})
        }

        await UpdateProductVarient.update({
            product_code,
            barcode,
            size,
            selling_price
        });

        return res.status(200).json({message: "Product varient Updated Successfully"});
    }
    catch(error){
        res.status(500).json({message: "internal Server Error", error: error.message})
    }
}

exports.updateProducts = async(req, res) => {
    try{
        const {product_code, 
            shop_id, 
            product_name, 
            mCategory_code, 
            sCategory_code, 
            product_description, 
            image_url
        } = req.body

        if (!product_code){
            return res.status(400).json({message: "Product code not Available"})
        }

        const UpdateProduct = await Products.findByPk(product_code)

        if (!UpdateProduct) {
            return res.status(400).json({message: "Product not available"})
        }

        await UpdateProduct.update({
            shop_id, 
            product_name, 
            mCategory_code, 
            sCategory_code, 
            product_description, 
            image_url
        });

        return res.status(200).json({message: "Products Updated Successfully"});
    }
    catch(error){
        res.status(500).json({message: "Internal Server Error", error: error.message})
    }
};

exports.AddDiscount = async (req, res) => {
    try {
        const { variant_id, discount_percentage, is_discount_active } = req.body;

        if (!variant_id) {
            return res.status(404).json({ message: "Product variant ID not found" });
        }

        const productVariant = await ProductVariants.findOne({
            where: { productVarient_code: variant_id },
            attributes: ["productVarient_code","selling_price"]
        });

        if (!productVariant) {
            return res.status(404).json({ message: "Product variant not found" });
        }

        const discountAmount = productVariant.selling_price * (discount_percentage / 100);
        const discountSellingPrice = productVariant.selling_price - discountAmount;

        await productVariant.update({
            discount_percentage,
            is_discount_active,
            discount_sellingPrice: discountSellingPrice
        });

        return res.status(200).json({ message: "Discount added successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.ActivateDiscount = async (req, res) => {
    try {
        const { variant_id, is_discount_active } = req.body;

        if (!variant_id) {
            return res.status(404).json({ message: "Product variant ID is required" });
        }

        const productVariant = await ProductVariants.findOne({
            where: { productVarient_code: variant_id }
        });

        if (!productVariant) {
            return res.status(404).json({ message: "Product variant not found" });
        }

        await productVariant.update({
            is_discount_active
        });

        return res.status(200).json({
            message: `Discount has been ${is_discount_active ? "activated" : "deactivated"} successfully`
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};




