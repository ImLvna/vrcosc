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
    config.modules.spotify.clientId &&
    config.modules.spotify.clientSecret &&
    config.modules.spotify.redirectUri
  );
});

if (!config.modules.spotify.clientId) {
  console.error("Spotify module requires a clientId");
} else
  (async () => {
    const api = new SpotifyWebApi({
      clientId: config.modules.spotify.clientId,
      clientSecret: config.modules.spotify.clientSecret,
      redirectUri: config.modules.spotify.redirectUri,
      refreshToken: config.modules.spotify.refreshToken,
    });

    try {
      api.refreshAccessToken().then((data) => {
        api.setAccessToken(data.body.access_token);
        if (data.body.refresh_token) {
          api.setRefreshToken(data.body.refresh_token);
          config.modules.spotify.refreshToken = data.body.refresh_token;
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
        config.modules.spotify.refreshToken = data.body.refresh_token;
        save();
      }
    }, 1000 * 60 * 60);

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
      if ("text" in line) return songstr + "\n" + line.text;
      if ("lead" in line) {
        return (
          songstr +
          "\n" +
          line.lead!.reduce((acc, val) => {
            acc += val.words;
            if (!val.part) acc += " ";
            return acc;
          }, "" as string)
        );
      }
    });

    setInterval(() => {
      time += 250;
    }, 250);

    setInterval(async () => {
      if (!moduleRunner.config[ClientConfig.spotifyEnabled] || !ready) return;

      try {
        const track = await api.getMyCurrentPlaybackState();

        const oldSongstr = songstr;

        if (track.body.is_playing && track.body.item) {
          songstr = `📻 ${track.body.item?.name} - ${
            (track.body.item as any).artists[0].name
          }`;
          time = track.body.progress_ms || 0;
        } else songstr = "";

        if (songstr !== "" && oldSongstr !== songstr) {
          // Refresh Lyrics
          if (config.verbose) {
            console.log("Fetching lyrics");
            console.log(track.body.item?.id);
          }
          try {
            lyrics = await fetch(
              `https://spotify-lyrics-api.lvna.workers.dev/lyrics/${track.body.item?.id}`
            ).then((res) => res.json());
          } catch (e) {
            console.error("Failed to fetch lyrics");
            console.error(e);
          }
        }
      } catch (e) {}
    }, config.modules.spotify.interval);
  })();
