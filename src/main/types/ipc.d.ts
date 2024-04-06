import { IPCDataReturn } from "../../shared/ipc";

declare module "electron" {
  namespace Electron {
    export interface IpcMain {
      handle<T extends IPCMessage>(
        event: T,
        callback: (
          event: IpcMainInvokeEvent,
          ...data: IPCData[T]
        ) => IPCDataReturn[T],
      ): void;

      on<T extends IPCMessage>(
        event: T,
        listener: (event: IpcMainEvent, ...data: IPCData[T]) => void,
      ): void;
    }
  }
}
