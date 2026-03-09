const { getDB } = require("../data/db");
const { ObjectId } = require("mongodb");

const orderCollection = () => getDB().collection("orders");

module.exports = {
    async create(orderData) {
        orderData.client = new ObjectId(orderData.client);
        orderData.products = orderData.products.map(id => new ObjectId(id));
        orderData.date = new Date();
        return await orderCollection().insertOne(orderData);
    },

    async findAll() {
        return await orderCollection().find({}).toArray();
    },

    async findByClient(clientId) {
        return await orderCollection().find({ client: new ObjectId(clientId) }).toArray();
    },

    async findOrdersBySeller(sellerId) {
        const db = getDB();
        const products = await db.collection("products").find({ seller: new ObjectId(sellerId) }).toArray();
        const productIds = products.map(p => p._id);
        return await orderCollection().find({ products: { $in: productIds } }).toArray();
    },

    async delete(id) {
        return await orderCollection().deleteOne({ _id: new ObjectId(id) });
    }
};