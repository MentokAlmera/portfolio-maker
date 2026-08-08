<template>
  <div
    class="flex min-h-screen items-center
           justify-center bg-white px-6"
  >

    <div
      class="w-full max-w-3xl rounded-3xl
             bg-[#ebe7e2] px-8 py-12
             text-center text-[#70453c]"
    >

      <h1 class="font-serif text-xl font-black">
        Verification code sent! 📧
      </h1>

      <p class="mx-auto mt-5 max-w-2xl">
        A verification code has been sent to your
        email address. Please check your inbox
        and enter the code to verify your account.
      </p>

      <p class="mt-2">
        If you don't see the email, please check
        your spam or junk folder.
      </p>


      <!-- CODE INPUTS -->
      <div class="mt-8 flex justify-center gap-3">

        <input
          v-for="n in 6"
          :key="n"
          maxlength="1"
          class="h-16 w-16 rounded-2xl
                 bg-white text-center text-2xl
                 font-bold outline-none"
        />

      </div>


      <button
        class="mt-8 rounded-full bg-[#70453c]
               px-10 py-2 font-bold text-white"
      >
        VERIFY
      </button>

    </div>

  </div>
</template>