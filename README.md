<img src="./demo/demo1.jpg" width="400" />

It is a library like at.js for vue3.

## Install

> npm install vue3-at --save

## Usage

```vue

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
      onAt({ at, inputChunk }: { at: string; inputChunk: string }) {
        console.log("onAt:", at, inputChunk);
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

```

## Props

```typescript

interface IVue3AtProps {
  /**
   * required
   * key is 'at' character which when you input it will show the list,
   * keyName is the property name of the list's item.
   */
  atMap:{ [at: string]: {list: any[];keyName: string;[]} };
  
  /**
   * optional
   * Use it to render custom tag
   * @param item; atMap list's item
   */
  renderTagItem:(item: any) => string;
  
  /**
   * optional
   * If you want tag can be modified,set it to false
   * @default true
   */
  disabledModifyTag: boolean;
  
  /**
   * optional
   * It will control the visible of subject title
   * 
   * @default true;
   */
  showSubjectTitle: boolean;
  
  /**
   * optional
   * Enable space between @ and word
   * 
   * @default false;
   */
  allowSpaces: boolean;
  
  /**
   * optional
   * If you want to filter by your self, use it to control.
   * @param item; atMap list's item
   * @param inputChunk; inputing chunk
   * @param keyName;
   */
  filtersFn:(item:any, inputChunk:string, keyName:string) => boolean;
}

```

## events

### at

parameter: `{at: string; inputChunk:string}` 

when at will be input

### insert-tag

parameter is the item which will be inserted

### click-list-item

parameter is the item which had be clicked in list.

### input

no parameter.
