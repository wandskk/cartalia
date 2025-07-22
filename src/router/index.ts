import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue';
import CardsView from '../views/CardsView.vue';
import CardDetailView from '../views/CardDetailView.vue';
import MarketplaceView from '../views/MarketplaceView.vue';
import CreateTradeView from '../views/CreateTradeView.vue';
import { useAuthStore } from '../stores/auth';

const routes = [
  { path: '/', redirect: '/marketplace' },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/marketplace', component: MarketplaceView },
  { path: '/create-trade', component: CreateTradeView },
  { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/cards', component: CardsView, meta: { requiresAuth: true } },
  { path: '/cards/:id', component: CardDetailView, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login');
  } else if ((to.path === '/login' || to.path === '/register') && auth.isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router 