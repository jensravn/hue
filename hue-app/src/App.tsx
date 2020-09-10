import React, { useState } from "react";
import "./App.css";

interface HueDevice {
  id: string;
  internalipaddress: string;
}

interface HueDeviceWithLink extends HueDevice {
  link: string;
}

function App() {
  const [json, setJson] = useState<HueDeviceWithLink[]>([]);
  fetch("https://discovery.meethue.com/")
    .then((x) => x.json())
    .then((x) =>
      x.map((x: HueDeviceWithLink) => ({
        ...x,
        link: `https://${x.internalipaddress}/debug/clip.html`,
      }))
    )
    .then((x) => setJson(x));

  return (
    <div>
      <h1>Hue Devices</h1>
      <ul>
        {json &&
          json.map((x) => (
            <li>
              <p>
                <span>{x.id}</span>: <a href={x.link}>{x.link}</a>
              </p>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default App;
