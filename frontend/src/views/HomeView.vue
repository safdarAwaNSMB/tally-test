<script setup>
import Index from '../components/Index.vue'
import Cookies from 'js-cookie';
import { onMounted } from 'vue';
import axios from 'axios';

const userToken = Cookies.get('userToken');

onMounted(async ()=>{
  if(userToken){
    await axios.get(`https://tally-test.onrender.com/get-twitter-user/${userToken}`).then(res => {
            console.log(res.data);
           
            // Cookies.set('userId', res.data.user);
        }).catch(err => console.log(err))
  }
});

</script>

<template>
  <main class="gradient-bg min-h-screen p-4">
    <Index />
  </main>
</template>
