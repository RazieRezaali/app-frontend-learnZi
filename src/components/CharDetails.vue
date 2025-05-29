<template>
  <char-info v-if="characterId" :characterId="characterId"></char-info>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const characterId = computed(() => route.params.characterId)
</script>
