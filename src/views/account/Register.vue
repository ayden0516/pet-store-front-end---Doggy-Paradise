<template>
    <main class="container col-xl-10 col-xxl-8 px-4 py-5">
        <div class="row align-items-center g-lg-5 py-5">
            <div class="col-lg-7 text-center text-lg-start">
                <h1 class="display-4 fw-bold lh-1 mb-3">歡迎加入DogLand！</h1>
                <p class="col-lg-10 fs-4">
                    探索DogLand，發現無盡的快樂！
                </p>
            </div>
            <div class="col-md-10 mx-auto col-lg-5">
                <form class="p-4 p-md-5 border rounded-3 bg-light">
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" placeholder="name@example.com" v-model="useremail"
                            required />
                        <label>Email address</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="password" class="form-control" placeholder="Password" v-model="password"
                            required />
                        <label>Password</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="password" class="form-control" placeholder="Confirm Password"
                            v-model="confirmpassword" required />
                        <label>Confirm Password</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" placeholder="Last Name" v-model="lastName" required />
                        <label>Last Name</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" placeholder="First Name" v-model="firstName" required />
                        <label>First Name</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" placeholder="Gender" v-model="userGender" required />
                        <label>Gender</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="date" class="form-control" placeholder="Birth Date" v-model="birthDate" required />
                        <label>Birth Date</label>
                    </div>
                    <button class="w-100 btn btn-lg btn-primary" @click.prevent="GOregister"
                        :disabled="showPassWordMismatch">Register</button>
                    <div class="text-danger text-center mt-3" v-if="showPassWordMismatch">Passwords do not match</div>
                    <hr class="my-4" />
                    <small class="text-muted">By registering, you agree to our <a href="#">Terms of Service</a></small>
                </form>
            </div>
        </div>
    </main>
</template>



<script>
import axios from "axios";
import { ref, watch } from "vue";

export default {
    data() {
        return {
            useremail: "",
            password: "",
            lastName: "",
            firstName: "",
            userGender: "",
            birthDate: "",
            confirmpassword: "",
            showPassWordMismatch: false,
        }
    },
    methods: {
        GOregister() {
            axios.post(`${this.API_URL}/register`, {
                userEmail: this.useremail,
                userPassword: this.password,
                lastName: this.lastName,
                firstName: this.firstName,
                userGender: this.userGender,
                birthDate: this.birthDate
            }, {
                Headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (response.status === 200) {
                    console.log('regiest success');
                    this.$router.push("/")
                } else {
                    console.error('regiest failed');
                }
            })
        }

    }

}

</script>
<!-- <script setup>

import axios from "axios";
import { ref, watch } from "vue";





const useremail = ref('');
const password = ref('');
const lastName = ref('');
const firstName = ref('');
const userGender = ref('');
const birthDate = ref('');
const confirmpassword = ref('');
const showPassWordMismatch = ref(false);

watch(confirmpassword, newConfirmPassword => {
    showPassWordMismatch.value = newConfirmPassword !== password.value;
});

function GOregister() {
    axios.post(`${this.API_URL}/register`, {
        userEmail: useremail.value,
        userPassword: password.value,
        lastName: lastName.value,
        firstName: firstName.value,
        userGender: userGender.value,
        birthDate: birthDate.value
    }, {
        Headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.status === 200) {
            console.log('regiest success');
            this.$router.push("/")
        } else {
            console.error('regiest failed');
        }
    })
}
</script> -->