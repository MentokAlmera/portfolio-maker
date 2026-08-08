<template>
  <div class="min-h-screen bg-white text-[#70453c]">

    <!-- HERO -->
    <section class="min-h-screen bg-[#e4dcd3] px-6 py-8">

      <!-- NAVIGATION -->
      <nav class="mx-auto max-w-6xl">

        <div
          class="flex items-center justify-end gap-8
                 border-b-2 border-black pb-4"
        >

          <a
            href="#how-it-works"
            class="text-lg text-[#70453c] transition hover:opacity-70"
          >
            HOW IT WORKS
          </a>

          <RouterLink
            to="/signup"
            class="text-lg text-[#70453c] underline transition hover:opacity-70"
          >
            START
          </RouterLink>

          <RouterLink
            to="/login"
            class="text-lg text-[#70453c] underline transition hover:opacity-70"
          >
            LOGIN
          </RouterLink>

        </div>

      </nav>


      <!-- HERO CONTENT -->
      <div
        class="mx-auto flex min-h-[80vh] max-w-6xl
               flex-col items-center justify-center"
      >

        <h1
          class="text-center font-serif text-6xl font-black
                 tracking-wide text-[#70453c]
                 md:text-7xl"
        >
          AGEEMAKE
        </h1>

        <h2
          class="text-center font-serif text-4xl font-black
                 text-[#70453c] md:text-5xl"
        >
          MAKE YOUR PORTFOLIO NOW
        </h2>

        <p
          class="mt-2 text-center text-lg
                 text-[#70453c]"
        >
          WITH AGEEMAKE YOU CAN CREATE YOUR OWN PORTFOLIO NOW
        </p>

        <RouterLink
          to="/signup"
          class="mt-10 rounded-full bg-[#b58e83]
                 px-10 py-2 text-sm font-bold
                 text-[#70453c] underline
                 transition hover:bg-[#a77e72]"
        >
          GET STARTED NOW
        </RouterLink>

      </div>

    </section>


    <!-- HOW IT WORKS -->
    <section
      id="how-it-works"
      class="min-h-screen px-6 py-16"
    >

      <h2
        class="text-center font-serif text-4xl
               font-black text-[#70453c]"
      >
        HOW IT WORKS
      </h2>

      <div
        class="mx-auto mt-10 grid max-w-6xl
               grid-cols-1 gap-10 md:grid-cols-3"
      >

        <div
          class="flex h-32 items-center justify-center
                 rounded-3xl bg-[#70453c] px-6
                 text-center text-xl text-white"
        >
          Click started now
        </div>

        <div
          class="flex h-32 items-center justify-center
                 rounded-3xl bg-[#70453c] px-6
                 text-center text-xl text-white"
        >
          Create an account
        </div>

        <div
          class="flex h-32 items-center justify-center
                 rounded-3xl bg-[#70453c] px-6
                 text-center text-xl text-white"
        >
          Click create portfolio
        </div>

        <div
          class="flex h-32 items-center justify-center
                 rounded-3xl bg-[#70453c] px-6
                 text-center text-xl text-white"
        >
          Fill up information
        </div>

        <div
          class="flex h-32 items-center justify-center
                 rounded-3xl bg-[#70453c] px-6
                 text-center text-xl text-white"
        >
          Publish portfolio
        </div>

        <div
          class="flex h-32 items-center justify-center
                 rounded-3xl bg-[#70453c] px-6
                 text-center text-xl text-white"
        >
          Yay! You have your portfolio now
        </div>

      </div>

    </section>

  </div>
</template>