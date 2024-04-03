import { ipcRenderer } from "electron";
import { IPCMessage } from "../shared/ipc";
import { Events, EventsData, ModuleRunnerBase } from "../shared/moduleRunner";

export type moduleRunnerEvListener = <T extends Events>(
  ...args: EventsData[T]["args"]
) => EventsData[T]["return"];

const listeners = new Map<Events, moduleRunnerEvListener[]>();

export function onModuleRunnerEvent<T extends Events>(
  event: T,
  listener: moduleRunnerEvListener,
) {
  listeners.set(event, [...(listeners.get(event) || []), listener]);
  console.log("listeners", listeners);
}

ipcRenderer.on(IPCMessage.onModuleRunnerEvent, (_, event, args) => {
  const eventListeners = listeners.get(event);
  if (!eventListeners) return;
  for (const listener of eventListeners) {
    listener(...args);
  }
});

export function callModuleRunnerFunc<T extends keyof ModuleRunnerBase>(
  func: T,
  ...args: any[]
): Promise<any> {
  return ipcRenderer.sendSync(IPCMessage.callModuleRunnerFunc, func, args);
}

export function getModuleRunnerConfig() {
  return ipcRenderer.sendSync(IPCMessage.getModuleRunnerConfig);
}
