import config from "../config";
import moduleRunner, { ClientConfig, Events } from "../moduleRunner";

let idx = 0;

function getPossibleMessages() {
  if (config.modules.chatbox.sets.flat().length === 0) return [];

  let possibleMessages: string[] = [];

  for (let i = 0; i < config.modules.chatbox.sets.length; i++) {
    if (!isSetEnabled(i)) continue;

    possibleMessages = possibleMessages.concat(config.modules.chatbox.sets[i]);
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

function getSetConfig(set: number) {
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

function isSetEnabled(set: number) {
  return moduleRunner.config[getSetConfig(set)];
}

moduleRunner.on(Events.initalizeParams, () => {
  console.log("Initializing chatbox params");
  moduleRunner.config[ClientConfig.messageSet1] =
    !!config.modules.chatbox.sets[0] &&
    config.modules.chatbox.sets[0].length > 0;
  moduleRunner.config[ClientConfig.messageSet2] =
    !!config.modules.chatbox.sets[1] &&
    config.modules.chatbox.sets[1].length > 0;
  moduleRunner.config[ClientConfig.messageSet3] =
    !!config.modules.chatbox.sets[2] &&
    config.modules.chatbox.sets[2].length > 0;
  moduleRunner.config[ClientConfig.messageSet4] =
    !!config.modules.chatbox.sets[3] &&
    config.modules.chatbox.sets[3].length > 0;
  moduleRunner.config[ClientConfig.messageSet5] =
    !!config.modules.chatbox.sets[4] &&
    config.modules.chatbox.sets[4].length > 0;
  moduleRunner.config[ClientConfig.messageSet6] =
    !!config.modules.chatbox.sets[5] &&
    config.modules.chatbox.sets[5].length > 0;
  moduleRunner.config[ClientConfig.messageSet7] =
    !!config.modules.chatbox.sets[6] &&
    config.modules.chatbox.sets[6].length > 0;

  moduleRunner.config[ClientConfig.messageEnabled] =
    config.modules.chatbox.sets.flat().length > 0;
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
