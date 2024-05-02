<script setup>
import { onMounted, ref, watch } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { userStore } from './stores/user';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'vue-router';


const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
const userState = userStore();
const router = useRouter();
const route = useRoute();
const state = ref(null);
const code = ref(null);



onMounted(async () => {
  
  const adminToken = Cookies.get('adminToken')
  if (adminToken) {
    await axios.get(`${backendUrl}/get-user`, {
      headers: {
        Authorization: adminToken
      }
    }).then(res => {
      userState.updateUser(res.data);
      router.push({name : 'adminHome'})
      console.log(res);
    }).catch(err => console.log(err))
  }
});
</script>

<template>
  <div>
    <header
      :class="userState?.user?.admin ? 'text-black bg-white' : 'text-white bg-gradient-to-r from-indigo-700 via-blue-800 to-indigo-700'"
      class="w-full flex justify-between text-2xl font-bold  p-4 items-center">
      <h3 class=" ">TallyUP!</h3>
      <h3 v-if="!userState.user?.admin">?</h3>
      <button @click="()=>{
        Cookies.remove('adminToken');
        userState.updateUser(null);
        router.push({name : 'home'})
      }" class="p-2 rounded font-normal bg-blue-600 text-white text-xl" v-if="userState.user?.admin">Log Out</button>
    </header>
    <div :class="userState?.user?.admin ? '' :  'italic'">
      <RouterView />
    </div>

  </div>
</template>
