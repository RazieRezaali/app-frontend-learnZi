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

export default {
  props: {
    character: String,
  },
  setup(props) {
    const similarCharacters = ref([]);

    // Start hanzi library
    onMounted(() => {
      hanzi.start();
    });

    // Watch for changes in the input character
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
      // Decompose the character
      const decomposition = hanzi.decompose(character);
      const components = new Set([
        ...(decomposition.components1 || []),
        ...(decomposition.components2 || []),
        ...(decomposition.components3 || []),
      ]);

      // Load all standard characters (replace with actual dataset if needed)
    //   const allCharacters = require("@/assets/characters.json"); // Ensure the file exists

      // Find characters that share components
      const candidateCharacters = new Set();
      components.forEach((component) => {
        const relatedChars = hanzi.getCharactersWithComponent(component);
        if (Array.isArray(relatedChars)) {
          relatedChars.forEach((char) => candidateCharacters.add(char));
        }
      });

      candidateCharacters.delete(character); // Remove the input character itself

      // Function to calculate similarity score
      function calculateSimilarity(char, targetComponents) {
        const charDecomposition = hanzi.decompose(char);
        const charComponents = new Set([
          ...(charDecomposition.components1 || []),
          ...(charDecomposition.components2 || []),
          ...(charDecomposition.components3 || []),
        ]);

        // Count shared components
        const sharedComponents = [...charComponents].filter((comp) =>
          targetComponents.has(comp)
        );

        // Define common radicals (less important for similarity)
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

        // Check if primary radical is the same
        const hasSamePrimaryRadical =
          sharedComponents.length > 0 &&
          sharedComponents[0] === [...targetComponents][0];

        // Compute similarity score
        let score = sharedComponents.length * 2 + uniqueSharedComponents.length * 3;
        if (hasSamePrimaryRadical) score += 3;

        return score;
      }

      // Rank similar characters
      const topSimilarChars = [...candidateCharacters]
        .map((char) => ({
          character: char,
          similarity: calculateSimilarity(char, components),
        }))
        .filter((result) => result.similarity > 0) // Remove zero similarity characters
        .sort((a, b) => b.similarity - a.similarity) // Sort by similarity
        .slice(0, 9) // Get top 9 similar characters
        .map((result) => result.character);

      return [character, ...topSimilarChars];
    }

    return {
      similarCharacters,
    };
  },
  methods:{
    selectChar(char){
      console.log(char);
      // this.$emit('selected-character',char)
      this.$router.push({ name: 'CharacterDetails', params: { char } });
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
  max-height: 450px; /* total box height */
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
