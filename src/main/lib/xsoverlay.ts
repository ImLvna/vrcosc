import config from "../config";

let ws = makeWebsocket();

function makeWebsocket() {
  if (!config.modules.xsOverlay.enabled) return;
  const newWs = new WebSocket(
    `ws://localhost:${config.modules.xsOverlay.port}/?client=Lillith%20OSC`
  );
  newWs.onopen = () => {
    console.log("xsOverlay connected");
  };
  newWs.onclose = () => {
    console.log("xsOverlay disconnected");
    ws = makeWebsocket();
  };
  return newWs;
}

const baseData = {
  sender: "Lillith OSC",
  target: "xsoverlay",
};

export function sendNotification(title: string, message: string) {
  if (!ws) return;
  ws.send(
    JSON.stringify({
      ...baseData,
      command: "SendNotification",
      type: 1,
      title,
      content: message,
    })
  );
}
