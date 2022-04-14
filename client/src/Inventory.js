import "./Inventory.css";
import React, {useState, useEffect} from "react";
import Axios from "axios";

function Inventory(props) {
    const [itemName, setItemName] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [barCode, setbarCode] = useState("");
    const [site, setSite] = useState(0);
    const [itemList, setItemList] = useState([]);
    // const [newItemName, setNewItemName] = useState("");
    const [newQuantity, setNewQuantity] = useState(0);
    let result = props.results === "333" || props.results === "36663" ? "" : props.results;
    const port = process.env.PORT || 8080;
    
    useEffect(() => {
        Axios.get(`/read`).then((response) => { //promise
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
        Axios.post(`/create`, {barCode: barCode, site: site, itemName: itemName, quantity: quantity,}).then(() => {
            Axios.get(`/getLatestId`).then((response) => {
                setItemList(itemList.concat({_id: response.data[0]._id, barCode: barCode, site: site, itemName: itemName, quantity: quantity}));
                setSite(0);
                setItemName("");
                setQuantity(0);
                setbarCode("");
            });
        });
        console.log("Item added to database");
    };
    const updateItem = (id, barCode, site) => {
        if(!newQuantity){
            alert("Please enter a valid new quantity");
            return;
        }
        if(window.confirm(`Are you sure you want to update this item to\nQuantity:${newQuantity}?`)){
            Axios.put(`/update`, {_id: id, newQuantity: newQuantity,}).then(() => {
            setItemList(itemList.map((item) => {
                if (item._id === id) {
                    // item.barCode = barCode;
                    // item.site = site;
                    // item.itemName = newItemName;
                    item.quantity = newQuantity;
                }
                return item;
            }));
            });
            console.log("Item updated in database");
        }
    };
    const deleteItem = (id) => {
        if(window.confirm("Are you sure you want to delete this item?")){
            Axios.delete(`/delete/${id}`).then(() => {
            setItemList(itemList.filter((item) => item._id !== id));
            });
            console.log("Item deleted from database");
        }
    };
    const downloadCSV = () => {
        const csv = itemList.map((item) => {
        return `"${item._id}","${item.barCode}","${item.site}","${item.itemName}","${item.quantity}"`;
        });
        const csvString = "ID,\"Barcode\",\"Site\",\"Item Name\",Quantity\n" + csv.join("\n");
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
            <label>Site:</label>
            <input type="number" name="site" value={site} onChange={(e) => {
                setSite(e.target.value);
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
                    <th>Barcode and Site</th>
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
                            <td>{item.barCode}<br></br>(Site {item.site})</td>
                            <td>{item.itemName}</td>
                            <td>{item.quantity}</td>
                            <td>
                            {/* <input type="text" placeholder="Updated Item Name" style={{fontSize: "11px"}} onChange={(event) => {
                                setNewItemName(event.target.value);
                            }}/> */}
                            <input type="number" placeholder="Updated Quantity" style={{fontSize: "11px"}} onChange={(event) => {
                                setNewQuantity(event.target.value);
                            }}/>
                            <button onClick={() => updateItem(item._id, item.barCode)}>Update</button>
                            <button id="delete" onClick={() => deleteItem(item._id, item.barCode)}>Delete</button>
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