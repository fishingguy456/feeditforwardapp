const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const InventoryModel = require("./models/inventory");
const app = express();

const path = require("path");
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

const uri = process.env.MONGODB_URI || "mongodb+srv://test:test@inventory.vjf7p.mongodb.net/inventory?retryWrites=true&w=majority";

console.log(uri);

mongoose.connect(uri, {
    useNewUrlParser: true,
});

app.post("/create", async(req, res) => {

    const itemName = req.body.itemName;
    const quantity = req.body.quantity;
    const barCode = req.body.barCode;
    const site = req.body.site;

    const item = new InventoryModel({
        barCode: barCode,
        site: site,
        itemName: itemName,
        quantity: quantity,
    });
    try{
        await item.save();
        res.send("Data saved to database");
    } catch(err){
        console.log(err);
    }
});

app.get("/read", async(req, res) => {
    InventoryModel.find({}, (err, result) => {
        if(err){
            res.send(err);
        } else {
            res.send(result);
        }
    })
});

app.put("/update", async(req, res) => {
    const id = req.body._id;
    // const newItemName = req.body.newItemName;
    const newQuantity = req.body.newQuantity;

    try{
        await InventoryModel.findByIdAndUpdate(id, {quantity: newQuantity});
        res.send("Item updated");
    } catch(err){
        console.log(err);
    }
});

app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;

    try{
        await InventoryModel.findByIdAndDelete(id);
        res.send("Item deleted");
    } catch(err){
        console.log(err);
    }
});

app.get("/getLatestId", async (req, res) => {
    InventoryModel.find().sort({_id: -1}).limit(1).exec((err, result) => {
        if(err){
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

app.use(express.static(path.join(__dirname, "client", "build")));
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
// });
console.log(process.env.API_URL);
app.listen(port, (err) => {
    if(err) return console.log(err);
    console.log(`Server is listening on port ${port}`);
});
