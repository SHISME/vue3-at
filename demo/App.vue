<template>
  <div>1122</div>
  <vue3-at
    :list="list"
    :atMap="atMap"
    keyName="name"
    @at="onAt"
    :renderInsertItem="renderInsertItem"
  >
    <div class="editor" contenteditable></div>
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
    const atMap = ref({
      "@": [
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
      ],
    });
    return {
      list,
      atMap,
      onAt(chunk: string) {
        console.log("onAt:", chunk);
      },
      renderInsertItem(row: { name: string; userId: string }): string {
        return `<span style="color:red;" data-user-id="${row.userId}">@${row.name}</span>`;
      },
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
  text-align: left;
  border: solid 2px rgba(0, 0, 0, 0.5);
}
</style>
