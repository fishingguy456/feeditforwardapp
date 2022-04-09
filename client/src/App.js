import "./App.css";
import React, {useState, useEffect} from "react";

import Inventory from "./Inventory.js";
import Scan from "./Scan.js";

function App() {

  const [screen, setScreen] = useState("scan");
  /*
  let childRef = React.createRef();

  
  if ((childRef.current.results).length == 1) {
    console.log(childRef.current.results[(childRef.current.results).length-1]);
    cur_screen = <Inventory result={childRef.current.results[(childRef.current.results).length-1]} />
  }
  */
 
  let cur_screen;
  let flag = 0;
  const eventhandler = data => {
    if (data.results.length == 1) {
      cur_screen = <Inventory result={data.results[0]["codeResult"]["code"]} />;
      setScreen("inventory");
      flag = 1;
      data.results.pop();
    }
    else {
      flag = 0;
    }
  };
  
  if (screen === "scan" && flag == 0) {
    cur_screen = <Scan onChange={eventhandler} />;
  }
  else if (flag == 0) {
    cur_screen = <Inventory />;
  }

  const changeScreen = () => {
    if (screen === "scan") {
      cur_screen = <Inventory />;
      setScreen("inventory");
    }
    else {
      cur_screen = <Scan />;
      setScreen("scan");
    }
  }

  return (
    <div>
      <button onClick={changeScreen}>Switch Scan</button>
      {cur_screen}
    </div>
  );
}

export default App;
