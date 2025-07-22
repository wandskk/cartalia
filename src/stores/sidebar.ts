import { defineStore } from 'pinia'
import { ref } from 'vue'
import { SIDEBAR } from '../constants'

export const useSidebarStore = defineStore('sidebar', () => {
  const stored = localStorage.getItem(SIDEBAR.STORAGE_KEY)
  const isCollapsed = ref(stored ? JSON.parse(stored) : false)
  const isMobileOpen = ref(false)

  const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value
    localStorage.setItem(SIDEBAR.STORAGE_KEY, JSON.stringify(isCollapsed.value))
  }

  const setCollapsed = (collapsed: boolean) => {
    isCollapsed.value = collapsed
    localStorage.setItem(SIDEBAR.STORAGE_KEY, JSON.stringify(isCollapsed.value))
  }

  const toggleMobile = () => {
    isMobileOpen.value = !isMobileOpen.value
  }

  const closeMobile = () => {
    isMobileOpen.value = false
  }

  return {
    isCollapsed,
    isMobileOpen,
    toggleCollapse,
    setCollapsed,
    toggleMobile,
    closeMobile
  }
}) 