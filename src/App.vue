<template>
  <a-layout class="layout" id="app" v-if="!userStore.loadingSession">
    <a-layout-header>
      <a-row>
        <a-col :span="12">
          <div class="logo">
            <h1>App Base</h1>
          </div>
        </a-col>
        <a-col :span="12">
          <a-menu
            mode="horizontal"
            theme="dark"
            v-model:selectedKeys="selectedKeys"
          >
            <a-menu-item v-if="userStore.userData" key="home">
              <router-link to="/">Home</router-link>
            </a-menu-item>
            <a-menu-item v-if="userStore.userData" key="profile">
              <router-link to="/profile">Perfil</router-link>
            </a-menu-item>
            <a-menu-item v-if="!userStore.userData" key="signup">
              <router-link to="/signup">SignUp</router-link>
            </a-menu-item>
            <a-menu-item v-if="!userStore.userData" key="login">
              <router-link to="/login">Login</router-link>
            </a-menu-item>
            <a-menu-item v-if="userStore.userData" @click="userStore.logOutUser" key="logout">
              LogOut
            </a-menu-item>
          </a-menu>
        </a-col>
      </a-row>
    </a-layout-header>
    <a-layout-content class="container-app">
      <router-view />
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Fire9 App ©2022 Created by Jon Tmarz
    </a-layout-footer>
  </a-layout>
  <div v-else>
    <div class="e_center">
      <a-spin tip="Loading" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useUserStore } from "./stores/user";
import { useRoute } from "vue-router";

const userStore = useUserStore();
const selectedKeys = ref([]);
const route = useRoute();

watch(
  () => route.name,
  () => { selectedKeys.value = [route.name] }
)

</script>

<style lang="scss">
#app {
  .container-app {
    margin-top: 2rem;
    padding: 0 50px;
    min-height: calc(100vh - 170px);
  }
  .text-center { text-align: center;}
  .logo {
    h1 {color: #fff;}
  }
  .pt-0 { padding: 0; }
  .e_center {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40rem;
  }
}
</style>