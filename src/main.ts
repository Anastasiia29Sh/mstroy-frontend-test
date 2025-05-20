// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
// ModuleRegistry.registerModules([AllCommunityModule])

import {
  AllCommunityModule,
  ClientSideRowModelModule,
  // ColDef,
  // ColGroupDef,
  // GridApi,
  // GridOptions,
  // GridReadyEvent,
  ModuleRegistry,
  // ValidationModule,
} from 'ag-grid-community'
import { RowGroupingModule, RowGroupingPanelModule, TreeDataModule } from 'ag-grid-enterprise'

ModuleRegistry.registerModules([
  AllCommunityModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  RowGroupingPanelModule,
  TreeDataModule
])

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
