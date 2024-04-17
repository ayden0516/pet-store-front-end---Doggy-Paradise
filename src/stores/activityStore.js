import { defineStore } from "pinia";

export const useActivityStore = defineStore("activityStore", {
  state() {
    return {
      activityId: "",
      activityTitle: "",
    };
  },

  actions: {
    createSuccess(activity) {
      this.activityId = activity.activityId;
      this.activityTitle = activity.activityTitle;
    },
    cancellCreate() {
      this.activityId = "";
      this.activityTitle = "";
    },
  },

  getters: {},
});
