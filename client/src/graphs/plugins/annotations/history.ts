import { computed, ref } from "vue"
import type { Ref } from 'vue'
import type { Annotation } from "."

type AnnotationHistoryRecord = {
  action: 'add' | 'remove',
  scribbles: Annotation[]
}

export const useAnnotationHistory = (annotations: Ref<Annotation[]>) => {
  const undoStack = ref<AnnotationHistoryRecord[]>([])
  const redoStack = ref<AnnotationHistoryRecord[]>([])

  const addToUndoStack = (record: AnnotationHistoryRecord) => {
    undoStack.value.push(record)
  }

  const addToRedoStack = (record: AnnotationHistoryRecord) => {
    redoStack.value.push(record)
  }

  const executeUndo = () => {
    const record = undoStack.value.pop()
    if (!record) return
    const { action, scribbles } = record
    const ids = scribbles.map(({ id }) => id)
    if (action === 'add') {
      annotations.value = annotations.value.filter(({ id: annotationId }) => {
        return !ids.includes(annotationId)
      })
    } else if (action === 'remove') {
      annotations.value.push(...scribbles)
    }
    redoStack.value.push(record)
  }

  const executeRedo = () => {
    const record = redoStack.value.pop()
    if (!record) return
    const { action, scribbles } = record
    const ids = scribbles.map(({ id }) => id)
    if (action === 'add') {
      annotations.value.push(...scribbles)
    } else if (action === 'remove') {
      annotations.value = annotations.value.filter(({ id: annotationId }) => {
        return !ids.includes(annotationId)
      })
    }
    undoStack.value.push(record)
  }

  return {
    executeUndo,
    executeRedo,
    addToUndoStack,
    addToRedoStack,

    canUndo: computed(() => undoStack.value.length !== 0),
    canRedo: computed(() => redoStack.value.length !== 0),
  }
}