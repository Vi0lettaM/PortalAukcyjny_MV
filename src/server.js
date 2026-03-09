require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const { connectDB } = require("./data/db");

const app = express();

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
    res.redirect("/products");
});

app.use(require("./routes/authRouter"));
app.use(require("./routes/clientRouter"));
app.use("/seller", require("./routes/sellerRouter"));

app.listen(process.env.PORT, () =>
    console.log(`Server running on http://localhost:${process.env.PORT}`)
);