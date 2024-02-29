declare module "voicemeeter-remote" {
  enum VoicemeeterType {
    voicemeeter = 1,
    voicemeeterBanana = 2,
    voicemeeterPotato = 3,
    unknown = 0,
  }

  enum RunVoicemeeterType {
    normal = 0,
    asAdmin = 1,
  }

  enum InterfaceType {
    strip = 0,
    bus = 1,
  }

  enum LevelType {
    peak = 0,
    rms = 1,
  }

  enum DeviceType {
    output = 0,
    input = 1,
  }

  enum MacroButtonState {
    off = 0,
    on = 1,
  }

  enum MacroButtonTrigger {
    press = 0,
    release = 1,
  }

  enum MacroButtonColor {
    off = 0,
    red = 1,
    green = 2,
    yellow = 3,
    blue = 4,
  }

  type VoicemeeterConfig = {
    [key in VoicemeeterType]: any; // You might want to provide more specific types here if available
  };

  type Device = {
    type: DeviceType;
    name: string;
    hardwareId: string;
  };

  type Voicemeeter = {
    isInitialised: boolean;
    isConnected: boolean;
    outputDevices: Device[];
    inputDevices: Device[];
    type: VoicemeeterType;
    version: string | null;
    voicemeeterConfig: VoicemeeterConfig | null;
    init(): Promise<void>;
    runVoicemeeter(runVoicemeeterType: RunVoicemeeterType): void;
    isParametersDirty(): number;
    getRawParameterFloat(parameter: string): number;
    getRawParameterString(parameter: string): string;
    setRawParameterFloat(parameter: string, value: number): void;
    setRawParameterString(parameter: string, value: string): void;
    setRawParameters(parameters: string): void;
    login(): void;
    logout(): void;
    getOutputDeviceNumber(): number;
    getInputDeviceNumber(): number;
    updateDeviceList(): void;
    showVoicemeeter(): void;
    shutdownVoicemeeter(): void;
    restartVoicemeeterAudioEngine(): void;
    ejectVoicemeeterCassette(): void;
    resetVoicemeeterConfiguration(): void;
    saveVoicemeeterConfiguration(filename: string): void;
    loadVoicemeeterConfiguration(filename: string): void;
    lockVoicemeeterGui(lock: boolean): void;
    setMacroButtonState(button: number, state: MacroButtonState): void;
    setMacroButtonStateOnly(button: number, state: MacroButtonState): void;
    setMacroButtonTrigger(button: number, trigger: MacroButtonTrigger): void;
    setMacroButtonColor(button: number, color: MacroButtonColor): void;
    showVbanChatDialog(): void;
    getLevel(type: LevelType, channel: number): number;
    setBusMono(busNumber: number, value: number | boolean): void;
    getBusMono(busNumber: number): number;
    setBusMute(busNumber: number, value: number | boolean): void;
    getBusMute(busNumber: number): number;
    setBusGain(busNumber: number, value: number | boolean): void;
    getBusGain(busNumber: number): number;
    setStripMono(stripNumber: number, value: number | boolean): void;
    getStripMono(stripNumber: number): number;
    setStripMute(stripNumber: number, value: number | boolean): void;
    getStripMute(stripNumber: number): number;
    setStripSolo(stripNumber: number, value: number | boolean): void;
    getStripSolo(stripNumber: number): number;
    setStripMC(stripNumber: number, value: number | boolean): void;
    getStripMC(stripNumber: number): number;
    setStripGain(stripNumber: number, value: number | boolean): void;
    getStripGain(stripNumber: number): number;
    setStripPan_x(stripNumber: number, value: number | boolean): void;
    getStripPan_x(stripNumber: number): number;
    setStripPan_y(stripNumber: number, value: number | boolean): void;
    getStripPan_y(stripNumber: number): number;
    setStripColor_x(stripNumber: number, value: number | boolean): void;
    getStripColor_x(stripNumber: number): number;
    setStripColor_y(stripNumber: number, value: number | boolean): void;
    getStripColor_y(stripNumber: number): number;
    setStripFx_x(stripNumber: number, value: number | boolean): void;
    getStripFx_x(stripNumber: number): number;
    setStripFx_y(stripNumber: number, value: number | boolean): void;
    getStripFx_y(stripNumber: number): number;
    setStripAudibility(stripNumber: number, value: number | boolean): void;
    getStripAudibility(stripNumber: number): number;
    setStripGate(stripNumber: number, value: number | boolean): void;
    getStripGate(stripNumber: number): number;
    setStripComp(stripNumber: number, value: number | boolean): void;
    getStripComp(stripNumber: number): number;
    setStripA1(stripNumber: number, value: number | boolean): void;
    getStripA1(stripNumber: number): number;
    setStripA2(stripNumber: number, value: number | boolean): void;
    getStripA2(stripNumber: number): number;
    setStripA3(stripNumber: number, value: number | boolean): void;
    getStripA3(stripNumber: number): number;
    setStripA4(stripNumber: number, value: number | boolean): void;
    getStripA4(stripNumber: number): number;
    setStripA5(stripNumber: number, value: number | boolean): void;
    getStripA5(stripNumber: number): number;
    setStripB1(stripNumber: number, value: number | boolean): void;
    getStripB1(stripNumber: number): number;
    setStripB2(stripNumber: number, value: number | boolean): void;
    getStripB2(stripNumber: number): number;
    setStripB3(stripNumber: number, value: number | boolean): void;
    getStripB3(stripNumber: number): number;
  };

  const voicemeeter: Voicemeeter;
  export = voicemeeter;
}
