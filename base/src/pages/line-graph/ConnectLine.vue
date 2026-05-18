<template>
  <div class="canvas" @click="handleCanvasClick">
    <!-- 渲染所有节点 -->
    <Node
      v-for="node in nodes"
      :key="node.id"
      :node="node"
      @select="handleNodeClick"
    />

    <!-- 渲染所有连线 -->
    <Connection
      v-for="(conn, index) in connections"
      :key="index"
      :from="getNodeCenter(conn.from)"
      :to="getNodeCenter(conn.to)"
    />

    <!-- 当前选中状态提示 -->
    <div class="status">
      <div>当前选择起点：<strong>{{ selectedId || '无' }}</strong></div>
      <div class="help-text">点击节点选择起点，再点击另一个节点创建连线</div>
      <div class="connections-count">已创建连线：{{ connections.length }} 条</div>
    </div>

    <!-- 操作按钮 -->
    <div class="controls">
      <button @click="clearAllConnections" class="btn btn-danger">
        清除所有连线
      </button>
      <button @click="addNewNode" class="btn btn-primary">
        添加节点
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, provide } from 'vue'
import Node from './Node.vue'
import Connection from './Connection.vue'

// 初始节点数据
const nodes = reactive([
  { id: 'A', x: 100, y: 200 },
  { id: 'B', x: 400, y: 300 },
  { id: 'C', x: 250, y: 100 },
  { id: 'D', x: 500, y: 150 },
])

// 连线数据
const connections = reactive([])
const selectedId = ref(null)
let nodeIdCounter = 5

// 向子组件提供选中状态
provide('selectedId', selectedId)

// 获取节点中心点坐标
function getNodeCenter(nodeId) {
  const node = nodes.find(n => n.id === nodeId)
  if (!node) return { x: 0, y: 0 }

  // 节点尺寸是 80x50，所以中心点偏移 40x25
  return {
    x: node.x + 40,
    y: node.y + 25,
  }
}

// 节点点击事件：连线逻辑
function handleNodeClick(id) {
  if (!selectedId.value) {
    // 选择起点
    selectedId.value = id
  } else if (selectedId.value !== id) {
    // 选择终点，创建连线
    const exists = connections.some(
      c => (c.from === selectedId.value && c.to === id) ||
           (c.from === id && c.to === selectedId.value)
    )
    if (!exists) {
      connections.push({ from: selectedId.value, to: id })
    }
    selectedId.value = null
  } else {
    // 点击同一个节点，取消选择
    selectedId.value = null
  }
}

// 点击画布取消选择
function handleCanvasClick() {
  selectedId.value = null
}

// 清除所有连线
function clearAllConnections() {
  connections.splice(0, connections.length)
  selectedId.value = null
}

// 添加新节点
function addNewNode() {
  const newNode = {
    id: String.fromCharCode(64 + nodeIdCounter), // A, B, C, D, E, F...
    x: Math.random() * 600 + 50,
    y: Math.random() * 400 + 50,
  }
  nodes.push(newNode)
  nodeIdCounter++
}

// 计算统计信息
const stats = computed(() => {
  return {
    nodeCount: nodes.length,
    connectionCount: connections.length,
  }
})
</script>

<style>
.canvas {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  overflow: hidden;
  font-family: 'Arial', sans-serif;
}

.status {
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 14px;
  line-height: 1.6;
  z-index: 10;
}

.help-text {
  color: #666;
  font-size: 12px;
  margin-top: 5px;
}

.connections-count {
  color: #409eff;
  font-weight: bold;
  margin-top: 5px;
}

.controls {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  z-index: 10;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #409eff;
  color: white;
}

.btn-primary:hover {
  background: #337ecc;
  transform: translateY(-1px);
}

.btn-danger {
  background: #f56c6c;
  color: white;
}

.btn-danger:hover {
  background: #d85454;
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
}
</style>
