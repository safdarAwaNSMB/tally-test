<script setup>
import { onMounted, ref } from 'vue';
import Quest from './Quest.vue'
import axios from 'axios';
const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
const quests = ref(null);
const loading = ref(true);


onMounted(async () => {
    await axios.get(`${backendUrl}/get-all-quests`).then(res => {
        console.log(res);
        quests.value = res.data.data
    }).catch(err => {
        console.log(err);
    }).finally(() => {
        loading.value = false
    })
})
console.log();
</script>

<template>
    <section class="flex md:w-2/3 w-full mx-auto m-4 p-5 flex-col justify-center">
        <h3 class="text-center text-white text-3xl font-bold my-3">Available Quests</h3>
        <Quest v-for="(quest, index) in quests" :key="index" :data="quest" />
    </section>
</template>
