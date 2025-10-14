<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      type: 0,
      text:''
    })
  }
});
</script>

<template>
  <div style="
  width: 100%;word-break: break-all;
    word-wrap: break-word;
    white-space: normal;
  ">
    {{data.text}}
  </div>
</template>

<style scoped>

</style>