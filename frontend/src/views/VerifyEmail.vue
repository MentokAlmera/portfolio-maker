<template>
  <div class="min-h-screen flex items-center justify-center bg-[#f8f3ed] px-6">
    <div class="w-full max-w-md text-center">

      <!-- Title -->
      <h1 class="font-serif text-5xl font-black text-[#70453c]">
        Verify Your Email
      </h1>

      <p class="mt-4 text-[#70453c]">
        We sent a verification code to
      </p>

      <p class="mt-1 font-semibold text-[#70453c]">
        {{ email }}
      </p>

      <!-- Verification Form -->
      <form
        @submit.prevent="handleVerification"
        class="mt-8"
      >

        <input
          v-model="code"
          type="text"
          inputmode="numeric"
          maxlength="6"
          placeholder="Enter 6-digit code"
          required
          class="w-full rounded-lg border border-[#d8c5b8] bg-white px-4 py-4 text-center text-2xl tracking-[0.5em] text-[#70453c] outline-none focus:ring-2 focus:ring-[#70453c]"
        />

        <!-- Error -->
        <p
          v-if="errorMessage"
          class="mt-3 text-sm text-red-600"
        >
          {{ errorMessage }}
        </p>

        <!-- Success -->
        <p
          v-if="successMessage"
          class="mt-3 text-sm text-green-600"
        >
          {{ successMessage }}
        </p>

        <!-- Verify Button -->
        <button
          type="submit"
          :disabled="loading || code.length !== 6"
          class="mt-6 w-full rounded-lg bg-[#70453c] px-4 py-3 font-semibold text-white transition hover:bg-[#5c3831] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ loading ? "Verifying..." : "Verify Email" }}
        </button>

      </form>

      <!-- Back to Login -->
      <p class="mt-6 text-sm text-[#70453c]">
        Already verified?

        <button
          type="button"
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { verifyEmail } from "../services/auth.service.js";

const router = useRouter();

const email = ref(
  localStorage.getItem("verificationEmail") || ""
);

const code = ref("");

const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const handleVerification = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  if (!email.value) {
    errorMessage.value = "Email address not found.";
    return;
  }

  if (code.value.length !== 6) {
    errorMessage.value = "Please enter the 6-digit verification code.";
    return;
  }

  loading.value = true;

  try {
    await verifyEmail(email.value, code.value);

    successMessage.value = "Email verified successfully!";

    // Remove temporary email
    localStorage.removeItem("verificationEmail");

    // Go to login after verification
    setTimeout(() => {
      router.push("/login");
    }, 1000);

  } catch (error) {
    errorMessage.value =
      error.response?.data?.message ||
      "Verification failed. Please try again.";

  } finally {
    loading.value = false;
  }
};
</script>