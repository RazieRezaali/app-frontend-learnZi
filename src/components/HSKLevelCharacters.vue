<template>
  <div class="container py-3">
    <!-- Search -->
    <div class="mb-4 text-center">
      <div class="input-group input-group-sm w-100 w-md-75 mx-auto">
        <span class="input-group-text bg-white border-end-0"><i class="bi bi-search"></i></span>
        <input
          v-model="searchKeyword"
          type="text"
          class="form-control border-start-0"
          placeholder="Search by pinyin, character, or radical"
        />
        <button v-if="isSearching" class="btn btn-outline-secondary" @click="clearSearch">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    </div>

    <!-- Title -->
    <h5 class="text-center mb-3 fw-semibold">Browse Characters by HSK Level</h5>

    <!-- HSK Levels -->
    <div class="d-flex flex-wrap justify-content-center gap-1 mb-4">
      <button
        v-for="level in 6"
        :key="level"
        class="btn btn-outline-primary rounded-pill py-1 px-3 btn-sm"
        :class="{ active: selectedLevel === level }"
        @click="fetchCharacters(level)"
      >
        HSK {{ level }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center text-muted mb-3">
      <div class="spinner-border spinner-border-sm text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Characters Grid -->
    <div v-if="characters.length" class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
      <div class="col" v-for="char in characters" :key="char.id">
        <div class="card h-100 shadow-sm border-0 text-center small-card">
          <div class="card-body py-3 px-2">
            <div class="fs-2 fw-bold">{{ char.character }}</div>
            <div class="text-muted fst-italic mb-2 small">{{ char.pinyin }}</div>
            <div class="d-grid gap-1">
              <button class="btn btn-outline-primary btn-sm" @click="goToCharacterDetail(char.id)">
                <i class="bi bi-eye me-1"></i> View
              </button>
              <button class="btn btn-outline-secondary btn-sm" @click="openCategoryModal(char)">
                <i class="bi bi-plus-lg me-1"></i> Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Result -->
    <div
      v-if="!loading && characters.length === 0 && (selectedLevel || isSearching)"
      class="text-center text-muted mt-3 small"
    >
      <i class="bi bi-emoji-frown fs-5 d-block mb-1"></i>
      <p class="mb-0">
        No characters found{{ selectedLevel ? ` for HSK ${selectedLevel}` : ' for your search.' }}
      </p>
    </div>

    <!-- Error -->
    <div v-if="error" class="alert alert-danger text-center mt-3 small">{{ error }}</div>

    <!-- Modal -->
    <CategoryModal
      v-if="showModal"
      :character="selectedCharacter"
      @close="closeModal"
    />
  </div>
</template>

<script>
import CategoryModal from './CategoryModal.vue'
import { debounce } from 'lodash'

export default {
  name: 'HSKLevelCharacters',
  components: {
    CategoryModal
  },
  data() {
    return {
      selectedLevel: null,
      characters: [],
      loading: false,
      error: '',
      showModal: false,
      selectedCharacter: null,
      searchKeyword: '',
      isSearching: false,
    }
  },
  watch: {
    searchKeyword: {
      handler: 'handleSearchInput',
      immediate: false
    }
  },
  methods: {
    handleSearchInput() {
      if (this.searchKeyword.length >= 1) {
        this.debouncedSearch()
      } else if (this.searchKeyword.length === 0) {
        this.clearSearch()
      }
    },
    async searchCharacters() {
      if (!this.searchKeyword.trim()) return;

      this.loading = true;
      this.characters = [];
      this.error = '';
      this.selectedLevel = null;
      this.isSearching = true;

      try {
        const response = await this.$axios.get(`/characters/search`, {
          params: { keyword: this.searchKeyword.trim() }
        });
        this.characters = response.data.characters;
      } catch (err) {
        this.error = 'Failed to search characters.';
      } finally {
        this.loading = false;
      }
    },
    clearSearch() {
      this.searchKeyword = '';
      this.isSearching = false;
      this.characters = [];
      this.error = '';
    },
    async fetchCharacters(level) {
      this.clearSearch()
      this.selectedLevel = level
      this.loading = true
      this.characters = []
      this.error = ''

      try {
        const response = await this.$axios.get(`/characters/level/${level}`)
        this.characters = response.data.characters
      } catch (err) {
        this.error = 'Failed to fetch characters.'
      } finally {
        this.loading = false
      }
    },
    openCategoryModal(char) {
      this.selectedCharacter = char
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
    },
    goToCharacterDetail(characterId) {
      this.$router.push({ name: 'CharDetails', params: { characterId } });
    }
  },
  created() {
    // Debounced version of searchCharacters
    this.debouncedSearch = debounce(this.searchCharacters, 500)
  }
}
</script>

<style scoped>
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-radius: 0.75rem;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.small-card .card-body {
  padding: 0.75rem;
}

.btn.active {
  background-color: #0d6efd !important;
  color: #fff !important;
  border-color: #0d6efd !important;
}

.input-group .form-control:focus {
  box-shadow: none;
  border-color: #0d6efd;
}

input::placeholder {
  color: #adb5bd;
  font-size: 0.875rem;
}
</style>
