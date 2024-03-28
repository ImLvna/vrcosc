<script lang="ts">
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import "./lib/moduleRunner";
  import Root from "./settings/Root.svelte";

  const sendToClient = writable(true);
  setContext("sendToClient", sendToClient);

  sendToClient.subscribe(window.moduleRunner.setSendToClient);
</script>

<Root />