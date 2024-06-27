import config from "../config";
import * as xso from "./xsoverlay";

interface PiShockRequestBody {
  Username: string;
  Apikey: string;
  Code: string;
  Name: string;
  Op: PiShockCommand;
  Duration: number;
  Intensity?: number;
}

const baseRequestBody: Omit<Omit<PiShockRequestBody, "Op">, "Duration"> = {
  Username: config.modules.pishock.username,
  Apikey: config.modules.pishock.apiKey,
  Code: config.modules.pishock.code,
  Name: "Lillith's Osc",
};

export enum PiShockCommand {
  Shock = 0,
  Vibrate = 1,
  Beep = 2,
}

export enum PiShockResponse {
  Success = "Operation Succeeded.",
  CodeDoesntExist = "This code doesn't exist.",
  NotAuthorized = "Not Authorized.",
  Paused = "Shocker is Paused, unable to send command.",
  NotConnected = "Device currently not connected.",
  UsedShareCode = "This share code has already been used by somebody else.",
  UnknownOP = "Unknown Op, use 0 for shock, 1 for vibrate and 2 for beep",
  IntensityInvalid = "Intensity must be between 0 and 15",
  DurationInvalid = "Duration must be between 1 and 100",
}

export async function sendCommand(
  cmd: PiShockCommand,
  duration: number,
  intensity: number | undefined = undefined
) {
  const body: PiShockRequestBody = {
    ...baseRequestBody,
    Op: cmd,
    Duration: duration,
  };
  if (cmd !== PiShockCommand.Beep) {
    body.Intensity = intensity;
  }
  const response = await fetch("https://do.pishock.com/api/apioperate/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const res = await response.text();
  if (res !== PiShockResponse.Success) {
    console.error(res);
    xso.sendNotification("PiShock Error", res);
    return false;
  }

  return true;
}

export async function shock(duration: number, intensity: number) {
  return await sendCommand(PiShockCommand.Shock, duration, intensity);
}
export async function vibrate(duration: number, intensity: number) {
  return await sendCommand(PiShockCommand.Vibrate, duration, intensity);
}
export async function beep(duration: number) {
  return await sendCommand(PiShockCommand.Beep, duration);
}
