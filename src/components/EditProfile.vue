<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card shadow-sm">
          <div class="card-body">
            <h3 class="card-title text-center text-primary mb-4">Edit Profile</h3>

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
                <input v-model="form.password" type="password" class="form-control" placeholder="New Password (optional)" />
              </div>
              <div class="col-md-6">
                <input v-model="form.password_confirmation" type="password" class="form-control" placeholder="Confirm Password" />
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

              <div class="col-12">
                <select v-model="form.country_id" @change="updateDialCode" class="form-select" required>
                  <option disabled value="">Select Country</option>
                  <option v-for="country in countries" :key="country.id" :value="country.id">
                    {{ country.name }}
                  </option>
                </select>
              </div>

              <div class="col-12 d-grid">
                <button type="submit" class="btn btn-primary">Update Profile</button>
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
import axios from '@/axios'
import { useRouter } from 'vue-router'

const router = useRouter()

// State
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
const selectedLevel = ref('')
const subLevels = ref([])
const dialCode = ref('')
const countries = ref([])

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

const updateSubLevels = () => {
  subLevels.value = levels[selectedLevel.value] || []
  form.value.level_id = ''
}

const updateDialCode = () => {
  const country = countries.value.find(c => c.id === form.value.country_id)
  if (country) {
    dialCode.value = country.dial_code
  }
}

onMounted(async () => {
  try {
    // Load user profile
    const res = await axios.get('/user/profile')
    const user = res.data.userProfile
    form.value = {
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      password: '',
      password_confirmation: '',
      phone: user.phone?.replace(/^\+/, '') || '',
      age: user.user_meta?.age || '',
      country_id: user.user_meta?.country?.id || '',
      level_id: user.user_meta?.level?.id || '',
    }

    // Match level string
    for (const key in levels) {
      if (levels[key].some(lvl => lvl.id === form.value.level_id)) {
        selectedLevel.value = key
        subLevels.value = levels[key]
        break
      }
    }

    // Fetch countries
    const countryRes = await axios.get('/countries')
    countries.value = countryRes.data.countries

    updateDialCode()

  } catch (err) {
    console.error('Error loading profile:', err)
    alert('Failed to load profile data.')
  }
})

const submitForm = async () => {
  try {
    const payload = {
      ...form.value,
      phone: `${dialCode.value}${form.value.phone}`,
    }

    await axios.put('/profile', payload)

    alert('Profile updated successfully!')
    router.push('/profile') // Redirect to profile view or wherever needed

  } catch (err) {
    console.error('Profile update failed:', err)
    alert('Failed to update profile.')
  }
}
</script>
