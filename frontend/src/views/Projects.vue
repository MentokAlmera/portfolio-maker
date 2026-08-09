<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const activeTab = ref("all");

const drafts = ref([]);
const published = ref([]);

/* =====================================================
   LOAD PORTFOLIOS
===================================================== */

const loadPortfolios = () => {
  try {
    const savedDrafts = localStorage.getItem("portfolioDrafts");
    const savedPublished = localStorage.getItem("portfolios");

    drafts.value = savedDrafts
      ? JSON.parse(savedDrafts)
      : [];

    published.value = savedPublished
      ? JSON.parse(savedPublished)
      : [];

    /*
      Compatibility with your older code.

      Your previous Create.vue used:
      portfolioDraft
      portfolio

      So we also check those.
    */

    const oldDraft = localStorage.getItem("portfolioDraft");

    if (oldDraft && drafts.value.length === 0) {
      const parsed = JSON.parse(oldDraft);

      drafts.value = [
        {
          id: Date.now(),
          name: parsed.name || "Untitled Portfolio",
          data: parsed,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
    }

    const oldPortfolio = localStorage.getItem("portfolio");

    if (oldPortfolio && published.value.length === 0) {
      const parsed = JSON.parse(oldPortfolio);

      published.value = [
        {
          id: Date.now(),
          name: parsed.name || "My Portfolio",
          data: parsed,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
    }
  } catch (error) {
    console.error("Failed to load portfolios:", error);

    drafts.value = [];
    published.value = [];
  }
};

onMounted(() => {
  loadPortfolios();
});


/* =====================================================
   ALL PORTFOLIOS
===================================================== */

const allPortfolios = computed(() => {
  return [
    ...published.value.map((item) => ({
      ...item,
      status: "published",
    })),

    ...drafts.value.map((item) => ({
      ...item,
      status: "draft",
    })),
  ].sort((a, b) => {
    return (
      new Date(b.updatedAt || 0) -
      new Date(a.updatedAt || 0)
    );
  });
});


/* =====================================================
   CURRENT LIST
===================================================== */

const displayedPortfolios = computed(() => {
  if (activeTab.value === "drafts") {
    return drafts.value;
  }

  if (activeTab.value === "published") {
    return published.value;
  }

  return allPortfolios.value;
});


/* =====================================================
   CREATE
===================================================== */

const createNewPortfolio = () => {
  router.push("/create");
};


/* =====================================================
   VIEW PORTFOLIO
===================================================== */

const viewPortfolio = (portfolio) => {
  localStorage.setItem(
    "selectedPortfolio",
    JSON.stringify(portfolio)
  );

  router.push({
    name: "portfolio-view",
    params: {
      id: portfolio.id,
    },
  });
};


/* =====================================================
   EDIT PORTFOLIO
===================================================== */

const editPortfolio = (portfolio) => {
  localStorage.setItem(
    "editingPortfolio",
    JSON.stringify(portfolio)
  );

  router.push({
    path: "/create",
    query: {
      edit: portfolio.id,
    },
  });
};


/* =====================================================
   UNPUBLISH
===================================================== */

const unpublishPortfolio = (portfolio) => {
  const confirmed = window.confirm(
    `Are you sure you want to unpublish "${portfolio.name}"?`
  );

  if (!confirmed) return;

  const updatedDraft = {
    ...portfolio,
    updatedAt: new Date().toISOString(),
  };

  drafts.value.push(updatedDraft);

  published.value = published.value.filter(
    (item) => item.id !== portfolio.id
  );

  saveData();

  alert("Portfolio unpublished successfully.");
};


/* =====================================================
   DELETE DRAFT
===================================================== */

const deleteDraft = (portfolio) => {
  const confirmed = window.confirm(
    `Delete "${portfolio.name}"? This cannot be undone.`
  );

  if (!confirmed) return;

  drafts.value = drafts.value.filter(
    (item) => item.id !== portfolio.id
  );

  saveData();
};


/* =====================================================
   DELETE PUBLISHED
===================================================== */

const deletePublished = (portfolio) => {
  const confirmed = window.confirm(
    `Delete "${portfolio.name}" permanently?`
  );

  if (!confirmed) return;

  published.value = published.value.filter(
    (item) => item.id !== portfolio.id
  );

  saveData();
};


/* =====================================================
   SAVE LOCAL STORAGE
===================================================== */

const saveData = () => {
  localStorage.setItem(
    "portfolioDrafts",
    JSON.stringify(drafts.value)
  );

  localStorage.setItem(
    "portfolios",
    JSON.stringify(published.value)
  );
};


/* =====================================================
   LOGOUT
===================================================== */

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  router.push("/");
};


/* =====================================================
   DATE FORMAT
===================================================== */

const formatDate = (date) => {
  if (!date) return "Recently";

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

  <div
    class="min-h-screen
           bg-[#f8f3ed]
           px-6 py-8
           text-[#17120f]
           md:px-10"
  >

    <!-- ================================================= -->
    <!-- NAVIGATION -->
    <!-- ================================================= -->

    <header class="mb-16">

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

        <nav
          class="hidden items-center
                 gap-8 text-sm
                 font-semibold md:flex"
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
            class="font-black underline"
          >
            PROJECTS
          </RouterLink>

        </nav>


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

    </header>


    <!-- ================================================= -->
    <!-- CONTENT -->
    <!-- ================================================= -->

    <main class="mx-auto max-w-7xl">


      <!-- ================================================= -->
      <!-- HEADER -->
      <!-- ================================================= -->

      <section
        class="mb-12 flex
               flex-col gap-6
               md:flex-row
               md:items-end
               md:justify-between"
      >

        <div>

          <p
            class="text-xs font-bold
                   uppercase
                   tracking-[0.3em]
                   opacity-60"
          >
            Portfolio Manager
          </p>


          <h1
            class="mt-3 font-serif
                   text-5xl font-black
                   md:text-7xl"
          >
            Your portfolios.
          </h1>


          <p
            class="mt-4 max-w-2xl
                   leading-relaxed
                   opacity-70"
          >
            Manage your drafts, published
            portfolios, and recent work.
          </p>

        </div>


        <!-- CREATE -->

        <button
          @click="createNewPortfolio"
          class="rounded-full
                 bg-[#70453c]
                 px-7 py-3
                 text-sm font-bold
                 text-white
                 transition
                 hover:bg-[#59362f]"
        >
          + CREATE PORTFOLIO
        </button>

      </section>


      <!-- ================================================= -->
      <!-- TABS -->
      <!-- ================================================= -->

      <div
        class="mb-10 flex
               flex-wrap gap-3
               border-b
               border-[#70453c]/20
               pb-4"
      >

        <button
          @click="activeTab = 'all'"
          :class="
            activeTab === 'all'
              ? 'bg-[#70453c] text-white'
              : 'bg-white hover:bg-[#eadbd3]'
          "
          class="rounded-full
                 px-6 py-3
                 text-sm font-bold
                 transition"
        >
          ALL PROJECTS
        </button>


        <button
          @click="activeTab = 'drafts'"
          :class="
            activeTab === 'drafts'
              ? 'bg-[#70453c] text-white'
              : 'bg-white hover:bg-[#eadbd3]'
          "
          class="rounded-full
                 px-6 py-3
                 text-sm font-bold
                 transition"
        >
          DRAFTS
          <span class="ml-1 opacity-70">
            {{ drafts.length }}
          </span>
        </button>


        <button
          @click="activeTab = 'published'"
          :class="
            activeTab === 'published'
              ? 'bg-[#70453c] text-white'
              : 'bg-white hover:bg-[#eadbd3]'
          "
          class="rounded-full
                 px-6 py-3
                 text-sm font-bold
                 transition"
        >
          PUBLISHED
          <span class="ml-1 opacity-70">
            {{ published.length }}
          </span>
        </button>

      </div>


      <!-- ================================================= -->
      <!-- EMPTY STATE -->
      <!-- ================================================= -->

      <div
        v-if="displayedPortfolios.length === 0"
        class="rounded-3xl
               border
               border-[#70453c]/15
               bg-white
               px-8 py-20
               text-center
               shadow-sm"
      >

        <p
          class="font-serif
                 text-3xl
                 font-black"
        >
          No portfolios yet.
        </p>


        <p
          class="mx-auto mt-3
                 max-w-md
                 text-sm
                 opacity-60"
        >
          Start creating your first portfolio
          and it will appear here.
        </p>


        <button
          @click="createNewPortfolio"
          class="mt-7 rounded-full
                 bg-[#70453c]
                 px-7 py-3
                 text-sm font-bold
                 text-white"
        >
          CREATE YOUR FIRST PORTFOLIO
        </button>

      </div>


      <!-- ================================================= -->
      <!-- PORTFOLIO GRID -->
      <!-- ================================================= -->

      <div
        v-else
        class="grid gap-6
               md:grid-cols-2
               lg:grid-cols-3"
      >

        <article
          v-for="portfolio in displayedPortfolios"
          :key="portfolio.id"
          class="overflow-hidden
                 rounded-3xl
                 border
                 border-[#70453c]/15
                 bg-white
                 shadow-sm
                 transition
                 hover:-translate-y-1
                 hover:shadow-lg"
        >

          <!-- PREVIEW -->

          <div
            class="relative
                   flex h-52
                   items-center
                   justify-center
                   overflow-hidden
                   bg-[#eadbd3]"
          >

            <img
              v-if="
                portfolio.data &&
                portfolio.data.profileImage
              "
              :src="portfolio.data.profileImage"
              class="absolute inset-0
                     h-full w-full
                     object-cover
                     opacity-30"
            />


            <div
              class="relative z-10
                     px-6 text-center"
            >

              <p
                class="font-serif
                       text-3xl
                       font-black"
              >
                {{
                  portfolio.data?.name ||
                  portfolio.name ||
                  "Untitled"
                }}
              </p>


              <p
                class="mt-2 text-sm
                       font-semibold
                       opacity-70"
              >
                {{
                  portfolio.data?.title ||
                  "Portfolio"
                }}
              </p>

            </div>


            <!-- STATUS -->

            <span
              class="absolute
                     right-4 top-4
                     rounded-full
                     px-3 py-1
                     text-[10px]
                     font-black
                     uppercase
                     tracking-wider"
              :class="
                portfolio.status === 'published'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              "
            >
              {{ portfolio.status }}
            </span>

          </div>


          <!-- CARD CONTENT -->

          <div class="p-6">

            <h2
              class="font-serif
                     text-2xl
                     font-black"
            >
              {{ portfolio.name }}
            </h2>


            <p
              class="mt-2 text-xs
                     opacity-50"
            >
              Last edited
              {{ formatDate(portfolio.updatedAt) }}
            </p>


            <!-- ACTIONS -->

            <div
              class="mt-6 flex
                     flex-wrap gap-2"
            >

              <!-- VIEW -->

              <button
                @click="viewPortfolio(portfolio)"
                class="rounded-full
                       bg-[#70453c]
                       px-4 py-2
                       text-xs font-bold
                       text-white
                       transition
                       hover:bg-[#59362f]"
              >
                VIEW
              </button>


              <!-- EDIT -->

              <button
                @click="editPortfolio(portfolio)"
                class="rounded-full
                       border
                       border-[#70453c]
                       px-4 py-2
                       text-xs font-bold
                       transition
                       hover:bg-[#eadbd3]"
              >
                EDIT
              </button>


              <!-- UNPUBLISH -->

              <button
                v-if="portfolio.status === 'published'"
                @click="unpublishPortfolio(portfolio)"
                class="rounded-full
                       border
                       border-orange-400
                       px-4 py-2
                       text-xs font-bold
                       text-orange-600
                       transition
                       hover:bg-orange-50"
              >
                UNPUBLISH
              </button>


              <!-- DELETE DRAFT -->

              <button
                v-if="portfolio.status === 'draft'"
                @click="deleteDraft(portfolio)"
                class="rounded-full
                       border
                       border-red-400
                       px-4 py-2
                       text-xs font-bold
                       text-red-500
                       transition
                       hover:bg-red-50"
              >
                DELETE
              </button>


              <!-- DELETE PUBLISHED -->

              <button
                v-if="portfolio.status === 'published'"
                @click="deletePublished(portfolio)"
                class="rounded-full
                       border
                       border-red-400
                       px-4 py-2
                       text-xs font-bold
                       text-red-500
                       transition
                       hover:bg-red-50"
              >
                DELETE
              </button>

            </div>

          </div>

        </article>

      </div>

    </main>

  </div>

</template>