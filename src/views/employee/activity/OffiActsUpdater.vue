<template>
  <div>
    <div id="title">
      <h4>
        <b>現行活動更新區</b
        ><img
          src="https://res.cloudinary.com/dxz9qtntt/image/upload/v1712297720/activityFolder/sjwop8uq4hb3objr0csd.png"
          alt="🐶"
          id="managerPic"
        />
      </h4>
    </div>
    <div class="Editcontainer">
      <div class="left">
        <section class="info">
          <h5>𖦹 請選擇要改變的種類 𖦹</h5>
        </section>
        <section class="cards-wrapper">
          <div class="card-grid-space">
            <a class="card" @click="showMainPhotoEditor">
              <div>
                <div class="tags">
                  <div class="tag">主照片</div>
                </div>
              </div>
            </a>
          </div>
          <div class="card-grid-space">
            <a class="card" @click="showInfoEditor">
              <div>
                <div class="tags">
                  <div class="tag">資訊</div>
                </div>
              </div>
            </a>
          </div>
          <div class="card-grid-space">
            <a class="card" @click="showTextEditor">
              <div>
                <div class="tags">
                  <div class="tag">內文</div>
                </div>
              </div>
            </a>
          </div>
          <div class="card-grid-space">
            <a class="card" @click="showSidePhotoEditor">
              <div>
                <div class="tags">
                  <div class="tag">說明圖</div>
                </div>
              </div>
            </a>
          </div>
        </section>
      </div>
      <div class="right">
        <div v-if="isInfo" class="">
          <div class="editorTitle">活動資訊編輯</div>
          <form class="p-4 p-md-7 border rounded-3 bg-light infoEditZone">
            <h6 style="text-align: left"><b>活動必要資訊</b></h6>
            <div class="form-floating mb-3">
              <input
                type="text"
                class="form-control"
                v-model.lazy="activityTitle"
                required
              />
              <label style="margin: 0">活動主題</label>
            </div>
            <div class="row g-2">
              <div class="col-md-4">
                <div class="form-floating mb-3">
                  <select
                    class="form-select"
                    id="floatingSelect"
                    name="venueId"
                    v-model="venueId"
                    required
                    aria-label="Floating label select example"
                  >
                    <option
                      v-for="v in venues"
                      :key="v.venueId"
                      :value="v.venueId"
                    >
                      {{ v.venueName }}
                    </option>
                  </select>
                  <label style="margin: 0" for="floatingSelect">場地選擇</label>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-floating mb-3">
                  <select
                    class="form-select"
                    id="floatingSelect"
                    name="activityDogNumber"
                    aria-label="Floating label select example"
                    v-model="dogNumber"
                    required
                  >
                    <option v-for="n in dogOptions" :key="n" :value="n">
                      {{ n }}
                    </option>
                  </select>
                  <label style="margin: 0" for="floatingSelect">預計狗數</label>
                </div>
              </div>
              <div class="col-md">
                <div class="form-floating mb-3">
                  <input
                    class="form-control"
                    type="date"
                    name="activityClosingDate"
                    :min="new Date()"
                    v-model.lazy="activityClosingDate"
                    required
                  /><label style="margin: 0">報名截止日期:</label>
                </div>
              </div>
            </div>
            <div class="row g-2">
              <div class="col-md">
                <div class="form-floating mb-3">
                  <input
                    class="form-control"
                    type="date"
                    name="activityDate"
                    value="2024-04-26"
                    :min="new Date()"
                    v-model.lazy="activityDate"
                    required
                  />
                  <label style="margin: 0">活動日期:</label>
                </div>
              </div>
              <div class="col-md">
                <div class="form-floating mb-3">
                  <input
                    class="form-control"
                    type="time"
                    name="activityStart"
                    value="13:00"
                    min="10:00"
                    max="22:00"
                    required
                    v-model.lazy="activityStart"
                  /><label style="margin: 0">開始時間:</label>
                </div>
              </div>
              <div class="col-md">
                <div class="form-floating mb-3">
                  <input
                    class="form-control"
                    type="time"
                    name="activityEnd"
                    :min="activityStart"
                    max="18:00"
                    v-model="activityEnd"
                    required
                  /><label style="margin: 0">結束時間:</label>
                </div>
              </div>
            </div>
          </form>
          <div class="picuploadbtn">
            <button class="btn btn-warning" @click.prevent="updateInfo">
              save info update
            </button>
          </div>

          <div class="text-danger text-center mt-3">{{ message }}</div>
        </div>

        <div v-if="ismainPic">
          <div class="editorTitle">主照片編輯</div>
          <div class="editZone">
            <div class="oldZone">
              <div class="editZoneTitle">舊照片</div>
              <div class="oldMain">
                <div class="input-group mb-3">
                  <input
                    class="form-control"
                    v-model="activityTitle"
                    readonly
                  />
                </div>
                <img :src="mainImg.galleryImgUrl" class="oldMainPic" />
              </div>
            </div>
            <div class="newZone">
              <div class="editZoneTitle">新照片</div>
              <div class="newMain">
                <div class="input-group mb-3">
                  <input
                    type="file"
                    class="form-control"
                    id="mainImgUpload"
                    ref="uploadMainPicInput"
                    accept="image/*"
                    required
                    @change="selectFile"
                  />
                </div>

                <!-- Crop result preview -->
                <div class="section" v-if="result.dataURL && result.blobURL">
                  <div class="preview">
                    <img :src="result.dataURL" />
                  </div>
                  <p>以上為裁切後畫面，下方可繼續編輯</p>
                </div>

                <!-- VuePictureCropper -->
                <div class="cropper-container" v-if="mainCropValue">
                  <div class="cropper-buttons">
                    <button class="btn btn-outline-dark" @click="clear">
                      清除
                    </button>
                    <button class="btn btn-outline-dark" @click="reset">
                      重置
                    </button>
                    <button class="btn btn-outline-success" @click="getResult">
                      剪切
                    </button>
                  </div>
                  <VuePictureCropper
                    :img="mainCropValue"
                    :options="{
                      viewMode: 1,
                      dragMode: 'crop',
                      aspectRatio: 16 / 9,
                    }"
                    @ready="ready"
                  ></VuePictureCropper>
                </div>
              </div>
            </div>
          </div>
          <div class="picuploadbtn">
            <button @click="saveMainPic" type="button" class="btn btn-warning">
              save update
            </button>
          </div>
        </div>

        <div v-if="isSidePic">
          <div class="editorTitle">說明照面編輯</div>
          <div class="editZone">
            <div class="oldZone">
              <div class="editZoneTitle">舊照片</div>
              <div class="oldMain">
                <div class="input-group mb-3">
                  <input
                    class="form-control"
                    v-model="activityTitle"
                    readonly
                  />
                </div>

                <div class="del">
                  <button
                    @click="delSidePic"
                    type="button"
                    id="delbtn"
                    class="btn btn-warning"
                    disabled
                  >
                    delete
                  </button>
                  <span>{{ delMessage }}</span>
                </div>

                <ul>
                  <li v-for="d in imgList.length - 1">
                    <input
                      type="checkbox"
                      :id="'myCheckbox' + d"
                      :value="imgList[d].galleryId"
                      v-model="delGalleryIdList"
                      @change="checkDelCount"
                    />
                    <label :for="'myCheckbox' + d"
                      ><img :src="imgList[d].galleryImgUrl" class="oldMainPic"
                    /></label>
                  </li>
                </ul>
              </div>
            </div>
            <div class="newZone">
              <div class="editZoneTitle">新照片</div>
              <div class="newMain">
                <div class="input-group mb-3">
                  <input
                    type="file"
                    class="form-control"
                    id="normalImage"
                    ref="normalImage"
                    accept="image/*"
                    multiple
                    @change="sidePicSelected"
                  />
                </div>
                <div class="del">
                  <button
                    @click="addSidePic"
                    type="button"
                    id="addbtn"
                    class="btn btn-warning"
                    disabled
                  >
                    add
                  </button>
                  <span>{{ addMessage }}</span>
                </div>
                <div
                  v-for="(image, index) in images"
                  :key="index"
                  class="preview"
                >
                  <img :src="image" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="isText">
          <div class="editorTitle">文本編輯</div>
          <form class="p-4 p-md-7 border rounded-3 bg-light infoEditZone">
            <h6 style="text-align: left"><b>活動敘述</b></h6>

            <div
              v-if="
                activityProcess == null &&
                activityNotice == null &&
                activityCostDescription == null
              "
            >
              <div>
                <h6 style="text-align: center; color: brown">
                  <b>活動內頁編輯</b>
                </h6>
                <ckeditor
                  :editor="editor"
                  v-model.lazy="activityDescription"
                  :config="editorConfig"
                  @blur="textOuputer"
                ></ckeditor>
                <div class="picuploadbtn">
                  <button
                    @click="updateEditor"
                    type="button"
                    class="btn btn-warning"
                  >
                    save description
                  </button>
                </div>
              </div>
            </div>
            <div
              v-if="
                activityProcess || activityNotice || activityCostDescription
              "
            >
              <div class="form-floating mb-3">
                <textarea
                  type="text"
                  class="form-control"
                  v-model.lazy="activityDescription"
                  style="height: 100px"
                ></textarea>
                <label style="margin: 0">活動簡介</label>
              </div>
              <div class="form-floating mb-3">
                <textarea
                  type="text"
                  class="form-control"
                  v-model="activityProcess"
                  style="height: 100px"
                ></textarea>
                <label style="margin: 0">活動流程</label>
              </div>
              <div class="form-floating mb-3">
                <textarea
                  type="text"
                  class="form-control"
                  v-model="activityNotice"
                  style="height: 10px"
                ></textarea>
                <label style="margin: 0">注意事項</label>
              </div>
              <div class="col-md">
                <div class="form-floating mb-3" v-if="activityCost > 1">
                  <input
                    type="text"
                    class="form-control"
                    v-model.lazy="activityCostDescription"
                  />
                  <label style="margin: 0">費用敘述</label>
                </div>
              </div>
              <div class="picuploadbtn">
                <button
                  @click="updateDescription"
                  type="button"
                  class="btn btn-warning"
                >
                  save description
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import VuePictureCropper, { cropper } from "vue-picture-cropper";
import Editor from "@ckeditor/ckeditor5-custom-build/build/ckeditor";
import { useMemberStore } from "@/stores/memberStore";
export default {
  components: {
    VuePictureCropper,
  },
  data() {
    return {
      ismainPic: false,
      isSidePic: false,
      isText: false,
      isInfo: false,
      activityId: null,
      message: "",
      //info
      venues: [],
      venueId: null,
      dogNumber: null,
      activityTitle: "",
      activityClosingDate: "",
      activityDate: "",
      activityStart: "",
      activityEnd: "",
      //main
      mainImg: "",
      newMainImg: "",
      newMainFile: null,

      mainCropValue: "", //base64
      uploadInput: null,
      result: {
        dataURL: "",
        blobURL: "",
      },
      //description form
      activityCost: null,
      activityDescription: "",
      activityCostDescription: "",
      activityNotice: "",
      activityProcess: "",

      //ckeditor
      editor: Editor,
      editorConfig: {
        // The configuration of the editor.
      },

      //side
      imgList: "",
      delMessage: "",
      delGalleryIdList: [],
      addMessage: "",
      images: [],
    };
  },
  mounted() {
    // 使用 $route.params.activityId 取值
    this.activityId = this.$route.params.activityId;
    axios
      .get(
        `${this.API_URL}/activity/api/official/activityInfo/${this.activityId}`
      )
      .then((rs) => {
        console.log(rs.data);
        const activityInfo = rs.data;
        this.venueId = activityInfo.venueId;
        this.dogNumber = activityInfo.activityDogNumber;

        this.activityTitle = activityInfo.activityTitle;
        this.activityClosingDate = this.spliceDate(
          activityInfo.activityClosingDate
        );

        this.activityDate = activityInfo.activityDate;

        this.activityStart = activityInfo.activityStart;
        this.activityEnd = activityInfo.activityEnd;
        this.mainImg = activityInfo.activityImgList[0];
        this.imgList = activityInfo.activityImgList;

        this.activityCost = activityInfo.activityCost;
        this.activityDescription = activityInfo.activityDescription;
        this.activityCostDescription = activityInfo.activityCostDescription;
        this.activityNotice = activityInfo.activityNotice;
        this.activityProcess = activityInfo.activityProcess;
      });
  },
  methods: {
    selectFile(e) {
      // Reset last selection and results
      this.mainCropValue = "";
      this.result.dataURL = "";
      this.result.blobURL = "";

      // Get selected files
      const file = e.target.files.item(0);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.mainCropValue = reader.result;
        console.log;
        // Clear selected files of input element
        if (this.uploadInput) this.uploadInput.value = "";
      };
    },
    // *********得到截圖的數據************
    async getResult() {
      if (!cropper) return;
      const base64 = cropper.getDataURL();
      const blob = await cropper.getBlob();
      if (!blob) return;

      const file = await cropper.getFile({
        fileName: "main",
      });

      console.log({ base64, blob, file });
      this.result.dataURL = base64;
      this.result.blobURL = URL.createObjectURL(blob);
      this.newMainFile = file;
      console.log(file);
    },
    clear() {
      if (!cropper) return;
      cropper.clear();
    },
    reset() {
      if (!cropper) return;
      cropper.reset();
    },
    ready() {
      console.log("Cropper is ready.");
    },

    showMainPhotoEditor() {
      this.ismainPic = true;
      this.isSidePic = false;
      this.isText = false;
      this.isInfo = false;
    },
    saveMainPic() {
      if (this.newMainFile != null) {
        const fd = new FormData();
        fd.append("activityId", this.activityId);
        fd.append("galleryId", this.mainImg.galleryId);
        fd.append("mainImg", this.newMainFile);
        axios
          .post(
            `${this.API_URL}/activity/api/official/updateManager/mainPic`,
            fd
          )
          .then((response) => {
            console.log("主題圖片更新成功!", response.data);
          })
          .then((reponse) => {
            location.reload();
          })
          .catch((error) => {
            console.error("主題圖片更新失敗", error);
          });
      }
    },

    showTextEditor() {
      this.ismainPic = false;
      this.isSidePic = false;
      this.isText = true;
      this.isInfo = false;
    },
    updateEditor() {
      const fd = new FormData();
      fd.append("activityId", this.activityId);
      fd.append("activityDescription", this.activityDescription);
      axios
        .post(
          `${this.API_URL}/activity/api/official/updateManager/desCkeditor`,
          fd
        )
        .then((response) => {
          console.log("editor更新成功!", response.data);
        })
        .then((reponse) => {
          location.reload();
        })
        .catch((error) => {
          console.error("editor更新失敗", error);
        });
    },
    updateDescription() {
      const fd = new FormData();
      fd.append("activityId", this.activityId);
      fd.append("activityDescription", this.activityDescription);
      fd.append("activityCostDescription", this.activityCostDescription);
      fd.append("activityNotice", this.activityNotice);
      fd.append("activityProcess", this.activityProcess);
      axios
        .post(`${this.API_URL}/activity/api/official/updateManager/desForm`, fd)
        .then((response) => {
          console.log("內文更新成功!", response.data);
        })
        .then((reponse) => {
          location.reload();
        })
        .catch((error) => {
          console.error("內文更新失敗", error);
        });
    },
    showSidePhotoEditor() {
      this.ismainPic = false;
      this.isSidePic = true;
      this.isText = false;
      this.isInfo = false;
    },
    sidePicSelected(e) {
      const files = e.target.files;
      const addbtn = document.getElementById("addbtn");
      if (e.target.files.length < 1) {
        addbtn.disabled = true;
      } else {
        addbtn.disabled = false;
      }
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = () => {
          this.images.push(reader.result);
        };
        reader.readAsDataURL(file);
      }
    },
    addSidePic() {
      if (this.$refs.normalImage.files.length > 0) {
        const fd = new FormData();
        fd.append("activityId", this.activityId);
        Array.from(this.$refs.normalImage.files).forEach((file) => {
          fd.append("addSidePicList", file);
        });
        axios
          .post(
            `${this.API_URL}/activity/api/official/updateManager/sidePic/add`,
            fd
          )
          .then((response) => {
            this.addMessage = "";
            console.log("說明圖片新增成功!", response.data);
          })
          .then((response) => {
            location.reload();
          })
          .catch((error) => {
            this.addMessage = "新增失敗";
            console.error("說明圖片新增失敗", error);
          });
      }
    },
    checkDelCount() {
      console.log(this.delGalleryIdList);
      const del = document.getElementById("delbtn");
      if (this.delGalleryIdList.length < 1) {
        del.disabled = true;
      } else {
        del.disabled = false;
      }
    },
    delSidePic() {
      const fd = new FormData();
      fd.append("delGalleryIdList", this.delGalleryIdList);
      fd.append("activityId", this.activityId);
      axios
        .post(
          `${this.API_URL}/activity/api/official/updateManager/sidePic/delete`,
          fd
        )
        .then((rs) => {
          this.delMessage = "";
          console.log(rs.data);
        })
        .then((rs) => {
          location.reload();
        })
        .catch((error) => {
          this.delMessage = "delete失敗";
          console.error("delete失敗:", error.message);
        });
    },
    showInfoEditor() {
      this.isInfo = true;
      this.ismainPic = false;
      this.isSidePic = false;
      this.isText = false;
      fetch(`${this.API_URL}/activity/api/venues`)
        .then((rs) => rs.json())
        .then((venueObj) => {
          this.venues = Object.values(venueObj);
          console.log(this.venues);
        });
    },
    updateInfo() {
      //再來寫邏輯
      console.log(this.activityId);
      const fd = new FormData();
      fd.append("venueId", this.venueId);
      fd.append("activityId", this.activityId);
      fd.append("activityTitle", this.activityTitle);
      fd.append("activityDate", new Date(this.activityDate));
      fd.append(
        "activityStart",
        new Date(`${this.activityDate}T${this.activityStart}`)
      );
      fd.append(
        "activityEnd",
        new Date(`${this.activityDate}T${this.activityEnd}`)
      );
      fd.append(
        "activityClosingDate",
        this.adjustClosing(this.activityClosingDate)
      );
      fd.append("activityDogNumber", this.dogNumber);

      axios
        .post(`${this.API_URL}/activity/api/official/updateManager/Info`, fd)
        .then((rs) => {
          this.message = "";
          console.log(rs.data);
        })
        .then((rs) => {
          location.reload();
        })
        .catch((error) => {
          this.message = "更新info失敗";
          console.error("更新info失敗:", error.message);
        });
    },
    spliceDate(time) {
      //給closinfDate用的
      const dateObject = new Date(time);
      const year = dateObject.getFullYear();
      let month = dateObject.getMonth() + 1;
      if (month < 10) {
        month = "0" + month;
      }
      let day = dateObject.getDate();
      if (day < 10) {
        day = "0" + day;
      }
      return `${year}-${month}-${day}`;
    },
    adjustClosing(time) {
      const date = new Date(time);
      date.setHours(23, 59, 59, 0);
      return date;
    },
  },
  computed: {
    dogOptions() {
      if (!this.venueId) return [];
      const selectedVenue = this.venues.find(
        (venue) => venue.venueId === this.venueId
      );
      if (!selectedVenue) return [];
      return Array.from(
        { length: selectedVenue.venueCapacityDog },
        (_, index) => index + 1
      );
    },
  },
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css?family=Heebo:400,700|Open+Sans:400,700");
#title {
  color: #874a33;
  margin: auto 20px;
  padding: 20px 20px;
  text-align: center;
}
#managerPic {
  height: 70px;
}
.Editcontainer {
  display: flex;
  border-radius: 20px;
  background-color: rgb(222, 227, 230);
}
.editorTitle {
  /* 大標 */
  text-align: center;
  font-weight: 600;
  margin: 10px;
}
.editZoneTitle {
  /* 小標*/
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  margin: 10px;
}
.editZone {
  display: flex;
  border-radius: 5px;
  margin: 0 10px;
  margin-bottom: 20px;
  background-color: white;
}
.infoEditZone {
  margin: 10px;
}
.oldZone {
  flex: 40%;
  /* background-color: lightblue; */
  padding: 0 10px;
}
.oldMain {
  justify-content: center;
}
.del {
  text-align: center;
  padding-bottom: 10px;
  margin-top: 0;
}
.oldMainPic {
  display: flex;
  height: 150px;
  margin: 10px auto;
  /* margin-top: 54px; */
}
.newZone {
  flex: 60%;
  padding: 0 10px;
  padding-bottom: 10px;
  /* background-color: lightgoldenrodyellow; */
}
.newMain {
  justify-content: center;
}
.newMainPic {
  display: flex;
  height: 150px;
  margin: 10px auto;
}

.preview {
  margin-top: 10px;
}

.picuploadbtn {
  display: flex;
  padding: 10px 0;
  justify-content: center;
}

.left {
  width: 20%;
  border-right: 3px dashed grey;
}

.right {
  width: 80%;
}

:root {
  --color: rgb(0, 0, 0, 0.1);
  --transition-time: 0.5s;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: "Open Sans";
  background: #fafafa;
}

a {
  color: inherit;
}
.info {
  margin-top: 15px;
  text-align: center;
}
.info h5 {
  font-size: 15px;
  font-weight: 600;
  color: #874a33;
}

.cards-wrapper {
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 2rem;
  padding: 0.5rem;
  width: max-content;
}

.card {
  font-family: "Heebo";
  --bg-filter-opacity: 0.5;
  background-image: linear-gradient(
      rgba(0, 0, 0, var(--bg-filter-opacity)),
      rgba(0, 0, 0, var(--bg-filter-opacity))
    ),
    var(--bg-img);
  height: 3em;
  width: 5.5em;
  font-size: 1.5em;
  color: rgb(14, 2, 42);
  font-weight: 700;
  border-radius: 1em;
  padding: 0.7em;
  margin: 0.5em;
  display: flex;
  align-items: center;
  background-size: cover;
  background-position: center;
  transition: all, var(--transition-time);
  position: relative;
  overflow: hidden;
  border: 8px solid #414141;
  text-decoration: none;
}

.card:hover {
  transform: rotate(0);
}

.card .tags {
  display: flex;
}

.card .tags .tag {
  font-size: 0.7em;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 0.3rem;
  padding: 0 0.5em;
  margin-right: 0.5em;
  line-height: 1.5em;
  transition: all, var(--transition-time);
}

.card:hover .tags .tag {
  background: var(--color);
  color: #e6453c;
}

.card:before,
.card:after {
  content: "";
  transform: scale(0);
  transform-origin: top left;
  border-radius: 50%;
  position: absolute;
  left: -50%;
  top: -50%;
  z-index: -5;
  transition: all, var(--transition-time);
  transition-timing-function: ease-in-out;
}

.card:before {
  background: #ddd;
  width: 250%;
  height: 250%;
}

.card:after {
  background: #ddd;
  width: 200%;
  height: 200%;
}

.card:hover {
  color: var(--color);
}

.card:hover:before,
.card:hover:after {
  transform: scale(1);
}

.card-grid-space .num {
  font-size: 3em;
  margin-bottom: 1.2rem;
  margin-left: 1rem;
}

/* MEDIA QUERIES */
@media screen and (max-width: 1285px) {
  .cards-wrapper {
    grid-template-columns: 1fr 1fr;
  }
}

@media screen and (max-width: 900px) {
  .cards-wrapper {
    grid-template-columns: 1fr;
  }
  .info {
    justify-content: center;
  }
  .card-grid-space .num {
    margin-left: 0;
    text-align: center;
  }
}

@media screen and (max-width: 500px) {
  .cards-wrapper {
    padding: 4rem 2rem;
  }
  .card {
    max-width: calc(100vw - 4rem);
  }
}

@media screen and (max-width: 450px) {
  .info {
    display: block;
    text-align: center;
  }
  .info h1 {
    margin: 0;
  }
}
.mixin-button {
  display: inline-block;
  border: 1px solid transparent;
  text-align: center;
  white-space: nowrap;
  transition: color 0.25s, border-color 0.25s, background-color 0.25s;
  cursor: pointer;
}

.section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.select-picture {
  position: relative;
  line-height: 38px;
  font-size: 14px;
  color: var(--vp-button-brand-text);
  border-color: var(--vp-button-brand-border);
  background-color: var(--vp-button-brand-bg);
  border-radius: 20px;
  padding: 0 40px;
  margin-bottom: 1em;
  display: inline-block;
  cursor: pointer;
  transition: color 0.25s, border-color 0.25s, background-color 0.25s;
}

.select-picture:hover {
  border-color: var(--vp-button-brand-hover-border);
  color: var(--vp-button-brand-hover-text);
  background-color: var(--vp-button-brand-hover-bg);
}

.select-picture input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-size: 0;
  cursor: pointer;
  opacity: 0;
}

.preview {
  display: flex;
  width: 100%;
  max-width: 800px;
  margin-bottom: 1em;
  justify-content: center;
}

.preview img {
  width: auto;
  height: auto;
  max-width: 60%;
  max-height: 60%;
}
.cropper-buttons .btn {
  margin-right: 20px;
  margin-bottom: 5px;
}
.section {
  display: flex;
  justify-content: center;
  align-items: center;
}
/* .ll */

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: inline;
}

li {
  display: inline;
}

input[type="checkbox"][id^="myCheckbox"] {
  display: none;
}

label {
  border: 1px solid #fff;
  padding: 10px;
  display: block;
  position: relative;
  margin: 10px;
  cursor: pointer;
}

label:before {
  background-color: white;
  color: white;
  content: " ";
  display: block;
  border-radius: 50%;
  border: 1px solid grey;
  position: absolute;
  top: -5px;
  left: -5px;
  width: 25px;
  height: 25px;
  text-align: center;
  line-height: 28px;
  transition-duration: 0.4s;
  transform: scale(0);
}

label img {
  max-width: 100px;
  max-height: 100px;
  width: auto;
  height: auto;
  transition-duration: 0.2s;
  transform-origin: 50% 50%;
}

:checked + label {
  border-color: #ddd;
}

:checked + label:before {
  content: "✓";
  background-color: grey;
  transform: scale(1);
}

:checked + label img {
  transform: scale(0.9);
  /* box-shadow: 0 0 5px #333; */
  z-index: -1;
}
</style>
