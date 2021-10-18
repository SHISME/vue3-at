<template>
  <vue3-at :atMap="atMap" @at="onAt" :renderTagItem="renderTagItem">
    <div class="editor" contenteditable></div>
    <template v-slot:listItem="{ item }">
      <div v-if="item.isSubjectTitle">{{ item.title }}</div>
      <div class="list-item" v-else-if="item.tag">
        {{ item.tag }}
      </div>
      <div class="list-item" v-else>
        <img :src="item.avatar" alt="" />{{ item.name }}
      </div>
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
    const atMap = ref({
      "@": {
        keyName: "name",
        list: [
          {
            isSubjectTitle: true,
            title: "最近联系人",
          },
          {
            name: "SHISME",
            userId: "",
            avatar: "https://avatars.githubusercontent.com/u/17661313?s=40&v=4",
          },
          {
            name: "CAYAHUANG",
            userId: "",
            avatar:
              "https://avatars.githubusercontent.com/u/18247969?s=100&v=4",
          },
          {
            isSubjectTitle: true,
            title: "好友",
          },
          {
            name: "OuYang",
            userId: "",
            avatar:
              "https://avatars.githubusercontent.com/u/13029538?s=100&v=4",
          },
          {
            name: "SAGA",
            avatar:
              "https://avatars.githubusercontent.com/u/16740021?s=100&v=4",
            userId: "",
          },
        ],
      },
      "#": {
        keyName: "tag",
        list: [
          {
            tag: "666",
          },
        ],
      },
    });
    return {
      atMap,
      onAt(chunk: string) {
        console.log("onAt:", chunk);
      },
      renderTagItem(
        row: { name: string; userId: string } | { tag: string }
      ): string {
        if (row.tag) {
          return `<span style="color: deepskyblue">${row.tag}</span>`;
        }
        return `<span style="color:#003569;" data-user-id="${row.userId}">@${row.name}</span>`;
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
.list-item {
  text-align: left;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.list-item > img {
  width: 40px;
  margin: 0 24px;
}
</style>
