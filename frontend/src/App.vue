<script setup>
import { onMounted, ref, watch } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import { userStore } from "./stores/user";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "vue-router";

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
const userState = userStore();
const router = useRouter();
const route = useRoute();
const state = ref(null);
const code = ref(null);

onMounted(async () => {
  const adminToken = Cookies.get("adminToken");
  if (adminToken) {
    await axios
      .get(`${backendUrl}/get-user`, {
        headers: {
          Authorization: adminToken,
        },
      })
      .then((res) => {
        userState.updateUser(res.data);
        router.push({ name: "adminHome" });
        console.log(res);
      })
      .catch((err) => console.log(err));
  }
});
</script>

<template>
  <div>
    <header
      :class="
        userState?.user?.admin
          ? 'text-black bg-white'
          : 'text-white shadow-md shadow-[#0000003D] bg-[#3B0AA5] backdrop-blur-sm'
      "
      class="w-full flex justify-between sm:text-2xl text-lg font-bold p-4 sm:px-10 items-center"
    >
      <img src="./assets/images/logo-header.png" class="sm:w-20 w-14" />
      <div class="flex flex-row items-center gap-2">
        <img
          v-if="!userState.user"
          src="./assets/images/help-button.png"
          class="sm:w-4 w-3"
        />
        <h4 v-else-if="userState.user?.admin">Admin Panel</h4>
        <p class="font-normal" v-else-if="userState?.user">
          {{ !userState?.user?.admin && userState?.user?.name }}
        </p>
        <button
          @click="
            () => {
              Cookies.remove('adminToken');
              Cookies.remove('userToken');
              userState.updateUser(null);
              router.push('/');
            }
          "
          class="sm:p-2 p-1 rounded font-normal bg-blue-600 text-white sm:text-xl text-lg"
          v-if="userState.user"
        >
          Log Out
        </button>
      </div>
    </header>
    <div :class="userState?.user?.admin ? '' : 'italic font'">
      <RouterView />
    </div>
  </div>
</template>
