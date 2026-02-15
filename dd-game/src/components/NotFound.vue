<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1>404</h1>
      <h2>页面未找到</h2>
      <p>抱歉，您访问的页面不存在或已被移除。</p>
      <router-link to="/" class="home-button">返回首页</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 2rem;
}

.not-found-content {
  text-align: center;
  color: #e8e8e8;
}

.not-found-content h1 {
  font-size: 6rem;
  color: #ff6b6b;
  margin: 0;
  text-shadow: 0 0 20px rgba(255, 107, 107, 0.5);
}

.not-found-content h2 {
  font-size: 2rem;
  margin: 1rem 0;
  color: #ffd700;
}

.not-found-content p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: #aaa;
}

.home-button {
  display: inline-block;
  padding: 0.875rem 2rem;
  background: #ffd700;
  color: #1a1a2e;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.home-button:hover {
  background: #ffed4a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}
</style>