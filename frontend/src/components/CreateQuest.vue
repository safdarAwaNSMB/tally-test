<script setup>
import axios from "axios";
import { ref, watch } from "vue";
import { useToast } from "vue-toast-notification";
import questLogo from "../assets/images/questLogo.png";
import questSample from "../assets/images/example-panel.png";

const toast = useToast();
const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
const errors = ref([]);
const requesting = ref(false);
const dataState = ref({
  questName: "",
  followLink: "",
  likeLink: "",
  retweetLink: "",
  eventLink: "",
  accessCode: "",
  header: "",
  description: "",
});
const created = ref(false);
const createdQuest = ref(null);

const handleSubmit = async (event) => {
  errors.value = []; // Reset errors array
  let isError = false;
  for (const key in dataState.value) {
    if (
      dataState.value[key].length === 0 &&
      (key === "questName" || key === "accessCode")
    ) {
      errors.value.push(key);
      isError = true;
    }
  }
  if (
    dataState.value.followLink === "" &&
    dataState.value.likeLink === "" &&
    dataState.value.retweetLink === ""
  ) {
    isError = true;
    toast.open({
      message: "Please provide at least one task, follow, Post, or retweet!",
      type: "error",
      position: "top",
      timeout: 2000,
      dismissible: true,
      style: {
        fontSize: "16px", // Customize font size
        // Other custom styles...
      },
    });
  }

  if (!isError) {
    requesting.value = true;
    const formData = new FormData(event.target);
    await axios
      .post(`${backendUrl}/create-quest`, formData)
      .then((res) => {
        console.log(res);
        dataState.value = {
          questName: "",
          followLink: "",
          likeLink: "",
          retweetLink: "",
          eventLink: "",
          accessCode: "",
          header: "",
          description: "",
        };
        event.target.reset();
        created.value = true;
        createdQuest.value = res.data.data;
      })
      .catch((err) => console.log(err))
      .finally(() => (requesting.value = false));
  }
};
const updateErrors = (e) => {
  errors.value = errors.value.filter((val) => val !== e.target.name);
};
watch(
  errors,
  (newVal) => {
    console.log(errors.value); // Log the updated errors array for debugging
  },
  { deep: true }
);
</script>

<template>
  <div class="bg-white p-2 md:p-10">
    <div class="md:w-1/2 w-full p-3">
      <p class="italic text-lg text-neutral-500">* Required Fields</p>
      <form encType="multipart/form-data" @submit.prevent="handleSubmit">
        <div class="col-span-full my-5 flex sm:flex-row flex-col">
          <div class="sm:w-2/3 w-full me-5">
            <label
              :class="
                errors?.includes('questName')
                  ? ' text-red-500'
                  : 'text-neutral-600'
              "
              class="block text-xl font-bold leading-6"
              >Quest Name*
              <span
                class="text-red-500 font-normal"
                v-if="errors?.includes('questName')"
                >Required</span
              ></label
            >
            <div class="mt-2">
              <input
                type="text"
                @input="updateErrors"
                v-model="dataState.questName"
                name="questName"
                class="block w-full rounded-lg border-2 py-2.5 text-neutral-500 ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-black md:text-2xl text-lg px-4"
              />
            </div>
          </div>
          <div class="sm:w-1/3 w-full">
            <label class="text-xl font-bold inline-block text-neutral-600"
              >Image
            </label>
            <input
              class="relative mt-2 m-0 block w-full min-w-0 flex-auto cursor-pointer rounded-lg border-2 border-solid border-secondary-500 bg-transparent bg-clip-padding px-3 py-2.5 text-xl font-normal text-surface transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:me-3 file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-e file:border-solid file:border-inherit file:bg-transparent file:px-3 file:py-[0.32rem] file:text-surface focus:border-primary focus:text-gray-700 focus:shadow-inset focus:outline-none dark:border-white/70 dark:text-white file:dark:text-white"
              type="file"
              accept=".jpg, .png, .jpeg"
              name="questImage"
            />
          </div>
        </div>
        <div class="w-full my-5">
          <label class="block text-xl font-bold leading-6 text-neutral-600"
            >Header (max 40 characters)</label
          >
          <div class="mt-2">
            <input
              maxlength="40"
              type="text"
              name="header"
              v-model="dataState.header"
              class="block w-full rounded-lg border-2 py-2.5 text-neutral-500 ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-black md:text-2xl text-lg px-4"
            />
          </div>
        </div>
        <div class="w-full my-5">
          <label class="block text-xl font-bold leading-6 text-neutral-600"
            >Description (max 50 characters)</label
          >
          <div class="mt-2">
            <input
              maxlength="50"
              type="text"
              name="description"
              v-model="dataState.description"
              class="block w-full rounded-lg border-2 py-2.5 text-neutral-500 ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-black md:text-2xl text-lg px-4"
            />
          </div>
        </div>
        <div class="w-full my-5">
          <label
            :class="
              errors.includes('followLink')
                ? ' text-red-500'
                : 'text-neutral-600'
            "
            class="block text-xl font-bold leading-6"
            >Twitter follow Account
            <span
              class="text-red-500 font-normal"
              v-if="errors.includes('followLink')"
              >Required</span
            ></label
          >
          <div class="mt-2">
            <input
              type="text"
              name="followLink"
              @input="updateErrors"
              v-model="dataState.followLink"
              class="block w-full rounded-lg border-2 py-2.5 text-neutral-500 ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-black md:text-2xl text-lg px-4"
            />
          </div>
        </div>
        <div class="w-full my-5">
          <label
            :class="
              errors.includes('likeLink') ? ' text-red-500' : 'text-neutral-600'
            "
            class="block text-xl font-bold leading-6"
            >Twitter Post to Like
            <span
              class="text-red-500 font-normal"
              v-if="errors.includes('likeLink')"
              >Required</span
            ></label
          >
          <div class="mt-2">
            <input
              type="text"
              name="likeLink"
              @input="updateErrors"
              v-model="dataState.likeLink"
              class="block w-full rounded-lg border-2 py-2.5 text-neutral-500 ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-black md:text-2xl text-lg px-4"
            />
          </div>
        </div>
        <div class="w-full my-5">
          <label
            :class="
              errors.includes('retweetLink')
                ? ' text-red-500'
                : 'text-neutral-600'
            "
            class="block text-xl font-bold leading-6"
            >Twitter Post to Retweet
            <span
              class="text-red-500 font-normal"
              v-if="errors.includes('retweetLink')"
              >Required</span
            ></label
          >
          <div class="mt-2">
            <input
              type="text"
              name="retweetLink"
              @input="updateErrors"
              v-model="dataState.retweetLink"
              class="block w-full rounded-lg border-2 py-2.5 text-neutral-500 ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-black md:text-2xl text-lg px-4"
            />
          </div>
        </div>
        <div class="w-full my-5">
          <label
            :class="
              errors.includes('eventLink')
                ? ' text-red-500'
                : 'text-neutral-600'
            "
            class="block text-xl font-bold leading-6"
            >In-App Event Link
            <span
              class="text-red-500 font-normal"
              v-if="errors.includes('eventLink')"
              >Required</span
            ></label
          >
          <div class="mt-2">
            <input
              type="text"
              name="eventLink"
              @input="updateErrors"
              v-model="dataState.eventLink"
              class="block w-full rounded-lg border-2 py-2.5 text-neutral-500 ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-black md:text-2xl text-lg px-4"
            />
          </div>
        </div>
        <div class="w-full my-5">
          <label
            :class="
              errors.includes('accessCode')
                ? ' text-red-500'
                : 'text-neutral-600'
            "
            class="block text-xl font-bold leading-6"
            >Access Code*
            <span
              class="text-red-500 font-normal"
              v-if="errors.includes('accessCode')"
              >Required</span
            ></label
          >
          <div class="mt-2">
            <input
              type="text"
              name="accessCode"
              @input="updateErrors"
              v-model="dataState.accessCode"
              class="block w-full rounded-lg border-2 py-2.5 text-neutral-500 ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-black md:text-2xl text-lg px-4"
            />
          </div>
        </div>
        <div class="w-full my-5">
          <button
            type="submit"
            class="md:w-1/2 w-full p-3 rounded-lg bg-blue-500 text-white text-xl mt-4"
          >
            <div v-if="requesting" role="status">
              <svg
                aria-hidden="true"
                class="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </div>
            <span v-else> Create Event </span>
          </button>
        </div>
      </form>
    </div>
    <div
      v-if="created"
      class="backdrop-blur-sm fixed top-0 left-0 h-full box-border w-full overflow-y-scroll custom-bg flex justify-center flex-col items-center pt-36"
    >
      <div class="w-[90%] md:w-1/2 lg:w-1/3 m-6 mt-36 pt-36 pb-20 popUpBox">
        <div class="bg-green-500 text-white p-6 text-center">
          <p class="text-xl font-bold">
            Event Created! Manage the event in the "Manager" tab
          </p>
          <p class="text-lg truncate w-full text-green-200">
            {{
              createdQuest.eventLink?.length > 0 ? "Event Link" : "Access Code"
            }}
            :
            <a class="underline " :href="createdQuest.eventLink || null">{{
              createdQuest.eventLink || createdQuest.accessCode
            }}</a>
          </p>
        </div>
        <div class="bg-white py-6 px-8">
          <div
            class="sm:my-4 p-4 w-full sm:mx-0 flex justify-start items-center"
          >
            <img
              class="w-full h-48 sm:rounded-lg shadow-2xl shadow-gray-800"
              :src="
                createdQuest.questImage
                  ? backendUrl + '/uploads/' + createdQuest.questImage?.filename
                  : questSample
              "
            />
          </div>

          <div v-if="createdQuest.questName" class="my-8">
            <p class="font-bold text-xl mt-1 text-neutral-600">Quest Name</p>
            <p class="text-lg text-neutral-500">{{ createdQuest.questName }}</p>
          </div>
          <div v-if="createdQuest.header?.length > 0" class="my-8">
            <p class="font-bold text-xl mt-1 text-neutral-600">Header</p>
            <p class="text-lg text-neutral-500">{{ createdQuest.header }}</p>
          </div>
          <div v-if="createdQuest.description?.length > 0" class="my-8">
            <p class="font-bold text-xl mt-1 text-neutral-600">Description</p>
            <p class="text-lg text-neutral-500">
              {{ createdQuest.description }}
            </p>
          </div>
          <div v-if="createdQuest.followLink?.length > 0" class="my-8">
            <p class="font-bold text-xl mt-1 text-neutral-600">
              Twitter follow Account
            </p>
            <p class="text-lg truncate text-neutral-500">
              {{ createdQuest.followLink }}
            </p>
          </div>
          <div v-if="createdQuest.likeLink?.length > 0" class="my-8">
            <p class="font-bold text-xl mt-1 text-neutral-600">
              Twitter Post to Like
            </p>
            <p class="text-lg truncate text-neutral-500">
              {{ createdQuest.likeLink }}
            </p>
          </div>
          <div v-if="createdQuest.retweetLink?.length > 0" class="my-8">
            <p class="font-bold text-xl mt-1 text-neutral-600">
              Twitter Post Retweet
            </p>
            <p class="text-lg truncate text-neutral-500">
              {{ createdQuest.retweetLink }}
            </p>
          </div>
          <div class="my-8">
            <p class="font-bold text-xl mt-1 text-neutral-600">Access Code</p>
            <p class="text-lg text-neutral-500">
              {{ createdQuest.accessCode }}
            </p>
          </div>
          <button
            @click="
              () => {
                created = false;
              }
            "
            class="w-full rounded-lg bg-blue-500 text-white py-3 text-xl"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
