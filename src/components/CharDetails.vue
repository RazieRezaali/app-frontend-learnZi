<template>
  <div class="details-page container">
    <h1 class="details-title">📖 Character Details</h1>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="character" class="card shadow-sm p-4 bg-white border-0">
      <div class="row g-4 align-items-start">
        <!-- Left Column: Stroke + Audio -->
        <div class="col-lg-4 d-flex flex-column align-items-center">
          <stroke-order :character="character.character" />
        </div>

        <!-- Center Column: Character + Info -->
        <div class="col-lg-4 text-center text-lg-start d-flex align-items-center flex-column align-items-center ">
          <span class="badge bg-secondary fs-6 px-3 py-2 mb-3">
            Pinyin: {{ character.pinyin }}
          </span>
          <div class="definition-box card p-3 shadow-sm border-0 bg-light w-100">
            <h5 class="mb-1 text-muted">Definition</h5>
            <p class="mb-0">{{ character.definition }}</p>
          </div>
          <character-audio :character="character.character" class="mt-3" />
        </div>

        <!-- Right Column: Metadata Cards -->
        <div class="col-lg-4">
          <div class="row row-cols-2 g-3">
            <div class="col">
              <div class="p-6 border rounded shadow-sm d-flex flex-column align-items-center bg-light">
                <i class="bi bi-pencil-fill text-primary fs-4 mb-1"></i>
                <div class="fw-semibold">Strokes</div>
                <div>{{ character.stroke_count }}</div>
              </div>
            </div>
            <div class="col">
              <div class="p-6 border rounded shadow-sm d-flex flex-column align-items-center bg-warning bg-opacity-10">
                <i class="bi bi-boxes text-warning fs-4 mb-1"></i>
                <div class="fw-semibold">Radical</div>
                <div>{{ character.radical }}</div>
              </div>
            </div>
            <div class="col">
              <div class="p-6 border rounded shadow-sm d-flex flex-column align-items-center bg-success bg-opacity-10">
                <i class="bi bi-graph-up-arrow text-success fs-4 mb-1"></i>
                <div class="fw-semibold">HSK Level</div>
                <div>{{ character.hsk_level || 'N/A' }}</div>
              </div>
            </div>
            <div class="col">
              <div class="p-6 border rounded shadow-sm d-flex flex-column align-items-center bg-info bg-opacity-10">
                <i class="bi bi-bar-chart-line text-info fs-4 mb-1"></i>
                <div class="fw-semibold">Frequency Rank</div>
                <div>{{ character.frequency_rank || 'N/A' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/axios';

// External component placeholders
import StrokeOrder from '@/components/StrokeOrder.vue'
import CharacterAudio from '@/components/CharacterAudio.vue'

const route = useRoute()
const character = ref(null)
const loading = ref(true)

const fetchCharacter = async () => {
  loading.value = true
  try {
    const res = await axios.get(`/characters/${route.params.characterId}`);
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
  background-color: #f9fafb;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.details-title {
  font-size: 2rem;
  font-weight: 600;
  color: #212529;
  margin-bottom: 2rem;
  text-align: center;
}

.character-display {
  font-size: 3rem;
  font-weight: 700;
  color: #212529;
}

.definition-box {
  background-color: #f1f3f5;
  border-radius: 0.5rem;
}

@media (max-width: 767.98px) {
  .character-display {
    font-size: 2.5rem;
  }

  .definition-box {
    text-align: center;
  }
}
</style>
