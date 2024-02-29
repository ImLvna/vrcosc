import { Server } from "node-osc";
import config from "../config";
import { OscMessageArgs, OscMessageType } from "./client";

const server = new Server(config.listen, "127.0.0.1");

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
      "",
    );
    address = OscMessageType.AvatarParameters;
    params = [parameter || "", value || 0];
  }

  // @ts-ignore Indexing by string
  if (!OscIncMessageArgs[address]) {
    if (config.verbose) console.error(`Unknown OSC message: ${address}`);
    return;
  }

  const parsedParams = params.reduce(
    (acc, param, i) => {
      // @ts-ignore Indexing by string
      acc[Object.keys(OscIncMessageArgs[address])[i]] = param;
      return acc;
    },
    {} as OscMessageArgs[OscMessageType],
  );

  if (config.debug) console.log(address, parsedParams);

  server.emit(address as OscMessageType, parsedParams);
});

export default server;
