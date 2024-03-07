import * as pishock from "../lib/pishock";
import moduleRunner, { ClientConfig, Events } from "../moduleRunner";

moduleRunner.on(Events.configUpdate, (config, value) => {
  if (config === ClientConfig.piShockSendSend && value) {
    const command: pishock.PiShockCommand =
      moduleRunner.config[ClientConfig.piShockSendMode] - 1;
    // config goes from 0 to 1, command goes from 1 to 100
    const intensity = Math.round(
      moduleRunner.config[ClientConfig.piShockSendIntensity] * 100,
    );
    // duration goes from 0 to 1, command goes from 1 to 15
    const duration = Math.round(
      moduleRunner.config[ClientConfig.piShockSendDuration] * 15,
    );

    console.log(
      `Sending PiShock command ${command} with intensity ${intensity} and duration ${duration}`,
    );
    if (intensity > 0 && duration > 0) {
      pishock.sendCommand(command, intensity, duration);
    }
  }
});
