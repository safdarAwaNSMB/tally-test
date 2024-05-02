import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import QuestView from "../views/QuestView.vue";
import LoginView from "../views/LoginView.vue";
import AdminView from "../views/AdminView.vue";
import ManageView from "../views/ManageView.vue"
import TwitterSuccess from "../views/TwitterSuccess.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/quest/:questId",
      name: "quest",
      component: QuestView,
    },
    {
      path: "/admin-login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/admin-home",
      name: "adminHome",
      component: AdminView,
    },
    {
      path: "/admin-manage",
      name: "adminManage",
      component: ManageView,
    },
    {
      path: "/twitter-success",
      name: "twitterSuccess",
      component: TwitterSuccess,
    },
  ],
});

export default router;
