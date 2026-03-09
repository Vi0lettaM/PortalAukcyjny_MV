const express = require("express");
const { getDB } = require("../data/db");
const { ObjectId } = require("mongodb");
const { isLogged } = require("../middleware/auth");
const { isClient } = require("../middleware/role");
const Product = require("../models/product");
const Review = require("../models/review");
const Order = require("../models/order");

const router = express.Router();

router.get("/products", async (req, res) => {
    const db = getDB();
    const { search, sort } = req.query;
    let query = {};
    if (search) query.title = { $regex: search, $options: "i" };
    let products = await db.collection("products").find(query).toArray();
    if (sort === "priceAsc") products.sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") products.sort((a, b) => b.price - a.price);
    res.render("products", { products, user: req.session.user });
});

router.get("/products/:id", async (req, res) => {
    const product = await Product.findById(req.params.id);
    const reviews = await Review.findByProduct(req.params.id);
    res.render("productDetails", { product, reviews });
});

router.post("/cart/add/:id", isLogged, isClient, (req, res) => {
    if (!req.session.cart) req.session.cart = [];
    req.session.cart.push(req.params.id);
    res.redirect("/cart");
});

router.post("/cart/remove/:id", isLogged, isClient, (req, res) => {
    if (req.session.cart) {
        req.session.cart = req.session.cart.filter(pid => pid !== req.params.id);
    }
    res.redirect("/cart");
});

router.get("/cart", isLogged, isClient, async (req, res) => {
    const db = getDB();
    const products = req.session.cart
        ? await db.collection("products").find({ _id: { $in: req.session.cart.map(id => new ObjectId(id)) } }).toArray()
        : [];
    res.render("cart", { products });
});

router.post("/order", isLogged, isClient, async (req, res) => {
    if (!req.session.cart || req.session.cart.length === 0) return res.redirect("/cart");
    await Order.create({
        client: req.session.user._id,
        products: req.session.cart
    });
    req.session.cart = [];
    res.redirect("/products");
});

router.post("/review/:id", isLogged, isClient, async (req, res) => {
    await Review.create({
        product: req.params.id,
        client: req.session.user._id,
        comment: req.body.comment,
        stars: Number(req.body.stars)
    });
    res.redirect("/products/" + req.params.id);
});

module.exports = router;