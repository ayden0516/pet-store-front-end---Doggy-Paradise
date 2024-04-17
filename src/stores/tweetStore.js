import { defineStore } from "pinia";

export const useTweetStore = defineStore("tweetStore",{
    state(){
        return{
            tweets:[],
            user:"",
        };
    },

    actions:{
        writeIn(allTweets){
            this.tweets=allTweets
        },
        setUserName(name){
            this.user=name
        },
        clearMsg(){
            this.tweets=[]
            this.user=""
        },
    },

    getters:{},
});