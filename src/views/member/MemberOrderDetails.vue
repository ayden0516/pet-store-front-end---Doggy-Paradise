<template>
  <main class="h-100 gradient-custom">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-lg-10 col-xl-15">
          <div class="card" style="border-radius: 10px">
            <div class="card-header px-4 py-5">
              <h5 class="text-muted mb-0">
                Thanks for your Order,
                <span style="color: #a8729a">{{ memberName }}</span>
              </h5>
            </div>
            <div class="card-body p-4">
              <div
                class="d-flex justify-content-between align-items-center mb-4"
              >
                <p class="lead fw-normal mb-0" style="color: #a8729a">
                  商品細項
                </p>
                <p class="small text-muted mb-0">訂單編號 : 001</p>
                <!--order o | o.orderId-->
              </div>
              <div
                class="card shadow-0 border mb-4"
                v-for="(p, index) in products"
                :key="index"
              >
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-2">
                      <img :src="p.mainImgPath" class="img-fluid" alt="" />
                      <!--:src="{{ productImgUrl }}"-->
                    </div>
                    <div
                      class="col-md-6 text-center d-flex justify-content-center align-items-center"
                    >
                      <p class="text-muted mb-0">
                        {{ p.productName }}
                      </p>
                      <!--{{ productName }}-->
                    </div>

                    <div
                      class="col-md-2 text-center d-flex justify-content-center align-items-center"
                    >
                      <p class="text-muted mb-0 small">
                        數量: {{ quantity[index] }}
                      </p>
                      <!--product.stock-->
                    </div>
                    <div
                      class="col-md-2 text-center d-flex justify-content-center align-items-center"
                    >
                      <p class="text-muted mb-0 small">${{ p.unitPrice }}</p>
                      <!--product.unitPrice-->
                      <!-- <div
                        class="col-md-5 text-center d-flex justify-content-center align-items-center"
                      >
                        <p class="text-muted mb-0 small">
                          ${{ totalPrice(p, index) }}
                        </p>
                      </div> -->
                      <!-- 評價按鈕 -->
                      <button
                        type="button"
                        class="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        data-bs-whatever="@mdo"
                        @click="setSelectedProductId(p.productId)"
                      >
                        評價
                      </button>
                      <!-- 評價按鈕 -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="card-footer border-0 px-4 py-4"
              style="
                background-color: #a8729a;
                border-bottom-left-radius: 10px;
                border-bottom-right-radius: 10px;
              "
            >
              <h5
                class="d-flex align-items-center justify-content-end text-white text-uppercase mb-0"
              >
                總計:
                <span class="h2 mb-0 ms-2">{{ calculateTotalPrice }}</span>
                <!--total(){}-->
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 彈出視窗 -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">評價此商品</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3 custom-rating">
                <label for="recipient-name" class="col-form-label"
                  >商品品質:</label
                >
                <div>
                  <el-rate
                    v-model="ratingValue"
                    :max="5"
                    @change="handleRatingChange"
                    :texts="['1顆星', '2顆星', '3顆星', '4顆星', '5顆星']"
                    show-text
                    class="custom-rating"
                  />
                </div>
              </div>
              <!-- ---------------照片上傳--------------- -->
              <div class="mb-3">
                <label for="imageUpload" class="col-form-label"
                  >上傳照片:</label
                >
                <div>
                  <input
                    type="file"
                    @change="handleImageUpload"
                    accept="image/*"
                    class="form-control"
                    id="imageUpload"
                    ref="imageUpload"
                    style="width: auto"
                  />
                  <div id="image-preview" style="margin-top: 15px">
                    <img
                      v-if="imageUrl"
                      :src="imageUrl"
                      style="max-width: 100%; max-height: 200px"
                    />
                  </div>
                </div>
              </div>
              <!-- ---------------照片上傳--------------- -->
              <div class="mb-3">
                <label for="message-text" class="col-form-label">評價:</label>
                <textarea
                  class="form-control"
                  id="messageText"
                  ref="messageText"
                ></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="resetForm"
            >
              取消
            </button>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              @click="commentPost"
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import { useMemberStore } from "@/stores/memberStore";
import axios from "axios";

export default {
  data() {
    return {
      memberId: "",
      memberName: "",
      orderId: "",
      productIds: [],
      quantity: [],
      products: [],
      productName: "",
      mainImgPath: "",
      stock: "",
      unitPrice: "",
      sum: "",
      // Element
      ratingValue: 0, // 初始化星星的值
      dialogVisible: false, //這個是Element要加的
      imageUrl: "", // 新增 imageUrl 數據
      selectedProductId: "", // 儲存所選商品的 productId
    };
  },
  mounted() {
    const memberStore = useMemberStore();
    this.memberId = memberStore.memberId;
    this.memberName = memberStore.memberName;

    this.orderId = this.$route.params.orderId;
    // console.log(this.orderId);
    // console.log(this.$route.params);

    axios
      .get(`${this.API_URL}/order/${this.orderId}/orderDetails`)
      .then((re) => {
        this.productIds = re.data.map((od) => od.productId);
        this.quantity = re.data.map((od) => od.quantity);
        // console.log(this.productIds);
        // console.log("111111111");
        // console.log(this.quantity);
        return axios.post(`${this.API_URL}/order/getProducts`, this.productIds);
      })
      .then((postRes) => {
        // console.log(postRes.data[2]);
        this.products = postRes.data;
        // console.log(this.productIds);
        // console.log("============");
        // console.log(postRes.data);
      });
  },

  computed: {
    calculateTotalPrice() {
      return this.products.reduce((total, product, index) => {
        return total + product.unitPrice * this.quantity[index];
      }, 0);
    },
  },
  methods: {
    //星星
    handleRatingChange(value) {
      this.ratingValue = value;
    },
    //即時顯示上傳的圖片
    handleImageUpload(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    //點評價按鈕時鎖定productId
    setSelectedProductId(productId) {
      this.selectedProductId = productId;
    },
    //發送評價
    commentPost() {
      try {
        const formData = new FormData();
        formData.append("ratingValue", this.ratingValue); // 星星
        formData.append("messageText", this.$refs.messageText.value);
        formData.append("productId", this.selectedProductId);
        console.log(this.ratingValue);
        console.log(this.$refs.messageText.value);
        console.log(this.selectedProductId);
        if (this.$refs.imageUpload.files.length > 0) {
          formData.append("productImage", this.$refs.imageUpload.files[0]);
        }
        axios
          .post(`${this.API_URL}/addComment`, formData)
          .then((response) => {
            console.log("評價成功!", response.data);
            //this.isRated = true; // 評家成功後將isRated設置為true
          })
          .catch((error) => {
            console.error("評價失敗", error);
          });
      } catch (error) {
        console.error("錯誤了", error);
      }
    },
    //重置評論
    resetForm() {
      this.ratingValue = 0; // 重置星星的值
      this.$refs.messageText.value = ""; // 清空評價文本框中的內容
      this.imageUrl = ""; // 清空圖片預覽
    },
  },
};
</script>
<style>
.custom-rating .el-rate__item {
  width: 50px; /* 设置单个星星的宽度 */
  height: 45px; /* 设置单个星星的高度 */
}

.custom-rating .el-rate__icon {
  font-size: 35px; /* 设置星星的图标大小 */
}
</style>
