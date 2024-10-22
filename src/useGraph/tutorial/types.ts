import type { UserEditableGraphEvents } from '@/useGraph/useUserEditableGraph';

export type EventMap = UserEditableGraphEvents;
export type GraphEventName = keyof EventMap;

export type FunctionArgs<T extends Function> = T extends (...args: infer R) => any ? R : any

export type ElementHighlightOptions = {
  highlightElementId?: string;
  highlightClassName?: string;
};

// css class defined in App.vue, should move later
export const DEFAULT_HIGHLIGHT_CLASS_NAME = 'element-highlight'

export type TutorialStepForEvent<T extends GraphEventName> = {
  hint: string;
  /**
   * if provided, a special effect will be applied to the element with this id
   */
  highlightElementId?: string;
  dismiss: T | {
    event: T,
    predicate: (...args: FunctionArgs<EventMap[T]>) => boolean
  };
};

export type CronStep = {
  hint: string,
  dismiss: 'onCron',
  /**
   * time to wait before the next step, in milliseconds
   */
  after: number,
};

export type TutorialStep = ({
  [K in GraphEventName]: TutorialStepForEvent<K>
}[GraphEventName] | CronStep) & ElementHighlightOptions;

export type TutorialSequence = TutorialStep[];