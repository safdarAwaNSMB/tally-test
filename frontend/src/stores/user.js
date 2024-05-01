import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const userStore = defineStore('user', () => {
  const user = ref(null)
  
  function updateUser(userObj) {
    user.value = userObj;
  }

  return { user, updateUser }
})
