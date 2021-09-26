<template>
  <div>1122</div>
  <vue3-at :list="list" keyName="name">
    <div class="editor" contenteditable></div>
    <template v-slot:customItem="{ item }">
      <span style="color: red">@{{ item.name }}</span>
    </template>
  </vue3-at>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Vue3At } from "../src/";

export default defineComponent({
  name: "App",
  components: {
    Vue3At,
  },
  setup() {
    const list = ref([
      {
        isSubjectTitle: true,
        title: "最近联系人",
      },
      {
        name: "sh",
        userId: "",
      },
      {
        name: "sh2",
        userId: "",
      },
      {
        isSubjectTitle: true,
        title: "好友",
      },
      {
        name: "sh",
        userId: "",
      },
      {
        name: "sh2",
        userId: "",
      },
    ]);
    return {
      list,
    };
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
