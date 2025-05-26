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
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  background: #f9fafb;
}
</style>
