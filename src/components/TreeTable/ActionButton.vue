<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  params: {
    type: Object,
    required: true,
  },
})

const { id, label, onAdd, onRemove } = props.params
</script>

<template>
  <div class="content" style="">
    <span>{{ label }}</span>
    <div class="btns">
      <button style="background-color: #005eff; margin-right: 4px" @click="onAdd">+</button>
      <button style="background-color: red" @click="onRemove">x</button>
    </div>
  </div>
</template>

<style>
.content {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
}

.btns button {
  width: 20px;
  height: 20px;
  border-radius: 100%;
  border: none;
  color: white;
  text-align: center;
}

.ag-cell-value, .ag-group-value {
  width: 100%;
  overflow: visible;
}
</style>
