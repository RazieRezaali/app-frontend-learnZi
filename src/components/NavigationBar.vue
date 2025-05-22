<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm sticky-top">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand text-danger fw-bold">
        <i class="bi bi-lightning-charge-fill me-1"></i> LearnZiApp
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-center">
          <li class="nav-item">
            <router-link to="/" class="nav-link">
              <i class="bi bi-house-door me-1"></i>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/draw" class="nav-link">
              Draw
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/characters" class="nav-link">
              Characters
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/scan" class="nav-link">
              Scan
            </router-link>
          </li>

          <template v-if="auth.isAuthenticated">
            <li class="nav-item">
              <router-link to="/test" class="nav-link">
                Quiz
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/profile" class="nav-link">
                <i class="bi bi-person-circle me-1 text-primary"></i>
              </router-link>
            </li>
            <li class="nav-item">
              <button @click="logout" class="nav-link btn btn-link px-0">
                <i class="bi bi-box-arrow-right me-1 text-danger"></i>
              </button>
            </li>
          </template>

          <template v-else>
            <li class="nav-item">
              <router-link to="/login" class="nav-link">
                <i class="bi bi-box-arrow-in-right me-1"></i> Login
              </router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { auth } from '@/stores/auth'

export default {
  name: 'NavigationBar',
  setup() {
    return { auth }
  },
  methods: {
    logout() {
      auth.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.navbar-brand {
  font-size: 1.5rem;
}

.nav-link {
  font-weight: 500;
  transition: color 0.2s ease-in-out, transform 0.2s;
  display: flex;
  align-items: center;
}

.nav-link:hover {
  color: #d32f2f !important;
  transform: translateY(-1px);
}

.btn-link {
  border: none;
  background: none;
  font-weight: 500;
}
</style>