<template>
  <div class="min-h-screen bg-white text-[#70453c]">

    <!-- NAVBAR -->
    <nav class="px-10 pt-10">

      <div
        class="mx-auto flex max-w-6xl
               justify-end gap-10
               border-b-2 border-black pb-4"
      >

        <RouterLink to="/home">
          HOME
        </RouterLink>

        <RouterLink
          to="/create"
          class="underline"
        >
          CREATE
        </RouterLink>

        <a href="#">
          PROJECTS
        </a>

      </div>

    </nav>


    <!-- HERO -->
    <main
      class="flex min-h-[80vh]
             items-center justify-center"
    >

      <div class="text-center">

        <h1
          class="font-serif text-6xl
                 font-black md:text-7xl"
        >
          AGEEMAKE
        </h1>

        <h2
          class="font-serif text-3xl
                 font-black"
        >
          MAKE YOUR PORTFOLIO NOW
        </h2>

        <p class="mt-2 text-lg">
          WITH AGEEMAKE YOU CAN CREATE
          YOUR OWN PORTFOLIO NOW
        </p>

        <RouterLink
          to="/create"
          class="mt-10 inline-block
                 rounded-full bg-[#b58e83]
                 px-10 py-2 text-sm
                 font-bold underline"
        >
          GET STARTED NOW
        </RouterLink>

      </div>

    </main>

  </div>
</template>