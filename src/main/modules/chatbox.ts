import { ClientConfig, Events } from "../../shared/moduleRunner";
import config, { save } from "../config";
import moduleRunner from "../moduleRunner";

let idx = 0;

function getPossibleMessages() {
  if (config.modules.chatbox.sets.flat().length === 0) return [];

  let possibleMessages: string[] = [];

  for (let i = 0; i < config.modules.chatbox.sets.length; i++) {
    if (!isSetEnabled(i)) continue;

    possibleMessages = possibleMessages.concat(
      config.modules.chatbox.sets[i].filter(
        (i) => typeof i === "string",
      ) as string[],
    );
  }
  return possibleMessages;
}

moduleRunner.on(Events.buildChatbox, () => {
  if (!moduleRunner.config[ClientConfig.messageEnabled]) return;
  const possibleMessages = getPossibleMessages();
  if (possibleMessages.length === 0) return;
  if (!possibleMessages[idx]) idx = (idx + 1) % possibleMessages.length;
  return possibleMessages[idx];
});

function numToEnum(set: number) {
  switch (set) {
    case 0:
      return ClientConfig.messageSet1;
    case 1:
      return ClientConfig.messageSet2;
    case 2:
      return ClientConfig.messageSet3;
    case 3:
      return ClientConfig.messageSet4;
    case 4:
      return ClientConfig.messageSet5;
    case 5:
      return ClientConfig.messageSet6;
    case 6:
      return ClientConfig.messageSet7;
    default:
      return null;
  }
}
function enumToNum(set: ClientConfig) {
  switch (set) {
    case ClientConfig.messageSet1:
      return 0;
    case ClientConfig.messageSet2:
      return 1;
    case ClientConfig.messageSet3:
      return 2;
    case ClientConfig.messageSet4:
      return 3;
    case ClientConfig.messageSet5:
      return 4;
    case ClientConfig.messageSet6:
      return 5;
    case ClientConfig.messageSet7:
      return 6;
    default:
      return null;
  }
}

function isSetEnabled(set: number) {
  return moduleRunner.config[numToEnum(set) as ClientConfig];
}

function getSet(set: number) {
  return config.modules.chatbox.sets[set];
}

moduleRunner.on(Events.initalizeParams, () => {
  console.log("Initializing chatbox params");

  const shouldSetBeEnabled = (set: number) =>
    !!getSet(set) && getSet(set).length > 1 && !!getSet(set)[0];

  moduleRunner.config[ClientConfig.messageSet1] = shouldSetBeEnabled(0);
  moduleRunner.config[ClientConfig.messageSet2] = shouldSetBeEnabled(1);
  moduleRunner.config[ClientConfig.messageSet3] = shouldSetBeEnabled(2);
  moduleRunner.config[ClientConfig.messageSet4] = shouldSetBeEnabled(3);
  moduleRunner.config[ClientConfig.messageSet5] = shouldSetBeEnabled(4);
  moduleRunner.config[ClientConfig.messageSet6] = shouldSetBeEnabled(5);
  moduleRunner.config[ClientConfig.messageSet7] = shouldSetBeEnabled(6);

  moduleRunner.config[ClientConfig.messageEnabled] =
    config.modules.chatbox.sets.flat().filter(String).length > 0;
});

moduleRunner.on(Events.configUpdate, (cfg, value) => {
  const setNum = enumToNum(cfg);
  if (setNum === null) return;
  if (
    !getSet(setNum) ||
    getSet(setNum).length > 1 ||
    typeof getSet(setNum)[0] === "boolean"
  )
    return;
  config.modules.chatbox.sets[setNum][0] = value as boolean;
  save();
});

setInterval(() => {
  const possibleMessages = getPossibleMessages();

  if (possibleMessages.length === 0) return;

  if (config.modules.chatbox.random) {
    idx = Math.floor(Math.random() * possibleMessages.length);
  } else {
    idx = (idx + 1) % possibleMessages.length;
  }
}, config.modules.chatbox.interval);
