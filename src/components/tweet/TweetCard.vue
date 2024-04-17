<template>

    <div class="colored-header">
        <div class="tweet-item">
            <button v-if="tweet.preNode != 0" class="reply-message" @click="goPreNodeTweetPage">此則為回覆{{ preNodeUserName
                }}的留言
            </button>

            <!-- 使用者的名字 -->
            <div v-if="this.tweetUserName" class="row align-items-center with-background">
                <div class="col">
                    <h3 @click="goOthersPage(this.tweetUserName, tweet.tweetId)" class="tweet-name like-count">
                        {{ this.tweetUserName }} :</h3>
                </div>

                <!-- ...按紐們 -->
                <div class="col-auto">
                    <div class="dropdown">
                        <button class="btn btn-secondary" type="button" id="dropdownMenuButton1" aria-expanded="false">
                            ...
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li v-if="this.userName == this.tweetUserName"><a class="dropdown-item"
                                    @click="editTweetContent = true">編輯推文</a></li>
                            <li v-if="this.userName != this.tweetUserName && userId"><a @click="showReportPostPage"
                                    class="dropdown-item">檢舉推文</a></li>
                            <li v-if="this.userName != this.tweetUserName"><a class="dropdown-item"
                                    @click="goOthersPage(this.tweetUserName, tweet.tweetId)">到{{ this.tweetUserName
                                    }}的主頁</a>
                            </li>

                        </ul>
                    </div>

                    <!--檢舉的彈出式視窗 -->
                    <div ref="ReportPostPage" class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel"
                        aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h3>檢舉頁面</h3>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
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
                                        <textarea class="form-control" id="reportReason" rows="3"
                                            v-model="reportPostText"></textarea>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" @click="submitReport" data-bs-dismiss="modal"
                                            aria-label="Close" class="btn btn-primary">送出</button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                </div>
            </div>
            <br>
            <!-- 使用的的狗狗們 -->
            <span v-if="userDogs.length > 0">我的狗勾們 :&nbsp;</span>
            <span v-for="(dog, index) in userDogs" :key="dog.dogId">
                {{ dog.dogName }}
                <template v-if="index < userDogs.length - 1">、</template>
            </span>





            <hr v-if="tweet.preNode == 0">




            <!-- 推文內容 -->
            <div v-if="!this.editTweetContent" class="content-wrapper">
                <div class="tweet-content">{{ tweet.tweetContent }}</div>
            </div>
            <div v-else>
                <textarea v-model="this.editTweetContentTmp" class="form-control"></textarea>
                <div class="mt-2">
                    <button @click="saveEditedTweet" class="btn btn-primary">保存</button>
                    <button @click="editTweetContent = false" class="btn btn-secondary ms-2">取消</button>
                    <button @click="removeTweet" class="btn btn-warning ms-2">刪除貼文</button>
                </div>
            </div>

            <br>

            <!-- 推文圖片 -->
            <div v-if="tweet.tweetGalleries && tweet.tweetGalleries.length > 0 && !imgOnline" class="tweet-galleries">
                <div class="d-flex justify-content-center">
                    <div v-for="(gallery, index) in tweet.tweetGalleries" :key="index" class="gallery-item">
                        <img :src="getImageUrl(gallery.imgPath)" alt="Gallery Image" class="gallery-image">
                    </div>
                </div>
            </div>
            <div v-if="tweet.tweetGalleries && tweet.tweetGalleries.length > 0 && imgOnline" class="tweet-galleries">
                <div class="d-flex justify-content-center">
                    <div class="gallery-item">
                        <a :href="activityLink">
                            <img :src="imgOnlinePath" alt="Gallery Image" class="gallery-image">
                        </a>
                    </div>
                </div>
            </div>

            <br>

            <!-- 讚功能 -->
            <span v-if="tweetLikeNum !== 0" @click="showLikeList" class="like-count">獲得了
                {{ tweetLikeNum }} 個骨頭
            </span>
            <!-- 按讚按钮 -->
            <span v-if="tweet.preNode == 0 && userId">
                <button v-if="!this.liked" @click="likeTweet" class="btn btn-primary">🦴</button>
                <button v-else @click="unlikeTweet" class="btn btn-warning">💩</button>
                <!-- 發文時間 -->
                發文時間: {{ formatPostDate(tweet.postDate) }}</span>

            <hr v-if="tweet.preNode == 0">

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
                        <!-- <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="hideLikeList">
                            Close
                        </button>
                    </div> -->
                    </div>
                </div>
            </div>


            <!-- 顯示留言數 -->
            <span v-if="this.numOfComment > 0" class="comment-count" style="margin-right: 10px;">
                <button @click="getCommentsLink(tweet.tweetId)" type="button" class="btn btn-outline-dark">有{{
                    this.numOfComment
                    }}則留言
                </button>
            </span>

            <!-- 子留言，內容 -->
            <div v-if="showComments" class="comment-section">

                <div v-for="comment in tweetComments" :key="comment.id" class="comment-item">{{ comment.userName
                    }} : {{ comment.tweetContent }}</div>
                <div>{{ currentReply }}</div>
            </div>

            <!-- 回覆推文的地方 -->
            <span v-if="tweet.preNode == 0 && userId">
                <input type="text" v-model="replyContent" placeholder="在此輸入回覆內容"
                    style="height: 0px; padding-top: 16px; padding-bottom: 18px;">
                <span>
                    <button @click="postReply" class="btn btn-success">回覆</button>
                </span>
            </span>
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
            axios.get(`${this.API_URL}/tweet/getUserNameByTweetId/${this.tweet.tweetId}`).then(re => {
                this.tweetUserName = re.data;
            })
        }
        if (this.tweet.preNode == 0) {
            axios.get(`${this.API_URL}/tweet/getUserIdByTweetId/${this.tweet.tweetId}`).then(re => {
                this.thisTweetUserId = re.data;
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
                console.log(this.imgOnlinePath)
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
            return `${year}年${month}月${day}號 ${hours}點${minutes}分`;
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
        }

    }
};
</script>

<style scoped>
.with-background {
    background-color: #F3F3FA;
    border-radius: 10px;

}

.tweet-item {
    max-width: 500px;
    margin-bottom: 20px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #C4E1E1;
}

.reply-message {
    cursor: pointer;
    font-weight: bold;
    color: blue;
    margin-bottom: 10px;
}

.tweet-id,
.post-date,
.tweet-name,
.tweet-content {
    margin-bottom: 10px;
}

.tweet-galleries {
    margin-bottom: 10px;
}

.gallery-item {
    display: inline-block;
    margin-right: 10px;
}

.gallery-image {
    max-width: 100%;
    max-height: 100%;
}


.like-count {
    cursor: pointer;
    padding: 5px;
}

.hovered {
    background-color: #aa2929;
}

.comment-section {
    margin-top: 10px;
}

.comment-item {
    margin-bottom: 5px;
}

.comment-username {
    font-weight: bold;
}

.comment-content {
    margin-left: 5px;
}

.current-reply {
    margin-top: 10px;
    font-style: italic;
}

.content-wrapper {
    border: 1.5px solid #1c1c1c;
    border-radius: 5px;
    background-color: #f9f9f9;
    padding: 10px;
}

.colored-header {
    background-color: #ffffff;
    padding: 20px;

}


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
</style>