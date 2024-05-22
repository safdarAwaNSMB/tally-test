<script setup>
import axios from "axios";
import { onMounted, ref, watch } from "vue";
import dayjs from "dayjs";
import questLogo from "../assets/images/questLogo.png";
import questSample from "../assets/images/example-panel.png";

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
const quests = ref(null);
const loading = ref(true);
const selectedQuest = ref(null);
const action = ref("");
const deleting = ref(false);
const updating = ref(false);
const getQuests = async () => {
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
};

const updateQuest = async () => {
  updating.value = true;
  await axios
    .post(`${backendUrl}/edit-quest`, selectedQuest.value)
    .then((res) => {
      console.log(res);
      getQuests();
      action.value = "";
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      updating.value = false;
    });
};

onMounted(async () => {
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
const deleteQuest = async () => {
  deleting.value = true;
  await axios
    .delete(`${backendUrl}/delete-quest/${selectedQuest.value._id}`)
    .then((res) => {
      console.log(res);
      action.value = "deleted";
      getQuests();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      deleting.value = false;
    });
};
watch(action, () => {
  console.log(action.value);
});
console.log();
</script>

<template>
  <div class="bg-white p-2 overflow-x-scroll overflow-y-scroll w-full md:p-10">
    <div class="flex justify-center mt-10" v-if="loading" role="status">
      <svg
        aria-hidden="true"
        class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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

    <div
      v-if="!loading"
      class="min-w-[600px] min-h-screen md:w-2/3 lg:w-1/2 flex flex-col"
    >
      <div class="flex flex-row justify-between gap-3">
        <span class="min-w-20 font-bold text-neutral-600">Quest Name</span>
        <span class="min-w-20 font-bold text-neutral-600">Creation Date</span>
        <div class="w-48"></div>
      </div>
      <div
        v-for="(quest, index) in quests"
        :key="index"
        class="flex flex-row justify-between gap-3 mt-6 border-b-2 py-3 border-neutral-200"
      >
        <span class="min-w-20 text-neutral-600">{{ quest.questName }}</span>
        <span class="min-w-20 text-neutral-600">{{
          dayjs(quest.creation).format("DD/MM/YYYY")
        }}</span>
        <div class="flex flex-row gap-8">
          <span
            @click="
              () => {
                action = 'view';
                selectedQuest = quest;
              }
            "
            class="text-blue-600 cursor-pointer"
            >View Link</span
          ><span
            @click="
              () => {
                action = 'edit';
                selectedQuest = quest;
              }
            "
            class="text-blue-600 cursor-pointer"
            >Edit</span
          ><span
            @click="
              () => {
                action = 'delete';
                selectedQuest = quest;
              }
            "
            class="text-red-500 cursor-pointer"
            >Delete</span
          >
        </div>
      </div>
    </div>

    <div
      v-if="
        action === 'view' ||
        action === 'edit' ||
        action === 'delete' ||
        action === 'deleted'
      "
      class="backdrop-blur-sm fixed top-0 left-0 h-full box-border w-full overflow-y-scroll custom-bg flex justify-center flex-col items-center pt-36"
    >
      <div class="w-[90%] md:w-1/2 lg:w-1/3 m-6 mt-20 pt-36 pb-20 popUpBox">
        <div v-if="action === 'view'">
          <div class="bg-gray-600 mt-20 text-white p-6 text-center">
            <p class="text-xl font-bold">Event Preview</p>
          </div>
          <div class="bg-white py-6 px-8">
            <div
              class="sm:my-4 p-4 w-full sm:mx-0 flex justify-start items-center"
            >
              <img
                class="w-full h-48 sm:rounded-lg shadow-2xl shadow-gray-800"
                :src="
                  selectedQuest.questImage
                    ? backendUrl +
                      '/uploads/' +
                      selectedQuest.questImage?.filename
                    : questSample
                "
              />
            </div>
            <div class="my-8">
              <p class="font-bold text-xl mt-1 text-neutral-600">Quest Name</p>
              <p class="text-lg text-neutral-500">
                {{ selectedQuest.questName }}
              </p>
            </div>
            <div v-if="selectedQuest.header?.length > 0" class="my-8">
              <p class="font-bold text-xl mt-1 text-neutral-600">Header</p>
              <p class="text-lg text-neutral-500">{{ selectedQuest.header }}</p>
            </div>
            <div v-if="selectedQuest.description?.length > 0" class="my-8">
              <p class="font-bold text-xl mt-1 text-neutral-600">Description</p>
              <p class="text-lg text-neutral-500">
                {{ selectedQuest.description }}
              </p>
            </div>
            <div v-if="selectedQuest.followLink?.length > 0" class="my-8">
              <p class="font-bold text-xl mt-1 text-neutral-600">
                Twitter follow Account
              </p>
              <p class="text-lg truncate text-neutral-500">
                {{ selectedQuest.followLink }}
              </p>
            </div>
            <div v-if="selectedQuest.likeLink?.length > 0" class="my-8">
              <p class="font-bold text-xl mt-1 text-neutral-600">
                Twitter Post to Like
              </p>
              <p class="text-lg truncate text-neutral-500">
                {{ selectedQuest.likeLink }}
              </p>
            </div>
            <div v-if="selectedQuest.retweetLink?.length > 0" class="my-8">
              <p class="font-bold text-xl mt-1 text-neutral-600">
                Twitter Post Retweet
              </p>
              <p class="text-lg truncate text-neutral-500">
                {{ selectedQuest.retweetLink }}
              </p>
            </div>
            <div class="my-8">
              <p class="font-bold text-xl mt-1 text-neutral-600">Access Code</p>
              <p class="text-lg text-neutral-500">
                {{ selectedQuest.accessCode }}
              </p>
            </div>
            <button
              @click="
                () => {
                  action = '';
                }
              "
              class="w-full rounded-lg bg-blue-500 text-white py-3 text-xl"
            >
              Close
            </button>
          </div>
        </div>
        <div v-else-if="action === 'edit'">
          <div class="bg-gray-600 mt-20 text-white p-6 text-center">
            <p class="text-xl font-bold">Edit Event</p>
          </div>
          <div class="bg-white py-6 px-8">
            <form></form>
            <div class="my-8">
              <p class="font-bold text-xl mt-1 text-neutral-600">Quest Name</p>
              <input
                type="text"
                v-model="selectedQuest.questName"
                class="w-full rounded-lg border-2 py-1 text-neutral-500 ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-black md:text-xl text-xl px-4"
                required
              />
            </div>
            <div class="my-8">
              <p class="font-bold text-xl mt-1 text-neutral-600">Header</p>
              <input
                type="text"
                v-model="selectedQuest.header"
                class="w-full rounded-lg border-2 py-1 text-neutral-500 ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-black md:text-xl text-xl px-4"
              />
            </div>
            <div class="my-8">
              <p class="font-bold text-xl mt-1 text-neutral-600">Description</p>

              <input
                type="text"
                v-model="selectedQuest.description"
                class="w-full rounded-lg border-2 py-1 text-neutral-500 ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-black md:text-xl text-xl px-4"
              />
            </div>
            <div class="my-8">
              <p class="font-bold text-xl mt-1 text-neutral-600">
                Twitter follow Account
              </p>
              <input
                type="text"
                v-model="selectedQuest.followLink"
                class="w-full rounded-lg border-2 py-1 text-neutral-500 ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-black md:text-xl text-xl px-4"
              />
            </div>
            <div class="my-8">
              <p class="font-bold text-xl mt-1 text-neutral-600">
                Twitter Post to Like
              </p>

              <input
                type="text"
                v-model="selectedQuest.likeLink"
                class="w-full rounded-lg border-2 py-1 text-neutral-500 ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-black md:text-xl text-xl px-4"
              />
            </div>
            <div class="my-8">
              <p class="font-bold text-xl mt-1 text-neutral-600">
                Twitter Post Retweet
              </p>

              <input
                type="text"
                v-model="selectedQuest.retweetLink"
                class="w-full rounded-lg border-2 py-1 text-neutral-500 ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-black md:text-xl text-xl px-4"
              />
            </div>
            <div class="my-8">
              <p class="font-bold text-xl mt-1 text-neutral-600">Access Code</p>
              <input
                type="text"
                v-model="selectedQuest.accessCode"
                class="w-full rounded-lg border-2 py-1 text-neutral-500 ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-black md:text-xl text-xl px-4"
              />
            </div>
            <button
              @click="updateQuest"
              class="w-full rounded-lg bg-blue-500 text-white py-3 text-xl"
            >
              <div v-if="updating" role="status">
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
              <span v-else-if="!updating"> Update</span>
            </button>
          </div>
        </div>
        <div v-else-if="action === 'delete'">
          <div class="bg-gray-500 text-white p-6 text-center">
            <p class="text-xl font-bold">Delete Quest</p>
          </div>
          <div class="bg-white py-6 px-8">
            <div class="my-8">
              <p class="font-bold text-xl mt-1 text-neutral-600">
                Are you sure you want to delete the Quest "{{
                  selectedQuest.questName
                }}" ?
              </p>
              <p class="text-xl text-red-600 font-bold my-4">
                This cannot be undone!
              </p>
            </div>

            <div class="flex flex-row">
              <button
                @click="
                  () => {
                    action = '';
                  }
                "
                class="w-1/2 mx-5 rounded-lg bg-blue-500 text-white py-3 text-xl"
              >
                Close
              </button>
              <button
                @click="deleteQuest"
                class="w-1/2 mx-5 rounded-lg bg-red-500 text-white py-3 text-xl"
              >
                <div v-if="deleting" role="status">
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
                <span v-else-if="!deleting"> Delete</span>
              </button>
            </div>
          </div>
        </div>
        <div v-if="action === 'deleted'">
          <div class="bg-green-500 text-white p-6 text-center">
            <p class="text-xl font-bold">Event Deleted</p>
          </div>
          <div class="bg-white py-6 px-8">
            <div class="my-8">
              <p class="font-bold text-xl mt-1 text-neutral-600">
                Quest "{{ selectedQuest.questName }}" has been deleted.
              </p>
            </div>

            <button
              @click="
                () => {
                  action = '';
                }
              "
              class="w-full mx-5 rounded-lg bg-blue-500 text-white py-3 text-xl"
            >
              Okay
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
