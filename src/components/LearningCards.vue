<template>
  <div class="category-view container py-5">
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

    <div class="fab-container" v-if="breadcrumbs.length > 0">
      <div v-if="fabOpen" class="fab-options">
        <button class="fab-option bg-danger" @click="onDeleteClick">
          <i class="bi bi-trash"></i>
        </button>
        <button class="fab-option bg-warning text-dark" @click="onRenameClick">
          <i class="bi bi-pencil"></i>
        </button>
      </div>
      <button class="fab-main" @click="fabOpen = !fabOpen">
        <i :class="fabOpen ? 'bi bi-x' : 'bi bi-plus'"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios';
import { auth } from '@/stores/auth'
import { useToast } from "vue-toastification";

const toast = useToast()

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
    const res = await axios.get(`/categories/root`);
    categories.value = res.data.categories
    cards.value = []
    breadcrumbs.value = []
  } catch (error) {
    console.error('Failed to fetch root categories:', error)
  }
}

const enterCategory = async (category) => {
  const res = await axios.get(`/categories/cards/${category.id}`);
  categories.value = res.data.categoryChildren
  cards.value = res.data.cards
  breadcrumbs.value.push({ id: category.id, name: category.name })
}

const goToBreadcrumb = async (index) => {
  const breadcrumb = breadcrumbs.value[index]
  breadcrumbs.value = breadcrumbs.value.slice(0, index + 1)

  const res = await axios.get(`/categories/cards/${breadcrumb.id}`);
  categories.value = res.data.categoryChildren
  cards.value = res.data.cards
}

const fabOpen = ref(false)

const onDeleteClick = async () => {
  const currentCategory = breadcrumbs.value[breadcrumbs.value.length - 1]
  const confirmed = confirm(`Are you sure you want to delete "${currentCategory.name}"? This action cannot be undone.`)
  if (!confirmed) return
  try {
    await axios.delete(`/categories/${currentCategory.id}`, {
      data: {
        categoryId: currentCategory.id
      }
    })
    breadcrumbs.value.pop()
    if (breadcrumbs.value.length > 0) {
      await goToBreadcrumb(breadcrumbs.value.length - 1)
    } else {
      await fetchRootCategories()
    }
    toast.success('Category deleted successfully!')
  } catch (error) {
    console.error('Delete failed:', error)
    toast.error(error.response?.data?.message || 'Something went wrong')
  }
}

const onRenameClick = async () => {
  const currentCategory = breadcrumbs.value[breadcrumbs.value.length - 1]
  const newName = prompt("Enter new category name:", currentCategory.name)
  if (!newName || newName.trim() === '') return
  try {
    await axios.put(`/categories/${currentCategory.id}`, {
      name: newName,
      categoryId: currentCategory.id,
    })
    currentCategory.name = newName
    toast.success('Category renamed successfully!')
  } catch (error) {
    console.error('Rename failed:', error)
    toast.error(error.response?.data?.message || 'Something went wrong')
  }
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

.fab-container {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.fab-main {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #0d6efd;
  color: white;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.fab-options {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  gap: 10px;
}

.fab-option {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  color: white;
  font-size: 18px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

</style>