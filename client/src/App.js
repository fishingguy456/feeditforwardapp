import "./App.css";
import React, {useState} from "react";

import Inventory from "./Inventory.js";
import Scan from "./Scan.js";

import logo from "./feeditforwardlogo.png";

var cur_screen;
var flag = 0;

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
      cur_screen = <Inventory results={data.results[0]["codeResult"]["code"]} />;
      // console.log(data.results[0]["codeResult"]["code"]);
      setScreen("inventory");
      flag = 1;
      data.results.pop();
    }
    else {
      flag = 0;
    }
  };
  
  if (screen === "scan" && flag === 0) {
    cur_screen = <Scan onChange={eventhandler} />;
  }
  else if (flag === 0) {
    console.log(flag);
    cur_screen = <Inventory results="333"/>;
  }

  const changeScreen = () => {
    if (screen === "scan") {
      cur_screen = <Inventory results="36663"/>;
      setScreen("inventory");
    }
    else {
      cur_screen = <Scan onChange={eventhandler} />;
      setScreen("scan");
    }
  }

  return (
    <div className="App">
      <div className="header">
        <h1>Stor-eat!: Feed it Forward Inventory Management System</h1>
        <img className="logo" src={logo} alt="Feed It Forward Logo" />
      </div>
      <button onClick={changeScreen}>Switch Scan</button>
      {cur_screen}
    </div>
  );
}

export default App;
