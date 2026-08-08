<template>
  <div class="min-h-screen bg-white px-6 py-10 text-[#70453c]">

    <!-- BRAND -->
    <div class="mx-auto max-w-6xl">

      <h1
        class="font-serif text-5xl font-black"
      >
        AGEEMAKE
      </h1>

      <h2
        class="mt-2 font-serif text-xl font-black"
      >
        MAKE YOUR PORTFOLIO NOW
      </h2>

    </div>


    <!-- SIGN UP FORM -->
    <div class="mx-auto mt-10 max-w-6xl">

      <div
        class="rounded-3xl bg-[#ebe7e2]
               p-10"
      >

        <div class="grid gap-8 md:grid-cols-2">

          <!-- USERNAME -->
          <div>
            <label>username</label>

            <input
              type="text"
              class="mt-2 w-full rounded-full
                     bg-white px-5 py-3
                     outline-none"
            />
          </div>


          <!-- EMAIL -->
          <div>
            <label>email</label>

            <input
              type="email"
              class="mt-2 w-full rounded-full
                     bg-white px-5 py-3
                     outline-none"
            />
          </div>


          <!-- PASSWORD -->
          <div>
            <label>password</label>

            <input
              type="password"
              class="mt-2 w-full rounded-full
                     bg-white px-5 py-3
                     outline-none"
            />
          </div>


          <!-- CONFIRM PASSWORD -->
          <div>
            <label>confirm password</label>

            <input
              type="password"
              class="mt-2 w-full rounded-full
                     bg-white px-5 py-3
                     outline-none"
            />
          </div>

        </div>


        <button
          class="float-right mt-10 rounded-full
                 bg-white px-12 py-2 text-xl
                 font-bold text-[#70453c]"
        >
          SIGN UP
        </button>

        <div class="clear-both"></div>

      </div>

    </div>

  </div>
</template>