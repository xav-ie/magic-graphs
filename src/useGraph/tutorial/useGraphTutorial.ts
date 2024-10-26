import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  toRef,
  watch,
  type MaybeRef
} from "vue";
import type { Graph } from "../useGraph";
import {
  DEFAULT_HIGHLIGHT_CLASS_NAME,
  DEFAULT_INTERVAL
} from "./types";
import type {
  TutorialSequence,
  IntervalStep,
  GraphEventStep,
  TutorialStep,
} from "./types";

/**
 * creates functionality for an interactive tutorial sequence for a graph
 *
 * @param graph the useGraph instance to apply the tutorial to
 * @param tutorialSequence the sequence of tutorial steps to apply
 * @returns // TODO make it return controls for the tutorial
 */
export const useGraphTutorial = (graph: Graph, tutorialSequence: MaybeRef<TutorialSequence>) => {

  /**
   * the current step in the tutorial sequence,
   * can be reactively set to skip to a specific step
   */
  const stepIndex = ref(0);
  const sequence = toRef(tutorialSequence);

  const textHintElement = createTextHintElement();

  const addText = (text: string) => {
    textHintElement.innerText = text;
    textHintElement.style.opacity = '1';
  }

  const removeText = () => {
    textHintElement.style.opacity = '0';
  }

  const DELAY_UNTIL_NEXT_STEP = 1000;

  let stepSetupTimeoutID: number;
  let cleanupHighlight: () => void;
  let cleanupStep: () => void;

  const executeStep = (step: GraphEventStep | IntervalStep) => {

    const {
      event: dismissEvent,
      predicate: dismissPredicate
    } = typeof step.dismiss === 'string' ? {
      event: step.dismiss,
      predicate: () => true
    } : step.dismiss;

    if (dismissEvent === 'onInterval') {
      const intervalTime = 'interval' in step ? step.interval : DEFAULT_INTERVAL;
      let iteration = 0;
      const interval = setInterval(() => {
        if (dismissPredicate(++iteration)) stepIndex.value++;
      }, intervalTime);
      return () => clearInterval(interval);
    }

    /**
     * must remain defined names and not anonymous to not create multiple function references
     */
    const eventFired = (...args: any[]) => {
      const predicate = dismissPredicate?.(...args);
      if (predicate) stepIndex.value++;
    }

    graph.subscribe(dismissEvent, eventFired);
    return () => graph.unsubscribe(dismissEvent, eventFired);
  }

  const runCurrentStep = () => {
    const step = sequence.value[stepIndex.value];

    if (!step) return;

    step.onInit?.();

    if (step.precondition?.(graph)) {
      stepIndex.value++;
      return;
    }

    if (step?.highlightElement) cleanupHighlight = applyHighlight(step);
    stepSetupTimeoutID = setTimeout(() => {
      addText(step.hint);
    }, DELAY_UNTIL_NEXT_STEP);

    cleanupStep = executeStep(step.dismiss !== 'onTimeout' ? step : {
      hint: step.hint,
      dismiss: 'onInterval',
      interval: step.after,
    });
  }

  const initiateNewStep = (newStepIndex: number, prevStepIndex: number) => {
    if (newStepIndex < 0) return stepIndex.value = 0;
    if (newStepIndex > sequence.value.length) return stepIndex.value = sequence.value.length
    const prevStep = sequence.value[prevStepIndex];
    prevStep?.onDismiss?.();
    cleanupStep?.();
    cleanupHighlight?.();
    removeText();
    clearTimeout(stepSetupTimeoutID);
    runCurrentStep();
  }

  watch(stepIndex, initiateNewStep);
  watch(sequence, () => initiateNewStep(stepIndex.value, stepIndex.value));

  onMounted(() => {
    if (!graph.canvas.value) throw new Error('canvas element not found in dom');
    const parent = graph.canvas.value.parentElement;
    if (!parent) throw new Error('canvas parent element not found in dom');
    parent.appendChild(textHintElement);
    runCurrentStep();
  });

  onUnmounted(() => {
    textHintElement.remove();
  });

  return {
    currentStepIndex: stepIndex,
    // added undefined because stepIndex is +1 out of bounds when tutorial is over
    currentStep: computed<TutorialStep | undefined>(() => sequence.value[stepIndex.value]),
    sequence,
    skipStep: () => stepIndex.value++,
    previousStep: () => stepIndex.value--,
    endTutorial: () => stepIndex.value = sequence.value.length,
    restartTutorial: () => stepIndex.value = 0,
    isTutorialOver: computed(() => stepIndex.value >= sequence.value.length),
  }
}

/**
 * create a new dom node for displaying text hints
 *
 * @returns a html element for displaying text hints
 */
const createTextHintElement = () => {
  const h1 = document.createElement('h1');
  h1.style.opacity = '0'
  h1.style.width = '100%';
  h1.style.textAlign = 'center';
  h1.style.userSelect = 'none';
  h1.classList.add(
    'text-3xl',
    'text-center',
    'text-white',
    'font-bold',
    'absolute',
    'bottom-[10%]',
    'absolute',
    'transition-opacity',
    'duration-300',
  );

  return h1;
}

/**
   * applies a highlight to an element
   *
   * @param tutorialStep the step containing the highlight element
   * @returns a function to remove the highlight
   */
const applyHighlight = (tutorialStep: TutorialStep) => {
  const { highlightElement: highlight } = tutorialStep;
  if (!highlight) return () => { };
  const {
    id,
    className,
  } = {
    id: typeof highlight === 'string' ? highlight : highlight.id,
    className: (typeof highlight === 'string' || !highlight?.className) ? DEFAULT_HIGHLIGHT_CLASS_NAME : highlight.className,
  };

  if (!id) return () => { };
  const element = document.getElementById(id);
  if (!element) throw new Error(`element with id ${id} not found`);

  element.classList.add(className);
  return () => element.classList.remove(className);
}