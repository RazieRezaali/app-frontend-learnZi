<template>
  <div class="similar-container">
    <h2>Similar Characters</h2>
    <ul class="char-list">
      <li
        v-for="char in similarCharacters"
        :key="char"
        class="char-item"
        @click="selectChar(char)"
      >
        {{ char }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import hanzi from "hanzi";
import axios from '@/axios';

export default {
  props: {
    character: String,
  },
  setup(props) {
    const similarCharacters = ref([]);
    onMounted(() => {
      hanzi.start();
    });
    watch(
      () => props.character,
      (newChar) => {
        if (newChar) {
          similarCharacters.value = findSimilarCharacters(newChar);
        } else {
          similarCharacters.value = [];
        }
      }
    );

    function findSimilarCharacters(character) {
      const decomposition = hanzi.decompose(character);
      const components = new Set([
        ...(decomposition.components1 || []),
        ...(decomposition.components2 || []),
        ...(decomposition.components3 || []),
      ]);
      const candidateCharacters = new Set();
      components.forEach((component) => {
        const relatedChars = hanzi.getCharactersWithComponent(component);
        if (Array.isArray(relatedChars)) {
          relatedChars.forEach((char) => candidateCharacters.add(char));
        }
      });

      candidateCharacters.delete(character);
      function calculateSimilarity(char, targetComponents) {
        const charDecomposition = hanzi.decompose(char);
        const charComponents = new Set([
          ...(charDecomposition.components1 || []),
          ...(charDecomposition.components2 || []),
          ...(charDecomposition.components3 || []),
        ]);

        const sharedComponents = [...charComponents].filter((comp) =>
          targetComponents.has(comp)
        );

        const commonRadicals = new Set([
          "一",
          "丨",
          "丶",
          "丿",
          "乙",
          "亠",
          "冂",
          "冖",
          "冫",
          "刂",
          "匕",
          "卩",
        ]);
        const uniqueSharedComponents = sharedComponents.filter(
          (comp) => !commonRadicals.has(comp)
        );

        const hasSamePrimaryRadical =
          sharedComponents.length > 0 &&
          sharedComponents[0] === [...targetComponents][0];

        let score = sharedComponents.length * 2 + uniqueSharedComponents.length * 3;
        if (hasSamePrimaryRadical) score += 3;

        return score;
      }

      const topSimilarChars = [...candidateCharacters]
        .map((char) => ({
          character: char,
          similarity: calculateSimilarity(char, components),
        }))
        .filter((result) => result.similarity > 0)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 9)
        .map((result) => result.character);

      return [character, ...topSimilarChars];
    }

    return {
      similarCharacters,
    };
  },
  methods:{
    async selectChar(char){
        const response = await axios.get(`/characters/id/${char}`);
        const characterId = response.data.characterId;
        this.$router.push({ name: 'CharDetails', params: { characterId } });
    }
  }
};
</script>

<style scoped>
.similar-container {
  padding: 1rem;
  border: 2px solid #eee;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  text-align: center;
  background: #fff;
  max-height: 450px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.char-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0 0;
  overflow-y: auto;
  flex-grow: 1;
  max-height: 400px;
  scroll-behavior: smooth;
}

.char-item {
  background-color: #f3f4f6;
  margin: 0.5rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.char-item:hover {
  background-color: #d1d5db;
  transform: translateY(-1px);
}
</style>
