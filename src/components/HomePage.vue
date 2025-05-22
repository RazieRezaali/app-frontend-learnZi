<template>
  <div class="category-view container py-5">
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb" class="mb-4">
      <ol class="breadcrumb bg-light px-3 py-2 rounded shadow-sm">
        <li class="breadcrumb-item" v-if="breadcrumbs.length === 0">
          <span class="text-primary fw-bold">Main Page</span>
        </li>
        <li v-else class="breadcrumb-item">
          <a href="#" @click.prevent="fetchRootCategories" class="text-decoration-none">Main Page</a>
        </li>
        <li
          v-for="(crumb, index) in breadcrumbs"
          :key="crumb.id"
          :class="['breadcrumb-item', { active: index === breadcrumbs.length - 1 }]"
          :aria-current="index === breadcrumbs.length - 1 ? 'page' : null"
        >
          <span v-if="index === breadcrumbs.length - 1" class="fw-semibold">{{ crumb.name }}</span>
          <a
            v-else
            href="#"
            class="text-decoration-none"
            @click.prevent="goToBreadcrumb(index)"
          >
            {{ crumb.name }}
          </a>
        </li>
      </ol>
    </nav>

    <!-- Categories Grid -->
    <div class="row row-cols-2 row-cols-md-4 g-4 mb-5">
      <div class="col" v-for="category in categories" :key="category.id">
        <div
          class="card h-100 border-0 shadow-sm hover-border-primary cursor-pointer"
          @click="enterCategory(category)"
        >
          <div class="card-body text-center">
            <i class="bi bi-folder-fill fs-3 text-primary mb-2"></i>
            <h6 class="fw-semibold text-dark">{{ category.name }}</h6>
          </div>
        </div>
      </div>
    </div>

    <!-- Cards Grid -->
    <div class="row row-cols-1 row-cols-md-3 g-4">
      <div class="col" v-for="card in cards" :key="card.id">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body text-center d-flex flex-column justify-content-center">
            <div v-if="card.character">
              <div class="fs-1 fw-bold text-primary mb-1">{{ card.character.character }}</div>
              <div class="text-muted fst-italic mb-3">{{ card.character.pinyin }}</div>
              <router-link
                :to="{ name: 'CardDetails', params: { cardId: card.id } }"
                class="btn btn-sm btn-outline-primary"
              >
                View Details
              </router-link>
            </div>
            <div v-else>
              <p class="text-muted fst-italic">No character data available.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { auth } from '@/stores/auth'

const categories = ref([])
const cards = ref([])
const breadcrumbs = ref([])

onMounted(async () => {
  await fetchRootCategories()
})

const fetchRootCategories = async () => {
  const userId = auth.user?.id
  if (!userId) {
    console.warn('User not logged in.')
    categories.value = []
    cards.value = []
    breadcrumbs.value = []
    return
  }

  try {
    const res = await axios.get(`http://localhost:8000/api/root-categories/${userId}`)
    categories.value = res.data
    cards.value = []
    breadcrumbs.value = []
  } catch (error) {
    console.error('Failed to fetch root categories:', error)
  }
}

const enterCategory = async (category) => {
  const res = await axios.get(`http://localhost:8000/api/cards-and-categories/${category.id}`)
  categories.value = res.data.categoryChildren
  cards.value = res.data.cards
  breadcrumbs.value.push({ id: category.id, name: category.name })
}

const goToBreadcrumb = async (index) => {
  const breadcrumb = breadcrumbs.value[index]
  breadcrumbs.value = breadcrumbs.value.slice(0, index + 1)

  const res = await axios.get(`http://localhost:8000/api/cards-and-categories/${breadcrumb.id}`)
  categories.value = res.data.categoryChildren
  cards.value = res.data.cards
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.hover-border-primary:hover {
  border: 0.7px solid #0d6efd !important;
  transition: border-color 0.05s;
}
</style>