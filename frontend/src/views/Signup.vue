<template>
  <div
    class="flex min-h-screen items-center justify-center bg-[#f8f3ed] px-6"
  >
    <div class="w-full max-w-md">

      <!-- Header -->
      <h1
        class="text-center font-serif text-5xl font-black text-[#70453c]"
      >
        Create Account
      </h1>

      <p class="mt-3 text-center text-[#70453c]">
        Create your AGEEMAKE account
      </p>

      <!-- Signup Form -->
      <form
        @submit.prevent="handleSignup"
        class="mt-8 space-y-4"
      >

        <!-- Username -->
        <div>
          <input
            v-model="form.username"
            type="text"
            placeholder="Username"
            autocomplete="username"
            maxlength="20"
            @blur="validateUsername"
            class="w-full rounded-lg border border-[#d8c5b8] bg-white px-4 py-3 text-[#70453c] outline-none transition focus:border-[#70453c] focus:ring-2 focus:ring-[#70453c]"
            :class="{
              'border-red-500': errors.username,
            }"
          />

          <p
            v-if="errors.username"
            class="mt-1 text-sm text-red-600"
          >
            {{ errors.username }}
          </p>
        </div>

        <!-- Email -->
        <div>
          <input
            v-model="form.email"
            type="email"
            placeholder="Email"
            autocomplete="email"
            @blur="validateEmail"
            class="w-full rounded-lg border border-[#d8c5b8] bg-white px-4 py-3 text-[#70453c] outline-none transition focus:border-[#70453c] focus:ring-2 focus:ring-[#70453c]"
            :class="{
              'border-red-500': errors.email,
            }"
          />

          <p
            v-if="errors.email"
            class="mt-1 text-sm text-red-600"
          >
            {{ errors.email }}
          </p>
        </div>

        <!-- Password -->
        <div>
          <input
            v-model="form.password"
            type="password"
            placeholder="Password"
            maxlength="20"
            autocomplete="new-password"
            @blur="validatePassword"
            class="w-full rounded-lg border border-[#d8c5b8] bg-white px-4 py-3 text-[#70453c] outline-none transition focus:border-[#70453c] focus:ring-2 focus:ring-[#70453c]"
            :class="{
              'border-red-500': errors.password,
            }"
          />

          <p
            v-if="errors.password"
            class="mt-1 text-sm text-red-600"
          >
            {{ errors.password }}
          </p>

          <p
            v-else
            class="mt-1 text-xs text-[#8f7066]"
          >
            Password must be at least 8 characters.
          </p>
        </div>

        <!-- Confirm Password -->
        <div>
          <input
            v-model="form.confirmPassword"
            type="password"
            placeholder="Confirm Password"
            autocomplete="new-password"
            maxlength="20"
            @blur="validateConfirmPassword"
            class="w-full rounded-lg border border-[#d8c5b8] bg-white px-4 py-3 text-[#70453c] outline-none transition focus:border-[#70453c] focus:ring-2 focus:ring-[#70453c]"
            :class="{
              'border-red-500': errors.confirmPassword,
            }"
          />

          <p
            v-if="errors.confirmPassword"
            class="mt-1 text-sm text-red-600"
          >
            {{ errors.confirmPassword }}
          </p>
        </div>

        <!-- Backend Error -->
        <p
          v-if="errorMessage"
          class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {{ errorMessage }}
        </p>

        <!-- Sign Up Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-lg bg-[#70453c] px-4 py-3 font-semibold text-white transition hover:bg-[#5c3831] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ loading ? "Creating account..." : "Sign Up" }}
        </button>

      </form>

      <!-- Login Link -->
      <p class="mt-6 text-center text-sm text-[#70453c]">
        Already have an account?

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
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { signup } from "../services/auth.service.js";

const router = useRouter();

/*
|--------------------------------------------------------------------------
| Form
|--------------------------------------------------------------------------
*/

const form = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

/*
|--------------------------------------------------------------------------
| Validation Errors
|--------------------------------------------------------------------------
*/

const errors = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

/*
|--------------------------------------------------------------------------
| Other States
|--------------------------------------------------------------------------
*/

const loading = ref(false);
const errorMessage = ref("");

/*
|--------------------------------------------------------------------------
| Username Validation
|--------------------------------------------------------------------------
*/

const validateUsername = () => {
  errors.username = "";

  const username = form.username.trim();

  if (!username) {
    errors.username = "Username is required.";
    return false;
  }

  if (username.length < 3) {
    errors.username =
      "Username must be at least 3 characters.";
    return false;
  }

  return true;
};

/*
|--------------------------------------------------------------------------
| Email Validation
|--------------------------------------------------------------------------
*/

const validateEmail = () => {
  errors.email = "";

  const email = form.email.trim();

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    errors.email = "Email is required.";
    return false;
  }

  if (!emailPattern.test(email)) {
    errors.email =
      "Please enter a valid email address.";
    return false;
  }

  return true;
};

/*
|--------------------------------------------------------------------------
| Password Validation
|--------------------------------------------------------------------------
*/

const validatePassword = () => {
  errors.password = "";

  if (!form.password) {
    errors.password = "Password is required.";
    return false;
  }

  if (form.password.length < 8) {
    errors.password =
      "Password must be at least 8 characters.";
    return false;
  }

  /*
   * If the user already entered the
   * confirm password, check it again.
   */
  if (form.confirmPassword) {
    validateConfirmPassword();
  }

  return true;
};

/*
|--------------------------------------------------------------------------
| Confirm Password Validation
|--------------------------------------------------------------------------
*/

const validateConfirmPassword = () => {
  errors.confirmPassword = "";

  if (!form.confirmPassword) {
    errors.confirmPassword =
      "Please confirm your password.";
    return false;
  }

  if (form.password !== form.confirmPassword) {
    errors.confirmPassword =
      "Passwords do not match.";
    return false;
  }

  return true;
};

/*
|--------------------------------------------------------------------------
| Validate Entire Form
|--------------------------------------------------------------------------
*/

const validateForm = () => {
  const usernameValid = validateUsername();
  const emailValid = validateEmail();
  const passwordValid = validatePassword();
  const confirmPasswordValid =
    validateConfirmPassword();

  return (
    usernameValid &&
    emailValid &&
    passwordValid &&
    confirmPasswordValid
  );
};

/*
|--------------------------------------------------------------------------
| Signup
|--------------------------------------------------------------------------
*/

const handleSignup = async () => {
  errorMessage.value = "";

  /*
   * Validate everything before sending
   * the request to the backend.
   */
  const isValid = validateForm();

  if (!isValid) {
    return;
  }

  loading.value = true;

  try {
    /*
     * Remove unnecessary spaces from
     * username and email.
     */
    const signupData = {
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
    };

    /*
     * Send signup request to backend.
     */
    await signup(signupData);

    /*
     * Save the email temporarily.
     * VerifyEmail.vue will use this.
     */
    localStorage.setItem(
      "verificationEmail",
      form.email.trim()
    );

    /*
     * Go to email verification page.
     */
    router.push("/verify-email");

  } catch (error) {
    /*
     * Show backend error.
     */
    errorMessage.value =
      error.response?.data?.message ||
      "Something went wrong. Please try again.";

  } finally {
    loading.value = false;
  }
};
</script>