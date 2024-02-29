import SpotifyWebApi from "spotify-web-api-node";
import config, { save } from "../config";
import moduleRunner, { ClientConfig, Events } from "../moduleRunner";

let ready = false;

let songstr = "";
let time = 0;

interface LyricsResponse {
  lyrics: {
    syncType: "LINE_SYNCED";
    lines: {
      startTimeMs: string;
      words: string;
      syllables: string[];
      endTimeMs: string;
    }[];
  };
}

let lyrics: LyricsResponse;

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

    setInterval(
      async () => {
        const data = await api.refreshAccessToken();
        api.setAccessToken(data.body.access_token);
        if (data.body.refresh_token) {
          api.setRefreshToken(data.body.refresh_token);
          config.modules.spotify.refreshToken = data.body.refresh_token;
          save();
        }
      },
      1000 * 60 * 60,
    );

    moduleRunner.on(Events.buildChatbox, () => {
      if (!ready) return;

      if (!moduleRunner.config[ClientConfig.spotifyEnabled]) return;
      if (songstr === "") return;
      if (!config.modules.spotify.lyrics || !lyrics || !lyrics.lyrics)
        return songstr;

      const possibleLines = lyrics.lyrics.lines.filter((line) => {
        if (parseInt(line.startTimeMs) > time) return false;
        if (parseInt(line.endTimeMs) === 0) return true;
        return parseInt(line.endTimeMs) >= time;
      });

      const line = possibleLines[possibleLines.length - 1];

      if (!line || line.words === "" || line.words === "♪") return songstr;
      return line.words;
    });

    setInterval(() => {
      time += 250;
    }, 250);

    setInterval(async () => {
      if (!moduleRunner.config[ClientConfig.spotifyEnabled] || !ready) return;

      try {
        const track = await api.getMyCurrentPlaybackState();

        const oldSongstr = songstr;

        if (track.body.is_playing) {
          songstr = `📻 ${track.body.item?.name} - ${
            (track.body.item as any).artists[0].name
          }`;
          time = track.body.progress_ms || 0;
        } else songstr = "";

        if (
          songstr !== "" &&
          oldSongstr !== songstr &&
          config.modules.spotify.lyrics
        ) {
          // Refresh Lyrics
          if (config.verbose) {
            console.log("Fetching lyrics");
            console.log(track.body.item?.id);
          }
          try {
            lyrics = await fetch(
              `https://spot-api.lvna.workers.dev/lyrics/${track.body.item?.id}`,
            ).then((res) => res.json());
          } catch (e) {
            console.error("Failed to fetch lyrics");
            console.error(e);
          }
        }
      } catch (e) {
        console.error("Failed to fetch current playback state");
        console.error(e);
      }
    }, config.modules.spotify.interval);
  })();
