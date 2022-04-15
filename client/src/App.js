import "./App.css";
import React, {useState} from "react";

import Inventory from "./Inventory.js";
import Scan from "./Scan.js";
import Scan2 from "./Scan2.js";

import logo from "./images/feeditforwardlogo.png";

var cur_screen;
var flag = 0;
var item_barcode;
var site_barcode;

function App() {

  const [screen, setScreen] = useState("scan");
  /*
  let childRef = React.createRef();

  
  if ((childRef.current.results).length == 1) {
    console.log(childRef.current.results[(childRef.current.results).length-1]);
    cur_screen = <Inventory result={childRef.current.results[(childRef.current.results).length-1]} />
  }
  */
 
  const eventhandler = data => {
    if (data.results.length === 1) {
      setScreen("scan2");
      flag = 1;
      item_barcode = data.results[0]["codeResult"]["code"];
      data.results.pop();
      cur_screen = <Scan2 onChange={eventhandler2} />;
      // console.log(data.results[0]["codeResult"]["code"]);
    }
    else {
      flag = 0;
    }
  };
  const eventhandler2 = data => {
    if (data.results.length === 1) {
      site_barcode = data.results[0]["codeResult"]["code"];
      data.results.pop();
      flag = 1;
      setScreen("inventory");
      cur_screen = <Inventory results={[item_barcode, site_barcode]} />;
      //console.log(data.results[0]["codeResult"]);
      //console.log(data.results[1]["codeResult"]);
    }
  }
  
  if (screen === "scan" && flag === 0) {
    cur_screen = <Scan onChange={eventhandler} />;
  }
  else if (flag === 0) {
    cur_screen = <Inventory results="test"/>;
  }

  const changeScreen = () => {
    if (screen === "scan") {
      cur_screen = <Inventory results="36663"/>;
      setScreen("inventory");
    }
    else if (screen === "inventory") {
      cur_screen = <Scan onChange={eventhandler} />;
      setScreen("scan");
      flag = 0;
    }
  }

  return (
    <div className="App">
      <div className="header">
        <h1>Feed it Forward Inventory Management System</h1>
        <img className="logo" src={logo} alt="Feed It Forward Logo" />
      </div>
      <button onClick={changeScreen}>Switch Screen</button>
      {cur_screen}
    </div>
  );
}

export default App;
