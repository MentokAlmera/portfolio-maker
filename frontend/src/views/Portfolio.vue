<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const portfolio = JSON.parse(
  localStorage.getItem("portfolio") || "null"
);

if (!portfolio) {
  router.push("/projects");
}

// ======================================================
// DATA
// ======================================================

const currentProject = ref(0);

const projects = computed(() => {
  return portfolio?.projects || [];
});

const visibleProjects = computed(() => {
  const total = projects.value.length;

  if (total <= 3) {
    return projects.value;
  }

  const result = [];

  for (let i = 0; i < 3; i++) {
    result.push(
      projects.value[
        (currentProject.value + i) % total
      ]
    );
  }

  return result;
});

// ======================================================
// CAROUSEL
// ======================================================

const nextProject = () => {
  if (projects.value.length <= 3) return;

  currentProject.value =
    (currentProject.value + 1) %
    projects.value.length;
};

const previousProject = () => {
  if (projects.value.length <= 3) return;

  currentProject.value =
    (currentProject.value - 1 + projects.value.length) %
    projects.value.length;
};

// ======================================================
// SECTION STYLE
// ======================================================

const getSectionStyle = (settings) => {
  if (!settings) {
    return {
      backgroundColor: "#ffffff",
      color: "#17120f",
      fontFamily: "Georgia, serif",
    };
  }

  const style = {
    color: settings.fontColor || "#17120f",
    fontFamily: settings.font || "Georgia, serif",
    backgroundColor:
      settings.backgroundColor || "#ffffff",
  };

  if (
    settings.backgroundType === "image" &&
    settings.backgroundImage
  ) {
    style.backgroundImage = `
      linear-gradient(
        rgba(255,255,255,${settings.overlay ?? 0.2}),
        rgba(255,255,255,${settings.overlay ?? 0.2})
      ),
      url(${settings.backgroundImage})
    `;

    style.backgroundSize = "cover";
    style.backgroundPosition = "center";
  }

  return style;
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
// USER
// ======================================================

const user = JSON.parse(
  localStorage.getItem("user") || "null"
);
</script>

<template>

  <!-- ================================================= -->
  <!-- NAVBAR -->
  <!-- ================================================= -->

  <nav
    class="fixed left-0 right-0 top-0 z-50
           border-b border-black/10
           bg-white/80 backdrop-blur-md"
  >

    <div
      class="mx-auto flex max-w-7xl
             items-center justify-between
             px-6 py-5 md:px-10"
    >

      <RouterLink
        to="/home"
        class="font-serif text-2xl
               font-black tracking-wide"
      >
        AGEEMAKE
      </RouterLink>

      <div
        class="hidden items-center
               gap-8 text-sm font-semibold
               md:flex"
      >

        <RouterLink
          to="/home"
          class="transition hover:opacity-60"
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
  <!-- PORTFOLIO -->
  <!-- ================================================= -->

  <main v-if="portfolio">


    <!-- ================================================= -->
    <!-- PERSONAL INFORMATION -->
    <!-- ================================================= -->

    <section
      class="relative min-h-screen
             px-6 py-32 md:px-16"
      :style="getSectionStyle(portfolio.personal)"
    >

      <div
        class="mx-auto max-w-7xl
               grid items-center
               gap-12 md:grid-cols-2"
      >

        <!-- LEFT -->

        <div>

          <p
            class="mb-5 text-sm font-bold
                   uppercase tracking-[0.3em]"
          >
            Welcome to my portfolio
          </p>

          <h1
            class="font-serif text-6xl
                   font-black leading-none
                   md:text-8xl"
          >
            {{ portfolio.name || "Your Name" }}
          </h1>

          <h2
            class="mt-6 text-2xl
                   font-bold md:text-3xl"
          >
            {{ portfolio.title || "Professional" }}
          </h2>

          <p
            v-if="portfolio.location"
            class="mt-3 opacity-70"
          >
            {{ portfolio.location }}
          </p>

          <p
            v-if="portfolio.contactEmail"
            class="mt-1 opacity-70"
          >
            {{ portfolio.contactEmail }}
          </p>


          <!-- SOCIAL LINKS -->

          <div
            class="mt-8 flex flex-wrap gap-3"
          >

            <a
              v-if="portfolio.social?.github"
              :href="portfolio.social.github"
              target="_blank"
              class="rounded-full
                     border border-current
                     px-5 py-2
                     text-sm font-bold
                     transition
                     hover:bg-black
                     hover:text-white"
            >
              GitHub
            </a>

            <a
              v-if="portfolio.social?.linkedin"
              :href="portfolio.social.linkedin"
              target="_blank"
              class="rounded-full
                     border border-current
                     px-5 py-2
                     text-sm font-bold
                     transition
                     hover:bg-black
                     hover:text-white"
            >
              LinkedIn
            </a>

            <a
              v-if="portfolio.social?.instagram"
              :href="portfolio.social.instagram"
              target="_blank"
              class="rounded-full
                     border border-current
                     px-5 py-2
                     text-sm font-bold
                     transition
                     hover:bg-black
                     hover:text-white"
            >
              Instagram
            </a>

          </div>

        </div>


        <!-- PROFILE IMAGE -->

        <div
          v-if="portfolio.profileImage"
          class="flex justify-center"
        >

          <img
            :src="portfolio.profileImage"
            alt="Profile"
            class="h-72 w-72
                   rounded-full
                   object-cover
                   shadow-2xl
                   md:h-96 md:w-96"
          />

        </div>

      </div>

    </section>


    <!-- ================================================= -->
    <!-- ABOUT ME -->
    <!-- ================================================= -->

    <section
      class="min-h-screen
             px-6 py-32 md:px-16"
      :style="getSectionStyle(portfolio.aboutSettings)"
    >

      <div class="mx-auto max-w-6xl">

        <p
          class="text-sm font-bold
                 uppercase tracking-[0.3em]"
        >
          About Me
        </p>

        <h2
          class="mt-4 font-serif
                 text-5xl font-black
                 md:text-7xl"
        >
          Get to know me.
        </h2>


        <!-- ABOUT TEXT -->

        <p
          class="mt-8 max-w-3xl
                 text-lg leading-relaxed
                 opacity-80"
        >
          {{ portfolio.about || "No information provided yet." }}
        </p>


        <!-- ================================================= -->
        <!-- EDUCATION -->
        <!-- ================================================= -->

        <div
          v-if="portfolio.education?.length"
          class="mt-16"
        >

          <h3
            class="font-serif
                   text-3xl font-black"
          >
            Education
          </h3>

          <div
            class="mt-6 grid gap-5
                   md:grid-cols-2"
          >

            <div
              v-for="(education, index) in portfolio.education"
              :key="index"
              class="rounded-2xl
                     border border-current/10
                     bg-white/50
                     p-6
                     backdrop-blur-sm"
            >

              <p class="text-lg font-bold">
                {{ education.school }}
              </p>

              <p class="mt-2 opacity-70">
                {{ education.degree }}
              </p>

              <p
                v-if="education.year"
                class="mt-2 text-sm opacity-50"
              >
                {{ education.year }}
              </p>

            </div>

          </div>

        </div>


        <!-- ================================================= -->
        <!-- SKILLS -->
        <!-- ================================================= -->

        <div
          v-if="portfolio.skills?.length"
          class="mt-16"
        >

          <h3
            class="font-serif
                   text-3xl font-black"
          >
            Skills
          </h3>

          <div
            class="mt-6 flex flex-wrap
                   gap-3"
          >

            <span
              v-for="(skill, index) in portfolio.skills"
              :key="index"
              class="rounded-full
                     border border-current
                     px-5 py-2
                     text-sm font-bold"
            >
              {{ skill }}
            </span>

          </div>

        </div>


        <!-- ================================================= -->
        <!-- RESUME -->
        <!-- ================================================= -->

        <div
          v-if="portfolio.resumeUrl"
          class="mt-16"
        >

          <a
            :href="portfolio.resumeUrl"
            target="_blank"
            class="inline-block
                   rounded-full
                   bg-[#70453c]
                   px-7 py-3
                   text-sm font-bold
                   text-white
                   transition
                   hover:bg-[#59362f]"
          >
            VIEW RESUME →
          </a>

        </div>

      </div>

    </section>


    <!-- ================================================= -->
    <!-- PROJECTS -->
    <!-- ================================================= -->

    <section
      class="min-h-screen
             px-6 py-32 md:px-16"
      :style="getSectionStyle(portfolio.projectsSettings)"
    >

      <div class="mx-auto max-w-7xl">

        <div
          class="flex flex-col
                 justify-between gap-6
                 md:flex-row md:items-end"
        >

          <div>

            <p
              class="text-sm font-bold
                     uppercase tracking-[0.3em]"
            >
              My Work
            </p>

            <h2
              class="mt-4 font-serif
                     text-5xl font-black
                     md:text-7xl"
            >
              Projects.
            </h2>

          </div>


          <!-- CAROUSEL CONTROLS -->

          <div
            v-if="projects.length > 3"
            class="flex gap-3"
          >

            <button
              @click="previousProject"
              class="flex h-12 w-12
                     items-center justify-center
                     rounded-full
                     border border-current
                     text-xl
                     transition
                     hover:bg-black
                     hover:text-white"
            >
              ←
            </button>

            <button
              @click="nextProject"
              class="flex h-12 w-12
                     items-center justify-center
                     rounded-full
                     border border-current
                     text-xl
                     transition
                     hover:bg-black
                     hover:text-white"
            >
              →
            </button>

          </div>

        </div>


        <!-- NO PROJECTS -->

        <div
          v-if="projects.length === 0"
          class="mt-16 rounded-3xl
                 border border-current/10
                 p-12 text-center"
        >
          <p class="text-lg opacity-60">
            No projects have been added yet.
          </p>
        </div>


        <!-- ================================================= -->
        <!-- PROJECT CAROUSEL -->
        <!-- ================================================= -->

        <div
          v-else
          class="mt-12 grid gap-6"
          :class="{
            'md:grid-cols-1':
              projects.length === 1,

            'md:grid-cols-2':
              projects.length === 2,

            'md:grid-cols-3':
              projects.length >= 3
          }"
        >

          <article
            v-for="(project, index) in visibleProjects"
            :key="`${project.title}-${index}`"
            class="overflow-hidden
                   rounded-3xl
                   shadow-lg
                   transition
                   hover:-translate-y-2"
            :style="{
              backgroundColor:
                portfolio.projectCardColor ||
                '#eadbd3'
            }"
          >

            <!-- IMAGE -->

            <div
              class="aspect-[16/10]
                     overflow-hidden
                     bg-black/10"
            >

              <img
                v-if="project.image"
                :src="project.image"
                :alt="project.title"
                class="h-full w-full
                       object-cover
                       transition duration-500
                       hover:scale-105"
              />

              <div
                v-else
                class="flex h-full
                       items-center justify-center
                       text-5xl font-black
                       opacity-20"
              >
                AGEEMAKE
              </div>

            </div>


            <!-- CONTENT -->

            <div class="p-7">

              <p
                class="text-xs font-bold
                       uppercase tracking-widest
                       opacity-50"
              >
                Project
              </p>

              <h3
                class="mt-2 font-serif
                       text-2xl font-black"
              >
                {{ project.title || "Untitled Project" }}
              </h3>

              <p
                v-if="project.description"
                class="mt-4 text-sm
                       leading-relaxed
                       opacity-70"
              >
                {{ project.description }}
              </p>

              <a
                v-if="project.link"
                :href="project.link"
                target="_blank"
                class="mt-6 inline-block
                       rounded-full
                       border border-current
                       px-5 py-2
                       text-xs font-bold
                       transition
                       hover:bg-black
                       hover:text-white"
              >
                SEE MORE →
              </a>

            </div>

          </article>

        </div>

      </div>

    </section>


    <!-- ================================================= -->
    <!-- EXPERIENCE -->
    <!-- ================================================= -->

    <section
      class="min-h-screen
             px-6 py-32 md:px-16"
      :style="getSectionStyle(portfolio.experienceSettings)"
    >

      <div class="mx-auto max-w-6xl">

        <p
          class="text-sm font-bold
                 uppercase tracking-[0.3em]"
        >
          Experience
        </p>

        <h2
          class="mt-4 font-serif
                 text-5xl font-black
                 md:text-7xl"
        >
          Where I've worked.
        </h2>


        <div
          v-if="portfolio.experience?.length"
          class="mt-16 space-y-6"
        >

          <article
            v-for="(experience, index) in portfolio.experience"
            :key="index"
            class="rounded-3xl
                   border border-current/10
                   bg-white/40
                   p-7
                   backdrop-blur-sm"
          >

            <div
              class="flex flex-col
                     justify-between gap-4
                     md:flex-row"
            >

              <div>

                <h3
                  class="font-serif
                         text-2xl font-black"
                >
                  {{ experience.position }}
                </h3>

                <p
                  class="mt-2 text-lg
                         font-bold opacity-70"
                >
                  {{ experience.company }}
                </p>

              </div>


              <div
                class="text-sm
                       font-semibold
                       opacity-60"
              >

                {{ experience.start }}

                <span class="mx-2">
                  —
                </span>

                <span v-if="experience.present">
                  Present
                </span>

                <span v-else>
                  {{ experience.end }}
                </span>

              </div>

            </div>

          </article>

        </div>


        <div
          v-else
          class="mt-12 opacity-50"
        >
          No experience added yet.
        </div>

      </div>

    </section>


    <!-- ================================================= -->
    <!-- FOOTER -->
    <!-- ================================================= -->

    <footer
      class="bg-[#17120f]
             px-6 py-12
             text-center text-white"
    >

      <p
        class="font-serif text-2xl
               font-black"
      >
        {{ portfolio.name || "Your Name" }}
      </p>

      <p
        class="mt-2 text-sm opacity-60"
      >
        Created with AGEEMAKE
      </p>

    </footer>

  </main>

</template>