<template>
    <div class="main-container">
        <!-- sideBar -->
        <div class="sidebar">
            <div id="leftside-navigation" class="nano">
                <ul class="nano-content">
                    <li>
                        <router-link to="/employee">
                            <i class="fa-solid fa-house"></i><span>後台首頁</span></router-link>
                    </li>
                    <li>
                        <router-link to="/employee/tweet/t_page"><i
                                class="fa-solid fa-circle-exclamation"></i><span>檢舉管理</span></router-link>
                    </li>
                    <li>
                        <router-link to="/employee/tweet/tweetChart"><i
                                class="fa-regular fa-calendar-days"></i><span>圖表</span></router-link>
                    </li>
                    <li>
                        <router-link to="#"><i class="fa-regular fa-calendar-days"></i><span
                                @click="showModal">官方動態發文</span></router-link>
                    </li>
                    <li>
                        <router-link to="/employee/tweet/tweetOfficial"><i
                                class="fa-regular fa-calendar-days"></i><span>歷史官方動態</span></router-link>
                    </li>

                </ul>
            </div>
        </div>
        <!-- 本體 -->
        <div class="main">
            <router-view>
                <template v-slot="{ Component }">
                    <component :is="Component" />
                </template>
            </router-view>
            <!-- <router-view>
                <template v-slot="{ Component }">
                    <transition name="slide-left" mode="out-in">
                        <component :is="Component" />
                    </transition>
                </template>
            </router-view> -->
        </div>
    </div>


    <!-- 發文的彈出式視窗 -->
    <div ref="myModal" class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">官方動態</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <textarea v-model="postTweetContent" class="form-control" id="tweetContent"
                            placeholder="What's happening?" rows="3"></textarea>
                        <textarea v-model="htmlLink" class="form-control" id="tweetContent" placeholder="外部連結"
                            rows="3"></textarea>
                        <span v-if="htmlLink">連結測試</span>
                        <div v-html="testhtmlWithLink"></div>
                        <small v-if="noText" class="text-danger">必須要有內容喔</small>
                    </div>
                    <!-- 上傳圖片 -->
                    <div class="mb-3">
                        <label for="imageUpload" class="form-label">上傳本地圖片</label>
                        <input type="file" class="form-control" id="imageUpload" ref="imageUpload"
                            @change="previewImage" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">上傳圖片連結</label>
                        <input class="form-control" v-model="imgLink" />


                    </div>

                    <!-- 圖片預覽 -->
                    <div v-if="imagePreviewUrl" class="mb-3">
                        本地端圖片預覽
                        <img :src="imagePreviewUrl" class="img-fluid" alt="Image Preview" />
                    </div>
                    <div v-if="imgLink" class="mb-3">
                        雲端圖片預覽
                        <img :src="imgLink" class="img-fluid" alt="Image Preview" />
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        Close
                    </button>
                    <button type="button" class="btn btn-primary" @click="postTweet">
                        Post
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import ReportItem from '@/components/tweet/TweetReport.vue';
import { useMemberStore } from "@/stores/memberStore";

export default {
    components: {
        ReportItem,
    },
    data() {
        return {
            reports: [],
            postTweetContent: "",
            imagePreviewUrl: '',
            noText: false,
            htmlLink: "",
            imgLink: "",
            testtext: '',
        }
    },
    created() {
        const memberStore = useMemberStore();
        if (!memberStore.memberRole.startsWith('ROLE')) {
            // 如果 memberRole 不是以 'ROLE' 開頭，導向首頁
            this.$router.push('/:pathMatch(.*)*');
        }
    },
    mounted() {
        axios.get(`${this.API_URL}/tweet/getTweetsReports`).then(re => {
            console.log(re.data);
            this.reports = re.data;
        })
    },
    computed: {
        testhtmlWithLink() {
            // 將URL嵌入到<a>標籤中
            return `<a href="${this.htmlLink}" target="_blank">${this.htmlLink}</a>`;
        }
    },
    methods: {
        showModal() {
            // https://bootstrap5.hexschool.com/docs/5.1/components/modal/#via-javascript
            const myModal = new bootstrap.Modal(this.$refs.myModal);
            myModal.show();
        },
        previewImage(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    this.imagePreviewUrl = reader.result;
                };
                reader.readAsDataURL(file);
            }
        },
        postTweet() {
            if (this.postTweetContent.trim() === "") {
                console.log("failed")
                this.noText = true;
                return;
            }
            this.noText = false;
            const memberStore = useMemberStore();

            const formData = new FormData();
            formData.append('memberId', memberStore.memberId);
            formData.append('tweetContent', this.postTweetContent);
            formData.append('htmlLink', this.htmlLink);

            if (this.$refs.imageUpload.files.length > 0) {

                const file = this.$refs.imageUpload.files[0];
                formData.append('image', file);

                axios.post(`${this.API_URL}/tweet/postTweetWithPhotoByOfficial`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                    .then(response => {
                        console.log("發文成功:", response.data);
                        // 清空推文内容
                        this.postTweetContent = "";
                        this.$refs.imageUpload.value = "";
                        this.$router.go(0)
                    })
                    .catch(error => {
                        console.error("發文失败:", error);
                    });


            } else {
                axios.post(`${this.API_URL}/tweet/postTweetWithOutPhotoByOfficial`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                    .then(response => {
                        console.log("發文成功:", response.data);
                        // 清空推文内容
                        this.postTweetContent = "";
                        this.$router.go(0)
                    })
                    .catch(error => {
                        console.error("發文失败:", error);
                    });
            }
        },
    }
}

</script>


<!-- <style scoped>
.accordion-item {
    width: 800px;
}
</style> -->

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans:300,400,700");
@import url("//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css");

/* .accordion-item {
    width: 800px;
} */

.main {
    width: 80vw;
    /* padding-left: 50px; */
    margin: 0 auto;
    /* 水平置中 */
}

.main-container {
    display: flex;
}

.sidebar {
    padding: 20px;
    height: 100vh;
    width: 15vw;
    background: #263747;
    -webkit-transition: all 0.3s ease-in-out;
    -moz-transition: all 0.3s ease-in-out;
    -o-transition: all 0.3s ease-in-out;
    -ms-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
    position: sticky;
    z-index: 100;
    top: 0;
}

.sidebar #leftside-navigation ul,
.sidebar #leftside-navigation ul ul {
    margin: -2px 0 0;
    padding: 0;
}

.sidebar #leftside-navigation ul li {
    list-style-type: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.sidebar #leftside-navigation ul li.active>a {
    color: #6579eb;
}

.sidebar #leftside-navigation ul li.active ul {
    display: block;
}

.sidebar #leftside-navigation ul li a {
    color: #cacdd1;
    text-decoration: none;
    display: block;
    padding: 18px 0 18px 25px;
    font-size: 12px;
    outline: 0;
    -webkit-transition: all 200ms ease-in;
    -moz-transition: all 200ms ease-in;
    -o-transition: all 200ms ease-in;
    -ms-transition: all 200ms ease-in;
    transition: all 200ms ease-in;
}

.sidebar #leftside-navigation ul li a:hover {
    color: #7990af;
}

span {
    display: inline-block;
    font-size: 14px;
}

i {
    width: 30px;
}

.sidebar #leftside-navigation ul li a i .fa-angle-left,
.sidebar #leftside-navigation ul li a i .fa-angle-right {
    padding-top: 3px;
}

.sidebar #leftside-navigation ul ul {
    display: none;
}

.sidebar #leftside-navigation ul ul li {
    background: #23313f;
    margin-bottom: 0;
    margin-left: 0;
    margin-right: 0;
    border-bottom: none;
}

.slide-left-enter {
    opacity: 0;
    -webkit-transform: translate(-20px, 0);
    transform: translate(-20px, 0);
}

.slide-left-enter-active {
    transition: all 0.4s ease;
}

.slide-left-leave-to {
    opacity: 0;
    -webkit-transform: translate(20px, 0);
    transform: translate(20px, 0);
}

.slide-left-leave-active {
    transition: all 0.4s ease;
}
</style>