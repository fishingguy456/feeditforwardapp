import "./App.css";
import React, {useState, useEffect} from "react";
import Axios from "axios";

function App() {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [itemList, setItemList] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [newQuantity, setNewQuantity] = useState(0);
  
  useEffect(() => {
    Axios.get("http://localhost:3001/read").then((response) => { //promise
      setItemList(response.data);
    });
  }, []);
  const addItem = () => {
    Axios.post("http://localhost:3001/create", {itemName: itemName, quantity: quantity,}).then(() => {
      Axios.get("http://localhost:3001/getLatestId").then((response) => {
        setItemList(itemList.concat({_id: response.data[0]._id, itemName: itemName, quantity: quantity}));
        setItemName("");
        setQuantity("");
      });
    });
    console.log("Item added to database");
  };
  const updateItem = (id) => {
    Axios.put("http://localhost:3001/update", {_id: id, newItemName: newItemName, newQuantity: newQuantity,}).then(() => {
      setItemList(itemList.map((item) => {
        if (item._id === id) {
          item.itemName = newItemName;
          item.quantity = newQuantity;
        }
        return item;
      }));
    });
    console.log("Item updated in database");
  };
  const deleteItem = (id) => {
    Axios.delete(`http://localhost:3001/delete/${id}`).then(() => {
      setItemList(itemList.filter((item) => item._id !== id));
    });
    console.log("Item deleted from database");
  };
  const downloadCSV = () => {
    const csv = itemList.map((item) => {
      return `${item._id},${item.itemName},${item.quantity}`;
    });
    const csvString = "ID,\"Item Name\",Quantity\n" + csv.join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURI(csvString);
    a.download = "inventory.csv";
    a.click();
    console.log("CSV Downloaded");
  };
  return (
    <div className="App">
      <h1>Inventory Management Application</h1>

      <div className="form">
        <h1>Add an Item</h1>
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
                    <td>{item.itemName}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <input type="text" placeholder="Updated Item Name" onChange={(event) => {
                        setNewItemName(event.target.value);
                      }}/>
                      <input type="number" placeholder="Updated Quantity" onChange={(event) => {
                        setNewQuantity(event.target.value);
                      }}/>
                      <button onClick={() => updateItem(item._id)}>Update</button>
                      <button onClick={() => deleteItem(item._id)}>Delete</button>
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

export default App;
