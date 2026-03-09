const { getDB } = require("../data/db");
const { ObjectId } = require("mongodb");

const productCollection = () => getDB().collection("products");

module.exports = {
    async create(productData) {
        return await productCollection().insertOne(productData);
    },

    async findAll() {
        return await productCollection().find({}).toArray();
    },

    async findById(id) {
        return await productCollection().findOne({ _id: new ObjectId(id) });
    },

    async findBySeller(sellerId) {
        return await productCollection().find({ seller: new ObjectId(sellerId) }).toArray();
    },

    async update(id, productData) {
        return await productCollection().updateOne({ _id: new ObjectId(id) }, { $set: productData });
    },

    async delete(id) {
        return await productCollection().deleteOne({ _id: new ObjectId(id) });
    }
};