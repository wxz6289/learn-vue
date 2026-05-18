<template>
  <div
    class="node"
    :class="{ 'node-selected': isSelected }"
    :style="{ left: node.x + 'px', top: node.y + 'px' }"
    @mousedown="startDrag"
    @click.stop="emit('select', node.id)"
  >
    {{ node.id }}
  </div>
</template>

<script setup>
import { defineProps, defineEmits, inject, computed } from 'vue'

const props = defineProps({
  node: Object,
})

const emit = defineEmits(['select'])

// 从父组件注入选中状态
const selectedId = inject('selectedId', null)
const isSelected = computed(() => selectedId?.value === props.node.id)

let offsetX = 0, offsetY = 0
let dragging = false

function startDrag(e) {
  dragging = true
  offsetX = e.clientX - props.node.x
  offsetY = e.clientY - props.node.y
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', endDrag)
  e.preventDefault() // 防止文本选择
}

function onMove(e) {
  if (!dragging) return
  props.node.x = e.clientX - offsetX
  props.node.y = e.clientY - offsetY
}

function endDrag() {
  dragging = false
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseup', endDrag)
}
</script>

<style scoped>
.node {
  position: absolute;
  width: 80px;
  height: 50px;
  background: linear-gradient(135deg, #409eff, #337ecc);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: grab;
  font-weight: bold;
  font-size: 16px;
  user-select: none;
  border: 2px solid transparent;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  transition: all 0.2s ease;
  z-index: 2;
}

.node:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
  background: linear-gradient(135deg, #337ecc, #285a99);
}

.node:active {
  cursor: grabbing;
  transform: translateY(0);
}

.node-selected {
  border-color: #f56c6c;
  background: linear-gradient(135deg, #f56c6c, #d85454);
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.4);
  animation: pulse 1.5s infinite;
}

.node-selected:hover {
  background: linear-gradient(135deg, #d85454, #b84242);
  box-shadow: 0 6px 16px rgba(245, 108, 108, 0.5);
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
</style>
