export enum Events {
  buildChatbox = "buildChatbox",
  chatboxBuilt = "chatboxBuilt",
  chatboxToClient = "chatboxToClient",
  configUpdate = "configUpdate",
  serverConfigUpdate = "serverConfigUpdate",
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

    return: void;
  };
  [Events.chatboxToClient]: {
    args: [string];

    return: void;
  };
  [Events.configUpdate]: {
    args: [ClientConfig, ClientConfigData[ClientConfig]];

    return: void;
  };
  [Events.reloadParams]: {
    args: [];

    return: void;
  };
  [Events.initalizeParams]: {
    args: [];

    return: void;
  };
  [Events.serverConfigUpdate]: {
    args: [];

    return: void;
  };
};

export enum ClientConfig {
  menuOpen = "menuOpen",

  chatboxEnabled = "chatbox",

  messageEnabled = "message/enabled",

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
  config = {
    [ClientConfig.menuOpen]: false,

    [ClientConfig.chatboxEnabled]: true,

    [ClientConfig.messageEnabled]: true,
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

  abstract updateClientConfig(): Promise<void>;

  abstract updateParameter<T extends ClientConfig>(
    parameter: T,
    value: ClientConfigData[T]
  ): void;

  abstract on<T extends Events>(
    event: T,
    listener: (...args: EventsData[T]["args"]) => EventsData[T]["return"]
  ): void;

  abstract emit<T extends Events>(
    event: T,
    ...args: EventsData[T]["args"]
  ): Promise<void>;
}
