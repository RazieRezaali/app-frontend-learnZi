<!-- src/components/AddToCardButton.vue -->
<template>
  <div class="add-button-container">
    <button @click="addToCard" class="add-btn">
      Add to Your Card
    </button>
    <p v-if="success" class="success-msg">Character added to your card!</p>
    <p v-if="error" class="error-msg">{{ error }}</p>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'

export default {
  props: {
    character: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const success = ref(false)
    const error = ref(null)

    const addToCard = async () => {
      success.value = false
      error.value = null

      try {
        const token = localStorage.getItem('token')
        await axios.post('http://localhost:8000/api/add-to-card', {
          character: props.character
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        success.value = true
      } catch (err) {
        error.value = err.response?.data?.message || 'Something went wrong'
      }
    }

    return { success, error, addToCard }
  }
}
</script>

<style scoped>
.add-button-container {
  margin-top: 2rem;
  text-align: center;
}

.add-btn {
  background-color: #e53935;
  color: white;
  padding: 0.8rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.add-btn:hover {
  background-color: #c62828;
}

.success-msg {
  margin-top: 1rem;
  color: green;
  font-weight: 500;
}

.error-msg {
  margin-top: 1rem;
  color: #e53935;
  font-weight: 500;
}
</style>
