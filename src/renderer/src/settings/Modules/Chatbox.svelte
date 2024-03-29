<script lang="ts">
  import { writable, type Writable } from "svelte/store";
  import type { Config } from "../../../../shared/config";
  import { ClientConfig, Events } from "../../../../shared/moduleRunner";
  import Switch from "../../components/Switch.svelte";
  import moduleRunner from "../../lib/moduleRunner";

  const enabled = writable(false);

  let config: Writable<ClientConfig | null> = writable(null);

  let serverConfig: Writable<Config["modules"]["chatbox"] | null> =
    writable(null);

  moduleRunner.getConfig().then((newConfig) => {
    config.set(newConfig);
    enabled.set(newConfig[ClientConfig.chatboxEnabled]);
    enabled.subscribe((value) => {
      moduleRunner.updateParameter(ClientConfig.chatboxEnabled, value);
    });

    moduleRunner.on(Events.configUpdate, (newVar, val) => {
      $config[newVar] = val;
      if (newVar === ClientConfig.chatboxEnabled) {
        enabled.set(val as boolean);
      }
    });
  });

  moduleRunner.getServerConfig().then((newConfig) => {
    $serverConfig = newConfig.modules.chatbox;
    serverConfig.subscribe(async (value) => {
      const newerConfig = await moduleRunner.getServerConfig();
      newerConfig.modules.chatbox = value;
      moduleRunner.setServerConfig(newerConfig);
      moduleRunner.saveServerConfig();
    });
  });

  const indexToSetEnum = (i: number) =>
    [
      ClientConfig.messageSet1,
      ClientConfig.messageSet2,
      ClientConfig.messageSet3,
      ClientConfig.messageSet4,
      ClientConfig.messageSet5,
      ClientConfig.messageSet6,
      ClientConfig.messageSet7,
    ][i];
</script>

<label for="chatboxEnabled" class="text-white">Enable Chatbox</label>
<Switch bind:value={$enabled} />

{#if !config || !$serverConfig}
  <div>Loading...</div>
{:else}
  <div>
    <h1>Sets</h1>
    <div>
      {#each $serverConfig.sets as set, i}
        <div>Set {i + 1}</div>
        <Switch
          bind:value={$config[indexToSetEnum(i)]}
          on:change={() =>
            moduleRunner.updateParameter(
              indexToSetEnum(i),
              $config[indexToSetEnum(i)]
            )}
        />
        <div>Messages</div>
        <div>
          {#each set.filter((i) => typeof i === "string") as _, j}
            <input type="text" bind:value={$serverConfig.sets[i][j + 1]} />
          {/each}
        </div>
      {/each}
    </div>
  </div>
{/if}
