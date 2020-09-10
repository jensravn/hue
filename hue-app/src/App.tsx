import React, { useState, useEffect } from "react";
import "./App.css";

interface HueDevice {
  id: string;
  internalipaddress: string;
  link?: string;
  status?: Status;
}

enum Status {
  LOADING = "STATUS_LOADING",
  OK = "STATUS_OK",
  NOT_OK = "STATUS_NOT_OK",
}

function App() {
  const [devices, setDevices] = useState<HueDevice[]>([]);
  const [readyToTestLinks, setReadyToTestLinks] = useState(false);

  useEffect(() => {
    fetch("https://discovery.meethue.com/")
      .then((response) => response.json() as Promise<HueDevice[]>)
      .then((hueDevices) =>
        hueDevices.map((hueDevice: HueDevice) => ({
          ...hueDevice,
          link: `https://${hueDevice.internalipaddress}/debug/clip.html`,
          status: Status.LOADING,
        }))
      )
      .then((x) => {
        setDevices(x);
        setReadyToTestLinks(true);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                ...currentDevices.filter((x) => x.id !== device.id),
                device,
              ]);
            })
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyToTestLinks]);

  return (
    <div>
      <h1>Hue Devices</h1>
      <ul>
        {devices &&
          devices.map((x) => (
            <li>
              <p>
                <span>{x.id}</span>:{" "}
                <a target="blank" href={x.link}>
                  {x.link}
                </a>{" "}
                <span>{x.status}</span>
              </p>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default App;
