import { ipcRenderer } from "electron";
import { IPCMessage } from "../shared/ipc";

export function setSendToClient(value: boolean) {
  return ipcRenderer.send(IPCMessage.setSendToClient, value);
}
