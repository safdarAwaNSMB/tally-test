<script setup>
import questSample from "../assets/images/example-panel.png";
import twitterLogo from "../assets/images/twitter.png";
import successTwitterLogo from "../assets/x-twitter.svg";
import pendingTwitterLogo from "../assets/x-twitter (1).svg";
import tickSvg from "../assets/check-solid.svg";
import crossIcon from "../assets/xmark-solid.svg";
import arrowRotate from "../assets/arrow-rotate-right-solid.svg";
import blurCode from "../assets/images/hidden-access-code.png";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import axios from "axios";
import { userStore } from "../stores/user";
import Cookies from "js-cookie";
import copyIcon from "../assets/images/copy-code-icon.png";
import { useToast } from "vue-toast-notification";

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
const twitterRedirectUrl = import.meta.env.VITE_APP_TWITTER_REDIRECT_URL;
const twitterClientId = import.meta.env.VITE_APP_TWITTER_CLIENT_ID;
const openTwitterLogin = ref(false);
const questData = ref(null);
const route = useRoute();
const router = useRouter();
const userState = userStore();
const userToken = Cookies.get("userToken");
const liked = ref(false);
const followed = ref(false);
const retweeted = ref(false);
const liking = ref(false);
const following = ref(false);
const retweeting = ref(false);
const loading = ref(true);



onMounted(async () => {
  await axios
    .get(`${backendUrl}/get-quest/${route.params.questId}`)
    .then((res) => {
      console.log(res);
      questData.value = res.data.data;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      loading.value = false;
    });
  if (userToken) {
    await axios
      .get(`/get-twitter-user/${userToken}`)
      .then((res) => {
        console.log(res.data);
        userState.updateUser(res.data);
        checkLike();
        checkRetweet();
        checkFollowed()
      })
      .catch((err) => console.log(err));
  }
});
const checkLogin = (relativeLink,clickedFollowButton=false) => {
  
  if (userToken && !userState?.user?.admin) {
    window.open(relativeLink, "_blank");
    if(clickedFollowButton){
    clickedFollowButtonHandler()
  }
  } else {
    if (!userToken) {
      openTwitterLogin.value = true;
    }
  }
};

const clickedFollowButtonHandler = async () => {
    if(userToken){
      await axios
        .post(
          `${backendUrl}/post-folow-userToken`,{userToken:userState?.user?.userData?.id,_id:questData._rawValue._id}
        )
        .then((res) => {
          console.log("FOLLOW BUTTON CLICKED",res)
        })
        .catch((err) => console.log(err))
        .finally(() => (following.value = false));
    }
}

const checkFollowed = async () => {
  if (userToken) {
    await axios
        .post(
          `${backendUrl}/get-folow-userToken`,{userToken:userState?.user?.userData?.id,_id:questData._rawValue._id}
        )
        .then((res) => {
          followed.value = res.data.data;
          console.log("FOLLOW BUTTON CLICKED",res.data.data)
        })
        .catch((err) => console.log(err))
        .finally(() => (following.value = false));
  }
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

    let url = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${twitterClientId}&redirect_uri=${twitterRedirectUrl}&scope=tweet.read users.read follows.read like.read offline.access&state=${state}&code_challenge=abc123ABC&code_challenge_method=plain`;
    url += "&state=" + csrfState;
    window.location.href = url;
    // window.open(url);
  } catch (error) {
    console.log(error);
  }
}
function getTweetIdFromUrl(url) {
  const urlParts = url.split("/");
  return urlParts[urlParts.length - 1]; // Extract the last part after the slash
}

const checkFollow = async () => {
  try {
    console.log(userState?.user?.userData?.id);
    console.log("checking follow");
    if (userToken) {
      following.value = true;
      await axios
        .get(
          `${backendUrl}/get-follow-result/${userToken}/${
            userState?.user?.userData?.id
          }/${getTweetIdFromUrl(questData?.value?.followLink)}`
        )
        .then((res) => {
          followed.value = res.data.result;

          console.log(res);
        })
        .catch((err) => console.log(err))
        .finally(() => (following.value = false));
    } else {
      openTwitterLogin.value = true;
    }
  } catch (error) {
    console.log(error);
  }
};
const checkLike = async () => {
  try {
    console.log(userState?.user?.userData?.id);
    console.log("checking like");
    if (userToken) {
      liking.value = true;
      await axios
        .get(
          `https://tally-test.onrender.com/get-like-result/${userToken}/${
            userState?.user?.userData?.id
          }/${getTweetIdFromUrl(questData?.value?.likeLink)}`
        )
        .then((res) => {
          liked.value = res.data.result;

          console.log(res);
        })
        .catch((err) => console.log(err))
        .finally(() => (liking.value = false));
    } else {
      openTwitterLogin.value = true;
    }
  } catch (error) {
    console.log(error);
  }
};



const checkRetweet = async () => {
  try {
    console.log(userState?.user?.userData?.id);
    console.log("checking retweet");
    if (userToken) {
      retweeting.value = true;
      await axios
        .get(
          `https://tally-test.onrender.com/get-retweet-result/${userToken}/${
            userState?.user?.userData?.id
          }/${getTweetIdFromUrl(questData?.value?.retweetLink)}`
        )
        .then((res) => {
          retweeted.value = res.data.result;

          console.log(res);
        })
        .catch((err) => console.log(err))
        .finally(() => (retweeting.value = false));
    } else {
      openTwitterLogin.value = true;
    }
  } catch (error) {
    console.log(error);
  }
};
const toast = useToast();

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(questData?.value?.accessCode);
    toast.open({
      message: "Code Copied!",
      type: "success",
      position: "top",
      timeout: 1000,
      dismissible: true,
      style: {
        fontSize: "12px", // Customize font size
        // Other custom styles...
      },
    });
  } catch (err) {
    console.error("Failed to copy text:", err);
  }
};
</script>

<template>
  <section
    class="flex md:w-[900px] w-full min-h-screen mx-auto pt-0 mt-0 md:m-4 lg:p-4 flex-col"
  >
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
    <div v-else-if="!loading">
      <div
        class="flex mt-0 flex-row w-full justify-between items-center gap-5 flex-wrap lg:flex-nowrap pt-0"
      >
        <div
          class=" md:my-4 mt-0 sm:mb-4 sm:py-3 pt-0 w-[111%] sm:w-full sm:mx-0 mx-[-15px] lg:w-1/2 flex justify-start items-center"
        >
          <img
            class="w-full h-full lg:shadow-custom-shadow sm:rounded-lg lg:rounded-custom object-contain"
            :src="
              questData?.questImage?.filename
                ? backendUrl + '/uploads/' + questData?.questImage?.filename
                : questSample
            "
          />
        </div>
        <div
          class="sm:my-4 my-1 sm:px-5 sm:py-4 py-2 md:py-8 w-full lg:w-1/2 text-white"
        >
          <p
            class="sm:text-2xl text-lg text-center lg:text-start roboto-condensed-font-italic"
          >
            {{
              questData?.header ||
              "COMPLETE 3 EASY STEPS TO REVEAL CODE & JOIN!"
            }}
          </p>
          <p
            class="text-custom-purple roboto-condensed-font text-center lg:text-start"
          >
            {{ questData?.description || "Lucky prizes are on the line!" }}
          </p>
        </div>
      </div>
      <div
        v-if="questData?.followLink?.length > 0"
        :class="
          followed
            ? 'bg-gradient-to-r from-[#0077FB] from-50% to-[#15E6D4] py-2 flex text-white my-2 flex-row sm:gap-0 w-full items-center justify-between rounded-lg px-2 sm:pe-6'
            : 'bg-gradient-to-r from-[#5D0DE6] from-50% to-[#7439FF] py-4 flex text-white my-2 flex-row sm:gap-0 w-full items-center justify-between rounded-lg px-2 sm:pe-6'
        "
      >
        <img
          class="w-[40px] sm:w-[80px] h-[25px] sm:h-[50px]"
          :src="followed ? successTwitterLogo : pendingTwitterLogo"
        />

        <div
          @click="() => checkLogin(questData?.followLink,true)"
          class="flex w-4/6 sm:w-5/6 flex-row items-center"
        >
          <div class="flex flex-col w-full">
            <p
              class="sm:text-xl roboto-condensed-font-italic inline-block text-md font-bold"
            >
              FOLLOW US ON TWITTER
            </p>
            <p
              class="sm:text-lg w-3/4 truncate text-sm not-italic roboto-condensed-font underline text-[#4DFFD4]"
            >
              {{ questData?.followLink }}
            </p>
            <p
              v-if="followed"
              class="sm:w-[90%] lg:w-[50%] rounded-sm text-xs bg-gradient-to-r from-[#FFF700] from-100% to-[#F9C414]0 pl-2 truncate not-italic roboto-condensed-font-italic  text-[#F5630E]"
            >
              * Follow will be confirmed before awarding prizes
            </p>
          </div>
        </div>
        <div
          v-if="following"
          class="inline-block sm:me-4 me-3 sm:mt-5 mt-3 sm:h-6 h-5 sm:w-6 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-white motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span
            class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
            >Loading...</span
          >
        </div>
        <div v-else-if="!following" class="w-1/6 flex justify-end pe-2">
          <img
            @click="checkFollowed"
            class="sm:w-7 w-5 me-3 text-white"
            :src="followed ? tickSvg : arrowRotate"
          />
        </div>
      </div>
      <div
        v-if="questData?.likeLink?.length > 0"
        :class="
          liked
            ? 'bg-gradient-to-r from-[#0077FB] from-50% to-[#15E6D4]'
            : 'bg-gradient-to-r from-[#5D0DE6] from-50% to-[#7439FF]'
        "
        class="flex text-white my-2 flex-row w-full items-center justify-between rounded-lg py-4 px-2 sm:pe-6"
      >
        <img
          class="w-[40px] sm:w-[80px] h-[25px] sm:h-[50px]"
          :src="liked ? successTwitterLogo : pendingTwitterLogo"
        />
        <div
          @click="() => checkLogin(questData?.likeLink)"
          class="flex w-4/6 sm:w-5/6 flex-row items-center"
        >
          <div class="flex flex-col w-full">
            <p
              class="sm:text-xl roboto-condensed-font-italic inline-block text-md font-bold"
            >
              LIKE THIS TWEET
            </p>
            <p
              class="sm:text-lg w-3/4 truncate text-sm not-italic roboto-condensed-font underline text-[#4DFFD4]"
            >
              {{ questData?.likeLink }}
            </p>
          </div>
        </div>
        <div
          v-if="liking"
          class="inline-block me-3 sm:me-4 sm:mt-5 sm:h-6 h-5 sm:w-6 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-white motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span
            class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
            >Loading...</span
          >
        </div>
        <div v-else-if="!liking" class="w-1/6 flex justify-end pe-2">
          <img
            @click="checkLike"
            class="sm:w-7 w-5 text-white"
            :src="liked ? tickSvg : arrowRotate"
          />
        </div>
      </div>
      <div
        v-if="questData?.retweetLink?.length > 0"
        :class="
          retweeted
            ? 'bg-gradient-to-r from-[#0077FB] from-50% to-[#15E6D4]'
            : 'bg-gradient-to-r from-[#5D0DE6] from-50% to-[#7439FF]'
        "
        class="flex text-white my-2 flex-row w-full items-center justify-between rounded-lg py-4 px-2 sm:pe-6"
      >
        <img
          class="w-[40px] sm:w-[80px] h-[25px] sm:h-[50px]"
          :src="retweeted ? successTwitterLogo : pendingTwitterLogo"
        />
        <div
          @click="() => checkLogin(questData?.retweetLink)"
          class="flex w-4/6 sm:w-5/6 flex-row items-center"
        >
          <div class="flex flex-col w-full">
            <p
              class="sm:text-xl roboto-condensed-font-italic inline-block text-md font-bold"
            >
              REPOST THIS TWEET
            </p>
            <p
              class="sm:text-lg w-3/4 truncate text-sm not-italic roboto-condensed-font underline text-[#4DFFD4]"
            >
              {{ questData?.retweetLink }}
            </p>
          </div>
        </div>
        <div
          v-if="retweeting"
          class="inline-block font-bold sm:me-4 me-3 sm:mt-5 sm:h-6 h-5 sm:w-6 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-white motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span
            class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
            >Loading...</span
          >
        </div>
        <div v-else-if="!retweeting" class="w-1/6 flex justify-end pe-2">
          <img
            @click="checkRetweet"
            class="sm:w-7 w-5 text-white"
            :src="retweeted ? tickSvg : arrowRotate"
          />
        </div>
      </div>
      <div class="flex flex-col justify-center text-center my-10 text-white">
        <p v class="text-xl roboto-condensed-font-italic">ACCESS CODE</p>
        <div
          class="flex items-center justify-center flex-row w-full"
          v-if="
            (questData?.likeLink?.length > 0 ? liked : true) &&
            (questData?.followLink?.length > 0 ? followed : true) &&
            (questData?.retweetLink?.length > 0 ? retweeted : true)
          "
        >
          <p
            class="sm:text-4xl mx-auto relative text-3xl roboto-condensed-font-italic text-center inline-block sm:my-5 my-2"
          >
            {{ questData?.accessCode }}
            <img
              @click="copyToClipboard"
              class="cursor-pointer max-w-20 absolute right-[-80px] top-[-20px] w-18 sm:w-20 h-20 inline-block"
              :src="copyIcon"
            />
          </p>
        </div>
        <div v-else class="w-full flex justify-center items-center">
          <img class="md:w-1/3 w-1/2" :src="blurCode" />
        </div>
        <a
        v-if="
            (questData?.likeLink?.length > 0 ? liked : true) &&
            (questData?.followLink?.length > 0 ? followed : true) &&
            (questData?.retweetLink?.length > 0 ? retweeted : true)
          "
          :href="questData?.eventLink"
          class="sm:py-4 py-2 w-[70%] cursor-pointer mx-auto text-center text-white sm:text-2xl text-lg roboto-condensed-font-italic bg-gradient-to-b from-[#FFDD00] from-10% rounded-full my-3 to-[#FF00D5]"
        >
          GO TO EVENT IN THE APP
        </a>
      </div>
      <div
        v-if="openTwitterLogin"
        style="
          opacity: 1;
          backdrop-filter: blur(43px);
          -webkit-backdrop-filter: blur(43px);
        "
        class="fixed top-0 left-0 bg-transparent backdrop-blur-md bg w-full h-screen flex justify-center items-center"
      >
        <div
          style="
            background: transparent
              linear-gradient(180deg, #1d0070 0%, #5300d1 100%) 0% 0% no-repeat
              padding-box;
            box-shadow: 0px 3px 6px #00000029;
            border-radius: 20px;
            opacity: 1;
            backdrop-filter: blur(30px);
            -webkit-backdrop-filter: blur(30px);
          "
          class="md:w-2/6 w-full p-5 m-3 text-white flex flex-col items-center"
        >
          <div
            @click="
              () => {
                openTwitterLogin = false;
              }
            "
            class="flex w-full justify-start"
          >
            <img class="sm:w-6 w-4 cursor-pointer" :src="crossIcon" />
          </div>
          <div class="flex justify-center flex-col px-5 mt-3 text-center">
            <p
              class="text-center roboto-condensed-font text-[#FFFFFF] text-xl my-3"
            >
              Verify your Twitter account so we can validate your reward
            </p>

            <button
              @click="connectTwitter"
              class="p-2 text-center flex items-center gap-2 justify-center lg:text-xl sm:text-xs md:text-xs roboto-bold-italic mt-5 text-white w-[90%] mx-auto rounded-full bg-gradient-to-b mb-4 from-[#309BFF] to-[#006EFF]"
            >
              <img :src="successTwitterLogo" class="w-6 h-6" />
              SIGN IN WITH X (TWITTER)
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
