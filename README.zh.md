<img src="./demo/demo1.jpg" width="400" />

这是一个基于vue3实现的用来实现@人的组件

## 安装

> npm install vue3-at --save

## 用法

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
   * 
   * map的key是用来触发@的关键字，如果你设置为 '#',这个字符就会触发匹配关键字
   * list是要匹配的列表，如果列表中的选项的isSubjectTitle为true，那么匹配的时候会自动过滤掉他
   * keyName是用指用list的哪个字段来做匹配，如果你设置了filtersFn，那么这个不填也没啥影响
   */
  atMap:{ [at: string]: {list: any[];keyName: string;[]} };
  
  /**
   * optional
   * 这个是用来自定义渲染插入的tag长啥样
   * @param item; atMap list's item
   */
  renderTagItem:(item: any) => string;
  
  /**
   * optional
   * 如果你想要你插入的tag可以继续修改，就设置这个为false
   * @default true
   */
  disabledModifyTag: boolean;
  
  /**
   * optional
   * 是否显示list中isSubjectTitle为true的选项
   * 
   * @default true;
   */
  showSubjectTitle: boolean;
  
  /**
   * optional
   * 是否允许匹配时中间是否能有空格，例如 @ 他 这样
   * 
   * @default false;
   */
  allowSpaces: boolean;
  
  /**
   * optional
   * 自定义匹配规则
   * @param item; 
   * @param inputChunk; 当前匹配的内容
   * @param keyName;
   */
  filtersFn:(item:any, inputChunk:string, keyName:string) => boolean;
}

```

## events

### at

parameter: `{at: string; inputChunk:string}`

当触发@的时候会触发，回传参数会告诉你是哪个关键字触发的，还有关键字后面的内容

### insert-tag

插入tag时触发，参数是被插入的选项的值

### click-list-item

点击列表中的item事件，参数是点击的选项的值

### input

输入事件，无回调值

## slot

### list-item

下拉列表的选项

slot scoped:item,curIndex,index
