export enum Events {
  buildChatbox = "buildChatbox",
  chatboxBuilt = "chatboxBuilt",
  chatboxToClient = "chatboxToClient",
  configUpdate = "configUpdate",
  reloadParams = "reloadParams",
  initalizeParams = "initalizeParams",
}
export type EventsData = {
  [Events.buildChatbox]: {
    args: [];
    return: string | undefined | Promise<string | undefined>;
  };
  [Events.chatboxBuilt]: {
    args: [string];
    // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
    return: void;
  };
  [Events.chatboxToClient]: {
    args: [string];
    // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
    return: void;
  };
  [Events.configUpdate]: {
    args: [ClientConfig, ClientConfigData[ClientConfig]];
    // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
    return: void;
  };
  [Events.reloadParams]: {
    args: [];
    // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
    return: void;
  };
  [Events.initalizeParams]: {
    args: [];
    // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
    return: void;
  };
};

export enum ClientConfig {
  menuOpen = "menuOpen",

  chatboxEnabled = "chatbox",

  messageEnabled = "message/enabled",
  messageSet1 = "message/set1",
  messageSet2 = "message/set2",
  messageSet3 = "message/set3",
  messageSet4 = "message/set4",
  messageSet5 = "message/set5",
  messageSet6 = "message/set6",
  messageSet7 = "message/set7",

  spotifyEnabled = "spotify",

  timeEnabled = "time",

  windowEnabled = "window/enabled",
  windowTitle = "window/title",

  vmStripNumber = "vm/stripNumber",
  vmA1 = "vm/A1",
  vmA2 = "vm/A2",
  vmA3 = "vm/A3",
  vmA4 = "vm/A4",
  vmA5 = "vm/A5",
  vmB1 = "vm/B1",
  vmB2 = "vm/B2",
  vmB3 = "vm/B3",
  vmMute = "vm/mute",
  vmGain = "vm/gain",
  vmResetGain = "vm/resetGain",

  piShockSendMode = "piShock/send/mode",
  piShockSendIntensity = "piShock/send/intensity",
  piShockSendDuration = "piShock/send/duration",
  piShockSendSend = "piShock/send/send",

  // piShockRecvShock = "piShock/recv/shock",
  // piShockRecvVibrate = "piShock/recv/vibrate",
  // piShockRecvBeep = "piShock/recv/beep",
  // piShockRecvIntensity = "piShock/recv/intensity",
  // piShockRecvDuration = "piShock/recv/duration",
  // piShockRecvSend = "piShock/recv/send",
}
export type ClientConfigData = {
  [ClientConfig.menuOpen]: boolean;

  [ClientConfig.chatboxEnabled]: boolean;

  [ClientConfig.messageEnabled]: boolean;
  [ClientConfig.messageSet1]: boolean;
  [ClientConfig.messageSet2]: boolean;
  [ClientConfig.messageSet3]: boolean;
  [ClientConfig.messageSet4]: boolean;
  [ClientConfig.messageSet5]: boolean;
  [ClientConfig.messageSet6]: boolean;
  [ClientConfig.messageSet7]: boolean;

  [ClientConfig.spotifyEnabled]: boolean;

  [ClientConfig.timeEnabled]: boolean;

  [ClientConfig.windowEnabled]: boolean;
  [ClientConfig.windowTitle]: boolean;

  [ClientConfig.vmStripNumber]: number;
  [ClientConfig.vmA1]: boolean;
  [ClientConfig.vmA2]: boolean;
  [ClientConfig.vmA3]: boolean;
  [ClientConfig.vmA4]: boolean;
  [ClientConfig.vmA5]: boolean;
  [ClientConfig.vmB1]: boolean;
  [ClientConfig.vmB2]: boolean;
  [ClientConfig.vmB3]: boolean;
  [ClientConfig.vmMute]: boolean;
  [ClientConfig.vmGain]: number;
  [ClientConfig.vmResetGain]: boolean;

  [ClientConfig.piShockSendMode]: number;
  [ClientConfig.piShockSendIntensity]: number;
  [ClientConfig.piShockSendDuration]: number;
  [ClientConfig.piShockSendSend]: boolean;

  // [ClientConfig.piShockRecvShock]: boolean;
  // [ClientConfig.piShockRecvVibrate]: boolean;
  // [ClientConfig.piShockRecvBeep]: boolean;
  // [ClientConfig.piShockRecvIntensity]: number;
  // [ClientConfig.piShockRecvDuration]: number;
  // [ClientConfig.piShockRecvSend]: boolean;
};

export abstract class ModuleRunnerBase {
  abstract getConfig(): Promise<ClientConfigData>;
  abstract setConfig(config: ClientConfigData);

  abstract updateClientConfig(): Promise<void>;

  abstract setSendToClient(toggle: boolean): void;

  abstract updateParameter<T extends ClientConfig>(
    parameter: T,
    value: ClientConfigData[T],
  ): void;

  abstract on<T extends Events>(
    event: T,
    listener: (...args: EventsData[T]["args"]) => EventsData[T]["return"],
  ): void;

  abstract emit<T extends Events>(
    event: T,
    ...args: EventsData[T]["args"]
  ): Promise<void>;
}
