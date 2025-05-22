<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-body">
            <h3 class="card-title text-center text-danger mb-4">Login</h3>

            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <input
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  placeholder="Email"
                  required
                />
              </div>

              <div class="mb-3">
                <input
                  v-model="form.password"
                  type="password"
                  class="form-control"
                  placeholder="Password"
                  required
                />
              </div>

              <div v-if="error" class="alert alert-danger text-center">
                {{ error }}
              </div>

              <div class="d-grid">
                <button type="submit" class="btn btn-danger">Login</button>
              </div>
            </form>

            <div class="text-center mt-3">
              Don't have an account?
              <router-link to="/register" class="text-danger fw-semibold">Register here</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { auth } from '@/stores/auth'

const router = useRouter()

const form = ref({
  email: '',
  password: '',
})

const error = ref(null)

const submitForm = async () => {
  error.value = null
  try {
    const response = await axios.post('http://localhost:8000/api/user/login', form.value)
    const { token, user } = response.data

    auth.login(token, user)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed'
  }
}
</script>
