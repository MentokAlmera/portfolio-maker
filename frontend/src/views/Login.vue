<template>
  <div class="min-h-screen flex items-center justify-center bg-[#f8f3ed] px-6">
    <div class="w-full max-w-md">

      <h1
        class="text-center font-serif text-5xl font-black text-[#70453c]"
      >
        Welcome Back
      </h1>

      <p class="mt-3 text-center text-[#70453c]">
        Login to your AGEEMAKE account
      </p>

      <form
        @submit.prevent="handleLogin"
        class="mt-8 space-y-4"
      >

        <!-- Email -->
        <input
          v-model="form.email"
          type="email"
          placeholder="Email"
          required
          class="w-full rounded-lg border border-[#d8c5b8] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#70453c]"
        />

        <!-- Password -->
        <input
          v-model="form.password"
          type="password"
          placeholder="Password"
          required
          class="w-full rounded-lg border border-[#d8c5b8] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#70453c]"
        />

        <!-- Error -->
        <p
          v-if="errorMessage"
          class="text-sm text-red-600"
        >
          {{ errorMessage }}
        </p>

        <!-- Login -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-lg bg-[#70453c] px-4 py-3 font-semibold text-white transition hover:bg-[#5c3831] disabled:opacity-50"
        >
          {{ loading ? "Logging in..." : "Login" }}
        </button>

      </form>

      <p class="mt-6 text-center text-sm text-[#70453c]">
        Don't have an account?

        <button
          type="button"
          @click="$router.push('/signup')"
          class="font-bold underline"
        >
          Sign Up
        </button>
      </p>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "../services/auth.service.js";

const router = useRouter();

const form = reactive({
  email: "",
  password: "",
});

const loading = ref(false);
const errorMessage = ref("");

const handleLogin = async () => {
  errorMessage.value = "";
  loading.value = true;

  try {
    const response = await login(
      form.email,
      form.password
    );

    // Save authentication token
    localStorage.setItem("token", response.token);

    // Save user information
    localStorage.setItem(
      "user",
      JSON.stringify(response.user)
    );

    // Go to homepage
    router.push("/home");

  } catch (error) {
    errorMessage.value =
      error.response?.data?.message ||
      "Invalid email or password.";

  } finally {
    loading.value = false;
  }
};
</script>