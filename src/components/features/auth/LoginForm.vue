<template>
  <v-container class="login-container">
    <v-row justify="center" align="center" style="min-height: calc(100vh - 64px);">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="login-card" elevation="4">
          <v-card-text class="pa-6">
            <Form :validation-schema="schema" @submit="onSubmit" class="login-form">
              <h2 class="login-title text-center mb-6">Bem-vindo de volta</h2>
              
              <Field name="email" v-slot="{ field, errorMessage, meta }">
                <v-text-field
                  v-bind="field"
                  label="E-mail"
                  placeholder="Digite seu e-mail"
                  type="email"
                  autocomplete="email"
                  variant="outlined"
                  :error="!!errorMessage && meta.touched"
                  :error-messages="errorMessage && meta.touched ? errorMessage : ''"
                  class="mb-4"
                />
              </Field>
              
              <Field name="password" v-slot="{ field, errorMessage, meta }">
                <v-text-field
                  v-bind="field"
                  label="Senha"
                  placeholder="Digite sua senha"
                  type="password"
                  autocomplete="current-password"
                  variant="outlined"
                  :error="!!errorMessage && meta.touched"
                  :error-messages="errorMessage && meta.touched ? errorMessage : ''"
                  class="mb-6"
                />
              </Field>
              
              <v-btn
                type="submit"
                :loading="loading"
                color="primary"
                block
                size="large"
                class="mb-4"
              >
                Entrar
              </v-btn>
              
              <v-alert
                v-if="error"
                type="error"
                variant="tonal"
                class="mb-4"
                text="center"
              >
                {{ error }}
              </v-alert>
              
              <div class="text-center">
                <v-btn
                  variant="text"
                  color="primary"
                  to="/register"
                  class="text-none"
                >
                  Não tem uma conta? Cadastre-se
                </v-btn>
              </div>
            </Form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { Form, Field } from "vee-validate";
import { toFormValidator } from "@vee-validate/zod";
import { loginSchema } from "../../../schemas/login.schema";
import { useAuthForm } from '../../../composables/useAuthForm';

const schema = toFormValidator(loginSchema);
const { onSubmit, loading, error } = useAuthForm('login');
</script>

<style scoped lang="scss">
@use "../../../styles/_variables.scss" as *;

.login-container {
  background: $gray-100;
}

.login-card {
  border-radius: 12px;
}

.login-form {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.login-title {
  font-weight: 700;
  font-size: 2rem;
  color: $gray-900;
}

@media (max-width: 480px) {
  .login-card {
    margin: 1rem;
  }
}
</style>
