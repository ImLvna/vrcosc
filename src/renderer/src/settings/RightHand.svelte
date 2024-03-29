<script lang="ts">
  import { writable } from "svelte/store";
  import { Events } from "../../../shared/moduleRunner";
  import Switch from "../components/Switch.svelte";
  import {
    default as ipcModuleRunner,
    default as moduleRunner,
  } from "../lib/moduleRunner";

  const sendToClient = writable(true);

  sendToClient.subscribe(moduleRunner.setSendToClient);

  const chatboxText = writable("");

  ipcModuleRunner.on(Events.chatboxToClient, (text) => {
    chatboxText.set(text);
  });
</script>

<div class="size-full flex flex-col justify-start p-5">
  <div
    class="chatbox w-full h-36 flex flex-col justify-center pl-5 pr-5 bg-violet-500 rounded-xl text-white"
  >
    <div
      class="bubble min-h-16 max-h-32 overflow-hidden flex flex-col justify-center items-center rounded-xl"
    >
      {#each $chatboxText.split("\n") as line}
        <div class="text-center">{line}</div>
      {/each}
    </div>
  </div>
  <div>
    <label for="sendToClient" class="text-white">Enable Luna OSC</label>
    <Switch bind:value={$sendToClient} />
  </div>
</div>

<style>
  .bubble {
    background-color: #3a4554;
  }
</style>
