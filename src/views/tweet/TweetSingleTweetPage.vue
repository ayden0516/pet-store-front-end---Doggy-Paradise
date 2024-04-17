<template>
    <div v-if="tweets.tweetId != null" class="tweet-container">
        <router-link to="/tweetPage/tweetsMyWallPage"><button class="btn btn-warning">
                回到我的發文
            </button></router-link>
        <hr>
        <TweetItem :key="tweets.tweetId" :tweet="tweets" />
    </div>
    <div v-else>
        <h3>此貼文已下架</h3>
    </div>



</template>
<script>
import TweetItem from '@/components/tweet/TweetCard.vue';
import { useTweetStore } from '@/stores/tweetStore';

export default {
    components: {
        TweetItem,
    },
    data() {
        return {
            tweets: [],
            name: ""
        }
    },
    created() {
        const tweetStore = useTweetStore();
        this.tweets = tweetStore.tweets;
        this.name = tweetStore.user;
    },
    mounted() {
        if (this.name.length == 0) {
            this.$router.push("/tweetPage/tweetsMyWallPage");

        }

    }


}
</script>
<style></style>