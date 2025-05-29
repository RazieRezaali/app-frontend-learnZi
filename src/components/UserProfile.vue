<template>
  <div class="container py-5">
    <div class="card shadow-lg border-0 rounded-4">
      <div class="card-body p-5">
        <h2 class="card-title mb-5 text-center text-primary">
          <i class="bi bi-person-circle me-2"></i>User Profile
        </h2>

        <div v-if="loading" class="text-center my-5">
          <div class="spinner-border text-primary"></div>
        </div>

        <div v-else-if="error" class="alert alert-danger text-center">
          {{ error }}
        </div>

        <div v-else>
          <!-- Personal Info -->
          <div class="row g-4 mb-4">
            <div class="col-md-6">
              <div class="d-flex align-items-start">
                <i class="bi bi-person-fill fs-4 text-secondary me-3"></i>
                <div>
                  <h6 class="mb-1">Full Name</h6>
                  <p class="mb-0">{{ user.fname }} {{ user.lname }}</p>
                </div>
              </div>

              <div class="d-flex align-items-start mt-4">
                <i class="bi bi-envelope-fill fs-4 text-secondary me-3"></i>
                <div>
                  <h6 class="mb-1">Email</h6>
                  <p class="mb-0">{{ user.email }}</p>
                </div>
              </div>

              <div class="d-flex align-items-start mt-4">
                <i class="bi bi-telephone-fill fs-4 text-secondary me-3"></i>
                <div>
                  <h6 class="mb-1">Phone</h6>
                  <p class="mb-0">{{ user.phone || 'N/A' }}</p>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="d-flex align-items-start">
                <i class="bi bi-geo-alt-fill fs-4 text-info me-3"></i>
                <div>
                  <h6 class="mb-1">Country</h6>
                  <p class="mb-0">{{ user.user_meta?.country?.name || 'N/A' }}</p>
                </div>
              </div>

              <div class="d-flex align-items-start mt-4">
                <i class="bi bi-cake-fill fs-4 text-warning me-3"></i>
                <div>
                  <h6 class="mb-1">Age</h6>
                  <p class="mb-0">{{ user.user_meta?.age || 'N/A' }}</p>
                </div>
              </div>
            </div>
          </div>

          <hr />

          <!-- Language Level Info -->
          <div class="mt-4">
            <h5 class="mb-3 text-center text-dark">📘 Language Proficiency</h5>
            <div class="row row-cols-1 row-cols-md-2 g-3">
              <div class="col">
                <div class="card border-0 shadow-sm bg-light rounded-3">
                  <div class="card-body d-flex align-items-center">
                    <i class="bi bi-award fs-3 text-success me-3"></i>
                    <div>
                      <h6 class="mb-1">Level</h6>
                      <p class="mb-0">{{ user.user_meta?.level?.name || 'N/A' }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col">
                <div class="card border-0 shadow-sm bg-light rounded-3">
                  <div class="card-body d-flex align-items-center">
                    <i class="bi bi-globe fs-3 text-primary me-3"></i>
                    <div>
                      <h6 class="mb-1">HSK</h6>
                      <p class="mb-0">{{ user.user_meta?.level?.HSK || 'N/A' }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col">
                <div class="card border-0 shadow-sm bg-light rounded-3">
                  <div class="card-body d-flex align-items-center">
                    <i class="bi bi-translate fs-3 text-info me-3"></i>
                    <div>
                      <h6 class="mb-1">CEFR</h6>
                      <p class="mb-0">{{ user.user_meta?.level?.CEFR || 'N/A' }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col">
                <div class="card border-0 shadow-sm bg-light rounded-3">
                  <div class="card-body d-flex align-items-center">
                    <i class="bi bi-lightbulb fs-3 text-warning me-3"></i>
                    <div>
                      <h6 class="mb-1">Vocabulary</h6>
                      <p class="mb-0">{{ user.user_meta?.level?.vocabulary || 'N/A' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from '@/axios';

const user = ref(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const res = await axios.get(`/user/profile`);
    user.value = res.data.userProfile
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load profile.'
  } finally {
    loading.value = false
  }
});
</script>
