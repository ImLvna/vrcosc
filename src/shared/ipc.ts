import { type ClientConfigData, Events, type EventsData } from "./moduleRunner";

export enum IPCMessage {
  onModuleRunnerEvent = "onModuleRunnerEvent",
  callModuleRunnerFunc = "callModuleRunnerFunc",
  moduleRunnerFuncReturn = "moduleRunnerFuncReturn",
  getModuleRunnerConfig = "getModuleRunnerConfig",
  setModuleRunnerConfig = "setModuleRunnerConfig",
}

export type IPCData = {
  [IPCMessage.onModuleRunnerEvent]: [
    Events,
    (...args: EventsData[Events]["args"]) => EventsData[Events]["return"]
  ];
  [IPCMessage.callModuleRunnerFunc]: [string, number, ...any];
  [IPCMessage.moduleRunnerFuncReturn]: [number, ...any];
  [IPCMessage.getModuleRunnerConfig]: [ClientConfigData?];
  [IPCMessage.setModuleRunnerConfig]: [ClientConfigData];
};
