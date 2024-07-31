export interface Config {
  listen: number;
  connect: string;
  verbose: boolean;
  debug: boolean;
  modules: {
    chatbox: {
      sets: [boolean, ...string[]][];
      random: boolean;
      interval: number;
    };
    spotify: {
      api: {
        clientId: string;
        clientSecret: string;
        redirectUri: string;
        refreshToken: string;
      };
      alternativeApi: string;
      lyrics: boolean;
      interval: number;
    };
    pishock: {
      username: string;
      apiKey: string;
      code: string;
    };
    xsOverlay: {
      enabled: boolean;
      port: number;
    };
    ui: {
      color: string;
    };
  };
}
