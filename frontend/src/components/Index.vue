<script setup>
import { onMounted, ref } from "vue";
import Quest from "./Quest.vue";
import axios from "axios";
const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
const quests = ref(null);
const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  await axios
    .get(`${backendUrl}/get-all-quests`)
    .then((res) => {
      console.log(res);
      quests.value = res.data.data;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      loading.value = false;
    });
});
</script>

<template>
  <section class="flex sm:w-2/3 w-full mx-auto sm:m-4 sm:p-5 flex-col justify-center">
    <h3 class="text-center text-white sm:text-3xl text-xl font-bold sm:my-3 my-1">
      Available Quests
    </h3>
    <div v-if="loading" class="flex mt-5 justify-center items-center w-full">
      <div
        class="inline-block me-3 h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-white motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      >
        <span
          class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >Loading...</span
        >
      </div>
    </div>
    <Quest v-for="(quest, index) in quests" :key="index" :data="quest" />
  </section>
</template>
