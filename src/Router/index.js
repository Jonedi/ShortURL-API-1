import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/user";

import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import Editar from "../views/Editar.vue";
import Profile from '../views/Profile.vue';
import NotFound from '../views/NotFound.vue';
import ShortUrl from '../views/ShortUrl.vue';
import { useDatabseStore } from "../stores/database";

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

const redireccion = async (to, form, next) => {
    const { getUrl } = useDatabseStore()
    const userStore = useDatabseStore()

    userStore.loadingSession = true

    const name = await getUrl(to.params.pathMatch[0])

    if (!name) {
        next()
        userStore.loadingSession = false
    } else {
        userStore.loadingSession = true
        window.location.href = name
        next()
    }
}

const routes = [
    { path: '/', component: Home, beforeEnter: requireAuth, name: "home" },
    { path: '/editar/:id', component: Editar, beforeEnter: requireAuth, name: 'edit'  },
    { path: '/profile', component: Profile, beforeEnter: requireAuth, name: 'profile' },
    { path: '/login', component: Login, name:'login'},
    { path: '/signup', component: Signup, name: 'signup' },
    // { path: '/shorturl', component: ShortUrl, name: 'shorturl', beforeEnter: redireccion },
    { path: '/:pathMatch(.*)*', component: NotFound, name: 'notfound', beforeEnter: redireccion },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;