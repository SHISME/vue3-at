<template>
  <div>1122</div>
  <vue3-at>
    <div class="editor" contenteditable></div>
  </vue3-at>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Vue3At } from "../src/";

export default defineComponent({
  name: "App",
  components: {
    Vue3At,
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.editor {
  width: 400px;
  height: 200px;
  overflow: auto;
  white-space: pre-wrap;
  border: solid 2px rgba(0, 0, 0, 0.5);
}
</style>
