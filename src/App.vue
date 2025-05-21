<script setup lang="ts">
import { AgGridVue } from "ag-grid-vue3"
import type { ColDef } from "ag-grid-community"

import ActionButton from '@/components/TreeTable/ActionButton.vue'

import { ref, computed, watch } from 'vue'
import { TreeStore } from "@/models/TreeStore.ts"
import type { ITreeItem } from "@/types/ITreeStore.ts"
import {HistoryChanges} from "@/models/HistoryChanges.ts";
import type {IHistoryChange} from "@/types/IHistoryChanges.ts";


const data: ITreeItem[] = [
  { id: 1, parent: null, label: 'Айтем 1' },
  { id: '2', parent: 1, label: 'Айтем 2' },
  { id: 3, parent: 1, label: 'Айтем 3' },
  { id: 4, parent: '2', label: 'Айтем 4' },
  { id: 5, parent: '2', label: 'Айтем 5' },
  { id: 6, parent: '2', label: 'Айтем 6' },
  { id: 7, parent: 4, label: 'Айтем 7' },
  { id: 8, parent: 4, label: 'Айтем 8' }
]

const dataTable = ref(new TreeStore(data))
const isEdited = ref(false)

const maxLengthHistory = 5
const historyChanges = ref(new HistoryChanges(maxLengthHistory))
const currentItemIndex = ref(0)
addHistoryChanges()

const getCategory = (params: ITreeItem) => {
  return dataTable.value.getChildren(params.id).length ? 'Группа' : 'Элемент'
}

const cols = computed(() => {
  return [
    { headerName: "№ п/п", valueGetter: (params: any) => params.node.rowIndex + 1, width: 80 },
    { field: "label", headerName: "Наименование", editable: isEdited.value }
  ]
})

const autoGroupColumnDefForEdit = ref<ColDef>({
  headerName: "Категория",
  minWidth: 350,

  cellRendererParams: (params: any) => ({
    innerRenderer: ActionButton,

    id: params.data?.id,
    label: params?.data ? getCategory(params.node.data) : '',
    onAdd: () => addItem(params.data?.id || null),
    onRemove: () => removeItem(params.data.id),

    suppressCount: true
  }),
})

const autoGroupColumnDefForView = ref<ColDef>({
  headerName: "Категория",
  minWidth: 350,
  valueGetter: (params: any) => params?.data ? getCategory(params.node.data) : '',
  cellRendererParams: { suppressCount: true }
})

const autoGroupColumnDef: ColDef = computed(() => {
  return isEdited.value ? autoGroupColumnDefForEdit.value : autoGroupColumnDefForView.value
})

const defaultColDef = ref({
  flex: 1,
  minWidth: 150,
  resizable: true,
})

const path = (data: ITreeItem) => {
  return data.parent ? dataTable.value.getAllParents(data.id).map(i => i.id).reverse() : [data.id]
}

const addItem = (id: number | string | null) => {
  const newItem: ITreeItem = { id: Date.now(), parent: id, label: 'Новый Айтем' }
  dataTable.value.addItem(newItem)
  addHistoryChanges()
}

const removeItem = (id: number | string) => {
  dataTable.value.removeItem(id)
  addHistoryChanges()
}

const editItem = (data: any) => {
  dataTable.value.updateItem(data.data)
  addHistoryChanges()
}

function addHistoryChanges() {
  const change: IHistoryChange = { id: null, items: [ ...dataTable.value.getAll()], isCurrent: true }
  historyChanges.value.add(change)
  currentItemIndex.value = historyChanges.value.findCurrentItemIndex()
}

const moveForward = () => {
  const data = historyChanges.value.moveForward()
  data !== null && dataTable.value.setItems(data)
  currentItemIndex.value = historyChanges.value.findCurrentItemIndex()
}

const moveBackward = () => {
  const data = historyChanges.value.moveBackward()
  data !== null && dataTable.value.setItems(data)
  currentItemIndex.value = historyChanges.value.findCurrentItemIndex()
}
</script>

<template>
  <div style="display: flex; align-items: center; margin-bottom: 8px">
    <span style="color: #005eff">Режим: {{ isEdited ? 'редактирование' : 'просмотр' }}</span>

    <button class="mode-btn" @click="isEdited = !isEdited">{{ isEdited ? '👁' : '✎' }}</button>

    <div v-if="isEdited" class="move-btn" style="margin-left: 18px">
      <button
        :disabled="currentItemIndex >= historyChanges.getCurrentLength()-1"
        @click="moveBackward">&#8630;
      </button>
      <button
        :disabled="currentItemIndex === 0 || historyChanges.getCurrentLength() < 2"
        @click="moveForward">&#8631;
      </button>
    </div>
  </div>

  <ag-grid-vue
    :columnDefs="cols"
    :rowData="dataTable.getAll()"
    :defaultColDef="defaultColDef"
    :autoGroupColumnDef="autoGroupColumnDef"
    :groupDefaultExpanded="-1"
    :suppressRowClickSelection="true"
    :treeData="true"
    :getDataPath="(data) => path(data)"
    style="height: 700px"
    @cellValueChanged="(data) => editItem(data)"
  />
</template>

<style scoped>
.mode-btn {
  border: none;
  background-color: transparent;
  margin-left: 4px;
  cursor: pointer;
  font-size: 18px;
}

.move-btn button {
  border: none;
  background-color: transparent;
  color: #005eff;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
}

.move-btn button[disabled] {
  color: #a2a2a2;
  cursor: auto;
}
</style>
