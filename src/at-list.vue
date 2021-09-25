<template>
  <div class="at-list">
    <template v-for="(item, index) in list" :key="index">
      <div
        v-if="!item.isSubjectTitle"
        class="at-list__item"
        :class="{
          'at-list__item--active': index === curIndex,
        }"
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
});
</script>
<style>
.at-list {
  top: 100%;
  position: absolute;
}
.at-list__item--active {
  color: red;
}
</style>
