<template>
  <div class="details-page container my-4">
    <char-info
      v-if="characterId"
      :characterId="characterId"
      @character-loaded="onCharacterLoaded"
    />

    <!-- Add to Cards Button -->
    <div v-if="character" class="text-center mt-4">
      <button class="btn btn-success px-4 py-2" @click="showModal = true">
        ➕ Add to Cards
      </button>
    </div>

    <CategoryModal
      v-if="showModal"
      :character="character"
      @close="showModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import CharInfo from '@/components/CharInfo.vue'
import CategoryModal from '@/components/CategoryModal.vue'

const route = useRoute()
const characterId = computed(() => route.params.characterId)

const character = ref(null)
const showModal = ref(false)

function onCharacterLoaded(charData) {
  character.value = charData
}
</script>
