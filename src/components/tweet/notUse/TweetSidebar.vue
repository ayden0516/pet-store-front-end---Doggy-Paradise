<template>
    <div class="sidebar">
        <div class="sidebar-header">
            <h2>狀態欄</h2>
        </div>
        <div class="sidebar-buttons">
            <button class="sidebar-button">首頁</button>
            <button class="sidebar-button" @click="showModal">發文</button>
            <!-- <PostModal v-if="isModalOpen" @close="closeModal" /> -->
            <button class="sidebar-button">訊息</button>
            <button class="sidebar-button">通知</button>
            <!-- 其他按鈕 -->
        </div>
    </div>
    <!-- Modal -->
    <div ref="myModal" class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">互動視窗</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">...</div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        Close
                    </button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div>
            </div>
        </div>
    </div>

</template>

<script>


export default {
    data() {
        return {
            isModalOpen: false
        };
    },
    methods: {
        showModal() {
            // https://bootstrap5.hexschool.com/docs/5.1/components/modal/#via-javascript
            const myModal = new bootstrap.Modal(this.$refs.myModal);
            myModal.show()
        },
    }
};
</script>

<style scoped>
.sidebar {
    background-color: #f0f0f0;
    padding: 20px;
}

.sidebar-header h2 {
    margin-bottom: 10px;
}

.sidebar-buttons {
    display: flex;
    flex-direction: column;
}

.sidebar-button {
    margin-bottom: 10px;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
    cursor: pointer;
}

.sidebar-button:hover {
    background-color: #e0e0e0;
}
</style>