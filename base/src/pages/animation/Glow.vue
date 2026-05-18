
<template>
  <div class="glow-container">
    <h1 class="glow-text fade-glow">正在思考中...</h1>
  </div>
</template>

<style scoped>
.glow-container {
  display: flex;
  justify-content: center;
  align-items: center;
  /* height: 100vh; */
  /* background: #111; */
  overflow: hidden;
}


.glow-text {
  font-size: 3rem;
  color: #fff;
  position: relative;
  background: linear-gradient(
    120deg,
    #ffffff 0%,
    #aaaaaa 20%,
    #ffffff 40%,
    #aaaaaa 60%,
    #ffffff 80%,
    #aaaaaa 100%
  );
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  /* 扫光动画 */
  animation: light-sweep 3s linear infinite;
}

.fade-glow {
  /* 渐隐渐显动画 */
  animation: light-sweep 3s linear infinite, fade-inout 2.4s ease-in-out infinite alternate;
}


@keyframes light-sweep {
  0% {
    background-position: -100% center;
  }
  100% {
    background-position: 100% center;
  }
}

@keyframes fade-inout {
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
}
</style>
