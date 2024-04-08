<script lang="ts">
  import { writable } from "svelte/store";
  import { ClientConfig } from "../../../../shared/moduleRunner";
  import Collapse from "../../components/Collapse.svelte";
  import Colored from "../../components/Colored.svelte";
  import Switch from "../../components/Switch.svelte";
  import moduleRunner from "../../lib/moduleRunner";

  let config = writable(moduleRunner.config);

  let serverConfig = writable(
    window.electron.config.getConfigModule("spotify")
  );

  $: window.electron.config.setConfigModule("spotify", $serverConfig);
</script>

<Collapse>
  <div slot="title" class="flex flex-row justify-between w-full pr-5">
    <label for="chatboxEnabled" class="text-white self-center">Spotify</label>
  </div>
  <div slot="titleRight">
    <Switch
      bind:value={$config[ClientConfig.spotifyEnabled]}
      on:change={() =>
        moduleRunner.updateParameter(
          ClientConfig.spotifyEnabled,
          $config[ClientConfig.spotifyEnabled]
        )}
    />
  </div>

  <div slot="content">
    {#if !config || !$serverConfig}
      <div>Loading...</div>
    {:else}
      <div class="size-full">
        <div class="w-full flex flex-row justify-between">
          <label for="lyrics">Lyrics</label>
          <Switch bind:value={$serverConfig["lyrics"]} />
        </div>
      </div>

      <!-- clientId -->
      <div class="w-full flex flex-row justify-between">
        <label for="clientId">Client ID</label>
        <Colored bg={800} class="rounded-xl">
          <input
            class="bg-blue-800"
            type="text"
            id="clientId"
            bind:value={$serverConfig["clientId"]}
          />
        </Colored>
      </div>

      <!-- clientSecret -->
      <div class="w-full flex flex-row justify-between">
        <label for="clientSecret">Client Secret</label>
        <Colored bg={800} class="rounded-xl">
          <input
            class="bg-blue-800"
            type="text"
            id="clientSecret"
            bind:value={$serverConfig["clientSecret"]}
          />
        </Colored>
      </div>

      <!-- refreshToken -->
      <div class="w-full flex flex-row justify-between">
        <label for="refreshToken">Refresh Token</label>
        <Colored bg={800} class="rounded-xl">
          <input
            class="bg-blue-800"
            type="text"
            id="refreshToken"
            bind:value={$serverConfig["refreshToken"]}
          />
        </Colored>
      </div>

      <Collapse>
        <div slot="title" class="flex flex-row justify-between w-full pr-5">
          <span class="text-white self-center">Advanced</span>
        </div>
        <div slot="content">
          <!-- redirectUri -->
          <div class="w-full flex flex-row justify-between">
            <label for="redirectUri">Redirect URI</label>
            <Colored bg={800} class="rounded-xl">
              <input
                type="text"
                id="redirectUri"
                bind:value={$serverConfig["redirectUri"]}
              />
            </Colored>
          </div>

          <!-- interval -->

          <div class="w-full flex flex-row justify-between">
            <label for="interval">Polling Interval</label>
            <Colored bg={800} class="rounded-xl">
              <input
                type="number"
                id="interval"
                bind:value={$serverConfig["interval"]}
              />
            </Colored>
          </div>
        </div>
      </Collapse>
    {/if}
  </div>
</Collapse>

<style>
  input {
    background: inherit;
  }
</style>
