<template>
  <div id="app">
    <h1>Cartalia</h1>
    <p>Marketplace de Cartas</p>
    <router-view />
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
  font-family: Arial, sans-serif;
}

h1 {
  color: #3F8CFF;
  margin-bottom: 1rem;
}

p {
  color: #666;
  margin-bottom: 2rem;
}
</style>
