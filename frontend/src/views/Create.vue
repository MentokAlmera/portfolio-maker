<script setup>
import { computed, reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import PortfolioPreview from "../components/PortfolioPreview.vue";

const router = useRouter();
onMounted(() => {
  loadDraft();
});

// ======================================================
// STEP
// ======================================================

const currentStep = ref(1);

const totalSteps = 4;

const progress = computed(() => {
  return Math.round((currentStep.value / totalSteps) * 100);
});

// ======================================================
// FORM
// ======================================================

const form = reactive({
  // ========================================
  // PERSONAL
  // ========================================

  name: "",
  title: "",
  location: "",
  contactEmail: "",

  social: {
    github: "",
    linkedin: "",
    instagram: "",
  },

  personal: {
    backgroundType: "color",
    backgroundColor: "#f8f3ed",
    backgroundImage: "",
    overlay: 0.2,
    fontColor: "#17120f",
    font: "Georgia, serif",
  },

  // ========================================
  // ABOUT
  // ========================================

  profileImage: "",
  about: "",

  education: [],

  skills: [],

  resumeName: "",
  resumeUrl: "",

  aboutSettings: {
    backgroundType: "color",
    backgroundColor: "#ffffff",
    backgroundImage: "",
    overlay: 0.2,
    fontColor: "#17120f",
    font: "Georgia, serif",
  },

  // ========================================
  // PROJECTS
  // ========================================

  projects: [],

  projectCardColor: "#eadbd3",

  projectsSettings: {
    backgroundType: "color",
    backgroundColor: "#ffffff",
    backgroundImage: "",
    overlay: 0.2,
    fontColor: "#17120f",
    font: "Georgia, serif",
  },

  // ========================================
  // EXPERIENCE
  // ========================================

  experience: [],

  experienceSettings: {
    backgroundType: "color",
    backgroundColor: "#f8f3ed",
    backgroundImage: "",
    overlay: 0.2,
    fontColor: "#17120f",
    font: "Georgia, serif",
  },
});

// ======================================================
// EDUCATION
// ======================================================

const addEducation = () => {
  form.education.push({
    school: "",
    degree: "",
    year: "",
  });
};

const removeEducation = (index) => {
  form.education.splice(index, 1);
};

// ======================================================
// SKILLS
// ======================================================

const newSkill = ref("");

const addSkill = () => {
  const skill = newSkill.value.trim();

  if (!skill) return;

  if (skill.length > 20) return;

  form.skills.push(skill);

  newSkill.value = "";
};

const removeSkill = (index) => {
  form.skills.splice(index, 1);
};

// ======================================================
// PROJECTS
// ======================================================

const addProject = () => {
  form.projects.push({
    title: "",
    image: "",
    description: "",
    link: "",
  });
};

const removeProject = (index) => {
  form.projects.splice(index, 1);
};

// ======================================================
// EXPERIENCE
// ======================================================

const addExperience = () => {
  form.experience.push({
    company: "",
    position: "",
    start: "",
    end: "",
    present: false,
  });
};

const removeExperience = (index) => {
  form.experience.splice(index, 1);
};

// ======================================================
// IMAGE READER
// ======================================================

const readImage = (file, callback) => {
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    callback(event.target.result);
  };

  reader.readAsDataURL(file);
};

// ======================================================
// PROFILE IMAGE
// ======================================================

const handleProfileImage = (event) => {
  const file = event.target.files?.[0];

  readImage(file, (result) => {
    form.profileImage = result;
  });
};

// ======================================================
// PERSONAL BACKGROUND
// ======================================================

const handlePersonalBackground = (event) => {
  const file = event.target.files?.[0];

  readImage(file, (result) => {
    form.personal.backgroundType = "image";
    form.personal.backgroundImage = result;
  });
};

// ======================================================
// ABOUT BACKGROUND
// ======================================================

const handleAboutBackground = (event) => {
  const file = event.target.files?.[0];

  readImage(file, (result) => {
    form.aboutSettings.backgroundType = "image";
    form.aboutSettings.backgroundImage = result;
  });
};

// ======================================================
// PROJECT BACKGROUND
// ======================================================

const handleProjectsBackground = (event) => {
  const file = event.target.files?.[0];

  readImage(file, (result) => {
    form.projectsSettings.backgroundType = "image";
    form.projectsSettings.backgroundImage = result;
  });
};

// ======================================================
// EXPERIENCE BACKGROUND
// ======================================================

const handleExperienceBackground = (event) => {
  const file = event.target.files?.[0];

  readImage(file, (result) => {
    form.experienceSettings.backgroundType = "image";
    form.experienceSettings.backgroundImage = result;
  });
};

// ======================================================
// PROJECT IMAGE
// ======================================================

const handleProjectImage = (event, index) => {
  const file = event.target.files?.[0];

  readImage(file, (result) => {
    if (form.projects[index]) {
      form.projects[index].image = result;
    }
  });
};

// ======================================================
// RESUME
// ======================================================

const handleResume = (event) => {
  const file = event.target.files?.[0];

  if (!file) return;

  form.resumeName = file.name;

  const reader = new FileReader();

  reader.onload = (event) => {
    form.resumeUrl = event.target.result;
  };

  reader.readAsDataURL(file);
};

// ======================================================
// STEP VALIDATION
// ======================================================

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++;
  }
};

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
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
// SAVE DRAFT
// ======================================================

const saveDraft = () => {
  const portfolioName = window.prompt(
    "What would you like to name this portfolio?"
  );

  // User clicked Cancel
  if (portfolioName === null) {
    return;
  }

  const cleanName = portfolioName.trim();

  if (!cleanName) {
    alert("Please enter a portfolio name.");
    return;
  }

  if (cleanName.length > 50) {
    alert("Portfolio name must not exceed 50 characters.");
    return;
  }

  // Get existing drafts
  const drafts =
    JSON.parse(localStorage.getItem("portfolioDrafts")) || [];

  // Create new draft
  const draft = {
    id: Date.now(),

    name: cleanName,

    status: "draft",

    savedAt: new Date().toISOString(),

    data: JSON.parse(JSON.stringify(form)),
  };

  // Add to drafts
  drafts.push(draft);

  // Save drafts
  localStorage.setItem(
    "portfolioDrafts",
    JSON.stringify(drafts)
  );

  alert("Draft saved successfully!");

  router.push("/projects");
};


// ======================================================
// SAVE PORTFOLIO
// ======================================================

const savePortfolio = () => {
  const portfolioName = window.prompt(
    "What would you like to name this portfolio?"
  );

  // User clicked Cancel
  if (portfolioName === null) {
    return;
  }

  const cleanName = portfolioName.trim();

  if (!cleanName) {
    alert("Please enter a portfolio name.");
    return;
  }

  if (cleanName.length > 50) {
    alert("Portfolio name must not exceed 50 characters.");
    return;
  }

  // Get existing published portfolios
  const published =
    JSON.parse(localStorage.getItem("publishedPortfolios")) || [];

  // Create portfolio
  const portfolio = {
    id: Date.now(),

    name: cleanName,

    status: "published",

    savedAt: new Date().toISOString(),

    data: JSON.parse(JSON.stringify(form)),
  };

  // Add to published
  published.push(portfolio);

  // Save
  localStorage.setItem(
    "publishedPortfolios",
    JSON.stringify(published)
  );

  alert("Portfolio published successfully!");

  router.push("/projects");
};

// ======================================================
// LOAD DRAFT
// ======================================================

const loadDraft = () => {
  const editingDraftId =
    localStorage.getItem("editingDraftId");

  if (!editingDraftId) {
    return;
  }

  const drafts =
    JSON.parse(
      localStorage.getItem("portfolioDrafts") || "[]"
    );

  const draft = drafts.find(
    (item) =>
      String(item.id) === String(editingDraftId)
  );

  if (!draft) {
    localStorage.removeItem("editingDraftId");
    return;
  }

  // Load saved data
  Object.assign(form, draft.data);

  // Remove temporary editing ID
  localStorage.removeItem("editingDraftId");
};
</script>

<template>
  <!-- ================================================= -->
  <!-- NAVBAR -->
  <!-- ================================================= -->

  <nav class="px-6 pt-6 md:px-10 md:pt-8">
    <div
      class="mx-auto flex max-w-7xl items-center justify-between border-b border-[#70453c]/30 pb-5"
    >
      <!-- LOGO -->

      <RouterLink
        to="/home"
        class="font-serif text-2xl font-black tracking-wide md:text-3xl"
      >
        AGEEMAKE
      </RouterLink>

      <!-- NAV -->

      <div class="hidden items-center gap-8 text-sm font-semibold md:flex">
        <RouterLink to="/home" class="transition hover:opacity-60">
          HOME
        </RouterLink>

        <RouterLink to="/create" class="font-black underline">
          CREATE
        </RouterLink>

        <RouterLink to="/projects" class="transition hover:opacity-60">
          PROJECTS
        </RouterLink>
      </div>

      <!-- LOGOUT -->

      <button
        @click="handleLogout"
        class="rounded-full border border-[#70453c] px-5 py-2 text-xs font-bold transition hover:bg-[#70453c] hover:text-white"
      >
        LOGOUT
      </button>
    </div>
  </nav>

  <!-- ================================================= -->
  <!-- MAIN -->
  <!-- ================================================= -->

  <main class="mx-auto max-w-7xl px-6 py-12 md:px-10">
    <!-- HEADER -->

    <section class="mb-10">
      <p class="text-xs font-bold uppercase tracking-[0.3em] opacity-60">
        Portfolio Builder
      </p>

      <h1 class="mt-3 font-serif text-5xl font-black md:text-7xl">
        Create your portfolio.
      </h1>

      <p class="mt-4 max-w-2xl text-base leading-relaxed opacity-70">
        Build your personal portfolio, customize each section, and see your
        changes instantly.
      </p>
    </section>

    <!-- ================================================= -->
    <!-- PROGRESS -->
    <!-- ================================================= -->

    <div class="mb-10">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold uppercase tracking-widest">
          Step {{ currentStep }} of {{ totalSteps }}
        </span>

        <span class="text-xs opacity-60"> {{ progress }}% complete </span>
      </div>

      <div class="mt-3 h-2 overflow-hidden rounded-full bg-[#eadbd3]">
        <div
          class="h-full rounded-full bg-[#70453c] transition-all duration-500"
          :style="{
            width: `${progress}%`,
          }"
        ></div>
      </div>
    </div>

    <!-- ================================================= -->
    <!-- FORM + PREVIEW -->
    <!-- ================================================= -->

    <div class="grid gap-8 lg:grid-cols-[1fr_450px]">
      <!-- ================================================= -->
      <!-- FORM -->
      <!-- ================================================= -->

      <section
        class="rounded-3xl border border-[#70453c]/15 bg-white p-7 shadow-sm md:p-10"
      >
        <!-- ================================================= -->
        <!-- STEP 1 PERSONAL INFORMATION -->
        <!-- ================================================= -->

        <div v-if="currentStep === 1">
          <p class="text-xs font-bold uppercase tracking-[0.25em] opacity-60">
            Step 01
          </p>

          <h2 class="mt-2 font-serif text-3xl font-black">
            Personal Information
          </h2>

          <div class="mt-8 grid gap-6 md:grid-cols-2">
            <!-- NAME -->

            <div>
              <label class="mb-2 block text-sm font-bold"> Full Name </label>

              <input
                v-model="form.name"
                maxlength="20"
                type="text"
                placeholder="Your full name"
                class="w-full rounded-xl border border-[#70453c]/20 bg-[#f8f3ed] px-4 py-3 outline-none focus:border-[#70453c]"
              />
            </div>

            <!-- TITLE -->

            <div>
              <label class="mb-2 block text-sm font-bold">
                Professional Title
              </label>

              <input
                v-model="form.title"
                maxlength="20"
                type="text"
                placeholder="Web Developer"
                class="w-full rounded-xl border border-[#70453c]/20 bg-[#f8f3ed] px-4 py-3 outline-none focus:border-[#70453c]"
              />
            </div>

            <!-- LOCATION -->

            <div>
              <label class="mb-2 block text-sm font-bold"> Location </label>

              <input
                v-model="form.location"
                maxlength="20"
                type="text"
                placeholder="Manila, Philippines"
                class="w-full rounded-xl border border-[#70453c]/20 bg-[#f8f3ed] px-4 py-3 outline-none focus:border-[#70453c]"
              />
            </div>

            <!-- EMAIL -->

            <div>
              <label class="mb-2 block text-sm font-bold">
                Contact Email
              </label>

              <input
                v-model="form.contactEmail"
                maxlength="20"
                type="email"
                placeholder="email@example.com"
                class="w-full rounded-xl border border-[#70453c]/20 bg-[#f8f3ed] px-4 py-3 outline-none focus:border-[#70453c]"
              />
            </div>
          </div>

          <!-- ================================================= -->
          <!-- SOCIAL -->
          <!-- ================================================= -->

          <div class="mt-10">
            <h3 class="font-serif text-xl font-black">Social Links</h3>

            <div class="mt-5 space-y-4">
              <input
                v-model="form.social.github"
                maxlength="100"
                type="url"
                placeholder="GitHub URL"
                class="w-full rounded-xl border border-[#70453c]/20 bg-[#f8f3ed] px-4 py-3 outline-none"
              />

              <input
                v-model="form.social.linkedin"
                maxlength="100"
                type="url"
                placeholder="LinkedIn URL"
                class="w-full rounded-xl border border-[#70453c]/20 bg-[#f8f3ed] px-4 py-3 outline-none"
              />

              <input
                v-model="form.social.instagram"
                maxlength="100"
                type="url"
                placeholder="Instagram URL"
                class="w-full rounded-xl border border-[#70453c]/20 bg-[#f8f3ed] px-4 py-3 outline-none"
              />
            </div>
          </div>

          <!-- ================================================= -->
          <!-- PERSONAL CUSTOMIZATION -->
          <!-- ================================================= -->

          <div class="mt-10">
            <h3 class="font-serif text-xl font-black">
              Customize Personal Section
            </h3>

            <div class="mt-5 grid gap-5 md:grid-cols-2">
              <!-- COLOR -->

              <div>
                <label class="mb-2 block text-sm font-bold">
                  Background Color
                </label>

                <input
                  v-model="form.personal.backgroundColor"
                  type="color"
                  class="h-12 w-full cursor-pointer rounded-xl"
                />
              </div>

              <!-- FONT COLOR -->

              <div>
                <label class="mb-2 block text-sm font-bold"> Font Color </label>

                <input
                  v-model="form.personal.fontColor"
                  type="color"
                  class="h-12 w-full cursor-pointer rounded-xl"
                />
              </div>

              <!-- FONT -->

              <div>
                <label class="mb-2 block text-sm font-bold"> Font </label>

                <select
                  v-model="form.personal.font"
                  class="w-full rounded-xl border border-[#70453c]/20 bg-[#f8f3ed] px-4 py-3"
                >
                  <option value="Georgia, serif">Classic Serif</option>

                  <option value="Arial, sans-serif">Modern Sans</option>

                  <option value="'Courier New', monospace">Typewriter</option>
                </select>
              </div>

              <!-- BACKGROUND IMAGE -->

              <div>
                <label class="mb-2 block text-sm font-bold">
                  Background Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  @change="handlePersonalBackground"
                  class="w-full rounded-xl border border-[#70453c]/20 bg-[#f8f3ed] px-3 py-3 text-sm"
                />
              </div>
            </div>

            <!-- TRANSPARENCY -->

            <div class="mt-5">
              <label class="mb-2 block text-sm font-bold">
                Background Transparency
              </label>

              <input
                v-model.number="form.personal.overlay"
                type="range"
                min="0"
                max="1"
                step="0.05"
                class="w-full"
              />
            </div>
          </div>
        </div>

        <!-- ================================================= -->
        <!-- STEP 2 ABOUT -->
        <!-- ================================================= -->

        <div v-if="currentStep === 2">
          <p class="text-xs font-bold uppercase tracking-[0.25em] opacity-60">
            Step 02
          </p>

          <h2 class="mt-2 font-serif text-3xl font-black">About Me</h2>

          <!-- PROFILE IMAGE -->

          <div class="mt-8">
            <label class="mb-2 block text-sm font-bold">
              Profile Picture
            </label>

            <input
              type="file"
              accept="image/*"
              @change="handleProfileImage"
              class="w-full rounded-xl border border-[#70453c]/20 bg-[#f8f3ed] px-3 py-3"
            />
          </div>

          <!-- ABOUT -->

          <div class="mt-6">
            <label class="mb-2 block text-sm font-bold"> About Me </label>

            <textarea
              v-model="form.about"
              maxlength="500"
              rows="7"
              placeholder="Tell people about yourself..."
              class="w-full resize-none rounded-xl border border-[#70453c]/20 bg-[#f8f3ed] px-4 py-3 outline-none"
            ></textarea>

            <p class="mt-1 text-right text-xs opacity-50">
              {{ form.about.length }}/500
            </p>
          </div>

          <!-- ================================================= -->
          <!-- EDUCATION -->
          <!-- ================================================= -->

          <div class="mt-10">
            <div class="flex items-center justify-between">
              <h3 class="font-serif text-xl font-black">Education</h3>

              <button
                @click="addEducation"
                class="rounded-full bg-[#70453c] px-4 py-2 text-xs font-bold text-white"
              >
                + ADD
              </button>
            </div>

            <div
              v-for="(education, index) in form.education"
              :key="index"
              class="mt-4 rounded-2xl bg-[#f8f3ed] p-5"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold">
                  EDUCATION {{ index + 1 }}
                </span>

                <button
                  @click="removeEducation(index)"
                  class="text-xs font-bold text-red-500"
                >
                  REMOVE
                </button>
              </div>

              <div class="mt-4 space-y-3">
                <input
                  v-model="education.school"
                  maxlength="50"
                  placeholder="School / University"
                  class="w-full rounded-xl border border-[#70453c]/20 bg-white px-4 py-3"
                />

                <input
                  v-model="education.degree"
                  maxlength="50"
                  placeholder="Degree / Course"
                  class="w-full rounded-xl border border-[#70453c]/20 bg-white px-4 py-3"
                />

                <input
                  v-model="education.year"
                  maxlength="20"
                  placeholder="Year"
                  class="w-full rounded-xl border border-[#70453c]/20 bg-white px-4 py-3"
                />
              </div>
            </div>
          </div>

          <!-- ================================================= -->
          <!-- SKILLS -->
          <!-- ================================================= -->

          <div class="mt-10">
            <h3 class="font-serif text-xl font-black">Skills</h3>

            <div class="mt-4 flex gap-2">
              <input
                v-model="newSkill"
                maxlength="20"
                placeholder="Add a skill"
                @keyup.enter="addSkill"
                class="flex-1 rounded-xl border border-[#70453c]/20 bg-[#f8f3ed] px-4 py-3"
              />

              <button
                @click="addSkill"
                class="rounded-xl bg-[#70453c] px-5 font-bold text-white"
              >
                ADD
              </button>
            </div>

            <div class="mt-4 flex flex-wrap gap-2">
              <span
                v-for="(skill, index) in form.skills"
                :key="index"
                class="flex items-center gap-2 rounded-full bg-[#eadbd3] px-4 py-2 text-xs font-bold"
              >
                {{ skill }}

                <button @click="removeSkill(index)" class="text-red-500">
                  ×
                </button>
              </span>
            </div>
          </div>

          <!-- ================================================= -->
          <!-- RESUME -->
          <!-- ================================================= -->

          <div class="mt-10">
            <h3 class="font-serif text-xl font-black">Resume</h3>

            <input
              type="file"
              accept=".pdf"
              @change="handleResume"
              class="mt-4 w-full rounded-xl border border-[#70453c]/20 bg-[#f8f3ed] px-3 py-3"
            />

            <p v-if="form.resumeName" class="mt-2 text-xs opacity-60">
              {{ form.resumeName }}
            </p>
          </div>

          <!-- ================================================= -->
          <!-- ABOUT CUSTOMIZATION -->
          <!-- ================================================= -->

          <div class="mt-10">
            <h3 class="font-serif text-xl font-black">
              Customize About Section
            </h3>

            <div class="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-bold">
                  Background Color
                </label>

                <input
                  v-model="form.aboutSettings.backgroundColor"
                  type="color"
                  class="h-12 w-full"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-bold"> Font Color </label>

                <input
                  v-model="form.aboutSettings.fontColor"
                  type="color"
                  class="h-12 w-full"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-bold"> Font </label>

                <select
                  v-model="form.aboutSettings.font"
                  class="w-full rounded-xl border bg-[#f8f3ed] px-4 py-3"
                >
                  <option value="Georgia, serif">Classic Serif</option>

                  <option value="Arial, sans-serif">Modern Sans</option>

                  <option value="'Courier New', monospace">Typewriter</option>
                </select>
              </div>

              <div>
                <label class="mb-2 block text-sm font-bold">
                  Background Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  @change="handleAboutBackground"
                  class="w-full rounded-xl border bg-[#f8f3ed] px-3 py-3"
                />
              </div>
            </div>

            <div class="mt-5">
              <label class="mb-2 block text-sm font-bold"> Transparency </label>

              <input
                v-model.number="form.aboutSettings.overlay"
                type="range"
                min="0"
                max="1"
                step="0.05"
                class="w-full"
              />
            </div>
          </div>
        </div>

        <!-- ================================================= -->
        <!-- STEP 3 PROJECTS -->
        <!-- ================================================= -->

        <div v-if="currentStep === 3">
          <p class="text-xs font-bold uppercase tracking-[0.25em] opacity-60">
            Step 03
          </p>

          <h2 class="mt-2 font-serif text-3xl font-black">Projects</h2>

          <div class="mt-8 flex items-center justify-between">
            <h3 class="font-serif text-xl font-black">Your Projects</h3>

            <button
              @click="addProject"
              class="rounded-full bg-[#70453c] px-4 py-2 text-xs font-bold text-white"
            >
              + ADD PROJECT
            </button>
          </div>

          <!-- PROJECT FORM -->

          <div
            v-for="(project, index) in form.projects"
            :key="index"
            class="mt-5 rounded-2xl bg-[#f8f3ed] p-5"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold"> PROJECT {{ index + 1 }} </span>

              <button
                @click="removeProject(index)"
                class="text-xs font-bold text-red-500"
              >
                REMOVE
              </button>
            </div>

            <div class="mt-5 space-y-4">
              <input
                v-model="project.title"
                maxlength="50"
                placeholder="Project title"
                class="w-full rounded-xl border bg-white px-4 py-3"
              />

              <textarea
                v-model="project.description"
                maxlength="300"
                rows="4"
                placeholder="Project description"
                class="w-full resize-none rounded-xl border bg-white px-4 py-3"
              ></textarea>

              <input
                v-model="project.link"
                maxlength="100"
                type="url"
                placeholder="See More link (optional)"
                class="w-full rounded-xl border bg-white px-4 py-3"
              />

              <div>
                <label class="mb-2 block text-xs font-bold">
                  Project Image / Logo
                </label>

                <input
                  type="file"
                  accept="image/*"
                  @change="handleProjectImage($event, index)"
                  class="w-full rounded-xl border bg-white px-3 py-3"
                />
              </div>
            </div>
          </div>

          <!-- PROJECT COLOR -->

          <div class="mt-10">
            <h3 class="font-serif text-xl font-black">
              Carousel Customization
            </h3>

            <label class="mt-4 mb-2 block text-sm font-bold">
              Carousel Card Color
            </label>

            <input
              v-model="form.projectCardColor"
              type="color"
              class="h-12 w-full"
            />
          </div>

          <!-- PROJECT SECTION SETTINGS -->

          <div class="mt-10">
            <h3 class="font-serif text-xl font-black">
              Customize Projects Section
            </h3>

            <div class="mt-5 grid gap-5 md:grid-cols-2">
              <input
                v-model="form.projectsSettings.backgroundColor"
                type="color"
                class="h-12 w-full"
              />

              <input
                v-model="form.projectsSettings.fontColor"
                type="color"
                class="h-12 w-full"
              />

              <select
                v-model="form.projectsSettings.font"
                class="rounded-xl border bg-[#f8f3ed] px-4 py-3"
              >
                <option value="Georgia, serif">Classic Serif</option>

                <option value="Arial, sans-serif">Modern Sans</option>

                <option value="'Courier New', monospace">Typewriter</option>
              </select>

              <input
                type="file"
                accept="image/*"
                @change="handleProjectsBackground"
                class="rounded-xl border bg-[#f8f3ed] px-3 py-3"
              />
            </div>
          </div>
        </div>

        <!-- ================================================= -->
        <!-- STEP 4 EXPERIENCE -->
        <!-- ================================================= -->

        <div v-if="currentStep === 4">
          <p class="text-xs font-bold uppercase tracking-[0.25em] opacity-60">
            Step 04
          </p>

          <h2 class="mt-2 font-serif text-3xl font-black">Experience</h2>

          <button
            @click="addExperience"
            class="mt-8 rounded-full bg-[#70453c] px-5 py-3 text-xs font-bold text-white"
          >
            + ADD EXPERIENCE
          </button>

          <!-- EXPERIENCE FORM -->

          <div
            v-for="(experience, index) in form.experience"
            :key="index"
            class="mt-5 rounded-2xl bg-[#f8f3ed] p-5"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold">
                EXPERIENCE {{ index + 1 }}
              </span>

              <button
                @click="removeExperience(index)"
                class="text-xs font-bold text-red-500"
              >
                REMOVE
              </button>
            </div>

            <div class="mt-5 space-y-4">
              <input
                v-model="experience.company"
                maxlength="50"
                placeholder="Company name"
                class="w-full rounded-xl border bg-white px-4 py-3"
              />

              <input
                v-model="experience.position"
                maxlength="50"
                placeholder="Position"
                class="w-full rounded-xl border bg-white px-4 py-3"
              />

              <div class="grid gap-4 md:grid-cols-2">
                <div>
                  <label class="mb-2 block text-xs font-bold">
                    Start Date
                  </label>

                  <input
                    v-model="experience.start"
                    type="date"
                    class="w-full rounded-xl border bg-white px-4 py-3"
                  />
                </div>

                <div v-if="!experience.present">
                  <label class="mb-2 block text-xs font-bold"> End Date </label>

                  <input
                    v-model="experience.end"
                    type="date"
                    class="w-full rounded-xl border bg-white px-4 py-3"
                  />
                </div>
              </div>

              <label class="flex items-center gap-2 text-sm font-bold">
                <input v-model="experience.present" type="checkbox" />

                I currently work here
              </label>
            </div>
          </div>

          <!-- EXPERIENCE CUSTOMIZATION -->

          <div class="mt-10">
            <h3 class="font-serif text-xl font-black">
              Customize Experience Section
            </h3>

            <div class="mt-5 grid gap-5 md:grid-cols-2">
              <input
                v-model="form.experienceSettings.backgroundColor"
                type="color"
                class="h-12 w-full"
              />

              <input
                v-model="form.experienceSettings.fontColor"
                type="color"
                class="h-12 w-full"
              />

              <select
                v-model="form.experienceSettings.font"
                class="rounded-xl border bg-[#f8f3ed] px-4 py-3"
              >
                <option value="Georgia, serif">Classic Serif</option>

                <option value="Arial, sans-serif">Modern Sans</option>

                <option value="'Courier New', monospace">Typewriter</option>
              </select>

              <input
                type="file"
                accept="image/*"
                @change="handleExperienceBackground"
                class="rounded-xl border bg-[#f8f3ed] px-3 py-3"
              />
            </div>
          </div>
        </div>

        <!-- ================================================= -->
        <!-- BUTTONS -->
        <!-- ================================================= -->

        <div
          class="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[#70453c]/15 pt-6"
        >
          <!-- BACK -->

          <button
            v-if="currentStep > 1"
            @click="previousStep"
            class="rounded-full border border-[#70453c] px-7 py-3 text-sm font-bold transition hover:bg-[#eadbd3]"
          >
            ← BACK
          </button>

          <div v-else></div>

          <div class="flex gap-3">
            <!-- SAVE DRAFT -->

            <button
              @click="saveDraft"
              class="rounded-full border border-[#70453c] px-6 py-3 text-sm font-bold transition hover:bg-[#eadbd3]"
            >
              SAVE DRAFT
            </button>

            <!-- CONTINUE -->

            <button
              v-if="currentStep < totalSteps"
              @click="nextStep"
              class="rounded-full bg-[#70453c] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#59362f]"
            >
              CONTINUE →
            </button>

            <!-- SAVE PORTFOLIO -->

            <button
              v-else
              @click="savePortfolio"
              class="rounded-full bg-[#70453c] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#59362f]"
            >
              SAVE PORTFOLIO
            </button>
          </div>
        </div>
      </section>

      <!-- ================================================= -->
      <!-- LIVE PREVIEW -->
      <!-- ================================================= -->

      <!-- ================================================= -->
      <!-- LIVE PREVIEW -->
      <!-- ================================================= -->

      <section
        class="sticky top-6 h-fit overflow-hidden rounded-3xl border border-[#70453c]/15 bg-white shadow-sm"
      >
        <!-- PREVIEW HEADER -->

        <div
          class="flex items-center justify-between border-b border-[#70453c]/15 px-6 py-4"
        >
          <div>
            <p
              class="text-[10px] font-bold uppercase tracking-[0.25em] opacity-50"
            >
              Live Preview
            </p>

            <h3 class="mt-1 font-serif text-xl font-black">Your Portfolio</h3>
          </div>

          <span
            class="rounded-full bg-[#eadbd3] px-3 py-1 text-[10px] font-bold"
          >
            STEP {{ currentStep }}
          </span>
        </div>

        <!-- ================================================= -->
        <!-- PREVIEW CONTENT -->
        <!-- ================================================= -->

        <div class="p-5">
          <!-- ================================================= -->
          <!-- STEP 1 PREVIEW -->
          <!-- ================================================= -->

          <div
            v-if="currentStep === 1"
            class="relative min-h-[550px] overflow-hidden rounded-2xl"
            :style="{
              color: form.personal.fontColor,
              fontFamily: form.personal.font,
              backgroundColor: form.personal.backgroundColor,
              backgroundImage:
                form.personal.backgroundType === 'image' &&
                form.personal.backgroundImage
                  ? `linear-gradient(
                rgba(255,255,255,${form.personal.overlay}),
                rgba(255,255,255,${form.personal.overlay})
              ),
              url(${form.personal.backgroundImage})`
                  : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }"
          >
            <div class="flex min-h-[550px] flex-col justify-center p-8">
              <p
                class="text-[10px] font-bold uppercase tracking-[0.3em]"
                :style="{ opacity: 0.6 }"
              >
                Hello, I'm
              </p>

              <h1 class="mt-3 break-words font-serif text-4xl font-black">
                {{ form.name || "Your Name" }}
              </h1>

              <p class="mt-2 text-xl font-semibold">
                {{ form.title || "Your Professional Title" }}
              </p>

              <p v-if="form.location" class="mt-3 text-sm opacity-70">
                📍 {{ form.location }}
              </p>

              <p
                v-if="form.contactEmail"
                class="mt-1 break-all text-sm opacity-70"
              >
                ✉ {{ form.contactEmail }}
              </p>

              <!-- SOCIAL LINKS -->

              <div class="mt-8 flex flex-wrap gap-2">
                <a
                  v-if="form.social.github"
                  :href="form.social.github"
                  target="_blank"
                  class="rounded-full border border-current px-4 py-2 text-xs font-bold"
                >
                  GitHub
                </a>

                <a
                  v-if="form.social.linkedin"
                  :href="form.social.linkedin"
                  target="_blank"
                  class="rounded-full border border-current px-4 py-2 text-xs font-bold"
                >
                  LinkedIn
                </a>

                <a
                  v-if="form.social.instagram"
                  :href="form.social.instagram"
                  target="_blank"
                  class="rounded-full border border-current px-4 py-2 text-xs font-bold"
                >
                  Instagram
                </a>
              </div>

              <!-- EMPTY STATE -->

              <p
                v-if="
                  !form.name &&
                  !form.title &&
                  !form.location &&
                  !form.contactEmail
                "
                class="mt-10 text-xs italic opacity-50"
              >
                Start filling out the form to see your portfolio here.
              </p>
            </div>
          </div>

          <!-- ================================================= -->
          <!-- STEP 2 PREVIEW -->
          <!-- ================================================= -->

          <div
            v-if="currentStep === 2"
            class="min-h-[550px] overflow-hidden rounded-2xl"
            :style="{
              color: form.aboutSettings.fontColor,
              fontFamily: form.aboutSettings.font,
              backgroundColor: form.aboutSettings.backgroundColor,
              backgroundImage:
                form.aboutSettings.backgroundType === 'image' &&
                form.aboutSettings.backgroundImage
                  ? `linear-gradient(
                rgba(255,255,255,${form.aboutSettings.overlay}),
                rgba(255,255,255,${form.aboutSettings.overlay})
              ),
              url(${form.aboutSettings.backgroundImage})`
                  : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }"
          >
            <div class="p-8">
              <p
                class="text-[10px] font-bold uppercase tracking-[0.3em] opacity-50"
              >
                About Me
              </p>

              <!-- PROFILE -->

              <div class="mt-6 flex justify-center">
                <div
                  class="h-32 w-32 overflow-hidden rounded-full border-4 border-current/20 bg-[#eadbd3]"
                >
                  <img
                    v-if="form.profileImage"
                    :src="form.profileImage"
                    alt="Profile"
                    class="h-full w-full object-cover"
                  />

                  <div
                    v-else
                    class="flex h-full w-full items-center justify-center text-4xl opacity-30"
                  >
                    👤
                  </div>
                </div>
              </div>

              <!-- ABOUT -->

              <h2 class="mt-6 text-center text-3xl font-black">
                {{ form.name || "Your Name" }}
              </h2>

              <p
                v-if="form.about"
                class="mt-5 whitespace-pre-line text-sm leading-relaxed opacity-80"
              >
                {{ form.about }}
              </p>

              <p v-else class="mt-5 text-center text-sm italic opacity-40">
                Your introduction will appear here.
              </p>

              <!-- EDUCATION -->

              <div v-if="form.education.length" class="mt-8">
                <h3 class="text-lg font-black">Education</h3>

                <div class="mt-3 space-y-3">
                  <div
                    v-for="(education, index) in form.education"
                    :key="index"
                    class="rounded-xl bg-black/5 p-4"
                  >
                    <p class="font-bold">
                      {{ education.school || "School" }}
                    </p>

                    <p class="mt-1 text-xs opacity-70">
                      {{ education.degree || "Degree / Course" }}
                    </p>

                    <p class="mt-1 text-xs opacity-50">
                      {{ education.year || "Year" }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- SKILLS -->

              <div v-if="form.skills.length" class="mt-8">
                <h3 class="text-lg font-black">Skills</h3>

                <div class="mt-3 flex flex-wrap gap-2">
                  <span
                    v-for="(skill, index) in form.skills"
                    :key="index"
                    class="rounded-full bg-black/10 px-3 py-2 text-xs font-bold"
                  >
                    {{ skill }}
                  </span>
                </div>
              </div>

              <!-- RESUME -->

              <div v-if="form.resumeName" class="mt-8">
                <a
                  :href="form.resumeUrl"
                  target="_blank"
                  class="inline-block rounded-full border border-current px-5 py-2 text-xs font-bold"
                >
                  VIEW RESUME
                </a>
              </div>
            </div>
          </div>

          <!-- ================================================= -->
          <!-- STEP 3 PROJECT PREVIEW -->
          <!-- ================================================= -->

          <div
            v-if="currentStep === 3"
            class="min-h-[550px] overflow-hidden rounded-2xl"
            :style="{
              color: form.projectsSettings.fontColor,
              fontFamily: form.projectsSettings.font,
              backgroundColor: form.projectsSettings.backgroundColor,
              backgroundImage:
                form.projectsSettings.backgroundType === 'image' &&
                form.projectsSettings.backgroundImage
                  ? `linear-gradient(
                rgba(255,255,255,${form.projectsSettings.overlay}),
                rgba(255,255,255,${form.projectsSettings.overlay})
              ),
              url(${form.projectsSettings.backgroundImage})`
                  : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }"
          >
            <div class="p-8">
              <p
                class="text-[10px] font-bold uppercase tracking-[0.3em] opacity-50"
              >
                My Work
              </p>

              <h2 class="mt-2 text-3xl font-black">Projects</h2>

              <!-- EMPTY -->

              <div v-if="!form.projects.length" class="mt-16 text-center">
                <div class="text-5xl opacity-20">◇</div>

                <p class="mt-4 text-sm italic opacity-50">
                  Your projects will appear here.
                </p>
              </div>

              <!-- PROJECTS -->

              <div v-else class="mt-8 space-y-5">
                <div
                  v-for="(project, index) in form.projects"
                  :key="index"
                  class="overflow-hidden rounded-2xl shadow-sm"
                  :style="{
                    backgroundColor: form.projectCardColor,
                  }"
                >
                  <!-- IMAGE -->

                  <div v-if="project.image" class="h-40 overflow-hidden">
                    <img
                      :src="project.image"
                      :alt="project.title"
                      class="h-full w-full object-cover"
                    />
                  </div>

                  <!-- PLACEHOLDER -->

                  <div
                    v-else
                    class="flex h-32 items-center justify-center text-4xl opacity-20"
                  >
                    ◇
                  </div>

                  <div class="p-5">
                    <p
                      class="text-[10px] font-bold uppercase tracking-widest opacity-50"
                    >
                      Project {{ index + 1 }}
                    </p>

                    <h3 class="mt-2 text-xl font-black">
                      {{ project.title || "Project Title" }}
                    </h3>

                    <p class="mt-3 text-sm leading-relaxed opacity-70">
                      {{
                        project.description ||
                        "Your project description will appear here."
                      }}
                    </p>

                    <a
                      v-if="project.link"
                      :href="project.link"
                      target="_blank"
                      class="mt-5 inline-block rounded-full border border-current px-4 py-2 text-xs font-bold"
                    >
                      SEE MORE →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ================================================= -->
          <!-- STEP 4 EXPERIENCE PREVIEW -->
          <!-- ================================================= -->

          <div
            v-if="currentStep === 4"
            class="min-h-[550px] overflow-hidden rounded-2xl"
            :style="{
              color: form.experienceSettings.fontColor,
              fontFamily: form.experienceSettings.font,
              backgroundColor: form.experienceSettings.backgroundColor,
              backgroundImage:
                form.experienceSettings.backgroundType === 'image' &&
                form.experienceSettings.backgroundImage
                  ? `linear-gradient(
                rgba(255,255,255,${form.experienceSettings.overlay}),
                rgba(255,255,255,${form.experienceSettings.overlay})
              ),
              url(${form.experienceSettings.backgroundImage})`
                  : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }"
          >
            <div class="p-8">
              <p
                class="text-[10px] font-bold uppercase tracking-[0.3em] opacity-50"
              >
                Career
              </p>

              <h2 class="mt-2 text-3xl font-black">Experience</h2>

              <!-- EMPTY -->

              <div v-if="!form.experience.length" class="mt-16 text-center">
                <div class="text-5xl opacity-20">✦</div>

                <p class="mt-4 text-sm italic opacity-50">
                  Your work experience will appear here.
                </p>
              </div>

              <!-- EXPERIENCE -->

              <div v-else class="relative mt-10">
                <!-- TIMELINE -->

                <div
                  class="absolute left-2 top-0 h-full w-px bg-current opacity-20"
                ></div>

                <div class="space-y-8">
                  <div
                    v-for="(experience, index) in form.experience"
                    :key="index"
                    class="relative pl-8"
                  >
                    <!-- DOT -->

                    <div
                      class="absolute left-0 top-1 h-4 w-4 rounded-full border-2 border-current bg-transparent"
                    ></div>

                    <p class="text-lg font-black">
                      {{ experience.position || "Position" }}
                    </p>

                    <p class="mt-1 text-sm font-bold opacity-70">
                      {{ experience.company || "Company Name" }}
                    </p>

                    <p class="mt-2 text-xs opacity-50">
                      {{ experience.start ? experience.start : "Start Date" }}

                      —

                      {{
                        experience.present
                          ? "Present"
                          : experience.end || "End Date"
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>
