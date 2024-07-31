import SpotifyWebApi from "spotify-web-api-node";
import { ClientConfig, Events } from "../../shared/moduleRunner";
import config, { save } from "../config";
import moduleRunner from "../moduleRunner";
import { Lyrics } from "../types/spotify";

let ready = false;

let songstr = "";
let time = 0;

let lyrics: Lyrics | null = null;

moduleRunner.on(Events.initalizeParams, () => {
  moduleRunner.config[ClientConfig.spotifyEnabled] = !!(
    (config.modules.spotify.api.clientId &&
      config.modules.spotify.api.clientSecret &&
      config.modules.spotify.api.redirectUri) ||
    config.modules.spotify.alternativeApi
  );
});

(async () => {
  let api: SpotifyWebApi;
  if (config.modules.spotify.alternativeApi) ready = true;

  moduleRunner.on(Events.buildChatbox, () => {
    if (!ready) return;

    if (!moduleRunner.config[ClientConfig.spotifyEnabled]) return;
    if (songstr === "") return;
    if (!config.modules.spotify.lyrics || !lyrics || !lyrics.lines)
      return songstr;

    const possibleLines = lyrics.lines.filter((line) => {
      if ("lead" in line && line.lead) {
        if (line.lead[0].start > time) return false;
        return line.lead[line.lead.length - 1].end >= time;
      }
      if ("start" in line) {
        if (line.start > time) return false;
        return line.end >= time;
      }
      return false;
    });

    const line = possibleLines[possibleLines.length - 1];

    if (!line) return songstr;
    if ("text" in line) return `${songstr}\n${line.text}`;
    if ("lead" in line && line.lead) {
      return `${songstr}\n${line.lead.reduce((acc, val) => {
        let nacc = acc;
        nacc += val.words;
        if (!val.part) nacc += " ";
        return nacc;
      }, "" as string)}`;
    }
    return;
  });

  setInterval(() => {
    time += 250;
  }, 250);

  setInterval(async () => {
    if (config.modules.spotify.alternativeApi) ready = true;

    if (!api && config.modules.spotify.api.clientId) {
      api = new SpotifyWebApi({
        clientId: config.modules.spotify.api.clientId,
        clientSecret: config.modules.spotify.api.clientSecret,
        redirectUri: config.modules.spotify.api.redirectUri,
        refreshToken: config.modules.spotify.api.refreshToken,
      });

      try {
        api.refreshAccessToken().then((data) => {
          api.setAccessToken(data.body.access_token);
          if (data.body.refresh_token) {
            api.setRefreshToken(data.body.refresh_token);
            config.modules.spotify.api.refreshToken = data.body.refresh_token;
            save();
          }
          ready = true;
        });
      } catch (e) {
        console.error("Failed to refresh access token");
        console.error(e);
      }

      setInterval(async () => {
        const data = await api.refreshAccessToken();
        api.setAccessToken(data.body.access_token);
        if (data.body.refresh_token) {
          api.setRefreshToken(data.body.refresh_token);
          config.modules.spotify.api.refreshToken = data.body.refresh_token;
          save();
        }
      }, 1000 * 60 * 60);
    }

    if (!moduleRunner.config[ClientConfig.spotifyEnabled] || !ready) return;

    try {
      let track: SpotifyApi.CurrentPlaybackResponse;
      if (config.modules.spotify.alternativeApi) {
        track = await fetch(config.modules.spotify.alternativeApi).then((res) =>
          res.json()
        );
      } else track = (await api.getMyCurrentPlaybackState()).body;

      const oldSongstr = songstr;

      if (track.is_playing && track.item) {
        songstr = `📻 ${track.item?.name} - ${
          (track.item as any).artists[0].name
        }`;
        time = track.progress_ms || 0;
      } else songstr = "";

      if (songstr !== "" && oldSongstr !== songstr) {
        // Refresh Lyrics
        if (config.verbose) {
          console.log("Fetching lyrics");
          console.log(track.item?.id);
        }
        try {
          lyrics = await fetch(
            `https://spotify-lyrics-api.lvna.workers.dev/lyrics/${track.item?.id}`
          ).then((res) => res.json());
        } catch (e) {
          console.error("Failed to fetch lyrics");
          console.error(e);
        }
      }
    } catch (e) {}
  }, config.modules.spotify.interval);
})();
