<template>
  <svg class="connection-svg">
    <defs>
      <!-- 定义箭头标记 -->
      <marker
        id="arrowhead"
        markerWidth="10"
        markerHeight="7"
        refX="9"
        refY="3.5"
        orient="auto"
      >
        <polygon
          points="0 0, 10 3.5, 0 7"
          fill="#666"
        />
      </marker>
    </defs>
    <path
      :d="path"
      stroke="#666"
      stroke-width="2"
      fill="none"
      marker-end="url(#arrowhead)"
      class="connection-path"
    />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  from: Object, // {x, y}
  to: Object,   // {x, y}
})

// 计算贝塞尔曲线路径
const path = computed(() => {
  if (!props.from || !props.to) return ''

  const { x: x1, y: y1 } = props.from
  const { x: x2, y: y2 } = props.to

  // 计算控制点，创建平滑的曲线
  const dx = x2 - x1
  const dy = y2 - y1
  const distance = Math.sqrt(dx * dx + dy * dy)

  // 根据距离调整曲线弯曲程度
  const curvature = Math.min(distance * 0.3, 100)

  const cp1x = x1 + curvature
  const cp1y = y1
  const cp2x = x2 - curvature
  const cp2y = y2

  return `M ${x1},${y1} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`
})
</script>

<style scoped>
.connection-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.connection-path {
  transition: stroke 0.2s ease;
}

.connection-path:hover {
  stroke: #409eff;
  stroke-width: 3;
}
</style>
