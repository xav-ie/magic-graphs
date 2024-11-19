import { toRef, watch } from 'vue'
import type { MaybeRef } from 'vue'

export const useTextTip = (textInput?: MaybeRef<string>) => {
  const text = toRef(textInput)

  const outerDiv = document.createElement('div')
  const innerDiv = document.createElement('div')

  const TRANSITION_DURATION = 300

  const outerDivClasslist = [
    'absolute',
    'top-6',
    'w-full',
    'flex',
    'justify-center',
    'items-center',
    'transition-opacity',
    `duration-${TRANSITION_DURATION}`,
    'pointer-events-none'
  ]
  outerDiv.classList.add(...outerDivClasslist)

  const innerDivClasslist = [
    'text-white',
    'font-bold',
    'bg-gray-800',
    'p-3',
    'px-10',
    'rounded-xl'
  ]
  innerDiv.classList.add(...innerDivClasslist)

  outerDiv.style.opacity = '0'

  outerDiv.appendChild(innerDiv)
  document.body.appendChild(outerDiv)

  const showText = () => {
    outerDiv.style.opacity = '1'
  }

  const hideText = () => {
    outerDiv.style.opacity = '0'
  }

  watch(text, async (newText) => {
    hideText()
    if (!newText) return
    await new Promise((res) => setTimeout(res, TRANSITION_DURATION))
    innerDiv.textContent = newText
    await new Promise((res) => setTimeout(res, TRANSITION_DURATION))
    showText()
  }, { immediate: true })

  return {
    showText,
    hideText,
    text,
  }
}