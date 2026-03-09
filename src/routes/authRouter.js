const express = require("express");
const bcrypt = require("bcrypt");
const { getDB } = require("../data/db");
const { encrypt } = require("../utils/crypto");

const router = express.Router();

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", async (req, res) => {
    const db = getDB();

    const hashed = await bcrypt.hash(req.body.password, 10);
    const encryptedAddress = encrypt(req.body.address);

    await db.collection("users").insertOne({
        username: req.body.username,
        password: hashed,
        role: req.body.role,
        address: encryptedAddress
    });

    res.redirect("/login");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", async (req, res) => {
    const db = getDB();

    const user = await db.collection("users")
        .findOne({ username: req.body.username });

    if (!user) return res.send("User not found");

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.send("Wrong password");

    req.session.user = user;
    res.redirect("/products");
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

module.exports = router;
