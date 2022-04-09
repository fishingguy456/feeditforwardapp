const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
});

const Inventory = mongoose.model("itemData", InventorySchema);
module.exports = Inventory;