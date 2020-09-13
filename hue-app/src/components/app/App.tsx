import React, { useState, useEffect } from "react";
import { HueDevice, Status } from "../../types/HueDevice";
import Lights from "../lights/Lights";
import "./App.css";

function App() {
  const [devices, setDevices] = useState<HueDevice[]>([]);
  const [readyToTestLinks, setReadyToTestLinks] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<HueDevice>();

  useEffect(() => {
    fetch("https://discovery.meethue.com/")
      .then((response) => response.json() as Promise<HueDevice[]>)
      .then((hueDevices) => hueDevices.filter((hd) => hd.internalipaddress))
      .then((hueDevices) =>
        hueDevices.map((hd: HueDevice) => ({
          ...hd,
          link: `https://${hd.internalipaddress}/debug/clip.html`,
          status: Status.LOADING,
        }))
      )
      .then((x) => {
        setDevices(x);
        setReadyToTestLinks(true);
      });
  }, []);

  useEffect(() => {
    if (readyToTestLinks) {
      devices
        .filter((device) => device.status === Status.LOADING)
        .map((device) =>
          fetch(device.link as string)
            .then((response) =>
              response.ok
                ? { ...device, status: Status.OK }
                : { ...device, status: Status.NOT_OK }
            )
            .catch(() => ({ ...device, status: Status.NOT_OK }))
            .then((device) => {
              console.log(device.status);
              setDevices((currentDevices) => [
                device,
                ...currentDevices.filter((x) => x.id !== device.id),
              ]);
            })
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyToTestLinks]);

  const mapToColor = (status?: Status) => {
    switch (status) {
      case Status.LOADING: {
        return "grey";
      }
      case Status.OK: {
        return "green";
      }
      case Status.NOT_OK: {
        return "red";
      }
      default: {
        return "black";
      }
    }
  };

  return (
    <div>
      <h1>Hue Devices</h1>
      <ul>
        {devices &&
          devices.map((x) => (
            <li>
              <p style={{ color: mapToColor(x.status) }}>
                <span>{x.id}</span>:{" "}
                <a target="blank" href={x.link}>
                  {x.link}
                </a>{" "}
                <span>{x.status}</span>
                {x.status === Status.OK && (
                  <button onClick={() => setSelectedDevice(x)}>
                    Select Device
                  </button>
                )}
              </p>
            </li>
          ))}
      </ul>
      {selectedDevice && <Lights hueDevice={selectedDevice}></Lights>}
    </div>
  );
}

export default App;
