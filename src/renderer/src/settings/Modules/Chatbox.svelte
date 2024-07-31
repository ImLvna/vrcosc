<script lang="ts">
  import { writable } from "svelte/store";
  import { ClientConfig, Events } from "../../../../shared/moduleRunner";
  import Collapse from "../../components/Collapse.svelte";
  import Colored from "../../components/Colored.svelte";
  import Switch from "../../components/Switch.svelte";
  import moduleRunner from "../../lib/moduleRunner";

  let config = writable(moduleRunner.config);

  moduleRunner.on(
    Events.configUpdate,
    (p, v) => (($config[p] as number | boolean) = v)
  );

  let serverConfig = writable(
    window.electron.config.getConfigModule("chatbox")
  );

  $: window.electron.config.setConfigModule("chatbox", $serverConfig);
</script>

<Collapse>
  <div slot="title" class="flex flex-row justify-between w-full pr-5">
    <label for="chatboxEnabled" class="self-center">Chatbox</label>
  </div>
  <div slot="titleRight">
    <Switch
      bind:value={$config[ClientConfig.chatboxEnabled]}
      on:change={() =>
        moduleRunner.updateParameter(
          ClientConfig.chatboxEnabled,
          $config[ClientConfig.chatboxEnabled]
        )}
    />
  </div>

  <div slot="content">
    {#if !config || !$serverConfig}
      <div>Loading...</div>
    {:else}
      <div class="size-full">
        <div class="w-full flex flex-row justify-between">
          <label for="messages">Messages</label>
          <Switch
            bind:value={$config[ClientConfig.messageEnabled]}
            on:change={() =>
              moduleRunner.updateParameter(
                ClientConfig.messageEnabled,
                $config[ClientConfig.messageEnabled]
              )}
          />
        </div>
        <h1>Sets</h1>
        <div class="w-full">
          {#each $serverConfig.sets as set, i}
            <div>Set {i + 1}</div>
            <Switch
              value={$serverConfig.sets[i][0]}
              on:change={() => {
                $serverConfig.sets[i][0] = !$serverConfig.sets[i][0];
                serverConfig.set($serverConfig);
              }}
            />
            <div>Messages</div>
            <div class="flex flex-col w-full">
              {#each set.filter((i) => typeof i === "string") as _, j}
                <div class="w-full">
                  <Colored bg={800} class="rounded-xl">
                    <input
                      class="w-11/12"
                      type="text"
                      bind:value={$serverConfig.sets[i][j + 1]}
                    />
                  </Colored>
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
              <button
                on:click={() => {
                  $serverConfig.sets.splice(i, 1);
                  serverConfig.set($serverConfig);
                }}
              >
                Remove Set
              </button>
            </div>
          {/each}

          <button
            on:click={() => {
              $serverConfig.sets.push([true, ""]);
              serverConfig.set($serverConfig);
            }}
          >
            Add Set
          </button>
        </div>
      </div>
    {/if}
  </div>
</Collapse>

<style>
  input {
    background: inherit;
  }
</style>
