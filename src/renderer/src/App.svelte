<script lang="ts">
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import "./app.css";
  import "./lib/moduleRunner";
  import Root from "./settings/Root.svelte";

  const uiSettings = writable(window.electron.config.getConfigModule("ui"));

  setContext("uiSettings", uiSettings);
  $: window.electron.config.setConfigModule("ui", $uiSettings);
</script>

<Root />
