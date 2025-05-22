import { reactive } from 'vue'

export const auth = reactive({
  isAuthenticated: !!localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user')) || null,

  login(token, user) {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    this.isAuthenticated = true
    this.user = user
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    this.isAuthenticated = false
    this.user = null
  }
})
