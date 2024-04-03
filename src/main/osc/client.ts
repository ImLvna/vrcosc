import { ipcMain } from "electron";
import { Client } from "node-osc";
import { IPCMessage } from "../../shared/ipc";
import config from "../config";

function makeClient() {
  const newClient = new Client(
    config.connect.split(":")[0],
    Number(config.connect.split(":")[1]),
  );

  newClient.sendToClient = true;

  ipcMain.handle(IPCMessage.setSendToClient, (_, value) => {
    newClient.sendToClient = value;
  });

  newClient.sendMessage = (addr, data, callback) => {
    if (!newClient.sendToClient) return;
    let address: string = addr;
    let newArgs: any[] = [];

    switch (addr) {
      case OscMessageType.AvatarParameters:
        address = `${addr}/${
          (data as OscMessageArgs[OscMessageType.AvatarParameters]).parameter
        }`;
        newArgs = [
          (data as OscMessageArgs[OscMessageType.AvatarParameters]).value,
        ];
        break;

      default:
        newArgs = Object.values(data) as any;
        break;
    }

    if (callback) {
      newArgs.push(callback);
    }
    if (config.debug) {
      console.log(`Sending message: ${address}`, newArgs);
    }
    newClient.send(address, ...(newArgs as any));
  };

  newClient._sock.on("error", (err) => {
    console.error("Client error:", err);
  });
  newClient._sock.on("close", () => {
    console.error("Client disconnected, reconnecting...");
    client = makeClient();
  });
  newClient._sock.on("connect", () => {
    console.log("Client connected");
  });
  return newClient;
}

let client = makeClient();

export enum OscMessageType {
  ChatboxInput = "/chatbox/input",
  ChatboxTyping = "/chatbox/typing",
  AvatarChange = "/avatar/change",
  AvatarParameters = "/avatar/parameters",
}

export type OscMessageArgs = {
  [OscMessageType.ChatboxInput]: {
    message: string;
    instant: boolean;
    notification: boolean;
  };
  [OscMessageType.ChatboxTyping]: {
    typing: boolean;
  };
  [OscMessageType.AvatarChange]: {
    avatarId: string;
  };
  [OscMessageType.AvatarParameters]: {
    parameter: string;
    value: number | boolean;
  };
};

export default client;
