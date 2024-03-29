import { ClientConfig, Events } from "../shared/moduleRunner";
import config from "./config";
import moduleRunner from "./moduleRunner";
import client, { OscMessageType } from "./osc/client";

let lastChatbox = "";

let chatboxTimeout = false;

moduleRunner.on(Events.chatboxBuilt, (chatbox) => {
  if (config.verbose) console.log(chatbox);
  if (
    !moduleRunner.config[ClientConfig.chatboxEnabled] ||
    chatboxTimeout ||
    chatbox === lastChatbox
  )
    return;
  lastChatbox = chatbox;
  chatboxTimeout = true;
  setTimeout(() => {
    chatboxTimeout = false;
  }, 1500);
  client.sendMessage(OscMessageType.ChatboxInput, {
    message: chatbox,
    instant: true,
    notification: false,
  });
  moduleRunner.emit(Events.chatboxToClient, chatbox);
});

moduleRunner.on(Events.configUpdate, (config, value) => {
  if (config === ClientConfig.chatboxEnabled) {
    if (!value) {
      lastChatbox = "";
      client.sendMessage(OscMessageType.ChatboxInput, {
        message: "",
        instant: true,
        notification: false,
      });
      moduleRunner.emit(Events.chatboxToClient, "");
    }
  }
});

setInterval(() => {
  moduleRunner.emit(Events.buildChatbox);
}, 250);

import "./modules";
