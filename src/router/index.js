import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Allowances from "../views/Allowances";
import Allowances_full from "../views/Allowances_full";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/allowances",
    name: "Allowances",
    component: Allowances
  },
    {
    path: "/allowances_full",
    name: "Allowances_full",
    component: Allowances_full
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
