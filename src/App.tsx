import React, { useCallback, useEffect, useState } from "react";
import ROSLIB, { Ros } from "roslib";
import "./App.css";
import { Controller } from "./components/Controller";

function App() {
  const [ros, setRos] = useState<Ros | undefined>(undefined);

  useEffect(() => {
    const _ros = new ROSLIB.Ros({
      url: "ws://192.168.1.8:9090",
    });
    console.log("API called");

    _ros.on("connection", () => {
      setRos(_ros);
      console.log("Connected to ROSBridge WebSocket server.");
    });

    _ros.on("error", function (error: any) {
      console.log("Error connecting to ROSBridge WebSocket server: ", error);
    });

    _ros.on("close", function () {
      console.log("Connection to ROSBridge WebSocket server closed.");
      setRos(undefined);
    });
  }, []);

  const publishCmd = useCallback(() => {
    console.log(ros);
    if (!ros?.isConnected) {
      console.log("ros is undefined");
      return;
    }
    const cmdVel = new ROSLIB.Topic({
      ros,
      name: "/cmd_vel",
      messageType: "geometry_msgs/Twist",
    });
    const twist = new ROSLIB.Message({
      linear: {
        x: 2.0,
        y: 0,
        z: 0,
      },
      angular: {
        x: 0,
        y: 0,
        z: 0,
      },
    });
    cmdVel.publish(twist);
  }, [ros]);

  return (
    <div className="App">
      <header className="App-header">
        <Controller ros={ros}/>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button onClick={publishCmd}>Publish Cmd</button>
      </header>
    </div>
  );
}

export default App;
