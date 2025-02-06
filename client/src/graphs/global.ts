import { computed, shallowRef } from 'vue';
import type { GEdge, GNode, Graph } from './types';
import type { Annotation } from './plugins/annotations/types';

export const graph = shallowRef<Graph>();

export const nonNullGraph = computed(() => {
	if (!graph.value) {
		throw new Error('global graph state is undefined');
	}

	return graph.value;
});

/**
 * when switching between products, if this is set, the graph will be loaded with this state
 */
export const queuedGraphStateLoadout = shallowRef<{ nodes: GNode[]; edges: GEdge[] }>();

export const queuedGraphAnnotationState = shallowRef<Annotation[]>();
