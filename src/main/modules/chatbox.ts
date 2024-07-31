import { ClientConfig, Events } from "../../shared/moduleRunner";
import config from "../config";
import moduleRunner from "../moduleRunner";

let idx = 0;

function getPossibleMessages() {
  if (config.modules.chatbox.sets.flat().length === 0) return [];

  let possibleMessages: string[] = [];

  for (let i = 0; i < config.modules.chatbox.sets.length; i++) {
    if (!isSetEnabled(i)) continue;

    possibleMessages = possibleMessages.concat(
      config.modules.chatbox.sets[i].filter(
        (i) => typeof i === "string"
      ) as string[]
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

function isSetEnabled(set: number) {
  return !!getSet(set) && getSet(set).length > 1 && !!getSet(set)[0];
}

function getSet(set: number) {
  return config.modules.chatbox.sets[set];
}

moduleRunner.on(Events.initalizeParams, () => {
  console.log("Initializing chatbox params");
  moduleRunner.config[ClientConfig.messageEnabled] =
    config.modules.chatbox.sets.flat().filter(String).length > 0;
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
