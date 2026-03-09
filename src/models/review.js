const { getDB } = require("../data/db");
const { ObjectId } = require("mongodb");

const reviewCollection = () => getDB().collection("reviews");

module.exports = {
    async create(reviewData) {
        reviewData.product = new ObjectId(reviewData.product);
        reviewData.client = new ObjectId(reviewData.client);
        return await reviewCollection().insertOne(reviewData);
    },

    async findAll() {
        return await reviewCollection().find({}).toArray();
    },

    async findByProduct(productId) {
        return await reviewCollection().find({ product: new ObjectId(productId) }).toArray();
    },

    async findByClient(clientId) {
        return await reviewCollection().find({ client: new ObjectId(clientId) }).toArray();
    },

    async update(id, reviewData) {
        return await reviewCollection().updateOne({ _id: new ObjectId(id) }, { $set: reviewData });
    },

    async delete(id) {
        return await reviewCollection().deleteOne({ _id: new ObjectId(id) });
    }
};