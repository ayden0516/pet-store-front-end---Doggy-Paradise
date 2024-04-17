<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <div class="mb-3">
          <label for="imageUpload" class="form-label">商品圖片：</label>
          <input
            type="file"
            @change="handleImageUpload"
            accept="image/*"
            class="form-control"
            id="imageUpload"
            ref="imageUpload"
            style="width: auto"
          />
          <div id="image-preview">
            <img
              v-if="imageUrl"
              :src="imageUrl"
              style="max-width: 100%; max-height: 100%"
            />
          </div>
        </div>
        <div class="col">
          <div>
            <label for="productName" class="form-label">商品名稱：</label>
            <input
              type="text"
              class="form-control"
              id="productName"
              ref="productName"
              style="width: 700px"
            />
            <label for="productCategory" class="form-label">商品分類：</label>
            <select id="productCategory" ref="productCategory">
              <option
                v-for="pc in productCategory"
                :key="pc.categoryId"
                :value="pc.categoryId"
              >
                {{ pc.categoryName }}
              </option>
            </select>
          </div>
        </div>
        <div class="col">
          <div>
            <label for="productPrice" class="form-label">商品價格：</label>
            <input
              type="text"
              class="form-control"
              id="productPrice"
              ref="productPrice"
              style="width: auto"
            />
          </div>
          <div>
            <label for="stock" class="form-label">庫存：</label>
            <input
              type="text"
              class="form-control"
              id="stock"
              ref="stock"
              style="width: auto"
            />
          </div>
        </div>
        <div>
          <div class="form-group">
            <label for="productDescription" class="form-label"
              >商品描述：</label
            >
            <textarea
              id="productDescription"
              ref="productDescription"
              cols="100"
              rows="10"
            ></textarea>
          </div>
          <button type="button" class="btn btn-primary" @click="postProduct">
            上架
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      imageUrl: null,
      productName: "",
      productPrice: "",
      productCategory: [],
      productDescription: "",
      stock: "",
    };
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(file);
    },
    postProduct() {
      const formData = new FormData();
      //   formData.append("employeeId", employeeStore.employeeId);
      formData.append("productName", this.$refs.productName.value);
      formData.append("categoryId", this.$refs.productCategory.value);
      formData.append("productPrice", this.$refs.productPrice.value);
      formData.append(
        "productDescription",
        this.$refs.productDescription.value
      );
      if (this.$refs.imageUpload.files.length > 0) {
        formData.append("productImage", this.$refs.imageUpload.files[0]);
      }
      formData.append("stock", this.$refs.stock.value);
      console.log(this.$refs.productName.value);
      console.log(this.$refs.productCategory.value);
      console.log(this.$refs.productPrice.value);
      console.log(this.$refs.productDescription.value);

      axios
        .post(`${this.API_URL}/employee/addProduct`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          this.imageUrl = "";
          this.productName = "";
          this.productPrice = "";
          this.productDescription = "";
          this.stock = "";
          location.reload();
        })
        .catch((error) => {
          console.error("", error);
        });
    },
  },
  mounted() {
    axios.get(`${this.API_URL}/employee/getCategory`).then((re) => {
      this.productCategory = re.data;
    });
  },
};
</script>
<style>
#image-preview {
  max-width: 400px;
  max-height: 400px;
  margin-top: 20px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group textarea {
  display: block;
}
</style>
