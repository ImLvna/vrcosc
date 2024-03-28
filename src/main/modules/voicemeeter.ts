import voicemeeter from "voicemeeter-remote";
import { ClientConfig, Events } from "../../shared/moduleRunner";
import moduleRunner from "../moduleRunner";

(async () => {
  if (process.platform !== "win32") {
    console.log("Not running on windows, skipping voicemeeter module");
    return;
  }

  try {
    await voicemeeter.init();
    voicemeeter.login();
    voicemeeter.updateDeviceList();
  } catch (e) {
    console.error(e);
    console.log("Voicemeeter initalization failed, skipping...");
    return;
  }

  const getStripFromClient = (strip: number) => {
    voicemeeter.setStripA1(strip, moduleRunner.config[ClientConfig.vmA1]);
    voicemeeter.setStripA2(strip, moduleRunner.config[ClientConfig.vmA2]);
    voicemeeter.setStripA3(strip, moduleRunner.config[ClientConfig.vmA3]);
    voicemeeter.setStripA4(strip, moduleRunner.config[ClientConfig.vmA4]);
    voicemeeter.setStripA5(strip, moduleRunner.config[ClientConfig.vmA5]);
    voicemeeter.setStripB1(strip, moduleRunner.config[ClientConfig.vmB1]);
    voicemeeter.setStripB2(strip, moduleRunner.config[ClientConfig.vmB2]);
    voicemeeter.setStripB3(strip, moduleRunner.config[ClientConfig.vmB3]);
    voicemeeter.setStripMute(strip, moduleRunner.config[ClientConfig.vmMute]);
    // Input: Value from 0 to 1
    // Output: Value from -60 to 12
    voicemeeter.setStripGain(
      strip,
      moduleRunner.config[ClientConfig.vmGain] * 72 - 60,
    );
  };
  const sendStripToClient = (strip: number) => {
    moduleRunner.updateParameter(
      ClientConfig.vmA1,
      !!voicemeeter.getStripA1(strip),
    );
    moduleRunner.updateParameter(
      ClientConfig.vmA2,
      !!voicemeeter.getStripA2(strip),
    );
    moduleRunner.updateParameter(
      ClientConfig.vmA3,
      !!voicemeeter.getStripA3(strip),
    );
    moduleRunner.updateParameter(
      ClientConfig.vmA4,
      !!voicemeeter.getStripA4(strip),
    );
    moduleRunner.updateParameter(
      ClientConfig.vmA5,
      !!voicemeeter.getStripA5(strip),
    );
    moduleRunner.updateParameter(
      ClientConfig.vmB1,
      !!voicemeeter.getStripB1(strip),
    );
    moduleRunner.updateParameter(
      ClientConfig.vmB2,
      !!voicemeeter.getStripB2(strip),
    );
    moduleRunner.updateParameter(
      ClientConfig.vmB3,
      !!voicemeeter.getStripB3(strip),
    );
    moduleRunner.updateParameter(
      ClientConfig.vmMute,
      !!voicemeeter.getStripMute(strip),
    );
    // Input: Value from -60 to 12
    // Output: Value from 0 to 1
    moduleRunner.updateParameter(
      ClientConfig.vmGain,
      (voicemeeter.getStripGain(strip) + 60) / 72,
    );
  };

  moduleRunner.on(Events.reloadParams, () => {
    const strip = moduleRunner.config[ClientConfig.vmStripNumber] - 1;
    if (strip < 0 || strip > 7) return;
    moduleRunner.config[ClientConfig.vmA1] = !!voicemeeter.getStripA1(strip);
    moduleRunner.config[ClientConfig.vmA2] = !!voicemeeter.getStripA2(strip);
    moduleRunner.config[ClientConfig.vmA3] = !!voicemeeter.getStripA3(strip);
    moduleRunner.config[ClientConfig.vmA4] = !!voicemeeter.getStripA4(strip);
    moduleRunner.config[ClientConfig.vmA5] = !!voicemeeter.getStripA5(strip);
    moduleRunner.config[ClientConfig.vmB1] = !!voicemeeter.getStripB1(strip);
    moduleRunner.config[ClientConfig.vmB2] = !!voicemeeter.getStripB2(strip);
    moduleRunner.config[ClientConfig.vmB3] = !!voicemeeter.getStripB3(strip);
    moduleRunner.config[ClientConfig.vmMute] =
      !!voicemeeter.getStripMute(strip);
  });

  moduleRunner.on(Events.configUpdate, async (parameter, value) => {
    const strip = moduleRunner.config[ClientConfig.vmStripNumber] - 1;
    if (strip < 0 || strip > 7) return;
    switch (parameter) {
      case ClientConfig.vmStripNumber:
        sendStripToClient(strip);
        break;

      case ClientConfig.vmA1:
      case ClientConfig.vmA2:
      case ClientConfig.vmA3:
      case ClientConfig.vmA4:
      case ClientConfig.vmA5:
      case ClientConfig.vmB1:
      case ClientConfig.vmB2:
      case ClientConfig.vmB3:
      case ClientConfig.vmMute:
      case ClientConfig.vmGain:
        getStripFromClient(strip);
        break;

      case ClientConfig.vmResetGain:
        voicemeeter.setStripGain(strip, 0);
        sendStripToClient(strip);
        break;
    }
  });
})();
