<template>
  <div class="register-container">
    <div class="register-card">
      <Form
        :validation-schema="schema"
        @submit="onSubmit"
        class="register-form"
      >
        <h2 class="register-title">Criar conta</h2>
        <Field name="name" v-slot="{ field, errorMessage, meta }">
          <div class="field-group">
            <BaseInput
              v-bind="field"
              label="Nome"
              placeholder="Digite seu nome"
              type="text"
              autocomplete="name"
              :error="!!errorMessage && meta.touched"
            />
            <span v-if="errorMessage && meta.touched" class="field-error">{{
              errorMessage
            }}</span>
          </div>
        </Field>
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
              autocomplete="new-password"
              :error="!!errorMessage && meta.touched"
            />
            <span v-if="errorMessage && meta.touched" class="field-error">{{
              errorMessage
            }}</span>
          </div>
        </Field>
        <BaseButton type="submit" :loading="loading" color="primary"
          >Cadastrar</BaseButton
        >
        <span v-if="error" class="error-text register-error">{{ error }}</span>
        <div class="login-link">
          <a href="/login">Já tem uma conta? Entrar</a>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Form, Field } from "vee-validate";
import { toFormValidator } from "@vee-validate/zod";
import BaseInput from "../../common/BaseInput.vue";
import BaseButton from "../../common/BaseButton.vue";
import { registerSchema } from "../../../schemas";
import { useAuthForm } from '../../../composables/useAuthForm';

const schema = toFormValidator(registerSchema);
const { onSubmit, loading, error } = useAuthForm('register');

</script>

<style scoped lang="scss">
@use "../../../styles/_variables.scss" as *;

.register-container {
  width: 100%;
  margin: 0 auto;
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: $gray-100;
}

.register-card {
  background: $white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  margin-top: 0;
}
.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.register-title {
  margin: 0 0 1.5rem 0;
  font-weight: 700;
  font-size: 2rem;
  text-align: center;
  color: $gray-900;
}
.register-error {
  text-align: center;
  font-size: 1rem;
  margin-top: -0.5rem;
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
.login-link {
  text-align: center;
  margin-top: 0.5rem;
  font-size: 0.98rem;
}
.login-link a {
  color: $gray-500;
  text-decoration: underline;
  transition: color 0.2s;
}
.login-link a:hover {
  color: $primary;
}
@media (max-width: 480px) {
  .register-form {
    min-width: 0;
    padding: 1.5rem 0.5rem 1.5rem 0.5rem;
  }
}
</style>
