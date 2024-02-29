import activeWindow from "active-win";
import moduleRunner, { ClientConfig, Events } from "../moduleRunner";

moduleRunner.on(Events.buildChatbox, async () => {
  if (!moduleRunner.config[ClientConfig.windowEnabled]) return;
  const window = await activeWindow();
  if (!window) return;
  return `Current Window: ${
    moduleRunner.config[ClientConfig.windowTitle]
      ? window.title
      : window.owner.name
  }`;
});
