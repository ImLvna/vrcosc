<script lang="ts">
  import { writable } from "svelte/store";
  import { Events } from "../../../shared/moduleRunner";
  import Colored from "../components/Colored.svelte";
  import Switch from "../components/Switch.svelte";
  import { default as ipcModuleRunner } from "../lib/moduleRunner";

  const sendToClient = writable(true);

  sendToClient.subscribe(window.electron.other.setSendToClient);

  const chatboxText = writable("");

  ipcModuleRunner.on(Events.chatboxToClient, (text) => {
    chatboxText.set(text);
  });
</script>

<div class="size-full flex flex-col justify-start p-5">
  <Colored
    bg={500}
    text={"white"}
    class="chatbox w-full h-36 flex flex-col justify-center pl-5 pr-5  rounded-xl "
  >
    <div
      class="bubble min-h-16 max-h-32 overflow-hidden flex flex-col justify-center items-center rounded-xl"
    >
      {#each $chatboxText.split("\n") as line}
        <div class="text-center">{line}</div>
      {/each}
    </div>
  </Colored>
  <Colored text={"white"}>
    <label for="sendToClient">Enable Luna OSC</label>
    <Switch bind:value={$sendToClient} />
  </Colored>
</div>

<style>
  .bubble {
    background-color: #3a4554;
  }
</style>
