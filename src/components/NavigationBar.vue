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
              Home
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
              <router-link to="/learning" class="nav-link">
                Learning
              </router-link>
            </li>
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
              <button class="nav-link btn btn-link px-0" type="button" @click="showLogoutModal">
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
  <div class="modal fade" id="logoutModal" tabindex="-1" aria-labelledby="logoutModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-4 shadow border-0">
        <div class="modal-header">
          <h5 class="modal-title text-danger" id="logoutModalLabel">
            <i class="bi bi-box-arrow-right me-2"></i> Confirm Logout
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body text-center text-muted">
          Are you sure you want to log out?
        </div>
        <div class="modal-footer justify-content-center border-0">
          <button type="button" class="btn btn-outline-secondary rounded-pill px-4" data-bs-dismiss="modal">
            Cancel
          </button>
          <button type="button" class="btn btn-danger rounded-pill px-4" @click="confirmLogout">
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from '@/stores/auth'
import { Modal } from 'bootstrap'

export default {
  name: 'NavigationBar',
  setup() {
    return { auth }
  },
  methods: {
    showLogoutModal() {
      const modalElement = document.getElementById('logoutModal')
      const modalInstance = Modal.getOrCreateInstance(modalElement)
      modalInstance.show()
    },
    confirmLogout() {
      this.$axios.post('/user/logout')
        .catch(err => {
          console.warn('Failed to logout:', err)
        })
        .finally(() => {
          auth.logout()
          this.$router.push('/login')
        })

      // Hide modal
      const modalElement = document.getElementById('logoutModal')
      const modalInstance = Modal.getInstance(modalElement)
      if (modalInstance) modalInstance.hide()
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

.modal-content {
  transition: all 0.3s ease;
}
</style>