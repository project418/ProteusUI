import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  const isCollapsed = ref(localStorage.getItem('sidebar-collapsed') === 'true')
  const isMobileOpen = ref(false)

  const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value
    localStorage.setItem('sidebar-collapsed', isCollapsed.value)
  }

  const toggleMobileMenu = () => {
    isMobileOpen.value = !isMobileOpen.value
  }

  return { isCollapsed, isMobileOpen, toggleSidebar, toggleMobileMenu }
})