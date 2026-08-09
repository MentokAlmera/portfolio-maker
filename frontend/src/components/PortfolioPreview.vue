<template>
  <div
    class="sticky top-6 overflow-hidden rounded-3xl
           border border-[#70453c]/15
           bg-white shadow-lg"
  >

    <!-- PREVIEW HEADER -->
    <div
      class="flex items-center justify-between
             border-b border-[#70453c]/10
             px-6 py-4"
    >
      <div>
        <p
          class="text-xs font-bold uppercase
                 tracking-[0.25em] opacity-50"
        >
          Live Preview
        </p>

        <h3 class="mt-1 font-serif text-xl font-black">
          Your Portfolio
        </h3>
      </div>

      <span
        class="rounded-full bg-[#eadbd3]
               px-3 py-1 text-xs font-bold"
      >
        STEP {{ currentStep }}
      </span>
    </div>


    <!-- PORTFOLIO PREVIEW -->
    <div class="max-h-[750px] overflow-y-auto">


      <!-- ====================================== -->
      <!-- PERSONAL INFORMATION -->
      <!-- ====================================== -->

      <section
        class="relative overflow-hidden
               bg-[#70453c]
               px-7 py-12 text-white"
      >

        <!-- Background Image -->
        <img
          v-if="form.personalBackground"
          :src="form.personalBackground"
          class="absolute inset-0 h-full w-full
                 object-cover opacity-30"
        />

        <div class="relative z-10">

          <p
            class="text-xs font-bold uppercase
                   tracking-[0.25em] opacity-70"
          >
            Portfolio
          </p>

          <h1
            class="mt-3 break-words
                   font-serif text-4xl font-black"
          >
            {{ form.name || "Your Name" }}
          </h1>

          <p
            class="mt-2 text-lg font-semibold"
          >
            {{ form.title || "Your Professional Title" }}
          </p>

          <div
            class="mt-5 space-y-1
                   text-sm opacity-80"
          >

            <p v-if="form.location">
              📍 {{ form.location }}
            </p>

            <p v-if="form.contactEmail">
              ✉ {{ form.contactEmail }}
            </p>

          </div>


          <!-- SOCIAL LINKS -->

          <div
            v-if="
              form.github ||
              form.linkedin ||
              form.instagram
            "
            class="mt-6 flex flex-wrap gap-2"
          >

            <span
              v-if="form.github"
              class="rounded-full
                     bg-white/15
                     px-3 py-1
                     text-xs"
            >
              GitHub
            </span>

            <span
              v-if="form.linkedin"
              class="rounded-full
                     bg-white/15
                     px-3 py-1
                     text-xs"
            >
              LinkedIn
            </span>

            <span
              v-if="form.instagram"
              class="rounded-full
                     bg-white/15
                     px-3 py-1
                     text-xs"
            >
              Instagram
            </span>

          </div>

        </div>

      </section>


      <!-- ====================================== -->
      <!-- ABOUT ME -->
      <!-- ====================================== -->

      <section
        class="bg-[#f8f3ed]
               px-7 py-10"
      >

        <p
          class="text-xs font-bold uppercase
                 tracking-[0.25em]
                 opacity-50"
        >
          About Me
        </p>


        <div
          class="mt-5 flex items-start gap-5"
        >

          <!-- PROFILE IMAGE -->

          <div
            class="h-20 w-20 shrink-0
                   overflow-hidden
                   rounded-2xl
                   bg-[#eadbd3]"
          >

            <img
              v-if="form.profileImage"
              :src="form.profileImage"
              class="h-full w-full object-cover"
            />

            <div
              v-else
              class="flex h-full w-full
                     items-center justify-center
                     text-2xl"
            >
              👤
            </div>

          </div>


          <!-- NAME -->

          <div>

            <h2
              class="font-serif text-2xl
                     font-black"
            >
              {{ form.name || "Your Name" }}
            </h2>

            <p
              class="mt-1 text-sm opacity-60"
            >
              {{ form.title || "Professional" }}
            </p>

          </div>

        </div>


        <!-- ABOUT -->

        <p
          class="mt-6 whitespace-pre-line
                 text-sm leading-6 opacity-75"
        >
          {{
            form.about ||
            "Your introduction will appear here."
          }}
        </p>


        <!-- SKILLS -->

        <div
          v-if="form.skills"
          class="mt-7"
        >

          <p
            class="mb-3 text-xs font-bold
                   uppercase tracking-widest
                   opacity-50"
          >
            Skills
          </p>

          <div class="flex flex-wrap gap-2">

            <span
              v-for="(skill, index) in parsedSkills"
              :key="index"
              class="rounded-full
                     bg-[#70453c]
                     px-3 py-1
                     text-xs font-bold
                     text-white"
            >
              {{ skill }}
            </span>

          </div>

        </div>

      </section>


      <!-- ====================================== -->
      <!-- PROJECTS -->
      <!-- ====================================== -->

      <section
        class="bg-white
               px-7 py-10"
      >

        <p
          class="text-xs font-bold uppercase
                 tracking-[0.25em]
                 opacity-50"
        >
          Projects
        </p>


        <!-- PROJECT CAROUSEL -->

        <div
          class="mt-5 overflow-hidden
                 rounded-2xl
                 bg-[#eadbd3]"
        >

          <!-- Project Image -->

          <div
            class="flex h-40 items-center
                   justify-center
                   overflow-hidden
                   bg-[#70453c]"
          >

            <img
              v-if="currentProject?.image"
              :src="currentProject.image"
              class="h-full w-full object-cover"
            />

            <span
              v-else
              class="text-4xl"
            >
              💻
            </span>

          </div>


          <!-- Project Information -->

          <div class="p-5">

            <p
              class="text-xs font-bold
                     uppercase tracking-widest
                     opacity-50"
            >
              Project
            </p>

            <h3
              class="mt-2 font-serif
                     text-xl font-black"
            >
              {{
                currentProject?.title ||
                "Your Project"
              }}
            </h3>

            <p
              class="mt-2 text-sm
                     leading-6 opacity-70"
            >
              {{
                currentProject?.description ||
                "Your project description will appear here."
              }}
            </p>

            <button
              v-if="currentProject?.link"
              class="mt-4 text-xs
                     font-bold underline"
            >
              SEE MORE →
            </button>

          </div>

        </div>


        <!-- CAROUSEL INDICATORS -->

        <div
          class="mt-4 flex
                 justify-center gap-2"
        >

          <span
            v-for="(_, index) in projects"
            :key="index"
            class="h-2 w-2 rounded-full
                   bg-[#70453c]/30"
          ></span>

        </div>

      </section>


      <!-- ====================================== -->
      <!-- EXPERIENCE -->
      <!-- ====================================== -->

      <section
        class="bg-[#f8f3ed]
               px-7 py-10"
      >

        <p
          class="text-xs font-bold uppercase
                 tracking-[0.25em]
                 opacity-50"
        >
          Experience
        </p>


        <div
          v-if="experiences.length"
          class="mt-5 space-y-5"
        >

          <div
            v-for="(experience, index) in experiences"
            :key="index"
            class="border-l-2
                   border-[#70453c]
                   pl-4"
          >

            <h3
              class="font-bold"
            >
              {{
                experience.position ||
                "Position"
              }}
            </h3>

            <p
              class="mt-1 text-sm
                     font-semibold"
            >
              {{
                experience.company ||
                "Company"
              }}
            </p>

            <p
              class="mt-1 text-xs
                     opacity-50"
            >
              {{
                experience.start ||
                "Start"
              }}

              -

              {{
                experience.end ||
                "Present"
              }}
            </p>

          </div>

        </div>


        <div
          v-else
          class="mt-5 rounded-xl
                 border border-dashed
                 border-[#70453c]/20
                 p-6 text-center"
        >

          <p class="text-sm opacity-50">
            Your experience will appear here.
          </p>

        </div>

      </section>


    </div>

  </div>
</template>


<script setup>

import { computed } from "vue";


const props = defineProps({

  form: {
    type: Object,
    required: true,
  },

  currentStep: {
    type: Number,
    default: 1,
  },

});


const skillList = computed(() => {

  const skills = props.form?.skills;

  // If skills is an array
  if (Array.isArray(skills)) {
    return skills.filter(
      (skill) => skill && skill.toString().trim()
    );
  }

  // If skills is a string
  if (typeof skills === "string") {

    return skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

  }

  return [];

});

</script>