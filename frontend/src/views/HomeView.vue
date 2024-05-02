<script setup>
import Index from '../components/Index.vue'
import Cookies from 'js-cookie';
import { onMounted } from 'vue';
import axios from 'axios';
import { userStore } from '../stores/user';
import { useToast } from "vue-toast-notification";


const userState = userStore();
const userToken = Cookies.get('userToken');
const toast = useToast();
onMounted(async ()=>{
  if(userToken){
    await axios.get(`https://tally-test.onrender.com/get-twitter-user/${userToken}`).then(res => {
            console.log(res.data.userData);
           userState.updateUser(res.data.userData);
           toast.open({
                    message: `Logged in as ${res.data?.userData?.name}`,
                    type: 'success',
                    position: 'top',
                    timeout: 2000,
                    dismissible: true,
                    style: {
                        fontSize: '16px', // Customize font size
                        // Other custom styles...
                    },
                });
        }).catch(err => console.log(err))
  }
});

</script>

<template>
  <main class="gradient-bg min-h-screen p-4">
    <Index />
  </main>
</template>
