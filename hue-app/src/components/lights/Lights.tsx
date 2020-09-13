import React, { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import { USER_NAME } from "../../Constants";
import { HueDevice } from "../../types/HueDevice";

interface Props {
  hueDevice: HueDevice;
}

const Lights: React.FC<Props> = (props) => {
  const { hueDevice } = props;
  const [lights, setLights] = useState<any>();

  const lightsUrl = `https://${hueDevice.internalipaddress}/api/${USER_NAME}/lights`;
  useEffect(() => {
    fetch(lightsUrl)
      .then((response) => response.json())
      .then((string) => setLights(string));
  }, [hueDevice.internalipaddress, lightsUrl]);

  const on = (lightNumber: string) => {
    fetch(`${lightsUrl}/${lightNumber}/state`, {
      body: '{ "on": true }',
      method: "PUT",
    });
  };

  return (
    <>
      <ul>
        {lights &&
          Object.entries(lights).map(([k, v]) => (
            <li>
              {(v as any).name} <button onClick={() => on(k)}>ON</button>
            </li>
          ))}
      </ul>
      {}
      <ReactJson src={lights} />
    </>
  );
};

export default Lights;
