<script setup>
import rightArrow from "../assets/chevron-right-solid.svg";

const props = defineProps(['data']);
console.log(props.data);

</script>

<template>
    <a :href="`http://localhost:5173/quest/${props.data?._id}`">
        <div class="flex my-2 flex-row w-full items-center bg-sky-400 justify-between rounded-lg md:px-8 p-4">
            <div>
                <img :src="backendUrl + '/' + props.data?.questImage" alt="image">
                <h1 class="text-xl">{{ props.data?.questName }}</h1>
            </div>
            <img :src="rightArrow" class="w-6" />
        </div>
    </a>
</template>
