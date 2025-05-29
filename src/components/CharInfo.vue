<template>
  <div class="details-page container">
    <h1 class="details-title">📖 Character Details</h1>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="character" class="card shadow-sm p-4 bg-white border-0">
      <div class="row g-4 align-items-start">
        <div class="col-lg-4 d-flex flex-column align-items-center">
          <stroke-order :character="character.character" />
          <character-audio :character="character.character" />
        </div>

        <div class="col-lg-4">
          <div class="d-flex flex-column h-100">
            <div>
              <span class="badge bg-primary bg-opacity-10 text-primary fs-6 px-2 py-1 mb-2">
                {{ character.pinyin }}
              </span>
              <h3 class="mb-2">{{ character.character }}</h3>
              <div class="card bg-light bg-opacity-50 border-0 p-2 mb-2">
                <h6 class="text-muted mb-1">Definition</h6>
                <p class="mb-0">{{ character.definition }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="row row-cols-2 g-3">
            <div class="col" v-if="character.stroke_count">
              <div class="p-6 border rounded shadow-sm d-flex flex-column align-items-center bg-light">
                <i class="bi bi-pencil-fill text-primary fs-4 mb-1"></i>
                <div class="fw-semibold">Strokes</div>
                <div>{{ character.stroke_count }}</div>
              </div>
            </div>
            <div class="col" v-if="character.radical">
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

<script>
import axios from '@/axios'
import StrokeOrder from '@/components/StrokeOrder.vue'
import CharacterAudio from '@/components/CharacterAudio.vue'

export default {
  components: {
    StrokeOrder,
    CharacterAudio
  },
  props: ['characterId'],
  data() {
    return {
      character: null,
      loading: true
    }
  },
  mounted() {
    this.fetchCharacter()
  },
  methods: {
    async fetchCharacter() {
      if (!this.characterId) return
      this.loading = true
      try {
        const response = await axios.get(`/characters/${this.characterId}`)
        this.character = response.data.character
      } catch (error) {
        console.error('Failed to fetch character:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
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
