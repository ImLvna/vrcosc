import type {
  ClientConfigData,
  Events,
  EventsData,
  ModuleRunnerBase,
} from "../../../shared/moduleRunner";

export class IPCModuleRunner implements ModuleRunnerBase {
  async getConfig() {
    return await window.electron.moduleRunner.callModuleRunnerFunc("getConfig");
  }
  setConfig(config: ClientConfigData) {
    window.electron.moduleRunner.callModuleRunnerFunc("setConfig", config);
  }

  async updateClientConfig(): Promise<void> {
    return await window.electron.moduleRunner.callModuleRunnerFunc(
      "updateClientConfig"
    );
  }

  setSendToClient(toggle: boolean): void {
    window.electron.moduleRunner.callModuleRunnerFunc(
      "setSendToClient",
      toggle
    );
  }

  updateParameter<T>(parameter: T, value: any): void {
    window.electron.moduleRunner.callModuleRunnerFunc(
      "updateParameter",
      parameter,
      value
    );
  }

  on<T extends Events>(
    event: T,
    listener: (...args: EventsData[T]["args"]) => EventsData[T]["return"]
  ): void {
    window.electron.moduleRunner.onModuleRunnerEvent(event, listener);
  }

  emit<T extends Events>(
    event: T,
    ...args: EventsData[T]["args"]
  ): Promise<void> {
    return window.electron.moduleRunner.callModuleRunnerFunc(
      "emit",
      event,
      args
    );
  }
}
const ipcModuleRunner = new IPCModuleRunner();
window.moduleRunner = ipcModuleRunner;
export default ipcModuleRunner;
