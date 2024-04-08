import { Server } from "node-osc";
import { OSCQAccess, OSCQueryServer } from "oscquery";
import config from "../config";
import { OscMessageArgs, OscMessageType } from "./client";

// @ts-ignore
const server = new Server(config.listen.toString(), "0.0.0.0", () => {
  if (config.verbose)
    console.log(`Listening for OSC messages on ${config.listen}`);
});

const query = new OSCQueryServer({
  serviceName: "VRCOSC",
  oscPort: config.listen,
  httpPort: config.listen + 1,
});
query.addMethod("/avatar", {
  description: "Change avatar",
  access: OSCQAccess.READWRITE,
});

query.start();

export const OscIncMessageArgs: Record<
  OscMessageType,
  OscMessageArgs[OscMessageType]
> = {
  [OscMessageType.ChatboxInput]: {
    message: "",
    instant: false,
    notification: false,
  },
  [OscMessageType.ChatboxTyping]: {
    typing: false,
  },
  [OscMessageType.AvatarChange]: {
    avatarId: "",
  },
  [OscMessageType.AvatarParameters]: {
    parameter: "",
    value: 0,
  },
};

server.on("message", (data) => {
  let address = data[0];
  let params = data.slice(1);

  if (config.debug) {
    console.log(`Received message: ${address}`);
  }

  // Special parsing for avatar parameters
  if (address.startsWith(OscMessageType.AvatarParameters)) {
    const value = params.pop();
    const parameter = address.replace(
      `${OscMessageType.AvatarParameters}/`,
      ""
    );
    address = OscMessageType.AvatarParameters;
    params = [parameter || "", value || 0];
  }

  // @ts-ignore Indexing by string
  if (!OscIncMessageArgs[address]) {
    if (config.verbose) console.error(`Unknown OSC message: ${address}`);
    return;
  }

  const parsedParams = params.reduce((acc, param, i) => {
    // @ts-ignore Indexing by string
    acc[Object.keys(OscIncMessageArgs[address])[i]] = param;
    return acc;
  }, {} as OscMessageArgs[OscMessageType]);

  if (config.debug) console.log(address, parsedParams);

  server.emit(address as OscMessageType, parsedParams);
});

export default server;
