<template>
  <div class="details-page container">
    <h1 class="details-title">📖 Character Details</h1>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="character" class="card shadow-sm p-4 mb-4 bg-white border-0">
      <div class="text-center">
        <h2 class="display-4">{{ character.character }}</h2>
        <p class="text-muted fst-italic mb-1">Pinyin: {{ character.pinyin }}</p>
        <p class="lead">Definition: {{ character.definition }}</p>
      </div>

      <hr />

      <div class="row text-center mb-4 g-3">
        <div class="col-md-3">
          <div class="p-3 bg-light border rounded shadow-sm">
            <i class="bi bi-pencil-fill text-primary fs-4"></i>
            <div class="fw-semibold mt-2">Strokes</div>
            <div>{{ character.stroke_count }}</div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="p-3 bg-warning bg-opacity-10 border rounded shadow-sm">
            <i class="bi bi-boxes text-warning fs-4"></i>
            <div class="fw-semibold mt-2">Radical</div>
            <div>{{ character.radical }}</div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="p-3 bg-success bg-opacity-10 border rounded shadow-sm">
            <i class="bi bi-graph-up-arrow text-success fs-4"></i>
            <div class="fw-semibold mt-2">HSK Level</div>
            <div>{{ character.hsk_level || 'N/A' }}</div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="p-3 bg-info bg-opacity-10 border rounded shadow-sm">
            <i class="bi bi-bar-chart-line text-info fs-4"></i>
            <div class="fw-semibold mt-2">Frequency Rank</div>
            <div>{{ character.frequency_rank || 'N/A' }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="character" class="mt-4">
      <stroke-order :character="character.character" class="mb-3" />
      <character-audio :character="character.character" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

// External component placeholders
import StrokeOrder from '@/components/StrokeOrder.vue'
import CharacterAudio from '@/components/CharacterAudio.vue'

const route = useRoute()
const character = ref(null)
const loading = ref(true)

const fetchCharacter = async () => {
  loading.value = true
  try {
    const res = await axios.get(`http://localhost:8000/api/character/${route.params.characterId}`)
    character.value = res.data.character
  } catch (error) {
    console.error('Failed to load character details:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchCharacter)
</script>

<style scoped>
.details-page {
  background-color: #f8f9fa;
  padding-top: 2rem;
  padding-bottom: 4rem;
  min-height: 100vh;
}

.details-title {
  font-size: 2.25rem;
  font-weight: bold;
  color: #212529;
  margin-bottom: 2rem;
  text-align: center;
}
</style>
