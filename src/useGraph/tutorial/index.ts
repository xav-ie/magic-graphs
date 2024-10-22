import { onMounted } from "vue";
import type { Graph } from "../useGraph";
import { DEFAULT_HIGHLIGHT_CLASS_NAME } from "./types";
import type {
  TutorialSequence,
  ElementHighlightOptions,
  GraphEventName,
} from "./types";

export const useGraphTutorial = (graph: Graph, tutorialSequence: TutorialSequence) => {

  const h1 = document.createElement('h1');
  h1.style.opacity = '0'
  h1.style.width = '100%';
  h1.style.textAlign = 'center';
  h1.style.userSelect = 'none';
  h1.classList.add(
    'text-4xl',
    'text-center',
    'text-white',
    'font-bold',
    'absolute',
    'bottom-[10%]',
    'absolute',
    'transition-opacity',
    'duration-300',
  );

  const addText = (text: string) => {
    h1.innerText = text;
    h1.style.opacity = '1';
  }

  const removeText = () => {
    h1.style.opacity = '0';
  }

  const applyHighlight = (highlight: ElementHighlightOptions) => {

    const {
      highlightElementId: elementId,
      highlightClassName = DEFAULT_HIGHLIGHT_CLASS_NAME
    } = highlight;

    if (!elementId) return () => { };
    const element = document.getElementById(elementId);
    if (!element) throw new Error(`element with id ${elementId} not found`);

    element.classList.add(highlightClassName);
    return () => element.classList.remove(highlightClassName);
  }

  const nextStep = () => {
    const step = tutorialSequence.shift();

    if (!step) {
      removeText()
      setTimeout(h1.remove, 1000);
      return;
    }

    let currentHighlightRemover: () => void;

    setTimeout(() => {
      addText(step.hint);
      if (step?.highlightElementId) currentHighlightRemover = applyHighlight(step);
    }, 1500);

    if (step.dismiss === 'onCron') {
      setTimeout(() => {
        removeText();
        nextStep();
      }, step.after);
      return;
    }

    const goNext = (eventName: GraphEventName) => {
      graph.unsubscribe(eventName, proceed);
      removeText();
      currentHighlightRemover?.();
      nextStep();
    }

    const proceed = (...args: any[]) => {
      if (typeof step.dismiss !== 'string') {
        const predicate = step.dismiss.predicate(...args);
        if (predicate) goNext(step.dismiss.event);
        return;
      }
      goNext(step.dismiss);
    }

    const dismissEvent = typeof step.dismiss === 'string' ? step.dismiss : step.dismiss.event;
    graph.subscribe(dismissEvent, proceed);
  }

  onMounted(() => {
    if (!graph.canvas.value) throw new Error('canvas element not found in dom');
    const parent = graph.canvas.value.parentElement;
    if (!parent) throw new Error('canvas parent element not found in dom');
    parent.appendChild(h1);
    nextStep();
  });
}