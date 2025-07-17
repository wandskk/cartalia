<template>
  <div class="login-container">
    <Card>
      <Form :validation-schema="schema" @submit="onSubmit" class="login-form">
        <h2 class="login-title">Bem-vindo de volta</h2>
        <Field name="email" v-slot="{ field, errorMessage, meta }">
          <div class="field-group">
            <BaseInput
              v-bind="field"
              label="E-mail"
              placeholder="Digite seu e-mail"
              type="email"
              autocomplete="email"
              :error="!!errorMessage && meta.touched"
            />
            <span v-if="errorMessage && meta.touched" class="field-error">{{
              errorMessage
            }}</span>
          </div>
        </Field>
        <Field name="password" v-slot="{ field, errorMessage, meta }">
          <div class="field-group">
            <BaseInput
              v-bind="field"
              label="Senha"
              placeholder="Digite sua senha"
              type="password"
              autocomplete="current-password"
              :error="!!errorMessage && meta.touched"
            />
            <span v-if="errorMessage && meta.touched" class="field-error">{{
              errorMessage
            }}</span>
          </div>
        </Field>
        <BaseButton type="submit" :loading="loading" color="primary"
          >Entrar</BaseButton
        >
        <div class="register-link">
          <a href="/register">Não tem uma conta? Cadastre-se</a>
        </div>
      </Form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Form, Field } from "vee-validate";
import { toFormValidator } from "@vee-validate/zod";
import { useAuthStore } from "../../../stores/auth";
import { useLoadingStore } from "../../../stores/loading";
import { useRouter } from "vue-router";
import BaseInput from "../../common/BaseInput.vue";
import BaseButton from "../../common/BaseButton.vue";
import Card from "../../common/Card.vue";
import { loginSchema } from "../../../schemas/auth/login.schema";
import { useNotificationStore } from "../../../stores/notification";

const schema = toFormValidator(loginSchema);
const loading = ref(false);
const error = ref("");
const auth = useAuthStore();
const globalLoading = useLoadingStore();
const router = useRouter();
const notification = useNotificationStore();

async function onSubmit(values: any) {
  error.value = "";
  loading.value = true;
  globalLoading.startLoading();
  try {
    await auth.login(values.email, values.password);
    notification.show("Login realizado com sucesso!", "success");
    router.push("/dashboard");
  } catch (e: any) {
    notification.show("E-mail ou senha inválidos", "error");
  } finally {
    loading.value = false;
    globalLoading.stopLoading();
  }
}
</script>

<style scoped lang="scss">
@use "../../../styles/_variables.scss" as *;

.login-container {
  width: 100%;
  margin: 0 auto;
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: $gray-100;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  margin-top: 0;
}
.login-title {
  margin: 0 0 1.5rem 0;
  font-weight: 700;
  font-size: 2rem;
  text-align: center;
  color: $gray-900;
}
.login-error {
  text-align: center;
  font-size: 1rem;
  margin-top: -0.5rem;
}
.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.field-error {
  color: $error;
  font-size: 0.98rem;
  margin-top: 0.1rem;
  margin-bottom: 0.2rem;
  display: flex;
  align-items: center;
  text-align: left;
  min-height: 1.2em;
}
.register-link {
  text-align: center;
  margin-top: 0.5rem;
  font-size: 0.98rem;
}
.register-link a {
  color: $gray-500;
  text-decoration: underline;
  transition: color 0.2s;
}
.register-link a:hover {
  color: $primary;
}
@media (max-width: 480px) {
  .login-form {
    min-width: 0;
    padding: 1.5rem 0.5rem 1.5rem 0.5rem;
  }
}
</style>
