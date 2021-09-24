<template>
  <div
    class="at-wrapper"
    @compositionstart="onCompositionStart"
    @compositionend="onCompositionEnd"
    @keydown.capture="onKeyDown"
    @input="onInput"
  >
    <slot></slot>
    <div v-if="showAtList" class="at-list">666</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { getCurRangeClone } from "./util";

export default defineComponent({
  name: "App",
  props: {
    at: {
      type: String,
      default: "@",
    },
    list: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    keyName: {
      type: String,
      default: "",
    },
    allowSpaces: {
      type: Boolean,
      default: false,
    },
    filtersFn: {
      type: Function as PropType<
        (item: any, chunk: string, keyName?: string) => boolean
      >,
      default: (item: any, chunk: string, keyName?: string) => {
        console.log("item:", chunk, this);
        if (!keyName) {
          return true;
        }
        return item[keyName].toLowerCase().includes(chunk.toLowerCase());
      },
    },
  },
  setup(props) {
    const showAtList = ref(true);
    let isInComposition = false;
    return {
      showAtList,
      onCompositionStart() {
        isInComposition = true;
      },
      onCompositionEnd() {
        isInComposition = false;
        console.log("handleCompositionEnd");
      },
      onKeyDown(e: KeyboardEvent) {
        // if (showAtList.value) {
        //   console.log("e:", e);
        // }
      },
      onInput() {
        if (isInComposition) return;
        const curRangeClone = getCurRangeClone();
        if (!curRangeClone) return;
        const text = curRangeClone.toString();
        const lastAtIndex = text.lastIndexOf(props.at);
        if (lastAtIndex === -1) return;
        const inputChunk = text.slice(lastAtIndex + props.at.length);
        let showFilterResult = false;
        if (!props.allowSpaces && /\s/.test(inputChunk)) {
          showFilterResult = false;
        }
        if (!showFilterResult) {
          showAtList.value = false;
          return;
        }
        console.log("inputChunk:", inputChunk);
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
.at-wrapper {
  position: relative;
}
.at-list {
  top: 100%;
  position: absolute;
}
</style>
