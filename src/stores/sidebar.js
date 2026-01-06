import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  const isCollapsed = ref(localStorage.getItem('sidebar-collapsed') === 'true')

  const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value
    localStorage.setItem('sidebar-collapsed', isCollapsed.value)
  }

  return { isCollapsed, toggleSidebar }
})