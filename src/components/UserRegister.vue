<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card shadow-sm">
          <div class="card-body">
            <h3 class="card-title text-center text-danger mb-4">Create an Account</h3>

            <form @submit.prevent="submitForm" class="row g-3">
              <div class="col-md-6">
                <input v-model="form.fname" type="text" class="form-control" placeholder="First Name" required />
              </div>
              <div class="col-md-6">
                <input v-model="form.lname" type="text" class="form-control" placeholder="Last Name" required />
              </div>

              <div class="col-12">
                <input v-model="form.email" type="email" class="form-control" placeholder="Email" required />
              </div>

              <div class="col-md-6">
                <input v-model="form.password" type="password" class="form-control" placeholder="Password" required />
              </div>
              <div class="col-md-6">
                <input v-model="form.password_confirmation" type="password" class="form-control" placeholder="Confirm Password" required />
              </div>

              <div class="col-12">
                <select v-model="form.country_id" @change="updateDialCode" class="form-select" required>
                  <option disabled value="">Select Country</option>
                  <option v-for="country in countries" :key="country.id" :value="country.id">
                    {{ country.name }}
                  </option>
                </select>
              </div>

              <div class="col-12 d-flex">
                <span class="input-group-text bg-light text-muted">{{ dialCode || '+--' }}</span>
                <input v-model="form.phone" type="text" class="form-control" placeholder="Phone Number" required />
              </div>

              <div class="col-md-4">
                <input v-model="form.age" type="text" class="form-control" placeholder="Age" required />
              </div>

              <div class="col-md-8">
                <select v-model="selectedLevel" @change="updateSubLevels" class="form-select" required>
                  <option disabled value="">Select Level</option>
                  <option v-for="(options, level) in levels" :key="level" :value="level">{{ level }}</option>
                </select>
              </div>

              <div class="col-12">
                <select v-model="form.level_id" class="form-select" required>
                  <option disabled value="">Select HSK</option>
                  <option v-for="option in subLevels" :key="option.id" :value="option.id">{{ option.name }}</option>
                </select>
              </div>

              <div class="col-12 d-grid">
                <button type="submit" class="btn btn-danger">Register</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Form state
const form = ref({
  fname: '',
  lname: '',
  email: '',
  password: '',
  password_confirmation: '',
  phone: '',
  age: '',
  country_id: '',
  level_id: '',
})

// Country data
const countries = ref([])
const dialCode = ref('')

// Levels data (simulating IDs)
const levels = {
  beginner: [
    { id: 1, name: 'HSK1' },
    { id: 2, name: 'HSK2' },
  ],
  elementary: [{ id: 3, name: 'HSK3' }],
  intermediate: [{ id: 4, name: 'HSK4' }],
  upper_intermediate: [{ id: 5, name: 'HSK5' }],
  advanced: [{ id: 6, name: 'HSK6' }],
}

const selectedLevel = ref('')
const subLevels = ref([])

const updateSubLevels = () => {
  subLevels.value = levels[selectedLevel.value] || []
  form.value.level_id = ''
}

const updateDialCode = () => {
  const country = countries.value.find(c => c.id === form.value.country_id)
  if (country) {
    dialCode.value = `${country.dial_code}`
  }
}

// Fetch countries from API
onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/countries')
    countries.value = res.data
  } catch (err) {
    console.error('Failed to fetch countries:', err)
  }
})

// Handle form submission
import { auth } from '@/stores/auth'
import { useRouter } from 'vue-router'
const router = useRouter()

const submitForm = async () => {
  try {
    const payload = {
      ...form.value,
      phone: `${dialCode.value}${form.value.phone}`
    }

    const res = await axios.post('http://localhost:8000/api/user/register', payload)

    const { token, user } = res.data

    auth.login(token, user)
    router.push('/dashboard')

  } catch (err) {
    console.error('Registration failed:', err)
    alert('Error during registration')
  }
}
</script>

<style scoped>
.input-group-text {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: none;
}
.form-control + .form-control {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>
