import { onUnmounted } from "vue"

export const useKeydownMap = () => {


  const trackKeyDown = (e: KeyboardEvent) => {
    console.log(e.key)
  }

  const trackKeyUp = (e: KeyboardEvent) => {
    console.log(e.key)
  }


  document.addEventListener('keydown', trackKeyDown)
  document.addEventListener('keyup', trackKeyUp)

  onUnmounted(() => {
    document.removeEventListener('keydown', trackKeyDown)
    document.removeEventListener('keyup', trackKeyUp)
  })
}