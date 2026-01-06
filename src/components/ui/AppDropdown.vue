<template>
  <div class="relative w-full" ref="containerRef">
    <div @click.stop="toggle" class="cursor-pointer" ref="triggerRef">
      <slot name="trigger" :isOpen="isOpen"></slot>
    </div>

    <teleport to="body">
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div 
          v-if="isOpen" 
          @click.stop
          v-click-outside="close"
          :style="dropdownStyles"
          class="fixed bg-card border border-line rounded-2xl shadow-xl p-2 z-[9999] overflow-hidden"
        >
          <div ref="contentRef">
            <slot name="content" :close="close"></slot>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, onUnmounted, nextTick } from 'vue';

const props = defineProps({
  isCollapsed: { type: Boolean, default: false },
  position: { type: String, default: 'bottom' }
});

const isOpen = ref(false);
const triggerRef = ref(null);
const contentRef = ref(null);
const dropdownStyles = ref({});

const toggle = async () => {
  if (!isOpen.value) {
    isOpen.value = true;
    await nextTick();
    calculatePosition();
  } else {
    isOpen.value = false;
  }
};

const close = () => {
  isOpen.value = false;
};

const calculatePosition = () => {
  if (!triggerRef.value || !isOpen.value) return;
  
  const rect = triggerRef.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const gap = 8;

  const menuHeight = contentRef.value?.offsetHeight || 250;
  const menuWidth = props.isCollapsed ? 240 : rect.width;

  let styles = { width: `${menuWidth}px` };

  if (props.isCollapsed) {
    styles.left = `${rect.right + gap}px`;
    
    let topPos = rect.top;
    if (topPos + menuHeight > viewportHeight) {
      topPos = viewportHeight - menuHeight - 32;
    }
    styles.top = `${topPos}px`;
  } else {
    styles.left = `${rect.left}px`;
    
    const spaceBelow = viewportHeight - rect.bottom;
    const hasSpaceBelow = spaceBelow > menuHeight + gap;

    if (props.position === 'top' || !hasSpaceBelow) {
      styles.bottom = `${viewportHeight - rect.top + gap}px`;
    } else {
      styles.top = `${rect.bottom + gap}px`;
    }
  }

  dropdownStyles.value = styles;
};

window.addEventListener('resize', calculatePosition);
onUnmounted(() => window.removeEventListener('resize', calculatePosition));

const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target) || triggerRef.value?.contains(event.target))) {
        binding.value();
      }
    };
    document.addEventListener('mousedown', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener('mousedown', el.clickOutsideEvent);
  }
};
</script>