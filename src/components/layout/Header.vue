<template>
  <header class="header">
    <Container>
      <div class="header-content">
        <div class="header-left">
          <HamburgerButton 
            :is-open="isMobileOpen" 
            @toggle="toggleMobile" 
          />
          <Logo />
        </div>
        <div class="header-right">
          <BaseButton 
            v-if="!isAuthenticated" 
            @click="handleButtonClick" 
            color="primary"
          >
            {{ buttonText }}
          </BaseButton>
        </div>
      </div>
    </Container>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useSidebar } from "../../composables/useSidebar";
import Logo from "../common/Logo.vue";
import BaseButton from "../common/BaseButton.vue";
import Container from "../common/Container.vue";
import HamburgerButton from "../common/HamburgerButton.vue";

const router = useRouter();
const route = useRoute();
const { isMobileOpen, toggleMobile, isAuthenticated } = useSidebar();

const currentRoute = computed(() => route.path);

const buttonText = computed(() => {
  if (currentRoute.value === "/login") {
    return "Registrar";
  }

  if (currentRoute.value === "/register") {
    return "Entrar";
  }

  return "Entrar";
});

const handleButtonClick = () => {
  if (currentRoute.value === "/login") {
    router.push("/register");
  } else {
    router.push("/login");
  }
};
</script>

<style scoped lang="scss">
@use "../../styles/_variables.scss" as *;

.header {
  width: 100%;
  height: 64px;
  background: $white;
  border-bottom: 1px solid $gray-200;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
  display: flex;
  align-items: center;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

@media (max-width: 700px) {
  .header-content {
    gap: 0.5rem;
  }

  .header {
    height: auto;
    padding: 0.5rem 0;
  }

  .header-left {
    gap: 0.5rem;
  }

  .header-right {
    gap: 0.5rem;
  }
}
</style>
