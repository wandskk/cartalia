import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { analytics } from "../utils/analytics";

const LoginView = () => import("../views/LoginView.vue");
const RegisterView = () => import("../views/RegisterView.vue");
const DashboardView = () => import("../views/DashboardView.vue");
const CardsView = () => import("../views/CardsView.vue");
const CardDetailView = () => import("../views/CardDetailView.vue");
const MarketplaceView = () => import("../views/MarketplaceView.vue");

const MyTradesView = () => import("../views/MyTradesView.vue");
const ErrorView = () => import("../views/ErrorView.vue");

const routes = [
  { path: "/", redirect: "/marketplace" },
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView },
  { path: "/marketplace", component: MarketplaceView },

  { path: "/my-trades", component: MyTradesView, meta: { requiresAuth: true } },
  {
    path: "/dashboard",
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  { path: "/cards", component: CardsView, meta: { requiresAuth: true } },
  {
    path: "/cards/:id",
    component: CardDetailView,
    meta: { requiresAuth: true },
  },
  { path: "/error/:code", component: ErrorView },
  { path: "/:pathMatch(.*)*", redirect: "/error/404" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next("/login");
  } else if (
    (to.path === "/login" || to.path === "/register") &&
    auth.isAuthenticated
  ) {
    next("/dashboard");
  } else {
    next();
  }
});

router.afterEach((to) => {
  analytics.trackPageView(to.path);
});

export default router;
