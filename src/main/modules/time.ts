import { ClientConfig, Events } from "../../shared/moduleRunner";
import moduleRunner from "../moduleRunner";

moduleRunner.on(Events.buildChatbox, () => {
  if (!moduleRunner.config[ClientConfig.timeEnabled]) return;
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
});
