import { createRouter, createWebHistory } from "vue-router";

import Landing from "../views/Landing.vue";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import VerifyEmail from "../views/VerifyEmail.vue";
import Home from "../views/Home.vue";
import Projects from "../views/Projects.vue";
import Create from "../views/Create.vue";
import Portfolio from "../views/Portfolio.vue";

const routes = [
  {
    path: "/",
    name: "Landing",
    component: Landing,
  },

  {
    path: "/login",
    name: "Login",
    component: Login,
  },

  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },

  {
    path: "/verify-email",
    name: "VerifyEmail",
    component: VerifyEmail,
    meta: {
      requiresVerification: true,
    },
  },

  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/projects",
    name: "Projects",
    component: Projects,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/create",
    name: "Create",
    component: Create,
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/portfolio",
    component: () => import("../views/Portfolio.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const token = localStorage.getItem("token");
  const verificationEmail = localStorage.getItem("verificationEmail");

  // 🔒 Protect Home
  if (to.meta.requiresAuth && !token) {
    return "/login";
  }

  // 🔒 Protect Verify Email
  if (to.meta.requiresVerification && !verificationEmail) {
    return "/signup";
  }

  // Prevent logged-in users from accessing Login/Signup
  if ((to.path === "/login" || to.path === "/signup") && token) {
    return "/home";
  }

  // Prevent logged-in users from accessing verification
  if (to.path === "/verify-email" && token) {
    return "/home";
  }

  return true;
});

export default router;
