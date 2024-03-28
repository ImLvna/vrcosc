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

const callModuleRunnerFuncPromises = new Map<number, (value: any) => void>();
export function callModuleRunnerFunc<T extends keyof ModuleRunnerBase>(
  func: T,
  ...args: Parameters<ModuleRunnerBase[T]>
): Promise<ReturnType<ModuleRunnerBase[T]>> {
  const nonce = Math.random();
  const promise = new Promise<any>((resolve, reject) => {
    callModuleRunnerFuncPromises.set(nonce, (value) => {
      callModuleRunnerFuncPromises.delete(nonce);
      if (value instanceof Error) {
        reject(value);
      } else {
        resolve(value);
      }
    });
  });
  ipcRenderer.send(IPCMessage.callModuleRunnerFunc, func, nonce, args);
  return promise;
}
ipcRenderer.on(IPCMessage.moduleRunnerFuncReturn, (_, nonce, value) => {
  const promise = callModuleRunnerFuncPromises.get(nonce);
  if (!promise) return;
  promise(value);
});
