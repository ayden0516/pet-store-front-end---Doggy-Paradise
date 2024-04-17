<template>
    <div class="main-container">

        <!-- sideBar -->
        <div class="sidebar">
            <div id="leftside-navigation" class="nano">
                <ul class="nano-content">
                    <li>
                        <router-link to="/tweetPage/tweetsWallPage">
                            <i class="fa-solid fa-vr-cardboard"></i><span>首頁</span></router-link>
                    </li>
                    <li>
                        <router-link to="#" v-if="userId && userAouth.startsWith('Act')">
                            <i class="fa-solid fa-dice-d20"></i><span @click="showModal">發文</span></router-link>
                    </li>
                    <li>
                        <router-link to="/tweetPage/tweetsMyWallPage" v-if="userId && userAouth.startsWith('Act')">
                            <i class="fa-solid fa-clock-rotate-left"></i><span>我的發文</span></router-link>
                    </li>
                    <li>
                        <router-link to="/tweetPage/tweetsMyFollowPage" v-if="userId && userAouth.startsWith('Act')">
                            <i class="fa-solid fa-heart"></i><span>我的追蹤</span></router-link>
                    </li>
                    <li>
                        <router-link to="/tweetPage/tweetsMyNotificationPath"
                            v-if="userId && userAouth.startsWith('Act')">
                            <i class="fa-solid fa-scroll"></i><span>我的通知</span></router-link>
                    </li>
                </ul>
            </div>
        </div>



        <!-- <div class="sidebar-buttons">
                <router-link to="/tweetPage/tweetsWallPage"><button class="sidebar-button custom-router-link">
                        首頁
                    </button>
                </router-link>

                <button v-if="userId" class="sidebar-button" @click="showModal">發文</button>

                <router-link to="/tweetPage/tweetsMyWallPage">
                    <button v-if="userId" class="sidebar-button custom-router-link">我的發文</button>
                </router-link>

                <router-link to="/tweetPage/tweetsMyFollowPage">
                    <button v-if="userId" class="sidebar-button custom-router-link">我的追蹤</button>
                </router-link>

                <router-link to="/tweetPage/tweetsMyNotificationPath">
                    <button v-if="userId" class="sidebar-button custom-router-link">我的通知</button>
                </router-link>

            </div> -->


        <router-view></router-view>
    </div>

    <!-- 發文的彈出式視窗 -->
    <div ref="myModal" class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">發個動態~</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <textarea v-model="postTweetContent" class="form-control" id="tweetContent"
                            placeholder="What's happening?" rows="3"></textarea>
                        <small v-if="noText" class="text-danger">必須要有內容喔</small>
                    </div>

                    <!-- 上傳圖片 -->
                    <div class="mb-3">
                        <label for="imageUpload" class="form-label">Upload Image:</label>
                        <input type="file" class="form-control" id="imageUpload" ref="imageUpload"
                            @change="previewImage" />
                    </div>
                    <!-- 圖片預覽 -->
                    <div v-if="imagePreviewUrl" class="mb-3">

                        <img :src="imagePreviewUrl" class="img-fluid" alt="Image Preview" />
                    </div>
                    <!-- 上傳影片 -->
                    <!-- <div class="mb-3">
                        <label for="videoUpload" class="form-label">Upload Video:</label>
                        <input type="file" class="form-control" id="videoUpload" ref="videoUpload"
                            @change="previewVideo" />
                    </div> -->
                    <!-- 影片預覽 -->
                    <!-- <div v-if="videoPreviewUrl" class="mb-3">
                        <label>Video Preview:</label>
                        <video controls class="img-fluid">
                            <source :src="videoPreviewUrl" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div> -->

                    <div>選一下要tag的狗狗</div>
                    <div v-for="dog in myDogs" :key="dog.dogId">
                        <input type="checkbox" :id="'dogCheckbox' + dog.dogId" :value="dog.dogId"
                            v-model="selectedDogs">
                        <label :for="'dogCheckbox' + dog.dogId">{{ dog.dogName }}</label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        Close
                    </button>
                    <button v-if="!postTweettrigger" type="button" class="btn btn-primary" @click="postTweet">
                        Post
                    </button>
                    <button v-if="postTweettrigger" type="button" class="btn btn-primary">
                        發文中<div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import { useMemberStore } from "@/stores/memberStore";

export default {
    components: {
        // TweetItem,
        // Sidebar
    },
    data() {
        return {
            postTweetContent: "",
            isModalOpen: false,
            noText: false,
            myDogs: [],
            selectedDogs: [],
            userId: useMemberStore().memberId,
            userAouth: useMemberStore().memberRole,
            imagePreviewUrl: '',
            postTweettrigger: false,
        };
    },
    mounted() {
        const memberStore = useMemberStore();
        this.memberId = memberStore.memberId
        axios.get(`${this.API_URL}/dog/getDogs/${this.memberId}`)
            .then(re => {
                this.myDogs = re.data;
            }).catch(

        )
    },
    methods: {
        showModal() {
            // https://bootstrap5.hexschool.com/docs/5.1/components/modal/#via-javascript
            const myModal = new bootstrap.Modal(this.$refs.myModal);
            myModal.show();
        },
        reloadPage() {
            window.location.reload();
        },
        postTweet() {
            if (this.postTweetContent.trim() === "") {
                console.log("failed")
                this.noText = true;
                return;
            }
            this.postTweettrigger = true;
            this.noText = false;
            const memberStore = useMemberStore();

            const formData = new FormData();
            formData.append('memberId', memberStore.memberId);
            formData.append('tweetContent', this.postTweetContent);
            formData.append('dogList', this.selectedDogs);

            if (this.$refs.imageUpload.files.length > 0) {
                const file = this.$refs.imageUpload.files[0];

                // 壓縮圖片
                this.compressImage(file)
                    .then(compressedFile => {
                        formData.append('image', compressedFile);
                        axios.post(`${this.API_URL}/tweet/postTweetWithPhoto`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                            .then(response => {
                                console.log("發文成功:", response.data);
                                // 清空推文内容
                                this.postTweetContent = "";
                                this.$refs.imageUpload.value = "";
                                this.postTweettrigger = false;
                                this.$router.go(0)
                            })
                            .catch(error => {
                                console.error("發文失败:", error);
                            });
                    })
                    .catch(error => {
                        console.error("圖片壓縮失敗:", error);
                    });
            } else {
                axios.post(`${this.API_URL}/tweet/postTweetOnlyText`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                    .then(response => {
                        console.log("發文成功:", response.data);
                        // 清空推文内容
                        this.postTweetContent = "";
                        this.postTweettrigger = false;
                        this.$router.go(0)
                    })
                    .catch(error => {
                        console.error("發文失败:", error);
                    });
            }
        },
        compressImage(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (event) => {
                    const img = new Image();
                    img.src = event.target.result;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        const maxSize = 1024;
                        let width = img.width;
                        let height = img.height;

                        if (file.size > 3 * 1024 * 1024) {
                            if (width > height) {
                                if (width > maxSize) {
                                    height *= maxSize / width;
                                    width = maxSize;
                                }
                            } else {
                                if (height > maxSize) {
                                    width *= maxSize / height;
                                    height = maxSize;
                                }
                            }
                        }

                        canvas.width = width;
                        canvas.height = height;

                        ctx.drawImage(img, 0, 0, width, height);

                        canvas.toBlob((blob) => {
                            const compressedFile = new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() });
                            resolve(compressedFile);
                        }, 'image/jpeg', 0.9);
                    };
                };
                reader.onerror = (error) => reject(error);
            });
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
        previewVideo(event) {
            const file = event.target.files[0];
            if (file) {
                this.videoPreviewUrl = URL.createObjectURL(file);
            }
        }


    }

}
</script>
<style scoped>
.main-container {
    display: flex;
}

.tweet-container {
    flex: 1;
    /* 將 tweet-container 擴展以填滿剩餘空間 */
    padding: 20px;
}



/* sideBar 按鈕的寬度 */
.custom-router-link {
    width: 100%;
    /* 設置寬度為父元素的 100% */
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
</style>
