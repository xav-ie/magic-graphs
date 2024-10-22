import { onMounted } from "vue";
import type { Graph } from "../useGraph";

type GraphEvent = keyof Graph['eventBus'];

type TutorialStep = {
  hint: string,
  dismiss: GraphEvent,
}

type TutorialSequence = TutorialStep[];

export const useGraphTutorial = (graph: Graph, tutorialSequency: TutorialSequence) => {

  const h1 = document.createElement('h1');
  h1.style.opacity = '0'
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

  document.body.appendChild(h1);

  const addText = (text: string) => {
    h1.innerText = text;
    h1.style.opacity = '1';
  }

  const removeText = () => {
    h1.style.opacity = '0';
  }

  const nextStep = () => {
    const step = tutorialSequency.shift();
    if (!step) return removeText();
    setTimeout(() => addText(step.hint), 500);
    const proceed = () => {
      graph.unsubscribe(step.dismiss, proceed);
      removeText();
      nextStep();
    }
    graph.subscribe(step.dismiss, proceed);
  }

  onMounted(nextStep);
}