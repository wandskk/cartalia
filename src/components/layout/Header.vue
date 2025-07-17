<template>
  <header class="header">
    <Logo />
    <div class="header-right">
      <NavMenu />
      <!-- <NotificationIcon /> -->
      <!-- <UserAvatar src="https://randomuser.me/api/portraits/women/44.jpg" /> -->
    </div>
  </header>
</template>

<script setup lang="ts">
import Logo from "../common/Logo.vue";
import NavMenu from "../common/NavMenu.vue";
// import NotificationIcon from '../common/NotificationIcon.vue'
// import UserAvatar from '../common/UserAvatar.vue'
</script>

<style scoped lang="scss">
@use "../../styles/_variables.scss" as *;
.header {
  width: 100%;
  height: 64px;
  background: $white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2.5rem;
  border-bottom: 1px solid $gray-200;
  box-sizing: border-box;
  position: relative;
  z-index: 10;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}
@media (max-width: 700px) {
  .header {
    padding: 0 1rem;
  }
  .header-right {
    gap: 0.5rem;
  }
}
</style>
