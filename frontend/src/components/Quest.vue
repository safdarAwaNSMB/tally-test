<script setup>
import rightArrow from "../assets/chevron-right-solid.svg";
import questLogo from "../assets/images/questLogo.png";
const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
const props = defineProps(['data']);

</script>

<template>
    <a :href="`http://localhost:5173/quest/${props.data?._id}`">
        <div class="flex my-2 flex-row w-full items-center bg-gradient-to-r from-[#5D0DE6] from-50% to-[#7439FF] justify-between rounded-lg md:px-8 p-3">
            <div class="flex flex-row items-center gap-2">
                <img  class="rounded-full w-12 h-12" :src="props.data?.questImage ? (backendUrl + '/uploads/' + props.data?.questImage?.filename) : questLogo" alt="image">
                <h1 class="sm:text-xl text-lg text-white">{{ props.data?.questName }}</h1>
            </div>
            <img :src="rightArrow" class=" w-4" />
        </div>
    </a>
</template>
