const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.CRYPTO_SECRET);
const iv = Buffer.alloc(16, 0);

exports.encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
};
