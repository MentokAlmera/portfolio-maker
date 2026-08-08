<template>
  <div class="min-h-screen flex items-center justify-center bg-[#f8f3ed] px-6">
    <div class="w-full max-w-md">

      <h1 class="text-center font-serif text-5xl font-black text-[#70453c]">
        Create Account
      </h1>

      <p class="mt-3 text-center text-[#70453c]">
        Create your AGEEMAKE account
      </p>

      <form @submit.prevent="handleSignup" class="mt-8 space-y-4">

        <input
          v-model="form.username"
          type="text"
          placeholder="Username"
          required
          class="w-full rounded-lg border border-[#d8c5b8] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#70453c]"
        />

        <input
          v-model="form.email"
          type="email"
          placeholder="Email"
          required
          class="w-full rounded-lg border border-[#d8c5b8] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#70453c]"
        />

        <input
          v-model="form.password"
          type="password"
          placeholder="Password"
          required
          class="w-full rounded-lg border border-[#d8c5b8] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#70453c]"
        />

        <input
          v-model="form.confirmPassword"
          type="password"
          placeholder="Confirm Password"
          required
          class="w-full rounded-lg border border-[#d8c5b8] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#70453c]"
        />

        <p v-if="errorMessage" class="text-sm text-red-600">
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-lg bg-[#70453c] px-4 py-3 font-semibold text-white transition hover:bg-[#5c3831] disabled:opacity-50"
        >
          {{ loading ? "Creating account..." : "Sign Up" }}
        </button>

      </form>

      <p class="mt-6 text-center text-sm text-[#70453c]">
        Already have an account?
        <button
          @click="$router.push('/login')"
          class="font-bold underline"
        >
          Login
        </button>
      </p>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { signup } from "../services/auth.service.js";

const router = useRouter();

const form = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const loading = ref(false);
const errorMessage = ref("");

const handleSignup = async () => {
  errorMessage.value = "";
  loading.value = true;

  try {
    await signup(form);

    // Save email temporarily for the verification page
    localStorage.setItem("verificationEmail", form.email);

    // Go to verification page
    router.push("/verify-email");

  } catch (error) {
    errorMessage.value =
      error.response?.data?.message ||
      "Something went wrong. Please try again.";

  } finally {
    loading.value = false;
  }
};
</script>