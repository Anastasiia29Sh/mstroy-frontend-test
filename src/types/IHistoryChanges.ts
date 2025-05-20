import type { ITreeItem } from '@/types/ITreeStore.ts'

export interface IHistoryChange {
  id: number | null,
  items: ITreeItem[],
  isCurrent: boolean
}
