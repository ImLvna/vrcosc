import { ipcRenderer } from "electron";
import { Config } from "../shared/config";
import { IPCMessage } from "../shared/ipc";

export function getConfigModule(module: keyof Config["modules"]) {
  return ipcRenderer.sendSync(IPCMessage.getModuleConfig, module);
}

export function setConfigModule(
  module: keyof Config["modules"],
  data: Config["modules"][keyof Config["modules"]],
) {
  return ipcRenderer.sendSync(IPCMessage.setModuleConfig, module, data);
}
