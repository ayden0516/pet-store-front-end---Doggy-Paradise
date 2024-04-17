<template>
    <div class="main">
        <h3>忘記密碼頁</h3>
        <div v-if="!emailSent && !resetPassword">
            <div class="input-group">
                <label for="email">請輸入 Email，送出後將寄驗證碼郵件至該信箱 :&nbsp;&nbsp;</label>
                <input type="email" id="email" v-model="email" placeholder="請輸入Email" required>
            </div>
            <button @click="sendEmail" :disabled="!email">送出</button>
            <!-- 添加正在處理中提示 -->
            <div v-if="sendingEmail" class="processing">正在發送驗證碼...</div>
        </div>
        <div v-else-if="emailSent && !resetPassword">
            <div>已發送驗證碼至 Email</div>
            <div class="input-group">
                <label for="verificationCode">請輸入驗證碼 :&nbsp;&nbsp;&nbsp;&nbsp;</label>
                <input type="text" id="verificationCode" v-model="verificationCode" placeholder="請輸入驗證碼" required>
                <div v-if="verificationCodeMismatch" class="error">驗證碼錯誤</div>
            </div>
            <button @click="verifyCode" :disabled="!verificationCode">驗證</button>
        </div>
        <div v-else-if="resetPassword && !backFormLog">
            <div class="input-group">
                <label for="newPassword">請輸入新密碼 :&nbsp;&nbsp;&nbsp;&nbsp;</label>
                <input type="password" id="newPassword" v-model="newPassword" placeholder="請輸入新密碼" required>
            </div>
            <div class="input-group">
                <label for="confirmPassword">請再次輸入新密碼 :&nbsp;&nbsp;&nbsp;&nbsp;</label>
                <input type="password" id="confirmPassword" v-model="confirmPassword" placeholder="請再次輸入新密碼" required>
                <div v-if="showPassWordMismatch" class="error">密碼不一致</div>
            </div>
            <button @click="goResetPassword" :disabled="passwordHasValAndSame">重設密碼</button>
        </div>
        <div v-else-if="backFormLog">
            <h4>兩秒後返回登入頁</h4>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router'

export default {
    data() {
        return {
            email: '',
            verificationCode: '',
            newPassword: '',
            confirmPassword: '',
            emailSent: false,
            verificationCodeMismatch: false,
            resetPassword: false,
            showPassWordMismatch: false,
            backFormLog: false,
            sendingEmail: false, // 添加正在發送 Email 的狀態
            router: useRouter()
        };
    },
    methods: {
        sendEmail() {
            // 發送驗證碼
            this.sendingEmail = true; // 設置正在處理中的狀態
            axios.get(`${this.API_URL}/forgetPassword/sendCode/${this.email}`)
                .then(response => {
                    if (response.status == 200) {
                        console.log('email send success');
                        this.emailSent = true;
                    } else {
                        console.error('email send failed');
                    }
                })
                .catch(error => {
                    console.error('ERROR:', error);
                })
                .finally(() => {
                    this.sendingEmail = false; // 無論成功或失敗都關閉處理中的狀態
                });
        },
        verifyCode() {
            // 驗證碼驗證
            axios.post(`${this.API_URL}/forgetPassword/verifyCode`, {
                verifyCode: this.verificationCode,
                email: this.email
            }
            ).then(response => {
                if (response.status === 200) {
                    this.resetPassword = true;
                    console.log('verify Code pass');
                } else {
                    console.error('verify Code failed');
                }
            }).catch(error => {
                this.verificationCodeMismatch = true;
                console.error('ERROR:', error);
            });
        },
        goResetPassword() {
            //重設密碼
            axios.post(`${this.API_URL}/forgetPassword/resetPassword`, {
                verifyCode: this.verificationCode,
                email: this.email,
                newPassword: this.newPassword
            }).then(response => {
                if (response.status === 200) {
                    console.log('resetPassword success');
                    this.backFormLog = true;
                    setTimeout(() => {
                        this.router.push({ name: 'login' });
                    }, 2000);
                } else {
                    console.error('resetPassword failed');
                }
            }).catch(error => {
                console.error('ERROR:', error);
            });
        }
    },
    watch: {
        confirmPassword(newVal, oldVal) {
            this.showPassWordMismatch = this.newPassword != this.confirmPassword
        }
    },
    computed: {
        passwordHasValAndSame() {
            return !this.newPassword || !this.confirmPassword || this.newPassword !== this.confirmPassword;
        }
    }
};
</script>


<style scoped>
.main {
    min-height: 82vh;
}

.input-group {
    margin-bottom: 10px;
}

.processing {
    color: blue;
    /* 正在處理中提示的顏色 */
}

.error {
    color: red;
    /* 錯誤提示的顏色 */
}
</style>