<script setup lang="ts">
import AppSiteItem from '../molecules/AppSiteItem.vue'
import IconHome from '~icons/carbon/home'
import IconActivities from '~icons/carbon/chart-point'
import IconPrompts from '~icons/carbon/help'
import IconCycle from '~icons/carbon/circle-dash'

defineProps<{ title: string }>()
const menu = [
  {
    icon: IconHome,
    label: 'Home',
    to: '/dashboard',
  }, {
    section: 'Activity',
    items: [
      {
        icon: IconActivities,
        label: 'Habits',
        to: '/dashboard/habits',
      }, {
        icon: IconPrompts,
        label: 'Prompts',
        to: '/dashboard/prompts',
      }, {
        icon: IconCycle,
        label: 'Cycles',
        to: '/dashboard/cycles',
      }, {
        icon: IconCycle,
        label: 'Rewards',
        to: '/dashboard/rewards',
      },
    ],
  }, {
    section: 'Resources',
    items: [
      {
        icon: IconCycle,
        label: 'Resources',
        to: '/dashboard/resources',
      }, {
        icon: IconCycle,
        label: 'My Resources',
        to: '/dashboard/my-resources',
      },
    ],
  },
]
</script>

<template>
  <div class="bg-white">
    <div class="">
      <router-link to="/dashboard" class="relative flex items-center py-4 pl-5 brand-handler">
        <slot name="brand">
          <div class="flex">
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fill-rule="evenodd">
                <path
                  d="M10 0h12a10 10 0 0110 10v12a10 10 0 01-10 10H10A10 10 0 010 22V10A10 10 0 0110 0z"
                  fill="#FFF"
                />
                <path
                  d="M5.3 10.6l10.4 6v11.1l-10.4-6v-11zm11.4-6.2l9.7 5.5-9.7 5.6V4.4z"
                  fill="#555AB9"
                />
                <path
                  d="M27.2 10.6v11.2l-10.5 6V16.5l10.5-6zM15.7 4.4v11L6 10l9.7-5.5z"
                  fill="#91BAF8"
                />
              </g>
            </svg>
            <h1 class="text-xl font-bold">
              {{ title }}
            </h1>
          </div>
        </slot>
      </router-link>
    </div>
    <div v-for="(item, index) in menu" :key="`menu-${index}`" class="section-item">
      <div v-if="item.section">
        <p class="pl-5 mt-2 text-sm font-bold text-gray-400 capitalize">
          {{ item.section }}
        </p>
        <div>
          <AppSiteItem v-for="childItem in item.items" :key="`${item.section}-${childItem.label}`" :item="childItem" />
        </div>
      </div>
      <AppSiteItem v-else :item="item" />
    </div>
  </div>
</template>

<style lang="scss">
.brand-handler::before {
    content: "";
    position: absolute;
    right: -1px;
    height: 100%;
    display: block;
    width: 1px;
    background: linear-gradient(rgb(255, 255, 255) 0%, rgb(220, 228, 243) 100%);
}
.brand-handler, .section-item:not(:last-child) {
    position: relative;
    &::after {
        content: "";
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 100%;
        display: block;
        height: 2px;
        background: linear-gradient(rgb(255, 255, 255) 33%, rgb(220, 228, 243) 100%);
    }
}
</style>
