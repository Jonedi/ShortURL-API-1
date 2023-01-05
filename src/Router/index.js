import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/user";

import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import Editar from "../views/Editar.vue";
import Profile from '../views/Profile.vue';

const requireAuth = async (to, from, next) => {
    const userStore = useUserStore();
    userStore.loadingSession = true;
    const user = await userStore.currentUser()
    if (user) {
        next()
    } else {
        next('/login')
    }
    userStore.loadingSession = false;
}

const routes = [
    { path: '/', component: Home, beforeEnter: requireAuth, name: "home" },
    { path: '/editar/:id', component: Editar, beforeEnter: requireAuth, name: 'edit'  },
    { path: '/profile', component: Profile, beforeEnter: requireAuth, name: 'profile' },
    { path: '/login', component: Login, name:'login'},
    { path: '/signup', component: Signup, name: 'signup' },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;