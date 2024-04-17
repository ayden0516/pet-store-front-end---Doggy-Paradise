<template>
    <div>
        <article class="tweetCard">
            <div class="tweetCardBody">
                <div class="cardContent">
                    <div class="headerContent">
                        <div class="headerImgHolder">
                            <img v-if="tweetUserImg" :src="tweetUserImg" id="headimg">
                            <img v-else id="headimg"
                                src="https://images.unsplash.com/photo-1580825328373-ee07fad4b195?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1868&q=80">
                        </div>
                        <div class="headerContentText">
                            <h3>{{ this.tweetUserName }}</h3>
                            <p class="tweetDate">{{ formatPostDate(tweet.postDate) }}
                            </p>
                            <p>
                                <!-- 使用的的狗狗們 -->
                                <span v-if="userDogs.length > 0">與我的狗勾 :&nbsp;</span>
                                <span v-for="(dog, index) in userDogs" :key="dog.dogId">
                                    <span class="tweetTarget" @click="showDogModal(dog)" style="cursor: pointer;">@{{
                                        dog.dogName }}</span>
                                    <template v-if="index < userDogs.length - 1">、</template>
                                </span>

                            </p>
                        </div>
                        &nbsp&nbsp&nbsp&nbsp&nbsp
                        <!-- ...按紐們 -->
                        <div v-if="userId" class="col-auto d-flex justify-content-end">
                            <div class="dropdown ml-auto">
                                <button class="btn btn-secondary " type="button" id="dropdownMenuButton1"
                                    aria-expanded="false">
                                    ...
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li v-if="this.userName == this.tweetUserName"><a class="dropdown-item"
                                            @click="editTweetContent = true">編輯推文</a></li>
                                    <li v-if="this.userName != this.tweetUserName && userId"><a
                                            @click="showReportPostPage" class="dropdown-item">檢舉推文</a></li>
                                    <li v-if="this.userName != this.tweetUserName"><a class="dropdown-item"
                                            @click="goOthersPage(this.tweetUserName, tweet.tweetId)">到{{
                                                this.tweetUserName
                                            }}的主頁</a>
                                    </li>

                                </ul>
                            </div>
                        </div>

                    </div>
                    <br>

                    <p>

                        <hr>
                        <!-- 推文內容 -->
                    <div v-if="!this.editTweetContent" class="content-wrapper">
                        <div class="tweet-content" style=" font-size: 20px;">{{ tweet.tweetContent }}</div>
                    </div>
                    <div v-else>
                        <textarea v-model="this.editTweetContentTmp" class="form-control"
                            style="width: 600px;"></textarea>
                        <div class="mt-2">
                            <button @click="saveEditedTweet" class="btn btn-primary">保存</button>
                            <button @click="editTweetContent = false" class="btn btn-secondary ms-2">取消</button>
                            <button @click="removeTweet" class="btn btn-warning ms-2">刪除貼文</button>
                        </div>
                    </div>
                    <hr>
                    </p>



                    <!-- 推文圖片 -->
                    <div v-if="tweet.tweetGalleries && tweet.tweetGalleries.length > 0 && !imgOnline"
                        class="tweet-galleries">
                        <div class="d-flex justify-content-center">
                            <div v-for="(gallery, index) in tweet.tweetGalleries" :key="index" class="gallery-item">
                                <img :src="getImageUrl(gallery.imgPath)" alt="Gallery Image" class="gallery-image">
                            </div>
                        </div>
                    </div>
                    <div v-if="tweet.tweetGalleries && tweet.tweetGalleries.length > 0 && imgOnline"
                        class="tweet-galleries">
                        <div class="d-flex justify-content-center">
                            <div class="gallery-item">
                                <a v-if="tweet.tweetContent.startsWith('我的狗狗: ')" :href="roomLink">
                                    <img :src="imgOnlinePath" style=" object-fit: cover" width="250" height="250"
                                        alt="Gallery Image" class="gallery-image">
                                </a>
                                <a v-else-if="tweet.tweetContent.startsWith('我與我的狗狗報名了超讚的活動:')" :href="activityLink">
                                    <img :src="imgOnlinePath" style=" object-fit: cover" width="250" height="250"
                                        alt="Gallery Image" class="gallery-image">
                                </a>
                                <a v-else href="#">
                                    <img :src="imgOnlinePath" style=" object-fit: cover" width="250" height="250"
                                        alt="Gallery Image" class="gallery-image">
                                </a>
                            </div>
                        </div>

                    </div>


                </div>
                <hr>

                <!-- 讚功能 -->
                &nbsp&nbsp&nbsp&nbsp&nbsp
                <span v-if="tweet.preNode == 0 && userId">
                    <i v-if="!this.liked" class="fa-regular fa-thumbs-up" @click="likeTweet"
                        style="font-size: 25px;cursor: pointer;"></i>
                    <i v-else @click="unlikeTweet" class="fa-solid fa-thumbs-up"
                        style="font-size: 25px;cursor: pointer;"></i>
                </span>

                <span v-if="tweet.preNode == 0 && userId" @click="showLikeList" class="like-count"
                    style=" font-size: 20px;cursor: pointer;">{{
                        tweetLikeNum }}
                </span>

                &nbsp&nbsp
                <!-- 顯示留言數 -->
                <i class="fa-solid fa-message" style="font-size: 20px;cursor: pointer;"
                    @click="getCommentsLink(tweet.tweetId)"></i>
                <span class="comment-count" style="margin-right: 20px; font-size: 20px;">{{
                    this.numOfComment
                }}

                </span>

                <!-- 子留言，內容 -->
                <div v-if="showComments" class="comment-section">
                    <div v-for="comment in tweetComments" :key="comment.id" class="comment-item">{{ comment.userName
                        }} : {{ comment.tweetContent }}</div>
                    <div>{{ currentReply }}</div>

                    <!-- 回覆推文的地方 -->
                    <span v-if="tweet.preNode == 0 && userId">
                        <input type="text" v-model="replyContent" placeholder="在此輸入回覆內容"
                            style="height: 0px; padding-top: 16px; padding-bottom: 18px;">
                        <span>&nbsp
                            <i @click="postReply" style="font-size: 20px;cursor: pointer;"
                                class="fa-solid fa-paper-plane"></i>
                        </span>
                    </span>
                </div>


            </div>

        </article>
    </div>

    <!--按讚名單的彈出式視窗 -->
    <div ref="myModal" class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">按讚的人~</h5>
                </div>
                <div class="modal-body" v-for="n in userLikeList">
                    {{ n.lastName }}
                </div>
            </div>
        </div>
    </div>

    <!--檢舉的彈出式視窗 -->
    <div ref="ReportPostPage" class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4>檢舉頁面</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3 form-check">
                        <div>
                            <label>
                                <input type="checkbox" value="不可愛" v-model="reportPost" /> 不可愛
                            </label>
                        </div>
                        <div>
                            <label>
                                <input type="checkbox" value="太恐怖" v-model="reportPost" /> 太恐怖
                            </label>
                        </div>
                        <div>
                            <label>
                                <input type="checkbox" value="政治不正確" v-model="reportPost" /> 政治不正確
                            </label>
                        </div>
                        <div>
                            <label>
                                <input type="checkbox" value="我不爽" v-model="reportPost" /> 我不爽
                            </label>
                        </div>

                    </div>
                    <div class="mb-3">
                        <label for="reportReason" class="form-label">其他意見</label>
                        <textarea class="form-control" id="reportReason" rows="3" v-model="reportPostText"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" @click="submitReport" data-bs-dismiss="modal" aria-label="Close"
                            class="btn btn-primary">送出</button>

                    </div>
                </div>
            </div>
        </div>
    </div>

    <!--狗狗的彈出式視窗 -->
    <div ref="DogPage" class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4>{{ dogCardName }}</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h4>狗狗介紹:</h4>{{ dogCarddogIntroduce }}
                    <hr>
                    <img v-if="dogCardImg != null" :src="dogCardImg" class="dog-image" />
                    <img v-else class="dog-image"
                        src="https://res.cloudinary.com/dxz9qtntt/image/upload/f_auto,q_auto/v1/dogFolder/o88brizbheeecrszxhec" />

                </div>
            </div>
        </div>
    </div>

</template>
<script>
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import axios from 'axios';
import { useMemberStore } from '@/stores/memberStore';
import { useTweetStore } from '@/stores/tweetStore';



export default {

    data() {
        return {

            numOfComment: 0,
            numOfLike: 0,
            showComments: false,
            tweetComments: [],
            tweetLikeNum: 0,
            liked: false,
            userId: useMemberStore().memberId,
            userName: useMemberStore().memberName,
            userLikeList: [],
            replyContent: '',
            thisTweetUserId: '',
            tweetUserName: "",
            tweetUserImg: '',
            currentReply: '',//當下留言立即出現
            preNodeUserName: '',//如果是回文的話，主文的推主是誰
            preNodeUserId: '',//如果是回文的話，主文的推主id
            preNodeTweetId: '',
            preNodeTweet: '',////如果是回文的話，主文的推主tweet
            editTweetContent: false,
            editTweetContentTmp: "",//編輯內文，暫存區
            userDogs: [],
            reportPost: [],//檢舉內容
            reportPostText: '',
            imgOnlinePath: "",
            imgOnline: false,
            activityLink: "http://localhost:5173/activity/all",
            roomLink: "http://localhost:5173/room/b_page",

            dogCardName: '',
            dogCarddogIntroduce: '',
            dogCardImg: '',
        }
    },
    props: {
        tweet: {
            type: Object,
            required: true
        }
    },
    created() {
        axios.get(`${this.API_URL}/tweet/getNumOfComment/${this.tweet.tweetId}`)
            .then(response => {
                this.numOfComment = response.data;
            })
            .catch(error => {
                console.error('Error fetching number of comments:', error);
            });

        if (this.userId) {
            axios.get(`${this.API_URL}/tweet/getTweetLikesNum`, {
                params: {
                    tweetId: this.tweet.tweetId,
                    userId: this.userId
                }
            }).then(re => {
                this.tweetLikeNum = re.data.tweetLikesNum;
                //確認使用者是否已經按讚
                if (re.data.isUserLiked == 1) {
                    this.liked = true
                }
            })
        } else {
            axios.get(`${this.API_URL}/tweet/getTweetLikesNumForVisitor`, {
                params: {
                    tweetId: this.tweet.tweetId,
                }
            }).then(re => {
                this.tweetLikeNum = re.data.tweetLikesNum;
                //確認使用者是否已經按讚
                if (re.data.isUserLiked == 1) {
                    this.liked = true
                }
            })
        }


        //載入使用者的狗狗們
        axios.get(`${this.API_URL}/tweet/getTweetDogTags/${this.tweet.tweetId}`).then(re => {
            if (re.data !== null && re.data !== undefined && re.data !== '') {
                this.userDogs = re.data;

            }
        })
    },
    mounted() {
        if (this.tweet.preNode != 0) {
            axios.get(`${this.API_URL}/tweet/getUserByTweetId/${this.tweet.preNode}`).then(re => {
                this.preNodeUserName = re.data.lastName;
                // this.preNodeUserId = re.data.userId;
            })
            // axios.get(`${this.API_URL}/tweet/getTweetById/${this.tweet.preNode}`).then(re => {
            //     this.preNodeTweet = re.data;
            // })
        }


        if (this.tweet.preNode == 0) {
            axios.get(`${this.API_URL}/tweet/getUserByTweetId/${this.tweet.tweetId}`).then(re => {
                this.thisTweetUserId = re.data.userId;
                this.tweetUserName = re.data.lastName;
                this.tweetUserImg = re.data.userImgPath;
            })
        }

    },
    watch: {
        editTweetContent(newValue, oldValue) {
            if (newValue) {
                this.editTweetContentTmp = this.tweet.tweetContent;
            } else {
                this.editTweetContentTmp = "";
            }
        }
    },
    methods: {
        getImageUrl(imgPath) {
            if (imgPath.startsWith('http')) {
                this.imgOnlinePath = imgPath;
                this.imgOnline = true;
                return;
            }
            return `${this.API_URL}/tweet/getImage/${imgPath}`;
        },
        getCommentsLink() {
            if (this.showComments == false) {
                this.tweetComments = [];
                axios.get(`${this.API_URL}/tweet/getComments/${this.tweet.tweetId}`)
                    .then(response => {
                        this.tweetComments = response.data
                    })
                    .catch(error => {
                        console.error('Error fetching number of comments:', error);
                    });
                this.showComments = !this.showComments
            } else {
                this.currentReply = "";
                this.showComments = !this.showComments
            }
        },
        goOthersPage(name, id) {
            const memberStore = useMemberStore();
            const tweetStore = useTweetStore();
            if (memberStore.memberName != name) {
                axios.get(`${this.API_URL}/tweet/getUserTweetsByTweetId/${id}`).then(re => {
                    tweetStore.writeIn(re.data)
                    tweetStore.setUserName(tweetStore.tweets[0].userName)
                    this.$router.push("/tweetPage/tweetsOthersWallPage")
                })
            } else {
                this.$router.push("/tweetPage/tweetsMyWallPage")
            }
        },
        likeTweet() {
            const memberStore = useMemberStore();
            this.liked = !this.liked;
            this.tweetLikeNum += 1;

            const fd = new FormData();
            fd.append("tweetId", this.tweet.tweetId);
            fd.append("userId", this.userId);

            axios.post(`${this.API_URL}/tweet/getLikeLink`, fd)
                .then(response => {
                    console.log("likeTweet success");
                })
                .catch(error => {
                    console.error(error);
                });

            if (this.userId != this.thisTweetUserId) {
                const params = {
                    hisUserId: this.thisTweetUserId,
                    hisTweetId: this.tweet.tweetId,
                    myName: memberStore.memberName
                };
                axios.get(`${this.API_URL}/tweet/sendLikeNotify`, { params })
                    .then(response => {
                        console.log(response.data);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }

        },
        unlikeTweet() {
            this.liked = !this.liked;
            this.tweetLikeNum -= 1;

            const fd = new FormData();
            fd.append("tweetId", this.tweet.tweetId);
            fd.append("userId", this.userId);

            axios.post(`${this.API_URL}/tweet/removeLikeLink`, fd)
                .then(response => {
                    console.log("unlikeTweet success");
                })
                .catch(error => {
                    console.error(error);
                });
        },
        showLikeList() {
            const myModal = new bootstrap.Modal(this.$refs.myModal);
            myModal.show()
            axios.get(`${this.API_URL}/tweet/getTweetLikesUser`, {
                params: {
                    tweetId: this.tweet.tweetId,
                }
            }).then(re => {
                console.log("getTweetLikesUser" + re.data)
                this.userLikeList = re.data
            })
        },
        hideLikeList() {
            this.userLikeList = [];
        },
        // showReply() {
        //     const myReplyModal = new bootstrap.Modal(this.$refs.myReplyModal);
        //     myReplyModal.show()
        // },
        postReply() {
            if (!this.replyContent.trim()) {
                return;
            }
            this.RepolyErrorMsg = '';
            const memberStore = useMemberStore();

            const formData = new FormData();
            formData.append('memberId', memberStore.memberId);
            formData.append('tweetId', this.tweet.tweetId);
            formData.append('tweetContent', this.replyContent);
            axios.post(`${this.API_URL}/tweet/replyTweet`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(response => {
                    console.log("回文成功:", response.data);
                    // 清空推文内容
                    this.currentReply = memberStore.memberName + " : " + this.replyContent;
                    this.replyContent = "";
                    this.numOfComment += 1;
                    if (this.showComments == false) {
                        this.currentReply = "";
                    }
                })
                .catch(error => {
                    console.error("發文失败:", error);
                })

            if (this.userId != this.thisTweetUserId) {

                const params = {
                    hisUserId: this.thisTweetUserId,
                    hisTweetId: this.tweet.tweetId,
                    myName: memberStore.memberName
                };
                axios.get(`${this.API_URL}/tweet/sendReplyNotify`, { params })
                    .then(response => {
                        console.log("sendReplyNotify: " + response.data);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }
        },
        goPreNodeTweetPage() {
            this.preNodeTweet = '';
            const tweetStore = useTweetStore();
            tweetStore.clearMsg();
            axios.get(`${this.API_URL}/tweet/getTweetById/${this.tweet.preNode}`).then(re => {

                this.preNodeTweet = re.data;

                tweetStore.setUserName(this.preNodeUserName)


                tweetStore.writeIn(re.data)

                this.$router.push("/tweetPage/tweetsSingleTweetPage")
            })

        },
        formatPostDate(dateString) {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            return `${year}/${month}/${day} ${hours}:${minutes}`;
        },
        saveEditedTweet() {
            const postData = {
                editTweetContentTmp: this.editTweetContentTmp,
                tweetId: this.tweet.tweetId
            };
            axios.post(`${this.API_URL}/tweet/updateTweetContent`, postData)
                .then(response => {
                    this.tweet.tweetContent = response.data;
                    this.editTweetContent = false;
                })
                .catch(error => {
                    console.error('更新推文錯誤：', error);
                });

        },
        removeTweet() {
            if (window.confirm('確定要刪除此推文嗎？')) {
                const postData = {
                    tweetId: this.tweet.tweetId
                };
                axios.post(`${this.API_URL}/tweet/removeTweetContent`, postData)
                    .then(response => {
                        alert('成功刪除推文: ' + response.data.tweetContent);
                        this.$router.go(0)
                    })
                    .catch(error => {
                        console.error('刪除推文錯誤：', error);
                    });

            } else {
                console.log('取消操作');
            }
        },
        showReportPostPage() {
            const reportPostPage = new bootstrap.Modal(this.$refs.ReportPostPage);
            reportPostPage.show()
        },
        submitReport() {
            const requestData = {
                reportText: this.reportPostText,
                reportCheckBox: this.reportPost,
                reporterId: this.userId,
                tweetId: this.tweet.tweetId
            };
            axios.post(`${this.API_URL}/tweet/reportTweet`, requestData)
                .then(response => {
                    console.log("Report submitted successfully:", response.data);
                })
                .catch(error => {
                    console.error("Error submitting report:", error.message);
                });
        },
        showDogModal(dog) {
            const DogPage = new bootstrap.Modal(this.$refs.DogPage);
            DogPage.show()
            this.dogCardName = dog.dogName;
            this.dogCarddogIntroduce = dog.dogIntroduce;
            this.dogCardImg = dog.dogImgPathCloud;
        }

    }
};
</script>




<style scoped>
body {
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgb(255, 253, 236);
    height: 100%;
    width: 100%;
}

.cardContent {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px;
    padding: 10px;
}

.tweetCard {
    /* height: 300px;
    width: 400px; */
    width: 600px;
    margin: 50px;

    font-family: "Quicksand", sans-serif;
}

.tweetCardBody {
    background-color: #e3e3e6;
    border-radius: 25px;
}

.tweetCardBody .headerContent {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
}

.tweetCardBody .headerContent .headerImgHolder {
    display: flex;
    justify-content: center;
    align-items: center;
}

.tweetCardBody .headerContent .headerContentText {
    margin-left: 5px;
}

.tweetCardBody .headerContent .headerContentText h3 {
    margin: 0;
    font-weight: 900;
    font-size: 15;
}

.tweetCardBody .headerContent .headerContentText p {
    font-size: 14px;
    margin: 0;
    color: #84868a;
}

.tweetCardBody {
    background-color: #e3e3e6;
    border-radius: 25px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    /* 添加陰影 */
}


#headimg {
    height: 38px;
    width: 38px;
    border-radius: 50%;
}

.tweetCard img {
    height: 400px;
    width: 400px;
    /* border-radius: 50%; */
}

.tweetTarget {
    color: #397dfa;
}

.tweetDate {
    font-size: 11px;
    color: #84868a;
    width: 100%;
}

.tweetCard .btnWrapper {
    display: flex;
    justify-content: flex-end;
    width: 100%;
}

/* .tweetCard button {
    border: none;
    border-radius: 25px;
    padding: 10px 10px;
    background-color: #397dfa;
    color: #f0f4fc;
    font-family: "Quicksand", sans-serif;
    transition-duration: 0.3s;
} */

/* .tweetCard button:hover {
    background-color: #7ca9fc;
    color: white;
    cursor: pointer;
}

.tweetCard button:focus {
    outline: none;
} */

.dropdown {
    position: relative;
    display: inline-block;
}

.dropdown-menu {
    display: none;
    position: absolute;
    z-index: 1;
}

.dropdown:hover .dropdown-menu {
    display: block;
}

.dog-image {
    width: 250px;
    height: 300px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 10px;
}

.gallery-image {
    border-radius: 10px;
    margin-bottom: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
</style>