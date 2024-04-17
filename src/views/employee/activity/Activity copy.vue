<template>
  <div class="main-container">
    <!-- sideBar -->
    <div class="sidebar">
      <div class="sidebar-header">
        <h2>活動管理</h2>
      </div>
      <button
        class="sidebar-button custom-router-link"
        data-bs-toggle="collapse"
        data-bs-target="#collapseExample"
      >
        活動管理
      </button>
      <div class="collapse" id="collapseExample">
        <router-link to="/employee/activity/act_HoldingManager">
          <button class="sidebar-button custom-router-link">現行活動</button>
        </router-link>
        <router-link to="/employee/activity/act_PastManager">
          <button class="sidebar-button custom-router-link">過去活動</button>
        </router-link>
        <router-link to="/employee/activity/act_Creater">
          <button class="sidebar-button custom-router-link">創建活動</button>
        </router-link>
      </div>
      <button
        class="sidebar-button custom-router-link"
        data-bs-toggle="collapse"
        data-bs-target="#collapse2"
      >
        場地管理
      </button>
      <div class="collapse" id="collapse2">
        <router-link to="/employee/activity/act_HoldingManager">
          <button class="sidebar-button custom-router-link">場地資訊</button>
        </router-link>
        <router-link to="/employee/activity/act_PastManager">
          <button class="sidebar-button custom-router-link">客戶租借</button>
        </router-link>
        <router-link to="/employee/activity/act_Creater">
          <button class="sidebar-button custom-router-link">官方租借</button>
        </router-link>
      </div>

      <div class="sidebar-buttons">
        <router-link to="/employee/activity/act_HoldingManager">
          <button class="sidebar-button custom-router-link">##</button>
        </router-link>
        <router-link to="/employee/activity/act_PastManager">
          <button class="sidebar-button custom-router-link">##</button>
        </router-link>

        <router-link to="/employee">
          <button class="sidebar-button custom-router-link">後臺管理</button>
        </router-link>
        <!-- 其他按鈕 -->
      </div>
    </div>

    <!-- 本體 -->
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.main {
  flex: 1;
  padding: 40px;
}

.main-container {
  display: flex;
}

.sidebar {
  background-color: #f0f0f0;
  padding: 20px;
  max-width: 15%;
  min-height: 82vh;
}

.sidebar-header h2 {
  margin: 20px 0 40px;
}

.sidebar-buttons {
  display: flex;
  flex-direction: column;
}

.sidebar-button {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.5s;
}

.sidebar-button:hover {
  background-color: #999898;
  color: #fff;
}

/* sideBar 按鈕的寬度 */
.custom-router-link {
  width: 100%;
}
</style>
