<script setup lang="ts">

</script>

<template>
  <div class="w-full px-1 pt-2 pb-5">
    <input
      ref="input"
      v-model.trim="searchText"
      class="w-full h-8 px-2 border-2 border-gray-100 rounded-md dark:bg-gray-900 dark:focus:border-gray-400 dark:border-gray-500 dark:text-gray-300 focus:outline-none focus:border-gray-200"
      type="text"
      placeholder="Add or create a tag"
      @click.stop
      @input="gotoTop"
      @keydown.enter="selectTag()"
      @keydown.up.prevent="moveCursorUp()"
      @keydown.down.prevent="moveCursorDown()"
    >

    <div
      ref="container"
      class="w-full pr-2 mt-2 space-y-1 overflow-auto tags-container max-h-48 ic-scroller"
    >
      <div
        v-for="(tag, index) in filteredList"
        :key="tag"
        class="flex px-2 py-2 capitalize transition-colors rounded-md cursor-pointer fnnt-bold"
        :class="[
          `select-item-${index}`,
          preSelectedValue == tag && 'bg-gray-500 text-white',
          isSelected(tag.uid) ? 'bg-gray-200 hover:bg-gray-200 ' : 'hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-gray-50'
        ]"
        @click.stop="selectTag(tag)"
      >
        <div class="w-2 h-5" :class="tag.colors && tag.colors[1]" />

        <div class="w-full h-full ml-2">
          {{ tag.name }}
        </div>

        <div class="flex items-center justify-center w-10 px-2 py-1 transition-colors rounded-full hover:bg-gray-700 hover:text-white" @click.prevent.stop="state.selectedTag=tag">
          <i class="fa fa-edit" />
        </div>
      </div>
    </div>

    <div v-if="searchText && filteredList.length == 0 && allowAdd">
      <button class="w-full h-8 px-2" @click="addTag">
        Add tag:  "{{ searchText }}"
      </button>
    </div>
    <div v-else-if="filteredList.length == 0 && searchText" class="text-center">
      <span> This tag doesn't exists</span>
    </div>
  </div>
</template>
