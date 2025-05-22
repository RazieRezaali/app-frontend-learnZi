<template>
  <navigation-bar></navigation-bar>
 <router-view></router-view>
</template>

<script>
export default{
  data(){
    return{
      result: '',
      selectedChar: ''
    }
  },
  methods:{
    ocrResult(ocrResult){
      this.result = ocrResult;
    },
    setSelectedCharacter(char){
      this.selectedChar = char;
    }
  }
}
</script>

<style>

</style>
