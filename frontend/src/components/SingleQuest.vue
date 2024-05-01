<script setup>
import questLogo from "../assets/images/questLogo.png";
import twitterLogo from "../assets/images/twitter.png";
import tickSvg from "../assets/check-solid.svg";
import crossIcon from '../assets/xmark-solid.svg'
import arrowRotate from "../assets/arrow-rotate-right-solid.svg"
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from "vue";
import axios from "axios";

const openTwitterLogin = ref(false);
const questData = ref(null);
const route = useRoute();
console.log(route.params);
console.log(route.query);
const router = useRouter()
const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
onMounted(async () => {
    await axios.get(`${backendUrl}/get-quest/${route.params.questId}`).then(res => {
        console.log(res);
        questData.value = res.data.data
    }).catch(err => {
        console.log(err);
    })
})
const checkLogin = () => {
    openTwitterLogin.value = true
}
const generateRandomString = () => {
    const charset =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";
    for (let i = 0; i < 64; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        randomString += charset.charAt(randomIndex);
    }
    return randomString;
};

const random = generateRandomString();
const state = random;
// twitter oauth Url constructor
async function connectTwitter() {
    try {
        const csrfState = Math.random().toString(36).substring(2);

        let url = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=V1FrUFdVZ3picVFSUGtHWExpR1I6MTpjaQ&redirect_uri=http://localhost:5173/twitter-success&scope=tweet.read users.read offline.access&state=${state}&code_challenge=challenge&code_challenge_method=plain`;
        url += "&state=" + csrfState;
        window.open(url, '_blank');
    } catch (error) {

    }
}

console.log(route.params);
</script>

<template>
    <section class="flex md:w-2/3 w-full mx-auto m-4 p-5 flex-col justify-center">
        <div class="flex my-5 flex-row w-full justify-between gap-5 flex-wrap lg:flex-nowrap py-4">
            <div
                class="my-4 rounded-lg px-4 py-8 w-full lg:w-1/2 shadow-2xl shadow-gray-800 bg-gradient-to-r from-red-500 from-20% to-violet-800 to-70% flex justify-between flex-row">
                <div>
                    <img :src="questLogo" />
                </div>
                <div class="text-center text-white">
                    <p class="text-md font-bold">{{ questData?.questName }}</p>
                    <!-- <h2 class="text-3xl font-bold mb-3">{{questData.header}}</h2> -->
                    <hr class="border-black" />
                </div>
            </div>
            <div class="my-4 px-5 py-8 w-full lg:w-1/2 text-white">
                <p class="text-3xl font-bold">
                    {{ questData?.header }}
                </p>
                <p class="text-slate-400">{{ questData?.description }}</p>
            </div>
        </div>
        <div @click="checkLogin"
            class="flex text-white my-2 flex-row w-full bg-gradient-to-r from-sky-600 from-50% to-teal-400 justify-between rounded-lg py-4 px-2 pe-6">
            <div class="flex flex-row items-center">
                <img class="w-18 h-12" :src="twitterLogo" />
                <div>
                    <h1 class="text-2xl mb-2 font-bold">FOLLOW US ON TWITTER</h1>
                    <a class="text-xl underline text-green-300" href="#">{{ questData?.followLink }}</a>
                </div>
            </div>
            <img class=" w-10 me-3 text-white" :src="tickSvg" />
        </div>
        <div @click="checkLogin"
            class="flex text-white my-2 flex-row w-full items-center bg-violet-600 justify-between rounded-lg py-4 px-2 pe-6">
            <div class="flex flex-row items-center">
                <img class="w-18 h-12" :src="twitterLogo" />
                <div>
                    <h1 class="text-2xl mb-2 font-bold">LIKE THIS TWEET</h1>
                    <a class="text-xl underline text-green-400" href="#">{{ questData?.likeLink }}</a>
                </div>
            </div>
            <img class=" w-10 me-3" :src="arrowRotate" />
        </div>
        <div @click="checkLogin"
            class="flex text-white my-2 flex-row w-full items-center bg-violet-600 justify-between rounded-lg py-4 px-2 pe-6">
            <div class="flex flex-row items-center">
                <img class="w-18 h-12" :src="twitterLogo" />
                <div>
                    <h1 class="text-2xl mb-2 font-bold">REPOST THIS TWEET</h1>
                    <a class="text-xl underline text-green-400" href="#">{{ questData?.retweetLink }}</a>
                </div>
            </div>
            <img class=" w-10 me-3" :src="arrowRotate" />
        </div>
        <div class="flex flex-col justify-center text-center my-10 text-white">
            <p class="text-xl font-bold">ACCESS CODE</p>
            <p class=" blur-sm text-4xl my-5 font-bold">COMPLETESTEPS</p>
        </div>
        <div v-if="openTwitterLogin"
            class="fixed top-0 left-0 backdrop-blur-sm bg w-full h-screen flex justify-center items-center">
            <div class=" md:w-2/6 w-full p-5 bg-[#1D0070] text-white rounded-lg h-[300px] flex flex-col  items-center ">
                <div class=" flex w-full justify-start">
                    <img class=" w-10" :src="crossIcon" />
                </div>
                <div class="flex justify-center flex-col mt-3 text-center">
                    <p class="text-center not-italic text-xl my-3">Verify your Twitter account so we can validate your
                        reward</p>


                    <button @click="connectTwitter"
                        class="p-2 text-center text-xl font-bold italic text-white w-full rounded-full bg-[#309BFF]">SIGN
                        IN WITH X (TWITTER)</button>


                </div>

            </div>
        </div>
    </section>
</template>
