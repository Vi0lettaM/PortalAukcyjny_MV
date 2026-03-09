const { getDB } = require("../data/db");

const userCollection = () => getDB().collection("users");

module.exports = {
    async create(userData) {
        return await userCollection().insertOne(userData);
    },

    async findByEmail(email) {
        return await userCollection().findOne({ email });
    },

    async findById(id) {
        const { ObjectId } = require("mongodb");
        return await userCollection().findOne({ _id: new ObjectId(id) });
    },

    async update(id, userData) {
        const { ObjectId } = require("mongodb");
        return await userCollection().updateOne({ _id: new ObjectId(id) }, { $set: userData });
    },

    async delete(id) {
        const { ObjectId } = require("mongodb");
        return await userCollection().deleteOne({ _id: new ObjectId(id) });
    }
};
