<template>
    <div>
        <h2>通知列表</h2>
        <div v-for="notification in notifications" :key="notification.tweetNotiId" class="card mb-3">
            <div class="card-header">
                <span class="fw-bold">{{ notification.content }}</span>
            </div>
            <div class="card-body">
                <p class="card-text">通知時間：{{ formatPostDate(notification.postTime) }}</p>
                <!-- <p class="card-text">用户ID：{{ notification.userId }}</p>
                <p class="card-text">推文ID：{{ notification.tweetId }}</p> -->
                <p class="card-text">已讀狀態：{{ notification.isRead ? '已讀' : '未讀' }}</p>

                <!-- Button trigger modal -->
                <button @click="getTweet(notification.tweetId, notification.tweetNotiId)" type="button"
                    class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    檢視推文
                </button>
            </div>
        </div>
    </div>




    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body" v-if="this.tweet">
                    <TweetItem3 :key="this.tweet.tweetId" :tweet="this.tweet" />
                </div>
                <div v-else>
                    <h5>此推文已不存在</h5>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import TweetItem from '@/components/tweet/TweetCard.vue';
import axios from "axios";
import { useMemberStore } from "@/stores/memberStore";
import TweetItem2 from '@/components/tweet/TweetCard2.vue'
import TweetItem3 from '@/components/tweet/TweetCard3.vue'

export default {
    components: {
        TweetItem,
        TweetItem2,
        TweetItem3
    },
    data() {
        return {
            memberId: "",
            notifications: [],
            tweet: null,
        };
    },
    mounted() {
        const memberStore = useMemberStore();
        if (memberStore.memberRole.startsWith("Act")) {
            this.memberId = memberStore.memberId;

            // 第一次載入頁面
            this.loadNotifications();

            // 每隔5秒更新頁面
            setInterval(() => {
                this.loadNotifications();
            }, 5000);
        }




    },

    methods: {
        loadNotifications() {
            axios.get(`${this.API_URL}/tweet/getMyNotify/${this.memberId}`)
                .then(re => {
                    this.notifications = re.data;
                })
                .catch(error => {
                    console.error('Error loading notifications:', error);
                });
        },
        formatPostDate(dateString) {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            return `${year}年${month}月${day}號 ${hours}點${minutes}分`;
        },
        getTweet(tweetId, tweetNotiId) {
            console.log(tweetId)
            console.log(tweetNotiId)
            axios.get(`${this.API_URL}/tweet/getTweetById/${tweetId}`)
                .then(re => {
                    this.tweet = re.data
                }).catch(error => {
                    console.log(error)
                });

            axios.post(`${this.API_URL}/tweet/changeIsRead`, {
                tweetNotiId: tweetNotiId
            })
                .then(response => {
                    console.log("/tweet/changeIsRead: " + response.data)
                })
                .catch(error => {
                    console.log(error)
                });
        }

    }
}
</script>
<style scoped>
/* 可以根据需要自定义样式 */
.card {
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-header {
    background-color: #f8f9fa;
    border-bottom: none;
}

.card-body {
    padding: 1.5rem;
}

.modal-content {
    background-color: transparent;
}
</style>