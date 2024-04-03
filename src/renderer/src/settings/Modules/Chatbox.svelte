<script lang="ts">
  import { writable } from "svelte/store";
  import { ClientConfig } from "../../../../shared/moduleRunner";
  import Switch from "../../components/Switch.svelte";
  import moduleRunner from "../../lib/moduleRunner";

  let config = writable(moduleRunner.config);

  let serverConfig = writable(
    window.electron.config.getConfigModule("chatbox")
  );

  $: window.electron.config.setConfigModule("chatbox", $serverConfig);

  const indexToSetEnum = (i: number) =>
    [
      ClientConfig.messageSet1,
      ClientConfig.messageSet2,
      ClientConfig.messageSet3,
      ClientConfig.messageSet4,
      ClientConfig.messageSet5,
      ClientConfig.messageSet6,
      ClientConfig.messageSet7,
    ][i] as
      | ClientConfig.messageSet1
      | ClientConfig.messageSet2
      | ClientConfig.messageSet3
      | ClientConfig.messageSet4
      | ClientConfig.messageSet5
      | ClientConfig.messageSet6
      | ClientConfig.messageSet7;
</script>

<label for="chatboxEnabled" class="text-white">Enable Chatbox</label>
<Switch
  bind:value={$config[ClientConfig.chatboxEnabled]}
  on:change={() =>
    moduleRunner.updateParameter(
      ClientConfig.chatboxEnabled,
      $config[ClientConfig.chatboxEnabled]
    )}
/>

{#if !config || !$serverConfig}
  <div>Loading...</div>
{:else}
  <div class="size-full">
    <h1>Sets</h1>
    <div class="w-full">
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
        <div class="flex flex-col w-full">
          {#each set.filter((i) => typeof i === "string") as _, j}
            <div class="w-full">
              <input
                class="w-11/12"
                type="text"
                bind:value={$serverConfig.sets[i][j + 1]}
              />
              <button
                on:click={() => {
                  $serverConfig.sets[i].splice(j + 1, 1);
                  serverConfig.set($serverConfig);
                }}
              >
                X
              </button>
            </div>
          {/each}
          <button
            on:click={() => {
              $serverConfig.sets[i].push("");
              serverConfig.set($serverConfig);
            }}
          >
            Add
          </button>
        </div>
      {/each}
    </div>
  </div>
{/if}
