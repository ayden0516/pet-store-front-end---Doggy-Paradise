import { defineStore } from "pinia";

export const useMemberStore = defineStore("memberStore",{
    state(){
        return{
            memberId:"",
            memberName:"",
            memberRole:"",
            memberPhoto:"",
            isLoggedIn:false
        };
    },

    actions:{
        loginSuccess(member){
            this.memberId=member.userId;
            this.memberName=member.username;
            this.memberRole=member.role;
            this.memberPhoto=member.photoUrl;
            this.isLoggedIn=true;
        },
        logout(){
            this.memberId="";
            this.memberName="";
            this.memberRole="";
            this.memberPhoto="";
            this.isLoggedIn=false;
        },
    },

    getters:{},
});
// state:()=>({}) 箭頭函式，意思同上