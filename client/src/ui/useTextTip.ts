import { toRef, watch } from 'vue'
import type { MaybeRef } from 'vue'

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

const innerDivClasslist = [
  'text-white',
  'font-bold',
  'bg-gray-800',
  'p-3',
  'px-10',
  'rounded-xl'
]

const mountTextTip = () => {
  const outerDiv = document.createElement('div')
  const innerDiv = document.createElement('div')

  outerDiv.classList.add(...outerDivClasslist)

  innerDiv.classList.add(...innerDivClasslist)

  outerDiv.style.opacity = '0'

  outerDiv.appendChild(innerDiv)
  document.body.appendChild(outerDiv)

  return { outerDiv, innerDiv }
}

const unmountTextTip = (outerDiv: HTMLDivElement) => {
  outerDiv.remove()
}

export const useTextTip = (textInput?: MaybeRef<string>) => {
  const text = toRef(textInput)

  const { outerDiv, innerDiv } = mountTextTip()

  outerDiv.style.opacity = '0'

  if (text.value) innerDiv.textContent = text.value

  const showText = () => {
    outerDiv.style.opacity = '1'
  }

  const hideText = () => {
    outerDiv.style.opacity = '0'
  }

  const transitionTextContent = async (newText: string | undefined) => {
    hideText()
    if (!newText) return
    await new Promise((res) => setTimeout(res, TRANSITION_DURATION))
    innerDiv.textContent = newText
    await new Promise((res) => setTimeout(res, TRANSITION_DURATION))
    showText()
  }

  watch(text, transitionTextContent)

  return {
    showText,
    hideText,
    text,

    /**
     * for customizing the HTML elements used in the text tip
     */
    els: {
      outerDiv,
      innerDiv
    }
  }
}