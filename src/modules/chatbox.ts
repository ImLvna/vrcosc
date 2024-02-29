import config from "../config";
import moduleRunner, { ClientConfig, Events } from "../moduleRunner";

let idx = 0;

moduleRunner.on(Events.buildChatbox, () => {
  if (!moduleRunner.config[ClientConfig.messageEnabled]) return;
  return config.modules.chatbox.messages[idx];
});

setInterval(() => {
  if (config.modules.chatbox.messages.length === 0) return;
  if (config.modules.chatbox.random) {
    idx = Math.floor(Math.random() * config.modules.chatbox.messages.length);
  } else {
    idx = (idx + 1) % config.modules.chatbox.messages.length;
  }
}, config.modules.chatbox.interval);
