<template>
  <header class="header">
    <Container>
      <div class="header-content">
        <Logo />
        <div class="header-right">
          <NavMenu />
          <!-- <NotificationIcon /> -->
          <!-- <UserAvatar src="https://randomuser.me/api/portraits/women/44.jpg" /> -->
        </div>
      </div>
    </Container>
  </header>
</template>

<script setup lang="ts">
import Logo from "../common/Logo.vue";
import NavMenu from "../common/NavMenu.vue";
import Container from "../common/Container.vue";
// import NotificationIcon from "../common/NotificationIcon.vue";
// import UserAvatar from "../common/UserAvatar.vue";
</script>

<style scoped lang="scss">
@use "../../styles/_variables.scss" as *;
.header {
  width: 100%;
  height: 64px;
  background: $white;
  border-bottom: 1px solid $gray-200;
  box-sizing: border-box;
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
}
.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}
@media (max-width: 700px) {
  .header-content {
    gap: 0.5rem;
  }
  .header {
    height: auto;
  }
  .header-right {
    gap: 0.5rem;
  }
}
</style>
