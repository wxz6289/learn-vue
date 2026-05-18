import { defineStore } from 'pinia';
import { reactive } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = reactive({
    name: "King",
    age: 20
  });
  const plusAge = () => user.age++;
  return { user, plusAge }
});
