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
      <template v-slot:default="{ item, index }">
        <slot name="listItem" v-bind:item="item" v-bind:index="index"></slot>
      </template>
    </AtList>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed } from "vue";
import {
  getCurRangeClone,
  applyRange,
  KeyCode,
  isTextNode,
  getRangeTagContainer,
} from "./util";
import AtList from "./at-list.vue";

export default defineComponent({
  name: "App",
  components: {
    AtList,
  },
  props: {
    atMap: {
      type: Object as PropType<{ [at: string]: any[] }>,
      default: () => ({}),
    },
    renderInsertItem: {
      type: Function,
      required: false,
    },
    disabledModifyTag: {
      type: Boolean,
      default: true,
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
        if (!keyName || item.isSubjectTitle) {
          return true;
        }
        return item[keyName].toLowerCase().includes(chunk.toLowerCase());
      },
    },
  },
  emits: ["at"],
  setup(props, ctx) {
    const atListVisible = ref(false);
    const atChats = computed(() => {
      return Object.keys(props.atMap);
    });
    const getAtIndex = (
      text: string
    ):
      | {
          at: string;
          index: number;
        }
      | false => {
      for (let i = 0; i < atChats.value.length; i++) {
        const index = text.indexOf(atChats.value[i]);
        if (index !== -1) {
          return {
            at: atChats.value[i],
            index,
          };
        }
      }
      return false;
    };
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
    const insertCustomHtmlToContent = (html: string) => {
      document.execCommand(
        "insertHTML",
        false,
        `<span is-tag="true">${html}</span>\u00A0`
      );
    };
    let curAt = "";
    let curAtIndex = -1;
    const inertItemToContent = (insertedItem: any) => {
      if (!lastInputRange) return;
      const rangeClone = lastInputRange.cloneRange();
      if (curAtIndex === -1) return;
      rangeClone.setStart(rangeClone.endContainer, curAtIndex);
      applyRange(rangeClone);
      if (props.renderInsertItem) {
        const customHtml = props.renderInsertItem(insertedItem);
        if (customHtml) {
          insertCustomHtmlToContent(customHtml);
        }
      } else {
        const itemText = insertedItem[props.keyName];
        insertTextToContent(curAt + itemText, rangeClone);
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
      atListVisible,
      matchedAtList,
      curIndex,
      onCompositionStart() {
        isInComposition = true;
      },
      onCompositionEnd() {
        isInComposition = false;
      },
      onKeyDown(e: KeyboardEvent) {
        if (e.isComposing) return;
        const resetRangeIfNeed = () => {
          if (!props.disabledModifyTag) return;
          const curRangeClone = getCurRangeClone();
          if (!curRangeClone) return;
          if (
            !(
              e.key.length <= 1 ||
              e.keyCode === KeyCode.enter ||
              e.keyCode === KeyCode.delete
            )
          )
            return;
          const tagContainer = getRangeTagContainer(curRangeClone);
          if (!tagContainer) return;
          const selection = document.getSelection();
          if (!selection) return;
          if (e.keyCode === KeyCode.delete) {
            if (curRangeClone.endOffset === 0) return;
            // 把整个tag删除
            curRangeClone.selectNode(tagContainer);
            selection.removeAllRanges();
            selection.addRange(curRangeClone);
            document.execCommand("delete");
            return;
          }
          // 输入的时候，
          // 如果光标在tag的前面，需要先插入一个空格才不会导致输入的内容在tag里面
          // 如果光标在tag里或后，则在tag后插入一个空格
          const emptyNode = document.createTextNode(" ");
          if (curRangeClone.endOffset === 0) {
            tagContainer.parentElement &&
              tagContainer.parentElement.insertBefore(emptyNode, tagContainer);
          } else {
            if (tagContainer.nextSibling) {
              tagContainer.parentElement!.insertBefore(
                emptyNode,
                tagContainer.nextSibling
              );
            } else {
              tagContainer.parentElement!.append(emptyNode);
            }
            curRangeClone.setStart(emptyNode, 1);
            selection.removeAllRanges();
            selection.addRange(curRangeClone);
          }
        };
        resetRangeIfNeed();
        if (!atListVisible.value) return;
        if (e.keyCode === KeyCode.enter) {
          if (matchedAtList.value[curIndex.value]) {
            inertItemToContent(matchedAtList.value[curIndex.value]);
          }
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
        const tagContainer = getRangeTagContainer(curRangeClone);
        if (tagContainer) {
          return;
        }
        lastInputRange = curRangeClone.cloneRange();
        const text = curRangeClone.toString();
        const atIndex = getAtIndex(text);
        if (!atIndex) {
          atListVisible.value = false;
          return;
        }
        curAtIndex = atIndex.index;
        curAt = atIndex.at;
        const inputChunk = text.slice(curAtIndex + curAt.length);
        let showFilterResult = true;
        if (!props.allowSpaces && /\s/.test(inputChunk)) {
          showFilterResult = false;
        }
        if (!showFilterResult) {
          atListVisible.value = false;
          return;
        }
        ctx.emit("at", inputChunk);
        const matchedList = !inputChunk
          ? [...props.atMap[curAt]]
          : props.atMap[curAt].filter((item) =>
              props.filtersFn(item, inputChunk, props.keyName)
            );
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
