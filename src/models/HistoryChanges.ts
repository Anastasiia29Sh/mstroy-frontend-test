import type { IHistoryChange } from '@/types/IHistoryChanges.ts'
import type {ITreeItem} from "@/types/ITreeStore.ts";

export class HistoryChanges {
  private readonly maxLength: number
  private items: IHistoryChange[]

  constructor(maxLength: number) {
    this.maxLength = maxLength
    this.items = []
  }

  findAll() {
    return this.items
  }

  getCurrentLength() {
    return this.items.length
  }

  add(item: IHistoryChange) {
    const newItem: IHistoryChange = { ...item, id: Date.now() }
    this.items.unshift(newItem)

    this.items.length > this.maxLength && (this.items.pop())

    this.changeCurrentItem(newItem.id)
  }

  changeCurrentItem(id: number | null) {
    this.items = this.items.map(i => {
      return { ...i, isCurrent: i.id === id }
    })
  }

  findCurrentItemIndex(): number {
    return this.items.findIndex(i => i.isCurrent)
  }

  moveForward(): ITreeItem[] | null {
    const index: number = this.findCurrentItemIndex()
    if (index > 0) {
      this.changeCurrentItem(this.items[index-1].id)
      return this.items[index-1].items
    }
    return null
  }

  moveBackward() : ITreeItem[] | null {
    const index = this.findCurrentItemIndex()
    if(index >= 0 && index+1 < this.maxLength) {
      this.changeCurrentItem(this.items[index+1].id)
      return this.items[index+1].items
    }
    return null
  }
}
