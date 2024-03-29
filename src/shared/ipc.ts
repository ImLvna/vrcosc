import { Config } from "./config";
import { type ClientConfigData, Events, type EventsData } from "./moduleRunner";

export enum IPCMessage {
  onModuleRunnerEvent = "onModuleRunnerEvent",
  callModuleRunnerFunc = "callModuleRunnerFunc",
  getModuleRunnerConfig = "getModuleRunnerConfig",
  setModuleRunnerConfig = "setModuleRunnerConfig",
  setSendToClient = "setSendToClient",
  getModuleConfig = "getModuleConfig",
  setModuleConfig = "setModuleConfig",
  saveServerConfig = "saveServerConfig",
}

export type IPCData = {
  [IPCMessage.onModuleRunnerEvent]: [
    Events,
    (...args: EventsData[Events]["args"]) => EventsData[Events]["return"],
  ];
  [IPCMessage.callModuleRunnerFunc]: [string, number, ...any];
  [IPCMessage.getModuleRunnerConfig]: [ClientConfigData?];
  [IPCMessage.setModuleRunnerConfig]: [ClientConfigData];
  [IPCMessage.setSendToClient]: [boolean];
  [IPCMessage.getModuleConfig]: [keyof Config["modules"]];
  [IPCMessage.setModuleConfig]: [
    keyof Config["modules"],
    Config["modules"][keyof Config["modules"]],
  ];
  [IPCMessage.saveServerConfig]: [];
};

export type IPCDataReturn = {
  [IPCMessage.onModuleRunnerEvent]: void;
  [IPCMessage.callModuleRunnerFunc]: any;
  [IPCMessage.getModuleRunnerConfig]: ClientConfigData;
  [IPCMessage.setModuleRunnerConfig]: void;
  [IPCMessage.setSendToClient]: void;
  [IPCMessage.getModuleConfig]: Config["modules"][keyof Config["modules"]];
  [IPCMessage.setModuleConfig]: void;
  [IPCMessage.saveServerConfig]: void;
};
