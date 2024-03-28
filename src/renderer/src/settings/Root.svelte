<script lang="ts">
  import { getContext } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import { Events } from "../../../shared/moduleRunner";
  import ipcModuleRunner from "../lib/moduleRunner";

  


  const sendToClient = getContext<Writable<boolean>>("sendToClient");

  const chatboxText = writable("");

  ipcModuleRunner.on(Events.chatboxToClient, (text) => {
    chatboxText.set(text);
  });
</script>

<input type="checkbox" bind:checked={$sendToClient} />
<div>
  {#if $sendToClient}
    <textarea bind:value={$chatboxText} />
  {:else}
    <p>Chatbox is disabled</p>
  {/if}
</div>