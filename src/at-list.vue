<template>
  <div class="at-list">
    <template v-for="(item, index) in list" :key="index">
      <div
        v-if="!item.isSubjectTitle"
        class="at-list__item"
        :class="{
          'at-list__item--active': index === curIndex,
        }"
        @click="$emit('click-item', item)"
        @mouseenter="onMouseEnter(index)"
      >
        <slot
          v-bind:item="item"
          v-bind:index="index"
          v-bind:curIndex="curIndex"
        >
          {{ item }}
        </slot>
      </div>
      <div v-else class="at-list__subject-title">
        <slot
          v-bind:item="item"
          v-bind:index="index"
          v-bind:curIndex="curIndex"
        >
          {{ item.title }}
        </slot>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AtList",
  emits: ["update:curIndex", "click-item"],
  props: {
    showSubjectTitle: {
      type: Boolean,
      default: true,
    },
    list: {
      type: Array,
      required: true,
    },
    curIndex: {
      type: Number,
      required: true,
    },
  },
  setup(props, ctx) {
    return {
      onMouseEnter(index: number) {
        ctx.emit("update:curIndex", index);
      },
    };
  },
});
</script>
