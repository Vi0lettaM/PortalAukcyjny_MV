const express = require("express");
const { isLogged } = require("../middleware/auth");
const { isSeller } = require("../middleware/role");
const Product = require("../models/product");
const Order = require("../models/order");
const Review = require("../models/review");

const router = express.Router();

router.get("/add-product", isLogged, isSeller, (req, res) => {
    res.render("addProduct");
});
router.post("/add-product", isLogged, isSeller, async (req, res) => {
    await Product.create({
        title: req.body.title,
        description: req.body.description,
        price: Number(req.body.price),
        seller: req.session.user._id
    });
    res.redirect("/seller/products");
});

router.get("/products", isLogged, isSeller, async (req, res) => {
    const products = await Product.findBySeller(req.session.user._id);
    res.render("sellerProducts", { products });
});

router.get("/products/edit/:id", isLogged, isSeller, async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product || product.seller.toString() !== req.session.user._id) return res.send("Brak dostępu");
    res.render("editProduct", { product });
});
router.post("/products/edit/:id", isLogged, isSeller, async (req, res) => {
    await Product.update(req.params.id, {
        title: req.body.title,
        description: req.body.description,
        price: Number(req.body.price)
    });
    res.redirect("/seller/products");
});

router.post("/products/delete/:id", isLogged, isSeller, async (req, res) => {
    await Product.delete(req.params.id);
    res.redirect("/seller/products");
});

router.get("/orders", isLogged, isSeller, async (req, res) => {
    const orders = await Order.findOrdersBySeller(req.session.user._id);
    res.render("sellerOrders", { orders });
});

router.get("/reviews", isLogged, isSeller, async (req, res) => {
    const products = await Product.findBySeller(req.session.user._id);
    const productIds = products.map(p => p._id.toString());
    const allReviews = await Review.findAll();
    const reviews = allReviews.filter(r => productIds.includes(r.product.toString()));
    res.render("sellerReviews", { reviews });
});

module.exports = router;