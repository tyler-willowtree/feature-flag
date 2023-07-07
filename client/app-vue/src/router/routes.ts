import Examples from '@/views/Examples.vue'
import MainLayout from '@/layout/MainLayout.vue'
import TestOnePage from '@/views/TestOnePage.vue'
import TestTwoPage from '@/views/TestTwoPage.vue'
import type { Component } from 'vue'

declare module 'vue-router' {
  interface RouteMeta {
    layout?: Component
    inNav?: {
      label: string
      order: number
      flagName?: string
    }
  }
}

export const routes = [
  {
    path: '/',
    component: Examples,
    meta: {
      layout: MainLayout,
      inNav: {
        label: 'Home',
        order: 0
      }
    }
  },
  {
    path: '/test-one',
    component: TestOnePage,
    meta: {
      layout: MainLayout,
      inNav: {
        label: 'Test One',
        order: 1
      }
    }
  },
  {
    path: '/test-two',
    component: TestTwoPage,
    meta: {
      layout: MainLayout,
      inNav: {
        label: 'Test Two',
        order: 2,
        flagName: 'a-example-only'
      }
    }
  }
]
