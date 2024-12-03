import { ref, watch } from "vue";
import type { Ref } from "vue";

export const useAnimateNumber = (number: Ref<number>, duration: number) => {
  const displayedValue = ref(0);

  watch(number, (newVal, oldVal) => {
    runAnimation(newVal, oldVal);
  });

  const getFrameDuration = (change: number) => {
    if (change < 5) {
      return 200
    } else if (change < 50) {
      return 100
    } else if (change < 200) {
      return 50
    } else {
      return 25
    }
  }

  const runAnimation = (newValue: number, oldValue: number) => {
    const change = Math.abs(newValue - oldValue)
    const frameDuration = getFrameDuration(change)

    let frameCount = 0
    const totalFrames = duration / frameDuration
    const increment = change / totalFrames

    const tick = setInterval(() => {
      frameCount++
      const tempValue = Math.round(increment + displayedValue.value)

      if (change > 0 && tempValue < newValue) {
        displayedValue.value = tempValue
      } else if (change < 0 && tempValue > newValue) {
        displayedValue.value = tempValue
      }

      if (frameCount >= totalFrames) {
        displayedValue.value = newValue
        clearInterval(tick)
      }
    }, frameDuration)
  };

  return displayedValue;
}