import type { ITreeItem } from '@/types/ITreeStore.ts'

export class TreeStore {
  private items: ITreeItem[]

  constructor(items: ITreeItem[]) {
    this.items = items
  }

  setItems(items: ITreeItem[]) {
    this.items = items
  }

  getAll() {
    return this.items
  }

  getItem(id: number | string) {
    return this.items.find(i => i.id === id)
  }

  getChildren(id: number | string) {
    return this.items.filter(i => i.parent === id) || []
  }

  getAllChildren(id: number | string){
    const groupedItemsByParent = new Map<number | string | null, ITreeItem[]>()
    for (const item of this.items) {
      if (!groupedItemsByParent.has(item.parent)) {
        groupedItemsByParent.set(item.parent, [])
      }
      groupedItemsByParent.get(item.parent)?.push(item)
    }

    function allChildren(currentId: number | string): ITreeItem[] {
      const children: ITreeItem[] = []
      for (const child of groupedItemsByParent.get(currentId) || []) {
        children.push(child)
        children.push(...allChildren(child.id))
      }
      return children
    }

    return allChildren(id)
  }

  getAllParents(id: number | string) {
    const itemMap = new Map<number | string, ITreeItem>()
    for (const item of this.items) {
      itemMap.set(item.id, item)
    }

    const result: ITreeItem[] = []
    let currentId = id || null

    while (currentId !== null) {
      const currentItem = itemMap.get(currentId)
      if (currentItem) {
        result.push(currentItem)
        currentId = currentItem.parent
      }
    }

    return result
  }

  addItem(item: ITreeItem) {
    !item.id && (item.id = Date.now())
    if(!this.items.some(i => i.id === item.id)) {
      this.items.push(item)
    }
  }

  removeItem(id: number | string) {
    const allChildrenIds = this.getAllChildren(id)?.map(i => i.id)
    this.items = this.items.filter(i => ![...allChildrenIds, id].includes(i.id))
  }

  updateItem(item: ITreeItem) {
    const index = this.items.findIndex(i => i.id === item.id)
    if (index !== -1) {
      this.items[index] = item
    }
  }
}
