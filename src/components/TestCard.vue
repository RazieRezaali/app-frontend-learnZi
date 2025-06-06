<template>
  <div class="test-container">
    <!-- Top Section -->
    <div class="top-bar">
      <div class="score">Score: {{ score }} / {{ characters.length }}</div>
      <div class="category-select">
        <label>Category:</label>
        <select v-model="selectedCategory" @change="loadCharacters">
          <option disabled value="">-- Select Category --</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="currentCard" class="content-area">
      <!-- Canvas Area -->
      <div class="canvas-area">
        <TestocrCharacter ref="TestocrCharacter" />
      </div>

      <!-- Right Side -->
      <div class="interaction-area">
        <div class="character-display">
          <small>Draw this character</small>
          <div class="char-text">{{ currentCard.character.character }}</div>
        </div>

        <div class="input-group">
          <label>Pinyin</label>
          <input type="text" v-model="typedPinyin" placeholder="e.g. nihao" />
        </div>

        <button @click="submitAnswer" class="submit-btn">Next</button>

        <div v-if="examCompleted" class="completion-msg">
          🎉 Exam Finished! <br />
          <strong>Final Score: {{ score }} / {{ characters.length }}</strong>
        </div>
      </div>
    </div>

    <div v-if="noCharacters" class="no-char-msg">
      🚫 No character is available for the selected category.
    </div>
  </div>
</template>

<script>
import TestocrCharacter from './TestocrCharacter.vue'
import { useToast } from 'vue-toastification'
import axios from '@/axios'

export default {
  components: { TestocrCharacter },
  data() {
    return {
      categories: [],
      selectedCategory: null,
      characters: [],
      currentIndex: 0,
      score: 0,
      userOcrChar: "",
      typedPinyin: "",
      examCompleted: false,
      noCharacters: false,
    }
  },
  computed: {
    currentCard() {
      return this.characters[this.currentIndex] || null
    }
  },
  mounted() {
    this.fetchCategories()
  },
  methods: {
    async fetchCategories() {
      try {
        const res = await axios.get('/categories')
        this.categories = res.data.categories
      } catch (err) {
        console.error('Failed to fetch categories:', err)
      }
    },
    async loadCharacters() {
      try {
        const res = await axios.get(`/categories/quiz/${this.selectedCategory}`)
        this.characters = res.data.cards
        this.currentIndex = 0
        this.score = 0
        this.examCompleted = false
        this.noCharacters = this.characters.length === 0
      } catch (err) {
        console.error('Failed to load characters:', err)
      }
    },
    handleOcrResult(char) {
      this.userOcrChar = char
    },
    async submitAnswer() {
      if (!this.currentCard) return

      const toast = useToast()

      try {
        const recognizedChar = await this.$refs.TestocrCharacter.sendImageAndGetChar()
        const expectedChar = this.currentCard.character.character
        const expectedPinyin = this.currentCard.character.pinyin.toLowerCase().replace(/\d/g, "")
        const typed = this.typedPinyin.toLowerCase().replace(/\d/g, "")

        const isCorrect = recognizedChar === expectedChar && typed === expectedPinyin

        if (isCorrect) {
          this.score++
          toast.success("✅ Correct!")
        } else {
          toast.error(`❌ Incorrect! Expected: ${expectedChar} (${expectedPinyin})`)
        }

        this.typedPinyin = ""
        this.$refs.TestocrCharacter.clearCanvas()

        if (this.currentIndex + 1 < this.characters.length) {
          this.currentIndex++
        } else {
          this.examCompleted = true
        }

      } catch (err) {
        console.error("Error during answer submission:", err)
        toast.error("⚠️ Failed to submit answer. Please try again.")
      }
    }
  }
}
</script>

<style scoped>
.test-container {
  padding: 2rem;
  /* min-height: 100vh; */
  font-family: 'Segoe UI', sans-serif;
  background-color: #f9fafb;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.top-bar {
  width: 100%;
  max-width: 800px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.score {
  font-size: 1.1rem;
  font-weight: 500;
  color: #0d6efd;
}

.category-select {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-select select {
  padding: 0.4rem 0.6rem;
  font-size: 0.9rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: white;
}

.content-area {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  width: 100%;
  max-width: 900px;
}

.canvas-area {
  flex: 1;
  min-width: 260px;
  max-width: 300px;
  display: flex;
  justify-content: center;
}

.interaction-area {
  flex: 1;
  min-width: 250px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.character-display {
  text-align: center;
}

.character-display small {
  font-size: 0.8rem;
  color: #888;
}

.char-text {
  font-size: 2.5rem;
  font-weight: 600;
  margin-top: 0.3rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.input-group input {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.submit-btn {
  background-color: #198754;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #157347;
}

.completion-msg {
  background: #e6f3ff;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-size: 0.95rem;
}

.no-char-msg {
  text-align: center;
  background-color: #fff3cd;
  padding: 1rem;
  border-radius: 8px;
  color: #856404;
  font-size: 0.9rem;
}
</style>