import type { UserEditableGraphEvents } from '@/useGraph/useUserEditableGraph';
import type { Graph } from '../useGraph';

export type EventMap = UserEditableGraphEvents;
export type GraphEventName = keyof EventMap;

/**
 * css class defined in App.vue, should move later, used as default for ElementHighlightOptions -> highlightElement.className
 */
export const DEFAULT_HIGHLIGHT_CLASS_NAME = 'element-highlight'

/**
 * describes a step in a tutorial sequence for graph events defined in the useGraph event map
 */
export type TutorialStepForEvent<T extends GraphEventName> = {
  /**
   * the hint to display to the user in order to complete the step
   */
  hint: string;
  /**
   * the event that triggers a dismiss inquiry, if its just the event itself (T), then the step will be dismissed
   * upon invocation of the event via event bus, if its an object, then the step will be dismissed upon invocation
   * of the event and only if the predicate returns true
   */
  dismiss: T | {
    event: T,
    /**
     * @param args the arguments passed to the event handler as defined in the event map
     * @returns true if the step should be dismissed
     */
    predicate: (...args: Parameters<EventMap[T]>) => boolean
  };
};

/**
 * describes a step that will resolve after a set amount of time
 */
export type TimeoutStep = {
  hint: string,
  dismiss: 'onTimeout',
  /**
   * time to wait before the next step, in milliseconds
   */
  after: number,
};

type SharedStepProps = {
  /**
   * the text shown to the user in order to help guide them along
   */
  hint: string,
  /**
   * describes the precondition option for a tutorial step.
   * a precondition allows the implementer to run a function before the step is shown.
   * its boolean return acts just as a predicate would act as defined in base tutorial step.
   * if the precondition returns true, its like the condition for going to the next step is
   * already met, so the step will be skipped.
   */
  precondition?: (graph: Graph) => boolean,
  /**
   * callback to run when the step is initialized.
   * runs before precondition
   */
  onInit?: () => void,
  /**
   * callback to run when the step is dismissed
   */
  onDismiss?: () => void,
  /**
   * describes options for highlighting an element.
   * passing a string will highlight the element with the id
   */
  highlightElement?: string | {
    /**
     * id of the element to highlight
     */
    id?: string;
    /**
     * css class name to apply to the element
     * @default 'element-highlight'
     */
    className?: string;
  }
}

/**
 * describes a step that will resolve after a set amount of time conditioned upon
 * the predicate returning true, if false the step will be re-evaluated after the interval
 * so on and so forth until the predicate returns true
 */
export type IntervalStep = {
  hint: string,
  dismiss: 'onInterval' | {
    event: 'onInterval',
    /**
     * @param iteration the number of times the interval has been called
     * @returns true if the step should be dismissed
     */
    predicate: (iteration: number) => boolean
  },
  /**
   * time to wait before the next evaluation, in milliseconds
   * @default 1000 milliseconds
   */
  interval?: number,
}

export const DEFAULT_INTERVAL = 1000;

/**
 * describes a step in a tutorial sequence for a graph event
 */
export type GraphEventStep = {
  [K in GraphEventName]: TutorialStepForEvent<K>
}[GraphEventName];

/**
 * describes a step in a tutorial sequence
 */
export type TutorialStep = (
  GraphEventStep |
  TimeoutStep |
  IntervalStep
) & SharedStepProps;

/**
 * describes a list of tutorial steps that will be executed in order from index 0 to n - 1
 */
export type TutorialSequence = TutorialStep[];