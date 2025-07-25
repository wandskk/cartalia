<template>
  <v-container class="register-container">
    <v-row justify="center" align="center" style="min-height: calc(100vh - 64px);">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="register-card" elevation="4">
          <v-card-text class="pa-6">
            <Form :validation-schema="schema" @submit="onSubmit" class="register-form">
              <h2 class="register-title text-center mb-6">Criar conta</h2>
              <Field name="name" v-slot="{ field, errorMessage, meta }">
                <v-text-field
                  v-bind="field"
                  label="Nome"
                  placeholder="Digite seu nome"
                  type="text"
                  autocomplete="name"
                  variant="outlined"
                  :error="!!errorMessage && meta.touched"
                  :error-messages="errorMessage && meta.touched ? errorMessage : ''"
                  class="mb-4"
                />
              </Field>
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
                  autocomplete="new-password"
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
                Cadastrar
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
                  to="/login"
                  class="text-none"
                >
                  Já tem uma conta? Entrar
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
import { registerSchema } from "../../../schemas";
import { useAuthForm } from '../../../composables/useAuthForm';

const schema = toFormValidator(registerSchema);
const { onSubmit, loading, error } = useAuthForm('register');
</script>

<style scoped lang="scss">
.register-container {
  background: $gray-100;
}

.register-card {
  border-radius: 12px;
}

.register-form {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.register-title {
  font-weight: 700;
  font-size: 2rem;
  color: $gray-900;
}

@media (max-width: 480px) {
  .register-card {
    margin: 1rem;
  }
}
</style>
