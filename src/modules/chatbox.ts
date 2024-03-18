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
}

moduleRunner.on(Events.buildChatbox, () => {
  if (!moduleRunner.config[ClientConfig.messageEnabled]) return;
  const possibleMessages = getPossibleMessages();
  if (possibleMessages.length === 0) return;
  if (!possibleMessages[idx]) idx = (idx + 1) % possibleMessages.length;
  return possibleMessages[idx];
});

function isSetEnabled(set: number) {
  switch (set) {
    case 0:
      return moduleRunner.config[ClientConfig.messageSet1];
    case 1:
      return moduleRunner.config[ClientConfig.messageSet2];
    case 2:
      return moduleRunner.config[ClientConfig.messageSet3];
    case 3:
      return moduleRunner.config[ClientConfig.messageSet4];
    case 4:
      return moduleRunner.config[ClientConfig.messageSet5];
    case 5:
      return moduleRunner.config[ClientConfig.messageSet6];
    case 6:
      return moduleRunner.config[ClientConfig.messageSet7];
    default:
      return false;
  }
}

setInterval(() => {
  const possibleMessages = getPossibleMessages();

  if (possibleMessages.length === 0) return;

  if (config.modules.chatbox.random) {
    idx = Math.floor(Math.random() * possibleMessages.length);
  } else {
    idx = (idx + 1) % possibleMessages.length;
  }
}, config.modules.chatbox.interval);
