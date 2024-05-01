<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { userStore } from '../stores/user';
import CreateQuest from '../components/CreateQuest.vue';
import ManageQuests from '@/components/ManageQuests.vue';


const userState = userStore()
const router = useRouter()
onMounted(() => {
    if (!userState.user?.admin || userState.user === null) {
        router.push({ name: 'home' })
    }
})
console.log("");
</script>


<template>
    <main class=" bg-blue-200 pt-4">
        <div class="flex flex-row w-full">
            <div class="text-center p-5 w-48 bg-white border-t-2 border-slate-300">
                <router-link class=" text-xl text-neutral-500 text-center w-full font-bold" to="/admin-home">Create</router-link>
            </div>
            <div class="bg-slate-300' border-t-2 text-center bg-slate-300 border-slate-300 p-5 w-48">
                <router-link class="text-neutral-500 text-xl text-center w-full font-bold" to="/admin-manage">Manage</router-link>
            </div>
        </div>
        <CreateQuest  />

    </main>
</template>
