import { IPCData, IPCMessage } from "../../shared/ipc";

declare module "electron" {
  namespace Electron {
    export interface IpcMain {
      on<T extends IPCMessage>(
        event: T,
        callback: (event: Event, ...data: IPCData[T]) => void,
      ): void;
    }
  }
}
