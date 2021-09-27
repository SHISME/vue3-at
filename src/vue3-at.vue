<template>
  <div
    class="at-wrapper"
    @compositionstart="onCompositionStart"
    @compositionend="onCompositionEnd"
    @keydown.capture="onKeyDown"
    @input="onInput"
  >
    <slot></slot>
    <AtList
      v-if="atListVisible"
      :list="matchedAtList"
      v-model:curIndex="curIndex"
      class="at-list"
    >
      666
    </AtList>
    <span v-if="matchedAtList[curIndex]" ref="customItem" v-show="false">
      <slot name="customItem" :item="matchedAtList[curIndex]"></slot>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onMounted } from "vue";
import {
  getCurRangeClone,
  applyRange,
  KeyCode,
  isTextNode,
  htmlToElement,
} from "./util";
import AtList from "./at-list.vue";

export default defineComponent({
  name: "App",
  components: {
    AtList,
  },
  props: {
    at: {
      type: String,
      default: "@",
    },
    list: {
      type: Array,
      default: () => [],
    },
    keyName: {
      type: String,
      default: "",
    },
    showSubjectTitle: {
      type: Boolean,
      default: true,
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
        console.log("item:", chunk);
        if (!keyName || item.isSubjectTitle) {
          return true;
        }
        return item[keyName].toLowerCase().includes(chunk.toLowerCase());
      },
    },
  },
  emits: ["at"],
  setup(props, ctx) {
    onMounted(() => {
      console.log("ctx:", ctx);
    });
    const customItem = ref<HTMLElement>();
    const atListVisible = ref(false);
    const curIndex = ref(1);
    let isInComposition = false;
    const matchedAtList = ref<any[]>([]);
    let lastInputRange: Range;
    const insertTextToContent = (text: string, range: Range) => {
      range.deleteContents();
      const { endContainer } = range;
      if (isTextNode(endContainer)) {
        const cutOffset = range.endOffset;
        endContainer.data =
          endContainer.data.slice(0, cutOffset) +
          text +
          endContainer.data.slice(cutOffset);
        range.setEnd(endContainer, cutOffset + text.length);
      } else {
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.setEndAfter(textNode);
      }
      range.collapse(false);
      applyRange(range);
    };
    const insertCustomHtmlToContent = (html: string, range: Range) => {
      range.deleteContents();
      const insertedElement = document.createElement("span");
      insertedElement.appendChild(htmlToElement(html));
      insertedElement.appendChild(document.createTextNode(""));
      insertedElement.setAttribute("contenteditable", "false");
      range.insertNode(insertedElement);
      range.setEndAfter(insertedElement);
      range.collapse(false);
      applyRange(range);
    };
    const inertCurItemToContent = () => {
      if (!lastInputRange) return;
      const rangeClone = lastInputRange.cloneRange();
      const text = rangeClone.toString();
      const lastAtIndex = text.lastIndexOf(props.at);
      if (lastAtIndex === -1) return;
      rangeClone.setStart(rangeClone.endContainer, lastAtIndex);
      applyRange(rangeClone);
      if (ctx.slots.customItem) {
        const customHtml = customItem.value?.innerHTML;
        if (customHtml) {
          insertCustomHtmlToContent(customHtml, rangeClone);
        }
      } else {
        const itemText = matchedAtList.value[curIndex.value][props.keyName];
        insertTextToContent(props.at + itemText, rangeClone);
      }
    };

    const onPressUpOrDown = (keyCode: number) => {
      if (!atListVisible.value) return;
      const offset = keyCode === KeyCode.up ? -1 : 1;
      let nextIndex = curIndex.value + offset;
      nextIndex = Math.min(
        Math.max(nextIndex, 0),
        matchedAtList.value.length - 1
      );
      // subject title不可选中
      while (
        matchedAtList.value[nextIndex] &&
        matchedAtList.value[nextIndex].isSubjectTitle
      ) {
        nextIndex += offset;
        if (nextIndex < 0) {
          nextIndex += 2;
        }
      }
      curIndex.value = nextIndex;
    };
    return {
      customItem,
      atListVisible,
      matchedAtList,
      curIndex,
      onCompositionStart() {
        isInComposition = true;
      },
      onCompositionEnd() {
        isInComposition = false;
        console.log("handleCompositionEnd");
      },
      onKeyDown(e: KeyboardEvent) {
        if (!atListVisible.value) return;
        if (e.keyCode === KeyCode.enter) {
          inertCurItemToContent();
          atListVisible.value = false;
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        if (e.keyCode === KeyCode.up || e.keyCode === KeyCode.down) {
          onPressUpOrDown(e.keyCode);
          e.preventDefault();
          e.stopPropagation();
          return;
        }
      },
      onInput() {
        if (isInComposition) return;
        const curRangeClone = getCurRangeClone();
        if (!curRangeClone) return;
        lastInputRange = curRangeClone.cloneRange();
        const text = curRangeClone.toString();
        const lastAtIndex = text.lastIndexOf(props.at);
        if (lastAtIndex === -1) {
          atListVisible.value = false;
          return;
        }
        const inputChunk = text.slice(lastAtIndex + props.at.length);
        let showFilterResult = true;
        if (!props.allowSpaces && /\s/.test(inputChunk)) {
          showFilterResult = false;
        }
        console.log("showFilterResult:", showFilterResult);
        if (!showFilterResult) {
          atListVisible.value = false;
          return;
        }
        ctx.emit("at", inputChunk);
        const matchedList = !inputChunk
          ? [...props.list]
          : props.list.filter((item) =>
              props.filtersFn(item, inputChunk, props.keyName)
            );
        console.log("matchedList:", matchedList);
        if (matchedList.length > 0) {
          atListVisible.value = true;
          matchedAtList.value = [...matchedList];
        } else {
          atListVisible.value = false;
        }
      },
    };
  },
});
</script>

<style>
.at-wrapper {
  position: relative;
  display: inline-block;
}
</style>
