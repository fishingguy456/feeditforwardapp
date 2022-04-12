import "./Inventory.css";
import React, {useState, useEffect} from "react";
import Axios from "axios";

function Inventory(props) {
    const [itemName, setItemName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [barCode, setbarCode] = useState("");
    const [itemList, setItemList] = useState([]);
    const [newItemName, setNewItemName] = useState("");
    const [newQuantity, setNewQuantity] = useState(0);
    let result = props.results === "333" || props.results === "36663" ? "" : props.results;
    const port = process.env.PORT || 8080;
    
    useEffect(() => {
        Axios.get(`http://localhost:${port}/read`).then((response) => { //promise
            console.log(props.results);
            setbarCode(result);
            setItemList(response.data);
        });
    }, [props.results, result, port]);
    const addItem = () => {
        console.log(itemList);
        if(itemList.filter(e => e.barCode === barCode).length > 0 || itemList.filter(e => e.itemName === itemName).length > 0){
            alert("Item already exists");
            return;
        }
        Axios.post(`http://localhost:${port}/create`, {barCode: barCode, itemName: itemName, quantity: quantity,}).then(() => {
            Axios.get(`http://localhost:${port}/getLatestId`).then((response) => {
                setItemList(itemList.concat({_id: response.data[0]._id, barCode: barCode, itemName: itemName, quantity: quantity}));
                setItemName("");
                setQuantity("");
                setbarCode("");
            });
        });
        console.log("Item added to database");
    };
    const updateItem = (id, barCode) => {
        Axios.put(`http://localhost:${port}/update`, {_id: id, barCode: barCode, newItemName: newItemName, newQuantity: newQuantity,}).then(() => {
        setItemList(itemList.map((item) => {
            if (item._id === id) {
                item.barCode = barCode;
                item.itemName = newItemName;
                item.quantity = newQuantity;
            }
            return item;
        }));
        });
        console.log("Item updated in database");
    };
    const deleteItem = (id) => {
        Axios.delete(`http://localhost:${port}/delete/${id}`).then(() => {
        setItemList(itemList.filter((item) => item._id !== id));
        });
        console.log("Item deleted from database");
    };
    const downloadCSV = () => {
        const csv = itemList.map((item) => {
        return `"${item._id}","${item.barCode}","${item.itemName}","${item.quantity}"`;
        });
        const csvString = "ID,\"Barcode\",\"Item Name\",Quantity\n" + csv.join("\n");
        const a = document.createElement("a");
        a.href = "data:text/csv;charset=utf-8," + encodeURI(csvString);
        a.download = "inventory.csv";
        a.click();
        console.log("CSV Downloaded");
    };


    return (
        <div className="App">    
        <div className="form">
            <h1>Add an Item</h1>
            <label>Barcode:</label>
            <input type="text" name="barcode" value={barCode} onChange={(e) => {
                setbarCode(e.target.value);
            }} />
            <label>Item Name:</label>
            <input type="text" name="itemName" value={itemName} onChange={(event) => {
            setItemName(event.target.value);
            }}/>
            <label>Quantity:</label>
            <input type="number" name="quantity" value={quantity} onChange={(event) => {
            setQuantity(event.target.value);
            }}/>
            <button onClick={addItem}>Add Item</button>
        </div>
            <h1>Current Inventory</h1>
            <table>
                <thead>
                    <tr>
                    <th>Barcode</th>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    itemList.map((item, key) => {
                        return (
                        <tr key={key} className="listItem">
                            <td>{item.barCode}</td>
                            <td>{item.itemName}</td>
                            <td>{item.quantity}</td>
                            <td>
                            <input type="text" placeholder="Updated Item Name" style={{fontSize: "11px"}} onChange={(event) => {
                                setNewItemName(event.target.value);
                            }}/>
                            <input type="number" placeholder="Updated Quantity" style={{fontSize: "11px"}} onChange={(event) => {
                                setNewQuantity(event.target.value);
                            }}/>
                            <button onClick={() => updateItem(item._id, item.barCode)}>Update</button>
                            <button onClick={() => deleteItem(item._id, item.barCode)}>Delete</button>
                            </td>
                        </tr>
                        );
                    })
                    }
                </tbody>
            </table>
            <button onClick={() => downloadCSV()}>Download to CSV</button>
        </div>  
    );
}

export default Inventory;