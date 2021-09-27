<template>
  <div class="at-list">
    <template v-for="(item, index) in list" :key="index">
      <div
        v-if="!item.isSubjectTitle"
        class="at-list__item"
        :class="{
          'at-list__item--active': index === curIndex,
        }"
        @mouseenter="onMouseEnter(index)"
      >
        {{ item }}
      </div>
      <div v-else class="at-list__subject-title">
        {{ item.title }}
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AtList",
  emits: ["update:curIndex"],
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
<style>
.at-list {
  top: 100%;
  width: 100%;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1), 0 0 2px 0 rgba(0, 0, 0, 0.12);
  position: absolute;
  background: #fff;
}
.at-list__item--active {
  background-color: rgb(245, 245, 245);
}
.at-list__subject-title {
  text-align: left;
}
</style>
