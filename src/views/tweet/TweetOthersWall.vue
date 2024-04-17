<template>
    <div class="tweet-container">
        <div style="display: flex; align-items: center;">
            <h3 style="margin-right: 10px;">{{ name }}的主頁</h3>
            <span v-if="userId">
                <button v-if="!isFollwer" @click="followUser" class="btn btn-primary">追蹤</button>
                <button v-else @click="unfollowUser" class="btn btn-primary">取消追蹤</button>
            </span>
        </div>
        <hr>
        <TweetItem3 v-for="tweet in tweets" :key="tweet.tweetId" :tweet="tweet"></TweetItem3>
    </div>
</template>
<script>
import axios from 'axios';
import { useTweetStore } from '@/stores/tweetStore';
import { useMemberStore } from '@/stores/memberStore';
import TweetItem3 from '@/components/tweet/TweetCard3.vue'

export default {
    components: {
        TweetItem3
    },
    data() {
        return {
            tweets: [],
            tweet: "",
            name: "",
            isFollwer: false,
            myUserId: '',
            otherUserId: '',
            userId: useMemberStore().memberId,
        }
    },
    mounted() {
        const tweetStore = useTweetStore();
        this.tweets = tweetStore.tweets;
        this.name = tweetStore.user;


        if (this.name.length === 0) {
            this.$router.push("/tweetPage/tweetsWallPage");
        } else {
            const memberStore = useMemberStore();
            this.myUserId = memberStore.memberId;

            axios.post(`${this.API_URL}/tweet/checkFollerRelationship`, {
                myId: memberStore.memberId,
                tweetUserId: this.tweets[0].tweetId
            })
                .then(response => {
                    this.isFollwer = response.data.isFollowing;
                    this.otherUserId = response.data.userId
                    window.scrollTo(0, 0);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    },
    methods: {
        followUser() {
            axios.post(`${this.API_URL}/tweet/getFollerRelationship`, {
                myId: this.myUserId,
                otherId: this.otherUserId
            }).then(re => {
                if (re.data == true) {
                    this.isFollwer = !this.isFollwer;
                };
            })
        },
        unfollowUser() {
            axios.post(`${this.API_URL}/tweet/removeFollerRelationship`, {
                myId: this.myUserId,
                otherId: this.otherUserId
            }).then(re => {
                if (re.data == true) {
                    this.isFollwer = !this.isFollwer;
                };
            })
        },
    },


}
</script>
<style></style>