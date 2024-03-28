import { ipcMain } from "electron";
import { mainWindow } from ".";
import { IPCMessage } from "../shared/ipc";
import {
  ClientConfig,
  ClientConfigData,
  Events,
  EventsData,
  ModuleRunnerBase,
} from "../shared/moduleRunner";
import client, { OscMessageType } from "./osc/client";
import server from "./osc/server";

class ModuleRunner implements ModuleRunnerBase {
  config = {
    [ClientConfig.menuOpen]: false,

    [ClientConfig.chatboxEnabled]: true,

    [ClientConfig.messageEnabled]: true,

    [ClientConfig.messageSet1]: true,
    [ClientConfig.messageSet2]: true,
    [ClientConfig.messageSet3]: true,
    [ClientConfig.messageSet4]: true,
    [ClientConfig.messageSet5]: true,
    [ClientConfig.messageSet6]: true,
    [ClientConfig.messageSet7]: true,

    [ClientConfig.spotifyEnabled]: true,

    [ClientConfig.timeEnabled]: true,

    [ClientConfig.windowEnabled]: false,
    [ClientConfig.windowTitle]: true,

    [ClientConfig.vmStripNumber]: 0,
    [ClientConfig.vmA1]: false,
    [ClientConfig.vmA2]: false,
    [ClientConfig.vmA3]: false,
    [ClientConfig.vmA4]: false,
    [ClientConfig.vmA5]: false,
    [ClientConfig.vmB1]: false,
    [ClientConfig.vmB2]: false,
    [ClientConfig.vmB3]: false,
    [ClientConfig.vmMute]: false,
    [ClientConfig.vmGain]: 0,
    [ClientConfig.vmResetGain]: false,

    [ClientConfig.piShockSendMode]: 0,
    [ClientConfig.piShockSendIntensity]: 0,
    [ClientConfig.piShockSendDuration]: 0,
    [ClientConfig.piShockSendSend]: false,

    // [ClientConfig.piShockRecvShock]: false,
    // [ClientConfig.piShockRecvVibrate]: false,
    // [ClientConfig.piShockRecvBeep]: false,
    // [ClientConfig.piShockRecvIntensity]: 0,
    // [ClientConfig.piShockRecvDuration]: 0,
    // [ClientConfig.piShockRecvSend]: false,
  };

  listeners: Record<
    Events,
    Array<(...args: EventsData[Events]["args"]) => EventsData[Events]["return"]>
  > = {
    buildChatbox: [],
    chatboxBuilt: [],
    chatboxToClient: [],
    configUpdate: [],
    reloadParams: [],
    initalizeParams: [],
  };

  getConfig() {
    return Promise.resolve(this.config);
  }
  setConfig(config: ClientConfigData) {
    this.config = config;
  }

  setSendToClient(toggle: boolean) {
    client.sendToClient = toggle;
  }

  async updateClientConfig() {
    console.log("Avatar Osc config out of date, updating...");
    await this.emit(Events.reloadParams);
    for (const [key, value] of Object.entries(this.config)) {
      client.sendMessage(OscMessageType.AvatarParameters, {
        parameter: `LvnOsc/${key}`,
        value,
      });
    }
  }

  updateParameter<T extends ClientConfig>(
    parameter: T,
    value: ClientConfigData[T],
  ) {
    this.config[parameter] = value;
    client.sendMessage(OscMessageType.AvatarParameters, {
      parameter: `LvnOsc/${parameter}`,
      value,
    });
  }

  constructor() {
    this.config[ClientConfig.menuOpen] = false;

    server.on(OscMessageType.AvatarParameters, (data) => {
      if (data.parameter.startsWith("LvnOsc/")) {
        const parameter = data.parameter.replace("LvnOsc/", "");

        // @ts-ignore Indexing by string
        const type = typeof this.config[parameter];
        if (type === "boolean") data.value = !!data.value;
        if (
          (parameter as ClientConfig) !== ClientConfig.menuOpen &&
          !this.config[ClientConfig.menuOpen]
        )
          return;

        // @ts-ignore Indexing by string
        this.config[parameter] = data.value;

        this.emit(
          Events.configUpdate,
          parameter as ClientConfig,
          data.value as ClientConfigData[ClientConfig],
        );
      }
    });

    server.on(OscMessageType.AvatarChange, this.updateClientConfig);

    ipcMain.on(
      IPCMessage.callModuleRunnerFunc,
      async (_, func: string, nonce: number, args: any[]) => {
        if (typeof this[func] === "function") {
          try {
            const res = await this[func](...args);
            mainWindow?.webContents.send(
              IPCMessage.moduleRunnerFuncReturn,
              nonce,
              res,
            );
          } catch (e) {
            console.error(e);
            mainWindow?.webContents.send(
              IPCMessage.moduleRunnerFuncReturn,
              nonce,
              e,
            );
          }
        }
      },
    );
  }

  on<T extends Events>(
    event: T,
    listener: (...args: EventsData[T]["args"]) => EventsData[T]["return"],
  ): void {
    // @ts-ignore Indexing by string
    this.listeners[event].push(listener);
  }

  async emit<T extends Events>(
    event: T,
    ...args: EventsData[T]["args"]
  ): Promise<void> {
    mainWindow?.webContents.send(IPCMessage.onModuleRunnerEvent, event, args);
    switch (event) {
      case Events.buildChatbox: {
        let chatbox = "";
        for (const listener of this.listeners.buildChatbox) {
          try {
            const result = await listener();
            if (result) {
              if (chatbox !== "") chatbox += "\n";
              chatbox += result;
            }
          } catch (e) {
            console.error(e);
          }
        }
        this.emit(Events.chatboxBuilt, chatbox);
        break;
      }
      default:
        for (const listener of this.listeners[event]) {
          try {
            listener(...args);
          } catch (e) {
            console.error(e);
          }
        }
        break;
    }
  }
}
const moduleRunner = new ModuleRunner();

export default moduleRunner;
