<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();


// ======================================================
// USER
// ======================================================

const user = JSON.parse(
  localStorage.getItem("user") || "null"
);


// ======================================================
// LOAD DRAFTS
// ======================================================

const drafts = JSON.parse(
  localStorage.getItem("portfolioDrafts") || "[]"
);


// ======================================================
// LOAD PUBLISHED
// ======================================================

const published = JSON.parse(
  localStorage.getItem("publishedPortfolios") || "[]"
);


// ======================================================
// ALL RECENT WORK
// ======================================================

const recentWorks = computed(() => {

  const all = [
    ...drafts.map((item) => ({
      ...item,
      type: "draft",
    })),

    ...published.map((item) => ({
      ...item,
      type: "published",
    })),
  ];

  return all
    .sort(
      (a, b) =>
        new Date(b.savedAt) -
        new Date(a.savedAt)
    )
    .slice(0, 3);
});


// ======================================================
// OPEN PROJECT
// ======================================================

const openProject = (project) => {

  if (project.status === "draft") {

    localStorage.setItem(
      "editingDraftId",
      project.id
    );

    router.push("/create");

    return;
  }

  localStorage.setItem(
    "viewingPortfolioId",
    project.id
  );

  router.push("/portfolio");
};


// ======================================================
// LOGOUT
// ======================================================

const handleLogout = () => {

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  router.push("/");
};


// ======================================================
// DATE
// ======================================================

const formatDate = (date) => {

  if (!date) return "";

  return new Date(date).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );
};
</script>


<template>

  <!-- ================================================= -->
  <!-- NAVBAR -->
  <!-- ================================================= -->

  <nav class="px-6 pt-6 md:px-10 md:pt-8">

    <div
      class="mx-auto flex max-w-7xl
             items-center justify-between
             border-b border-[#70453c]/30
             pb-5"
    >

      <!-- LOGO -->

      <RouterLink
        to="/home"
        class="font-serif text-2xl
               font-black tracking-wide
               md:text-3xl"
      >
        AGEEMAKE
      </RouterLink>


      <!-- NAV -->

      <div
        class="hidden items-center
               gap-8 text-sm font-semibold
               md:flex"
      >

        <RouterLink
          to="/home"
          class="font-black underline"
        >
          HOME
        </RouterLink>

        <RouterLink
          to="/create"
          class="transition hover:opacity-60"
        >
          CREATE
        </RouterLink>

        <RouterLink
          to="/projects"
          class="transition hover:opacity-60"
        >
          PROJECTS
        </RouterLink>

      </div>


      <!-- LOGOUT -->

      <button
        @click="handleLogout"
        class="rounded-full
               border border-[#70453c]
               px-5 py-2
               text-xs font-bold
               transition
               hover:bg-[#70453c]
               hover:text-white"
      >
        LOGOUT
      </button>

    </div>

  </nav>


  <!-- ================================================= -->
  <!-- HERO -->
  <!-- ================================================= -->

  <main
    class="mx-auto max-w-7xl
           px-6 py-12 md:px-10"
  >

    <section
      class="rounded-3xl
             bg-[#f8f3ed]
             px-8 py-16
             md:px-14 md:py-20"
    >

      <p
        class="text-xs font-bold
               uppercase tracking-[0.3em]
               opacity-60"
      >
        Welcome back
      </p>

      <h1
        class="mt-4 font-serif
               text-5xl font-black
               md:text-7xl"
      >
        Hi,
        {{ user?.username || "Creator" }}.
      </h1>

      <p
        class="mt-5 max-w-2xl
               text-base leading-relaxed
               opacity-70"
      >
        Continue building your portfolio,
        edit your latest work, or create
        something completely new.
      </p>

      <RouterLink
        to="/create"
        class="mt-8 inline-block
               rounded-full
               bg-[#70453c]
               px-8 py-3
               text-sm font-bold
               text-white
               transition
               hover:bg-[#59362f]"
      >
        CREATE NEW PORTFOLIO
      </RouterLink>

    </section>


    <!-- ================================================= -->
    <!-- RECENT WORKS -->
    <!-- ================================================= -->

    <section class="mt-16">

      <div
        class="flex items-end
               justify-between"
      >

        <div>

          <p
            class="text-xs font-bold
                   uppercase
                   tracking-[0.3em]
                   opacity-60"
          >
            Your workspace
          </p>

          <h2
            class="mt-2 font-serif
                   text-4xl font-black
                   md:text-5xl"
          >
            Recent works.
          </h2>

        </div>


        <RouterLink
          to="/projects"
          class="hidden text-sm
                 font-bold underline
                 md:block"
        >
          VIEW ALL PROJECTS →
        </RouterLink>

      </div>


      <!-- ================================================= -->
      <!-- EMPTY -->
      <!-- ================================================= -->

      <div
        v-if="recentWorks.length === 0"
        class="mt-8 rounded-3xl
               border border-dashed
               border-[#70453c]/30
               bg-[#f8f3ed]
               px-6 py-16
               text-center"
      >

        <h3
          class="font-serif
                 text-3xl font-black"
        >
          No work yet.
        </h3>

        <p
          class="mx-auto mt-3
                 max-w-md
                 text-sm opacity-60"
        >
          Start creating your first
          portfolio and it will appear here.
        </p>

        <RouterLink
          to="/create"
          class="mt-6 inline-block
                 rounded-full
                 bg-[#70453c]
                 px-7 py-3
                 text-xs font-bold
                 text-white"
        >
          CREATE YOUR FIRST PORTFOLIO
        </RouterLink>

      </div>


      <!-- ================================================= -->
      <!-- RECENT CARDS -->
      <!-- ================================================= -->

      <div
        v-else
        class="mt-8 grid gap-6
               md:grid-cols-2
               xl:grid-cols-3"
      >

        <article
          v-for="project in recentWorks"
          :key="project.id"
          @click="openProject(project)"
          class="group cursor-pointer
                 overflow-hidden
                 rounded-3xl
                 border border-[#70453c]/15
                 bg-white
                 shadow-sm
                 transition
                 hover:-translate-y-1
                 hover:shadow-xl"
        >

          <!-- IMAGE -->

          <div
            class="relative h-52
                   overflow-hidden
                   bg-[#eadbd3]"
          >

            <img
              v-if="project.data?.profileImage"
              :src="project.data.profileImage"
              class="h-full w-full
                     object-cover
                     transition
                     duration-500
                     group-hover:scale-105"
            />

            <div
              v-else
              class="flex h-full
                     items-center
                     justify-center"
            >

              <span
                class="font-serif
                       text-3xl
                       font-black
                       opacity-30"
              >
                AGEEMAKE
              </span>

            </div>


            <!-- STATUS -->

            <span
              class="absolute right-4
                     top-4 rounded-full
                     px-3 py-1
                     text-[10px]
                     font-black
                     uppercase"
              :class="
                project.status === 'published'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              "
            >
              {{ project.status }}
            </span>

          </div>


          <!-- INFORMATION -->

          <div class="p-6">

            <h3
              class="font-serif
                     text-2xl font-black"
            >
              {{ project.name }}
            </h3>

            <p
              class="mt-2 text-xs
                     opacity-50"
            >
              {{ formatDate(project.savedAt) }}
            </p>

            <p
              v-if="project.data?.title"
              class="mt-4 text-sm
                     opacity-70"
            >
              {{ project.data.title }}
            </p>

            <div
              class="mt-5 text-xs
                     font-bold underline"
            >
              {{
                project.status === "draft"
                  ? "CONTINUE EDITING →"
                  : "VIEW PORTFOLIO →"
              }}
            </div>

          </div>

        </article>

      </div>


      <RouterLink
        to="/projects"
        class="mt-8 block text-center
               text-sm font-bold underline
               md:hidden"
      >
        VIEW ALL PROJECTS →
      </RouterLink>

    </section>

  </main>

</template>