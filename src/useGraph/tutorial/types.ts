import type { UserEditableGraphEvents } from '@/useGraph/useUserEditableGraph';

export type EventMap = UserEditableGraphEvents;
export type GraphEventName = keyof EventMap;

export type FunctionArgs<T extends Function> = T extends (...args: infer R) => any ? R : any

/**
 * options for highlighting an element or string id of the element to highlight
 */
export type ElementHighlightOptions = {
  highlightElement?: string | {
    /**
     * id of the element to highlight
     */
    id?: string;
    /**
     * css class name to apply to the element
     */
    className?: string;
  }
}

/**
 * TODO implement PreconditionOptions!
 *
 * describes the precondition option for a tutorial step
 * a precondition allows the implementer to run a function before the step is shown
 * its boolean return acts just as a predicate would act as defined in base tutorial step
 * if the precondition returns true, its like the condition for going to the next step is
 * already met, so the step will be skipped
 */
export type PreconditionOptions = {
  precondition?: () => boolean
}

/**
 * css class defined in App.vue, should move later
 */
export const DEFAULT_HIGHLIGHT_CLASS_NAME = 'element-highlight'

export type TutorialStepForEvent<T extends GraphEventName> = {
  hint: string;
  dismiss: T | {
    event: T,
    predicate: (...args: FunctionArgs<EventMap[T]>) => boolean
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

/**
 * TODO implement IntervalStep!
 *
 * describes a step that will resolve after a set amount of time conditioned upon
 * the predicate returning true, if false the step will be re-evaluated after the interval
 * so on and so forth until the predicate returns true
 */
export type IntervalStep = {
  hint: string,
  dismiss: {
    event: 'onInterval',
    /**
     * @param iteration the number of times the interval has been called
     * @returns true if the step should be dismissed
     */
    predicate: (iteration: number) => boolean
  },
  /**
   * time to wait before the next evaluation, in milliseconds
   */
  interval: number,
}

export type TutorialStep = ({
  [K in GraphEventName]: TutorialStepForEvent<K>
}[GraphEventName] | TimeoutStep) & ElementHighlightOptions & PreconditionOptions;

export type TutorialSequence = TutorialStep[];