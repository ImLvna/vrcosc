import { Config } from "./config";
import { type ClientConfigData, Events, type EventsData } from "./moduleRunner";

export enum IPCMessage {
  onModuleRunnerEvent = "onModuleRunnerEvent",
  callModuleRunnerFunc = "callModuleRunnerFunc",
  getModuleRunnerConfig = "getModuleRunnerConfig",
  setSendToClient = "setSendToClient",
  getModuleConfig = "getModuleConfig",
  setModuleConfig = "setModuleConfig",
}

export type IPCData = {
  [IPCMessage.onModuleRunnerEvent]: [
    Events,
    (...args: EventsData[Events]["args"]) => EventsData[Events]["return"],
  ];
  [IPCMessage.callModuleRunnerFunc]: [string, ...any];
  [IPCMessage.getModuleRunnerConfig]: [];
  [IPCMessage.setSendToClient]: [boolean];
  [IPCMessage.getModuleConfig]: [keyof Config["modules"]];
  [IPCMessage.setModuleConfig]: [
    keyof Config["modules"],
    Config["modules"][keyof Config["modules"]],
  ];
};

export type IPCDataReturn = {
  [IPCMessage.onModuleRunnerEvent]: void;
  [IPCMessage.callModuleRunnerFunc]: any;
  [IPCMessage.getModuleRunnerConfig]: ClientConfigData;
  [IPCMessage.setSendToClient]: void;
  [IPCMessage.getModuleConfig]: Config["modules"][keyof Config["modules"]];
  [IPCMessage.setModuleConfig]: void;
};
