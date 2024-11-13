"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UTURN_DEFAULTS = exports.STROKE_DEFAULTS = exports.TEXT_DEFAULTS = exports.TEXTAREA_DEFAULTS = exports.triangle = exports.TRIANGLE_DEFAULTS = exports.square = exports.rect = exports.RECT_DEFAULTS = exports.line = exports.LINE_DEFAULTS = exports.cross = exports.CROSS_DEFAULTS = exports.circle = exports.CIRCLE_DEFAULTS = exports.useMSTSimulation = exports.useDijkstra = exports.INF = exports.TUTORIAL_THEME_ID = exports.DELAY_UNTIL_NEXT_STEP = exports.DEFAULT_INTERVAL = exports.getInitialThemeMap = exports.NON_COLOR_THEMES = exports.resolveThemeForEdge = exports.resolveThemeForNode = exports.THEMES = exports.getThemeResolver = exports.DEFAULT_GRAPH_SETTINGS = exports.DEFAULT_COLLABORATIVE_SETTINGS = exports.DEFAULT_PERSISTENT_SETTINGS = exports.DEFAULT_USER_EDITABLE_SETTINGS = exports.DEFAULT_MARQUEE_SETTINGS = exports.DEFAULT_NODE_ANCHOR_SETTINGS = exports.DEFAULT_DRAGGABLE_SETTINGS = exports.DEFAULT_FOCUS_SETTINGS = exports.DEFAULT_BASE_SETTINGS = exports.getInitialEventBus = exports.FOCUS_THEME_ID = exports.FOCUSABLE_GRAPH_TYPES = exports.COLLAB_NAMES = exports.COLLAB_COLORS = exports.useGraphCRUD = exports.useAggregator = exports.ADD_EDGE_DEFAULTS = exports.MOVE_NODE_OPTIONS_DEFAULTS = exports.REMOVE_EDGE_OPTIONS_DEFAULTS = exports.ADD_EDGE_OPTIONS_DEFAULTS = exports.REMOVE_NODE_OPTIONS_DEFAULTS = exports.BULK_ADD_NODE_OPTIONS_DEFAULTS = exports.ADD_NODE_OPTIONS_DEFAULTS = void 0;
exports.PROGRESS_DEFAULTS = exports.uturn = void 0;
// @ts-ignore
// @ts-ignore
exports.ADD_NODE_OPTIONS_DEFAULTS = {
    // @ts-ignore
    broadcast: true,
    // @ts-ignore
    focus: true,
    // @ts-ignore
    history: true,
    // @ts-ignore
};
// @ts-ignore
// @ts-ignore
exports.BULK_ADD_NODE_OPTIONS_DEFAULTS = {
    // @ts-ignore
    broadcast: true,
    // @ts-ignore
    focus: false,
    // @ts-ignore
    history: true,
    // @ts-ignore
};
// @ts-ignore
// @ts-ignore
exports.REMOVE_NODE_OPTIONS_DEFAULTS = {
    // @ts-ignore
    broadcast: true,
    // @ts-ignore
    history: true,
    // @ts-ignore
};
// @ts-ignore
// @ts-ignore
exports.ADD_EDGE_OPTIONS_DEFAULTS = {
    // @ts-ignore
    broadcast: true,
    // @ts-ignore
    focus: false,
    // @ts-ignore
    history: true,
    // @ts-ignore
};
// @ts-ignore
// @ts-ignore
exports.REMOVE_EDGE_OPTIONS_DEFAULTS = {
    // @ts-ignore
    broadcast: true,
    // @ts-ignore
    history: true,
    // @ts-ignore
};
// @ts-ignore
// @ts-ignore
exports.MOVE_NODE_OPTIONS_DEFAULTS = {
    // @ts-ignore
    broadcast: true,
    // @ts-ignore
};
// @ts-ignore
// @ts-ignore
/**
// @ts-ignore
 * defaults for newly added edges
// @ts-ignore
 */
// @ts-ignore
exports.ADD_EDGE_DEFAULTS = {
    // @ts-ignore
    type: 'directed',
    // @ts-ignore
    label: '',
    // @ts-ignore
};
// @ts-ignore
// @ts-ignore
const useAggregator = ({ canvas, emit }) => {
    // @ts-ignore
    const aggregator = ref([]);
    // @ts-ignore
    const updateAggregator = [];
    // @ts-ignore
    // @ts-ignore
    /**
  // @ts-ignore
     * refresh the canvas
  // @ts-ignore
     *
  // @ts-ignore
     * @param repaintId - the id of the repaint event (for tracking)
  // @ts-ignore
     * @returns a function that will repaint the canvas
  // @ts-ignore
     */
    // @ts-ignore
    const repaint = (repaintId) => () => {
        // @ts-ignore
        if (!canvas.value)
            return;
        // @ts-ignore
        const ctx = canvas.value.getContext('2d');
        // @ts-ignore
        if (!ctx)
            return;
        // @ts-ignore
        ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
        // @ts-ignore
        // @ts-ignore
        const evaluateAggregator = updateAggregator.reduce((acc, fn) => fn(acc), []);
        // @ts-ignore
        aggregator.value = [...evaluateAggregator.sort((a, b) => a.priority - b.priority)];
        // @ts-ignore
        // @ts-ignore
        const indexOfLastEdge = aggregator.value.findLastIndex(item => item.graphType === 'edge');
        // @ts-ignore
        const beforeLastEdge = aggregator.value.slice(0, indexOfLastEdge + 1);
        // @ts-ignore
        const afterLastEdge = aggregator.value.slice(indexOfLastEdge + 1);
        // @ts-ignore
        // @ts-ignore
        for (const item of beforeLastEdge) {
            // @ts-ignore
            item.shape.drawShape(ctx);
            // @ts-ignore
        }
        // @ts-ignore
        // @ts-ignore
        for (const item of beforeLastEdge) {
            // @ts-ignore
            item.shape.drawTextAreaMatte?.(ctx);
            // @ts-ignore
        }
        // @ts-ignore
        // @ts-ignore
        for (const item of beforeLastEdge) {
            // @ts-ignore
            item.shape.drawText?.(ctx);
            // @ts-ignore
        }
        // @ts-ignore
        // @ts-ignore
        for (const item of afterLastEdge) {
            // @ts-ignore
            item.shape.draw(ctx);
            // @ts-ignore
        }
        // @ts-ignore
        // @ts-ignore
        emit('onRepaint', ctx, repaintId);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    /**
  // @ts-ignore
     * get all schema items at given coordinates
  // @ts-ignore
     *
  // @ts-ignore
     * @param x - the x coord
  // @ts-ignore
     * @param y - the y coord
  // @ts-ignore
     * @returns an array where the first item is the bottom most schema item and the last is the top most
  // @ts-ignore
     * @example // returns [node, nodeAnchor] where a nodeAnchor is sitting on top of a node
  // @ts-ignore
     * getSchemaItemsByCoordinates(200, 550)
  // @ts-ignore
     */
    // @ts-ignore
    const getSchemaItemsByCoordinates = (x, y) => {
        // @ts-ignore
        return aggregator.value
            // @ts-ignore
            .sort((a, b) => a.priority - b.priority)
            // @ts-ignore
            .filter(item => item.shape.shapeHitbox({ x, y }) || item.shape.textHitbox?.({ x, y }));
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    return {
        // @ts-ignore
        aggregator,
        // @ts-ignore
        updateAggregator,
        // @ts-ignore
        repaint,
        // @ts-ignore
        getSchemaItemsByCoordinates,
        // @ts-ignore
    };
};
exports.useAggregator = useAggregator;
// @ts-ignore
// @ts-ignore
// @ts-ignore
const useGraphCRUD = ({ 
// @ts-ignore
nodes, 
// @ts-ignore
edges, 
// @ts-ignore
nodeMap, 
// @ts-ignore
edgeMap, 
// @ts-ignore
repaint, 
// @ts-ignore
emit, 
// @ts-ignore
settings,
// @ts-ignore
 }) => {
    // @ts-ignore
    // @ts-ignore
    // READ OPERATIONS
    // @ts-ignore
    // @ts-ignore
    /**
  // @ts-ignore
     * get a node by its id
  // @ts-ignore
     *
  // @ts-ignore
     * @param id
  // @ts-ignore
     * @returns the node or undefined if not found
  // @ts-ignore
     */
    // @ts-ignore
    const getNode = (id) => nodeMap.value.get(id);
    // @ts-ignore
    // @ts-ignore
    /**
  // @ts-ignore
     * get an edge by its id
  // @ts-ignore
     *
  // @ts-ignore
     * @param id
  // @ts-ignore
     * @returns the edge or undefined if not found
  // @ts-ignore
     */
    // @ts-ignore
    const getEdge = (id) => edgeMap.value.get(id);
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // CREATE OPERATIONS
    // @ts-ignore
    // @ts-ignore
    /**
  // @ts-ignore
     * add a node to the graph
  // @ts-ignore
     *
  // @ts-ignore
     * @param node - the node to add
  // @ts-ignore
     * @param options - override default effects (onNodeAdded event)
  // @ts-ignore
     * @returns the added node or undefined if not added
  // @ts-ignore
     */
    // @ts-ignore
    const addNode = (
    // @ts-ignore
    node, 
    // @ts-ignore
    options = {}
    // @ts-ignore
    ) => {
        // @ts-ignore
        if (node?.id && getNode(node.id)) {
            // @ts-ignore
            console.warn('prevented adding a node with an existing id, this shouldn\'t happen');
            // @ts-ignore
            return;
            // @ts-ignore
        }
        // @ts-ignore
        // @ts-ignore
        const fullOptions = {
            // @ts-ignore
            ...exports.ADD_NODE_OPTIONS_DEFAULTS,
            // @ts-ignore
            ...options
            // @ts-ignore
        };
        // @ts-ignore
        // @ts-ignore
        const labelGetter = settings.value.newNodeLabelGetter ?? nodeLetterLabelGetter({ nodes });
        // @ts-ignore
        // @ts-ignore
        const newNode = {
            // @ts-ignore
            id: node.id ?? generateId(),
            // @ts-ignore
            label: node.label ?? labelGetter(),
            // @ts-ignore
            x: node.x ?? 0,
            // @ts-ignore
            y: node.y ?? 0,
            // @ts-ignore
        };
        // @ts-ignore
        // @ts-ignore
        nodes.value.push(newNode);
        // @ts-ignore
        emit('onStructureChange', nodes.value, edges.value);
        // @ts-ignore
        emit('onNodeAdded', newNode, fullOptions);
        // @ts-ignore
        repaint('base-graph/add-node')();
        // @ts-ignore
        return newNode;
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const bulkAddNode = (
    // @ts-ignore
    nodes, 
    // @ts-ignore
    options = {}
    // @ts-ignore
    ) => {
        // @ts-ignore
        if (nodes.length === 0)
            return;
        // @ts-ignore
        // @ts-ignore
        const fullOptions = {
            // @ts-ignore
            ...exports.BULK_ADD_NODE_OPTIONS_DEFAULTS,
            // @ts-ignore
            ...options
            // @ts-ignore
        };
        // @ts-ignore
        // @ts-ignore
        const createdNodes = [];
        // @ts-ignore
        // @ts-ignore
        for (const node of nodes) {
            // @ts-ignore
            const newNode = addNode(node, {
                // @ts-ignore
                focus: false,
                // @ts-ignore
                broadcast: false,
                // @ts-ignore
                history: false,
                // @ts-ignore
            });
            // @ts-ignore
            if (!newNode)
                continue;
            // @ts-ignore
            createdNodes.push(newNode);
            // @ts-ignore
        }
        // @ts-ignore
        // @ts-ignore
        if (createdNodes.length === 0)
            return;
        // @ts-ignore
        emit('onBulkNodeAdded', createdNodes, fullOptions);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    /**
  // @ts-ignore
     * add an edge to the graph
  // @ts-ignore
     *
  // @ts-ignore
     * @param edge - the edge to add
  // @ts-ignore
     * @param options - override default effects (onEdgeAdded event)
  // @ts-ignore
     * @returns the added edge or undefined if not added
  // @ts-ignore
     */
    // @ts-ignore
    const addEdge = (
    // @ts-ignore
    edge, 
    // @ts-ignore
    options = {}
    // @ts-ignore
    ) => {
        // @ts-ignore
        const fullOptions = {
            // @ts-ignore
            ...exports.ADD_EDGE_OPTIONS_DEFAULTS,
            // @ts-ignore
            ...options
            // @ts-ignore
        };
        // @ts-ignore
        // @ts-ignore
        const [fromNode, toNode] = [getNode(edge.from), getNode(edge.to)];
        // @ts-ignore
        if (!fromNode || !toNode)
            return;
        // @ts-ignore
        // @ts-ignore
        const undirectedEdgeOnPath = edges.value.find(e => {
            // @ts-ignore
            const connectedToFrom = e.to === edge.to && e.from === edge.from;
            // @ts-ignore
            const connectedFromTo = e.to === edge.from && e.from === edge.to;
            // @ts-ignore
            return (connectedToFrom || connectedFromTo) && e.type === 'undirected';
            // @ts-ignore
        });
        // @ts-ignore
        // @ts-ignore
        if (undirectedEdgeOnPath)
            return;
        // @ts-ignore
        // @ts-ignore
        const directedEdgeOnPath = edges.value.find(e => {
            // @ts-ignore
            return e.to === edge.to && e.from === edge.from;
            // @ts-ignore
        });
        // @ts-ignore
        // @ts-ignore
        if (directedEdgeOnPath)
            return;
        // @ts-ignore
        // @ts-ignore
        // if the edge type is undirected, check the other directed way
        // @ts-ignore
        if (edge.type === 'undirected') {
            // @ts-ignore
            const directedEdgeOnPath = edges.value.find(e => {
                // @ts-ignore
                return e.to === edge.from && e.from === edge.to;
                // @ts-ignore
            });
            // @ts-ignore
            // @ts-ignore
            if (directedEdgeOnPath)
                return;
            // @ts-ignore
        }
        // @ts-ignore
        // @ts-ignore
        const newEdge = {
            // @ts-ignore
            ...exports.ADD_EDGE_DEFAULTS,
            // @ts-ignore
            id: generateId(),
            // @ts-ignore
            ...edge,
            // @ts-ignore
        };
        // @ts-ignore
        // @ts-ignore
        edges.value.push(newEdge);
        // @ts-ignore
        // @ts-ignore
        emit('onEdgeAdded', newEdge, fullOptions);
        // @ts-ignore
        emit('onStructureChange', nodes.value, edges.value);
        // @ts-ignore
        // @ts-ignore
        repaint('base-graph/add-edge')();
        // @ts-ignore
        return newEdge;
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const bulkAddEdge = (
    // @ts-ignore
    edges, 
    // @ts-ignore
    options = {}
    // @ts-ignore
    ) => {
        // @ts-ignore
        if (edges.length === 0)
            return;
        // @ts-ignore
        // @ts-ignore
        const fullOptions = {
            // @ts-ignore
            ...exports.ADD_EDGE_OPTIONS_DEFAULTS,
            // @ts-ignore
            ...options
            // @ts-ignore
        };
        // @ts-ignore
        // @ts-ignore
        const createdEdges = [];
        // @ts-ignore
        // @ts-ignore
        for (const edge of edges) {
            // @ts-ignore
            const newEdge = addEdge(edge, {
                // @ts-ignore
                broadcast: false,
                // @ts-ignore
                history: false,
                // @ts-ignore
            });
            // @ts-ignore
            if (!newEdge)
                continue;
            // @ts-ignore
            createdEdges.push(newEdge);
            // @ts-ignore
        }
        // @ts-ignore
        // @ts-ignore
        if (createdEdges.length === 0)
            return;
        // @ts-ignore
        emit('onBulkEdgeAdded', createdEdges, fullOptions);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // UPDATE OPERATIONS
    // @ts-ignore
    // @ts-ignore
    /**
  // @ts-ignore
     * move a node to a new position (in place mutation)
  // @ts-ignore
     *
  // @ts-ignore
     * @param id - the id of the node to move
  // @ts-ignore
     * @param coords - the new coordinates (x, y)
  // @ts-ignore
     * @param options - override default effects (onNodeMoved event)
  // @ts-ignore
     * @returns void
  // @ts-ignore
     */
    // @ts-ignore
    const moveNode = (
    // @ts-ignore
    id, 
    // @ts-ignore
    coords, 
    // @ts-ignore
    options = {}
    // @ts-ignore
    ) => {
        // @ts-ignore
        const node = getNode(id);
        // @ts-ignore
        if (!node)
            return;
        // @ts-ignore
        // @ts-ignore
        const fullOptions = {
            // @ts-ignore
            ...exports.MOVE_NODE_OPTIONS_DEFAULTS,
            // @ts-ignore
            ...options
            // @ts-ignore
        };
        // @ts-ignore
        // @ts-ignore
        node.x = coords.x;
        // @ts-ignore
        node.y = coords.y;
        // @ts-ignore
        emit('onNodeMoved', node, fullOptions);
        // @ts-ignore
        repaint('base-graph/move-node')();
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // DELETE OPERATIONS
    // @ts-ignore
    // @ts-ignore
    /**
  // @ts-ignore
     * remove a node from the graph
  // @ts-ignore
     *
  // @ts-ignore
     * @param id - the id of the node to remove
  // @ts-ignore
     * @param options - override default effects (onNodeRemoved event)
  // @ts-ignore
     * @returns the removed node along with its removed edges or undefined if not removed
  // @ts-ignore
     */
    // @ts-ignore
    const removeNode = (id, options = {}) => {
        // @ts-ignore
        const removedNode = getNode(id);
        // @ts-ignore
        if (!removedNode)
            return;
        // @ts-ignore
        // @ts-ignore
        const fullOptions = {
            // @ts-ignore
            ...exports.REMOVE_NODE_OPTIONS_DEFAULTS,
            // @ts-ignore
            ...options
            // @ts-ignore
        };
        // @ts-ignore
        // @ts-ignore
        const edgesToRemove = getConnectedEdges(removedNode, edges.value);
        // @ts-ignore
        const removedEdges = edgesToRemove.map((e) => removeEdge(e.id, {
            // @ts-ignore
            broadcast: false,
            // @ts-ignore
            history: false,
            // @ts-ignore
        })).filter(Boolean);
        // @ts-ignore
        // @ts-ignore
        nodes.value = nodes.value.filter(n => n.id !== removedNode.id);
        // @ts-ignore
        // @ts-ignore
        emit('onStructureChange', nodes.value, edges.value);
        // @ts-ignore
        emit('onNodeRemoved', removedNode, removedEdges, fullOptions);
        // @ts-ignore
        // @ts-ignore
        setTimeout(repaint('base-graph/remove-node'), 5);
        // @ts-ignore
        return [removedNode, removedEdges];
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const bulkRemoveNode = (
    // @ts-ignore
    nodeIds, 
    // @ts-ignore
    options = {}
    // @ts-ignore
    ) => {
        // @ts-ignore
        if (nodeIds.length === 0)
            return;
        // @ts-ignore
        // @ts-ignore
        const fullOptions = {
            // @ts-ignore
            ...exports.REMOVE_NODE_OPTIONS_DEFAULTS,
            // @ts-ignore
            ...options
            // @ts-ignore
        };
        // @ts-ignore
        // @ts-ignore
        const removedNodes = [];
        // @ts-ignore
        const removedEdges = [];
        // @ts-ignore
        // @ts-ignore
        for (const nodeId of nodeIds) {
            // @ts-ignore
            const removed = removeNode(nodeId, {
                // @ts-ignore
                broadcast: false,
                // @ts-ignore
                history: false,
                // @ts-ignore
            });
            // @ts-ignore
            if (!removed)
                continue;
            // @ts-ignore
            const [removedNode, removedNodeEdges] = removed;
            // @ts-ignore
            removedNodes.push(removedNode);
            // @ts-ignore
            removedEdges.push(...removedNodeEdges);
            // @ts-ignore
        }
        // @ts-ignore
        // @ts-ignore
        if (removedNodes.length === 0)
            return;
        // @ts-ignore
        emit('onBulkNodeRemoved', removedNodes, removedEdges, fullOptions);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    /**
  // @ts-ignore
     * remove an edge from the graph
  // @ts-ignore
     *
  // @ts-ignore
     * @param edgeId - the id of the edge to remove
  // @ts-ignore
     * @param options - override default effects (onEdgeRemoved event)
  // @ts-ignore
     * @returns the removed edge or undefined if not removed
  // @ts-ignore
     */
    // @ts-ignore
    const removeEdge = (
    // @ts-ignore
    edgeId, 
    // @ts-ignore
    options = {}
    // @ts-ignore
    ) => {
        // @ts-ignore
        const edge = getEdge(edgeId);
        // @ts-ignore
        if (!edge)
            return;
        // @ts-ignore
        // @ts-ignore
        const fullOptions = {
            // @ts-ignore
            ...exports.REMOVE_EDGE_OPTIONS_DEFAULTS,
            // @ts-ignore
            ...options
            // @ts-ignore
        };
        // @ts-ignore
        // @ts-ignore
        edges.value = edges.value.filter(e => e.id !== edge.id);
        // @ts-ignore
        // @ts-ignore
        emit('onEdgeRemoved', edge, fullOptions);
        // @ts-ignore
        emit('onStructureChange', nodes.value, edges.value);
        // @ts-ignore
        repaint('base-graph/remove-edge')();
        // @ts-ignore
        return edge;
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const bulkRemoveEdge = (
    // @ts-ignore
    edgeIds, 
    // @ts-ignore
    options = {}
    // @ts-ignore
    ) => {
        // @ts-ignore
        if (edgeIds.length === 0)
            return;
        // @ts-ignore
        // @ts-ignore
        const fullOptions = {
            // @ts-ignore
            ...exports.REMOVE_EDGE_OPTIONS_DEFAULTS,
            // @ts-ignore
            ...options
            // @ts-ignore
        };
        // @ts-ignore
        // @ts-ignore
        const removedEdges = [];
        // @ts-ignore
        // @ts-ignore
        for (const edgeId of edgeIds) {
            // @ts-ignore
            const removed = removeEdge(edgeId, {
                // @ts-ignore
                broadcast: false,
                // @ts-ignore
                history: false,
                // @ts-ignore
            });
            // @ts-ignore
            if (!removed)
                continue;
            // @ts-ignore
            removedEdges.push(removed);
            // @ts-ignore
        }
        // @ts-ignore
        // @ts-ignore
        if (removedEdges.length === 0)
            return;
        // @ts-ignore
        emit('onBulkEdgeRemoved', removedEdges, fullOptions);
        // @ts-ignore
        return removedEdges;
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    return {
        // @ts-ignore
        getNode,
        // @ts-ignore
        getEdge,
        // @ts-ignore
        // @ts-ignore
        addNode,
        // @ts-ignore
        addEdge,
        // @ts-ignore
        // @ts-ignore
        moveNode,
        // @ts-ignore
        // @ts-ignore
        removeNode,
        // @ts-ignore
        removeEdge,
        // @ts-ignore
        // @ts-ignore
        bulkAddNode,
        // @ts-ignore
        bulkRemoveNode,
        // @ts-ignore
        // @ts-ignore
        bulkAddEdge,
        // @ts-ignore
        bulkRemoveEdge,
        // @ts-ignore
    };
};
exports.useGraphCRUD = useGraphCRUD;
// @ts-ignore
// @ts-ignore
/**
// @ts-ignore
 * list of colors that may be assigned to collaborators
// @ts-ignore
 */
// @ts-ignore
exports.COLLAB_COLORS = [
    // @ts-ignore
    colors.AMBER_600,
    // @ts-ignore
    colors.BLUE_600,
    // @ts-ignore
    colors.CYAN_600,
    // @ts-ignore
    colors.GREEN_600,
    // @ts-ignore
    colors.INDIGO_600,
    // @ts-ignore
    colors.LIME_600,
    // @ts-ignore
    colors.ORANGE_600,
    // @ts-ignore
    colors.PINK_600,
    // @ts-ignore
    colors.PURPLE_600,
    // @ts-ignore
    colors.RED_600,
    // @ts-ignore
];
// @ts-ignore
// @ts-ignore
/**
// @ts-ignore
 * list of default names for collaborators
// @ts-ignore
 */
// @ts-ignore
exports.COLLAB_NAMES = [
    // @ts-ignore
    'Joud',
    // @ts-ignore
    'Zavier',
    // @ts-ignore
    'Thomas',
    // @ts-ignore
    'Jaime',
    // @ts-ignore
    'Dila',
    // @ts-ignore
    'Bella',
    // @ts-ignore
    'Julian',
    // @ts-ignore
    'Adriana',
    // @ts-ignore
    'Juliana',
    // @ts-ignore
    'Yona'
    // @ts-ignore
];
// @ts-ignore
// @ts-ignore
exports.FOCUSABLE_GRAPH_TYPES = ['node', 'edge'];
// @ts-ignore
exports.FOCUS_THEME_ID = 'use-focus-graph';
// @ts-ignore
// @ts-ignore
/**
// @ts-ignore
 * @returns an empty event bus with all events initialized to empty sets
// @ts-ignore
 */
// @ts-ignore
const getInitialEventBus = () => {
    // @ts-ignore
    const eventBus = {
        // @ts-ignore
        /**
    // @ts-ignore
         * BaseGraphEvents
    // @ts-ignore
         */
        // @ts-ignore
        onStructureChange: new Set(),
        // @ts-ignore
        // @ts-ignore
        onNodeAdded: new Set(),
        // @ts-ignore
        onBulkNodeAdded: new Set(),
        // @ts-ignore
        // @ts-ignore
        onNodeRemoved: new Set(),
        // @ts-ignore
        onBulkNodeRemoved: new Set(),
        // @ts-ignore
        // @ts-ignore
        onNodeMoved: new Set(),
        // @ts-ignore
        onBulkNodeMoved: new Set(),
        // @ts-ignore
        // @ts-ignore
        onEdgeAdded: new Set(),
        // @ts-ignore
        onBulkEdgeAdded: new Set(),
        // @ts-ignore
        // @ts-ignore
        onEdgeRemoved: new Set(),
        // @ts-ignore
        onBulkEdgeRemoved: new Set(),
        // @ts-ignore
        // @ts-ignore
        onEdgeLabelChange: new Set(),
        // @ts-ignore
        // @ts-ignore
        onRepaint: new Set(),
        // @ts-ignore
        onNodeHoverChange: new Set(),
        // @ts-ignore
        onGraphReset: new Set(),
        // @ts-ignore
        // @ts-ignore
        onClick: new Set(),
        // @ts-ignore
        onMouseDown: new Set(),
        // @ts-ignore
        onMouseUp: new Set(),
        // @ts-ignore
        onMouseMove: new Set(),
        // @ts-ignore
        onDblClick: new Set(),
        // @ts-ignore
        onContextMenu: new Set(),
        // @ts-ignore
        // @ts-ignore
        onKeydown: new Set(),
        // @ts-ignore
        // @ts-ignore
        onThemeChange: new Set(),
        // @ts-ignore
        onSettingsChange: new Set(),
        // @ts-ignore
        // @ts-ignore
        /**
    // @ts-ignore
         * HistoryGraphEvents
    // @ts-ignore
         */
        // @ts-ignore
        onUndo: new Set(),
        // @ts-ignore
        onRedo: new Set(),
        // @ts-ignore
        // @ts-ignore
        /**
    // @ts-ignore
         * FocusGraphEvents
    // @ts-ignore
         */
        // @ts-ignore
        onFocusChange: new Set(),
        // @ts-ignore
        // @ts-ignore
        /**
    // @ts-ignore
         * DraggableGraphEvents
    // @ts-ignore
         */
        // @ts-ignore
        onNodeDragStart: new Set(),
        // @ts-ignore
        onNodeDrop: new Set(),
        // @ts-ignore
        // @ts-ignore
        /**
    // @ts-ignore
         * NodeAnchorGraphEvents
    // @ts-ignore
         */
        // @ts-ignore
        onNodeAnchorDragStart: new Set(),
        // @ts-ignore
        onNodeAnchorDrop: new Set(),
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    return eventBus;
};
exports.getInitialEventBus = getInitialEventBus;
// @ts-ignore
// @ts-ignore
exports.DEFAULT_BASE_SETTINGS = {
    // @ts-ignore
    displayEdgeLabels: true,
    // @ts-ignore
    edgeLabelsEditable: true,
    // @ts-ignore
    edgeInputToLabel: (input) => {
        // @ts-ignore
        const trimmed = input.trim();
        // @ts-ignore
        if (!trimmed)
            return;
        // @ts-ignore
        const decimalNum = fractionToDecimal(trimmed)?.toFixed(2);
        // @ts-ignore
        if (decimalNum === "Infinity")
            return '∞';
        // @ts-ignore
        else if (decimalNum === "-Infinity")
            return '-∞';
        // @ts-ignore
        else if (decimalNum === undefined && isNaN(Number(trimmed)))
            return;
        // @ts-ignore
        return decimalNum ?? trimmed;
        // @ts-ignore
    },
    // @ts-ignore
    newNodeLabelGetter: null,
    // @ts-ignore
};
// @ts-ignore
// @ts-ignore
exports.DEFAULT_FOCUS_SETTINGS = {
    // @ts-ignore
    focusable: true,
    // @ts-ignore
    focusBlacklist: [],
    // @ts-ignore
};
// @ts-ignore
// @ts-ignore
exports.DEFAULT_DRAGGABLE_SETTINGS = {
    // @ts-ignore
    draggable: true,
    // @ts-ignore
};
// @ts-ignore
// @ts-ignore
exports.DEFAULT_NODE_ANCHOR_SETTINGS = {
    // @ts-ignore
    nodeAnchors: true
    // @ts-ignore
};
// @ts-ignore
// @ts-ignore
exports.DEFAULT_MARQUEE_SETTINGS = {
    // @ts-ignore
    marquee: true,
    // @ts-ignore
    marqueeSelectableGraphTypes: ['node', 'edge'],
    // @ts-ignore
};
// @ts-ignore
// @ts-ignore
exports.DEFAULT_USER_EDITABLE_SETTINGS = {
    // @ts-ignore
    userEditable: true,
    // @ts-ignore
    userEditableAddedEdgeType: 'directed',
    // @ts-ignore
    userEditableAddedEdgeLabel: "1",
    // @ts-ignore
};
// @ts-ignore
// @ts-ignore
exports.DEFAULT_PERSISTENT_SETTINGS = {
    // @ts-ignore
    persistent: true,
    // @ts-ignore
    persistentStorageKey: 'graph',
    // @ts-ignore
    persistentTrackTheme: false,
    // @ts-ignore
    persistentTrackSettings: false,
    // @ts-ignore
};
// @ts-ignore
// @ts-ignore
exports.DEFAULT_COLLABORATIVE_SETTINGS = {};
// @ts-ignore
// @ts-ignore
/**
// @ts-ignore
 * the default settings for a graph instance
// @ts-ignore
 */
// @ts-ignore
exports.DEFAULT_GRAPH_SETTINGS = {
    // @ts-ignore
    ...exports.DEFAULT_BASE_SETTINGS,
    // @ts-ignore
    ...exports.DEFAULT_FOCUS_SETTINGS,
    // @ts-ignore
    ...exports.DEFAULT_DRAGGABLE_SETTINGS,
    // @ts-ignore
    ...exports.DEFAULT_NODE_ANCHOR_SETTINGS,
    // @ts-ignore
    ...exports.DEFAULT_MARQUEE_SETTINGS,
    // @ts-ignore
    ...exports.DEFAULT_USER_EDITABLE_SETTINGS,
    // @ts-ignore
    ...exports.DEFAULT_PERSISTENT_SETTINGS,
    // @ts-ignore
    ...exports.DEFAULT_COLLABORATIVE_SETTINGS,
    // @ts-ignore
};
// @ts-ignore
// @ts-ignore
// @ts-ignore
const getThemeResolver = (
// @ts-ignore
theme, 
// @ts-ignore
themeMap) => (
// @ts-ignore
prop, 
// @ts-ignore
...args
// @ts-ignore
) => {
    // @ts-ignore
    const themeMapEntry = themeMap[prop].findLast((themeMapEntryItem) => {
        // @ts-ignore
        const themeGetterOrValue = themeMapEntryItem.value;
        // @ts-ignore
        const themeValue = getValue(
        // @ts-ignore
        themeGetterOrValue, 
        // @ts-ignore
        ...args
        // @ts-ignore
        );
        // @ts-ignore
        return themeValue ?? false;
        // @ts-ignore
    });
    // @ts-ignore
    const getter = themeMapEntry?.value ?? theme.value[prop];
    // @ts-ignore
    if (!getter)
        throw new Error(`Theme property "${prop}" not found`);
    // @ts-ignore
    return getValue(getter, ...args);
    // @ts-ignore
};
exports.getThemeResolver = getThemeResolver;
// @ts-ignore
// @ts-ignore
exports.THEMES = {
    // @ts-ignore
    light: LIGHT_THEME,
    // @ts-ignore
    dark: DARK_THEME,
    // @ts-ignore
    girl: GIRL_THEME,
    // @ts-ignore
};
// @ts-ignore
// @ts-ignore
/**
// @ts-ignore
 * gets the theme attributes for a GNode at the point in time the function is called
// @ts-ignore
 *
// @ts-ignore
 * @param getTheme - the theme getter function
// @ts-ignore
 * @param node - the node to get the theme for
// @ts-ignore
 * @returns the theme attributes for the node
// @ts-ignore
 */
// @ts-ignore
const resolveThemeForNode = (getTheme, node) => ({
    // @ts-ignore
    nodeSize: getTheme('nodeSize', node),
    // @ts-ignore
    nodeBorderWidth: getTheme('nodeBorderWidth', node),
    // @ts-ignore
    nodeColor: getTheme('nodeColor', node),
    // @ts-ignore
    nodeBorderColor: getTheme('nodeBorderColor', node),
    // @ts-ignore
    nodeTextSize: getTheme('nodeTextSize', node),
    // @ts-ignore
    nodeTextColor: getTheme('nodeTextColor', node),
    // @ts-ignore
    nodeText: getTheme('nodeText', node),
    // @ts-ignore
    nodeShape: getTheme('nodeShape', node),
    // @ts-ignore
});
exports.resolveThemeForNode = resolveThemeForNode;
// @ts-ignore
// @ts-ignore
/**
// @ts-ignore
 * gets the theme attributes for a GEdge at the point in time the function is called
// @ts-ignore
 *
// @ts-ignore
 * @param getTheme - the theme getter function
// @ts-ignore
 * @param edge - the edge to get the theme for
// @ts-ignore
 * @returns the theme attributes for the edge
// @ts-ignore
 */
// @ts-ignore
const resolveThemeForEdge = (getTheme, edge) => ({
    // @ts-ignore
    edgeWidth: getTheme('edgeWidth', edge),
    // @ts-ignore
    edgeColor: getTheme('edgeColor', edge),
    // @ts-ignore
    edgeTextSize: getTheme('edgeTextSize', edge),
    // @ts-ignore
    edgeTextColor: getTheme('edgeTextColor', edge),
    // @ts-ignore
    edgeTextFontWeight: getTheme('edgeTextFontWeight', edge),
    // @ts-ignore
});
exports.resolveThemeForEdge = resolveThemeForEdge;
// @ts-ignore
// @ts-ignore
/**
// @ts-ignore
 * themes that do not depend on color scheme
// @ts-ignore
 */
// @ts-ignore
exports.NON_COLOR_THEMES = {
    // @ts-ignore
    nodeShape: 'circle',
    // @ts-ignore
    nodeSize: 35,
    // @ts-ignore
    nodeBorderWidth: 8,
    // @ts-ignore
    nodeTextSize: 24,
    // @ts-ignore
    // Math.ceil(Math.sqrt(nodeSize) * 2)
    // @ts-ignore
    nodeAnchorRadius: Math.ceil(Math.sqrt(35) * 2),
    // @ts-ignore
    edgeWidth: 10,
    // @ts-ignore
    edgeTextSize: 20,
    // @ts-ignore
    nodeText: ({ label }) => label,
    // @ts-ignore
    edgeTextFontWeight: 'bold',
    // @ts-ignore
    linkPreviewWidth: 10,
};
// @ts-ignore
// @ts-ignore
const getInitialThemeMap = () => ({
    // @ts-ignore
    /**
  // @ts-ignore
     * UI themes
  // @ts-ignore
     */
    // @ts-ignore
    primaryColor: [],
    // @ts-ignore
    secondaryColor: [],
    // @ts-ignore
    tertiaryColor: [],
    // @ts-ignore
    primaryTextColor: [],
    // @ts-ignore
    secondaryTextColor: [],
    // @ts-ignore
    tertiaryTextColor: [],
    // @ts-ignore
    // @ts-ignore
    /**
  // @ts-ignore
     * base themes
  // @ts-ignore
     */
    // @ts-ignore
    nodeSize: [],
    // @ts-ignore
    nodeBorderWidth: [],
    // @ts-ignore
    nodeColor: [],
    // @ts-ignore
    nodeBorderColor: [],
    // @ts-ignore
    nodeFocusColor: [],
    // @ts-ignore
    nodeFocusBorderColor: [],
    // @ts-ignore
    nodeText: [],
    // @ts-ignore
    nodeFocusTextColor: [],
    // @ts-ignore
    nodeTextSize: [],
    // @ts-ignore
    nodeTextColor: [],
    // @ts-ignore
    nodeShape: [],
    // @ts-ignore
    edgeColor: [],
    // @ts-ignore
    edgeWidth: [],
    // @ts-ignore
    edgeTextSize: [],
    // @ts-ignore
    edgeTextColor: [],
    // @ts-ignore
    edgeFocusTextColor: [],
    // @ts-ignore
    edgeTextFontWeight: [],
    // @ts-ignore
    edgeFocusColor: [],
    // @ts-ignore
    // @ts-ignore
    graphBgColor: [],
    // @ts-ignore
    graphBgPatternColor: [],
    // @ts-ignore
    // @ts-ignore
    /**
  // @ts-ignore
     * node anchor themes
  // @ts-ignore
     */
    // @ts-ignore
    nodeAnchorRadius: [],
    // @ts-ignore
    nodeAnchorColor: [],
    // @ts-ignore
    nodeAnchorColorWhenParentFocused: [],
    // @ts-ignore
    linkPreviewColor: [],
    // @ts-ignore
    linkPreviewWidth: [],
    // @ts-ignore
    // @ts-ignore
    /**
  // @ts-ignore
     * marquee themes
  // @ts-ignore
     */
    // @ts-ignore
    marqueeSelectionBoxColor: [],
    // @ts-ignore
    marqueeSelectionBoxBorderColor: [],
    // @ts-ignore
    marqueeEncapsulatedNodeBoxColor: [],
    // @ts-ignore
    marqueeEncapsulatedNodeBoxBorderColor: [],
    // @ts-ignore
});
exports.getInitialThemeMap = getInitialThemeMap;
// @ts-ignore
// @ts-ignore
exports.DEFAULT_INTERVAL = 1000;
// @ts-ignore
// @ts-ignore
// @ts-ignore
/**
// @ts-ignore
 * time to wait (in milliseconds) between the dismissal of a step and the initialization of the next step
// @ts-ignore
 */
// @ts-ignore
exports.DELAY_UNTIL_NEXT_STEP = 1000;
// @ts-ignore
// @ts-ignore
exports.TUTORIAL_THEME_ID = 'tutorial';
// @ts-ignore
// @ts-ignore
/**
// @ts-ignore
 * serializable infinity value for node distance
// @ts-ignore
 */
// @ts-ignore
exports.INF = 999999;
// @ts-ignore
// @ts-ignore
const dijkstras = (graph) => (startingNodeId) => {
    // @ts-ignore
    // @ts-ignore
    const distanceArr = graph.nodes.value.map(
    // @ts-ignore
    (n) => 
    // @ts-ignore
    ({
        // @ts-ignore
        id: n.id,
        // @ts-ignore
        distance: exports.INF,
        // @ts-ignore
    })
    // @ts-ignore
    );
    // @ts-ignore
    // @ts-ignore
    // assign distance 0 to source
    // @ts-ignore
    distanceArr.filter((n) => n.id === startingNodeId)[0].distance = 0;
    // @ts-ignore
    // @ts-ignore
    let priorityQueue = [...distanceArr];
    // @ts-ignore
    const exploredNodes = [{ id: startingNodeId, distance: 0 }];
    // @ts-ignore
    const nodeParentMap = new Map();
    // @ts-ignore
    // @ts-ignore
    // initialize trace with first source without any nodes explored
    // @ts-ignore
    const trace = [
        // @ts-ignore
        {
            // @ts-ignore
            source: { id: startingNodeId, distance: 0 },
            // @ts-ignore
            exploredNodes: JSON.parse(
            // @ts-ignore
            JSON.stringify(exploredNodes)
            // @ts-ignore
            ),
            // @ts-ignore
            distances: JSON.parse(JSON.stringify(distanceArr)),
            // @ts-ignore
            nodeParentMap: new Map(nodeParentMap),
            // @ts-ignore
        },
        // @ts-ignore
    ];
    // @ts-ignore
    // @ts-ignore
    // iterate through priority queue
    // @ts-ignore
    while (priorityQueue.length !== 0) {
        // @ts-ignore
        // grab node with least-distance
        // @ts-ignore
        const sourceNode = priorityQueue.reduce(
        // @ts-ignore
        (acc, cur) => (cur.distance < acc.distance ? cur : acc), 
        // @ts-ignore
        { id: "", distance: Infinity }
        // @ts-ignore
        );
        // @ts-ignore
        // @ts-ignore
        // remove that node
        // @ts-ignore
        priorityQueue = priorityQueue.filter((e) => e.id !== sourceNode.id);
        // @ts-ignore
        // @ts-ignore
        // don't iterate through nodes with no ingoing edges
        // @ts-ignore
        if (
        // @ts-ignore
        getInboundEdges(sourceNode.id, graph).length === 0 &&
            // @ts-ignore
            sourceNode.id !== startingNodeId
        // @ts-ignore
        )
            // @ts-ignore
            continue;
        // @ts-ignore
        // @ts-ignore
        // iterate through source's neighbors
        // @ts-ignore
        getOutboundEdges(sourceNode.id, graph).forEach((edge) => {
            // @ts-ignore
            // updates distance of neighbor if new distance is less than old
            // @ts-ignore
            const newDistanceIsLess = 
            // @ts-ignore
            distanceArr.filter((e) => e.id === edge.from)[0].distance +
                // @ts-ignore
                Number(edge.label) <
                // @ts-ignore
                distanceArr.filter((e) => e.id === edge.to)[0].distance;
            // @ts-ignore
            if (newDistanceIsLess) {
                // @ts-ignore
                const newDistance = 
                // @ts-ignore
                distanceArr.filter((e) => e.id === edge.from)[0].distance +
                    // @ts-ignore
                    Number(edge.label);
                // @ts-ignore
                distanceArr.filter((e) => e.id === edge.to)[0].distance = newDistance;
                // @ts-ignore
                // @ts-ignore
                // idk if this should be outside if or not
                // @ts-ignore
                const neighborAlreadyExplored = exploredNodes
                    // @ts-ignore
                    .map((n) => n.id)
                    // @ts-ignore
                    .includes(edge.to);
                // @ts-ignore
                if (!neighborAlreadyExplored)
                    // @ts-ignore
                    exploredNodes.push({ id: edge.to, distance: newDistance });
                // @ts-ignore
                // @ts-ignore
                nodeParentMap.set(edge.to, sourceNode.id);
                // @ts-ignore
            }
            // @ts-ignore
        });
        // @ts-ignore
        trace.push({
            // @ts-ignore
            source: sourceNode,
            // @ts-ignore
            exploredNodes: JSON.parse(
            // @ts-ignore
            JSON.stringify(exploredNodes)
            // @ts-ignore
            ),
            // @ts-ignore
            distances: JSON.parse(JSON.stringify(distanceArr)),
            // @ts-ignore
            nodeParentMap: new Map(nodeParentMap),
            // @ts-ignore
        });
        // @ts-ignore
    }
    // @ts-ignore
    // @ts-ignore
    // push an empty source to give the impression that there are no more nodes to check
    // @ts-ignore
    trace.push({
        // @ts-ignore
        source: { id: "", distance: 0 },
        // @ts-ignore
        exploredNodes: JSON.parse(
        // @ts-ignore
        JSON.stringify(exploredNodes)
        // @ts-ignore
        ),
        // @ts-ignore
        distances: JSON.parse(JSON.stringify(distanceArr)),
        // @ts-ignore
        nodeParentMap: new Map(nodeParentMap),
        // @ts-ignore
    });
    // @ts-ignore
    // @ts-ignore
    return trace;
    // @ts-ignore
};
// @ts-ignore
// @ts-ignore
const useDijkstra = (graph) => {
    // @ts-ignore
    const trace = ref([]);
    // @ts-ignore
    const getDijkstrasTrace = dijkstras(graph);
    // @ts-ignore
    // @ts-ignore
    // TODO - make this be a ref that a user can write to
    // @ts-ignore
    // const startingNodeId = ref<GNode['id'] | undefined>();
    // @ts-ignore
    const startingNodeId = computed(() => {
        // @ts-ignore
        const nodeLabelledA = graph.nodes.value.find((n) => n.label === "A");
        // @ts-ignore
        return nodeLabelledA?.id;
        // @ts-ignore
    });
    // @ts-ignore
    // @ts-ignore
    const update = () => {
        // @ts-ignore
        if (!startingNodeId.value)
            return;
        // @ts-ignore
        const startingNode = graph.getNode(startingNodeId.value);
        // @ts-ignore
        if (!startingNode)
            return;
        // @ts-ignore
        trace.value = getDijkstrasTrace(startingNode.id);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    graph.subscribe("onStructureChange", update);
    // @ts-ignore
    graph.subscribe("onEdgeLabelChange", update);
    // @ts-ignore
    graph.subscribe("onGraphReset", update);
    // @ts-ignore
    // @ts-ignore
    update();
    // @ts-ignore
    // @ts-ignore
    return { trace };
    // @ts-ignore
};
exports.useDijkstra = useDijkstra;
// @ts-ignore
// @ts-ignore
const useMSTSimulation = (
// @ts-ignore
graph, 
// @ts-ignore
currentAlgorithm
// @ts-ignore
) => {
    // @ts-ignore
    const { trace: kTrace } = useKruskal(graph);
    // @ts-ignore
    const { trace: pTrace } = usePrims(graph);
    // @ts-ignore
    // @ts-ignore
    const trace = computed(() => {
        // @ts-ignore
        if (currentAlgorithm.value === "none")
            return graph.edges.value;
        // @ts-ignore
        else if (currentAlgorithm.value === "prim")
            return pTrace.value;
        // @ts-ignore
        else
            return kTrace.value;
        // @ts-ignore
    });
    // @ts-ignore
    // @ts-ignore
    const step = ref(0);
    // @ts-ignore
    const paused = ref(true);
    // @ts-ignore
    const playbackSpeed = ref(1_500);
    // @ts-ignore
    const active = ref(false);
    // @ts-ignore
    const interval = ref();
    // @ts-ignore
    const isOver = computed(() => step.value === trace.value.length + 1);
    // @ts-ignore
    const hasBegun = computed(() => step.value > 0);
    // @ts-ignore
    // @ts-ignore
    const traceAtStep = computed(() => trace.value.slice(0, step.value));
    // @ts-ignore
    // @ts-ignore
    const start = () => {
        // @ts-ignore
        paused.value = false;
        // @ts-ignore
        active.value = true;
        // @ts-ignore
        step.value = 0;
        // @ts-ignore
        interval.value = setInterval(() => {
            // @ts-ignore
            if (isOver.value || paused.value)
                return;
            // @ts-ignore
            nextStep();
            // @ts-ignore
        }, playbackSpeed.value);
        // @ts-ignore
        useColorizeGraph(graph, traceAtStep.value);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const stop = () => {
        // @ts-ignore
        if (interval.value)
            clearInterval(interval.value);
        // @ts-ignore
        active.value = false;
        // @ts-ignore
        setStep(trace.value.length);
        // @ts-ignore
        useColorizeGraph(graph, traceAtStep.value);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const nextStep = () => {
        // @ts-ignore
        if (!trace.value)
            return;
        // @ts-ignore
        if (step.value === trace.value.length + 1)
            return;
        // @ts-ignore
        step.value++;
        // @ts-ignore
        // @ts-ignore
        useColorizeGraph(graph, traceAtStep.value);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const prevStep = () => {
        // @ts-ignore
        if (step.value === 0)
            return;
        // @ts-ignore
        step.value--;
        // @ts-ignore
        // @ts-ignore
        useColorizeGraph(graph, traceAtStep.value);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const setStep = (newStep) => {
        // @ts-ignore
        if (newStep < -1 || newStep > trace.value.length)
            return;
        // @ts-ignore
        step.value = newStep;
        // @ts-ignore
        // @ts-ignore
        useColorizeGraph(graph, traceAtStep.value);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    return {
        // @ts-ignore
        nextStep,
        // @ts-ignore
        prevStep,
        // @ts-ignore
        setStep,
        // @ts-ignore
        // @ts-ignore
        trace: computed(() => trace.value),
        // @ts-ignore
        step: computed(() => step.value),
        // @ts-ignore
        // @ts-ignore
        start,
        // @ts-ignore
        stop,
        // @ts-ignore
        paused,
        // @ts-ignore
        playbackSpeed,
        // @ts-ignore
        // @ts-ignore
        isOver,
        // @ts-ignore
        hasBegun,
        // @ts-ignore
        isActive: computed(() => active.value),
        // @ts-ignore
        // progress: computed(() => `${step.value} / ${trace.value.length}`),
        // @ts-ignore
    };
    // @ts-ignore
};
exports.useMSTSimulation = useMSTSimulation;
// @ts-ignore
// @ts-ignore
exports.CIRCLE_DEFAULTS = {
    // @ts-ignore
    color: 'black',
    // @ts-ignore
};
// @ts-ignore
// @ts-ignore
const circle = (options) => {
    // @ts-ignore
    // @ts-ignore
    if (options.radius < 0) {
        // @ts-ignore
        throw new Error('radius must be positive');
        // @ts-ignore
    }
    // @ts-ignore
    // @ts-ignore
    const drawShape = drawCircleWithCtx(options);
    // @ts-ignore
    // @ts-ignore
    const shapeHitbox = circleHitbox(options);
    // @ts-ignore
    const textHitbox = circleTextHitbox(options);
    // @ts-ignore
    const efficientHitbox = circleEfficientHitbox(options);
    // @ts-ignore
    const hitbox = (point) => {
        // @ts-ignore
        return textHitbox?.(point) || shapeHitbox(point);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    const drawTextArea = drawTextAreaOnCircle(options);
    // @ts-ignore
    // @ts-ignore
    const drawTextAreaMatte = drawTextAreaMatteOnCircle(options);
    // @ts-ignore
    const drawText = drawTextOnCircle(options);
    // @ts-ignore
    // @ts-ignore
    const draw = (ctx) => {
        // @ts-ignore
        drawShape(ctx);
        // @ts-ignore
        drawTextArea?.(ctx);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const activateTextArea = (handler) => {
        // @ts-ignore
        if (!options.textArea)
            return;
        // @ts-ignore
        const location = getTextAreaLocationOnCircle(options);
        // @ts-ignore
        const fullTextArea = getFullTextArea(options.textArea, location);
        // @ts-ignore
        engageTextarea(fullTextArea, handler);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    return {
        // @ts-ignore
        id: generateId(),
        // @ts-ignore
        name: 'circle',
        // @ts-ignore
        // @ts-ignore
        draw,
        // @ts-ignore
        // @ts-ignore
        drawShape,
        // @ts-ignore
        drawTextArea,
        // @ts-ignore
        drawTextAreaMatte,
        // @ts-ignore
        drawText,
        // @ts-ignore
        // @ts-ignore
        hitbox,
        // @ts-ignore
        shapeHitbox,
        // @ts-ignore
        textHitbox,
        // @ts-ignore
        efficientHitbox,
        // @ts-ignore
        // @ts-ignore
        activateTextArea,
        // @ts-ignore
    };
};
exports.circle = circle;
// @ts-ignore
// @ts-ignore
exports.CROSS_DEFAULTS = {
    // @ts-ignore
    rotation: 0,
    // @ts-ignore
    color: 'black',
    // @ts-ignore
    lineWidth: exports.LINE_DEFAULTS.width,
    // @ts-ignore
    borderRadius: 0,
    // @ts-ignore
};
// @ts-ignore
// @ts-ignore
const cross = (options) => {
    // @ts-ignore
    // @ts-ignore
    if (options.lineWidth && options.lineWidth < 0) {
        // @ts-ignore
        throw new Error('lineWidth must be positive');
        // @ts-ignore
    }
    // @ts-ignore
    // @ts-ignore
    const drawShape = drawCrossWithCtx(options);
    // @ts-ignore
    const shapeHitbox = crossHitbox(options);
    // @ts-ignore
    const efficientHitbox = crossEfficientHitbox(options);
    // @ts-ignore
    const hitbox = (point) => {
        // @ts-ignore
        return shapeHitbox(point); // text not implemented yet
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    const draw = (ctx) => {
        // @ts-ignore
        drawShape(ctx);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    return {
        // @ts-ignore
        id: generateId(),
        // @ts-ignore
        name: 'cross',
        // @ts-ignore
        // @ts-ignore
        draw,
        // @ts-ignore
        drawShape,
        // @ts-ignore
        // @ts-ignore
        shapeHitbox,
        // @ts-ignore
        hitbox,
        // @ts-ignore
        efficientHitbox,
        // @ts-ignore
    };
};
exports.cross = cross;
// @ts-ignore
// @ts-ignore
exports.LINE_DEFAULTS = {
    // @ts-ignore
    width: 10,
    // @ts-ignore
    textOffsetFromCenter: 0,
    // @ts-ignore
    color: 'black',
    // @ts-ignore
};
// @ts-ignore
// @ts-ignore
const line = (options) => {
    // @ts-ignore
    // @ts-ignore
    if (options.width && options.width < 0) {
        // @ts-ignore
        throw new Error('lineWidth must be positive');
        // @ts-ignore
    }
    // @ts-ignore
    // @ts-ignore
    const drawShape = drawLineWithCtx(options);
    // @ts-ignore
    // @ts-ignore
    const shapeHitbox = lineHitbox(options);
    // @ts-ignore
    const textHitbox = lineTextHitbox(options);
    // @ts-ignore
    const efficientHitbox = lineEfficientHitbox(options);
    // @ts-ignore
    const hitbox = (point) => {
        // @ts-ignore
        return textHitbox?.(point) || shapeHitbox(point);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const drawTextArea = drawTextAreaOnLine(options);
    // @ts-ignore
    // @ts-ignore
    const drawTextAreaMatte = drawTextAreaMatteOnLine(options);
    // @ts-ignore
    const drawText = drawTextOnLine(options);
    // @ts-ignore
    // @ts-ignore
    const draw = (ctx) => {
        // @ts-ignore
        drawShape(ctx);
        // @ts-ignore
        drawTextArea?.(ctx);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const activateTextArea = (handler) => {
        // @ts-ignore
        if (!options.textArea)
            return;
        // @ts-ignore
        const location = getTextAreaLocationOnLine(options);
        // @ts-ignore
        const fullTextArea = getFullTextArea(options.textArea, location);
        // @ts-ignore
        engageTextarea(fullTextArea, handler);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    return {
        // @ts-ignore
        id: generateId(),
        // @ts-ignore
        name: 'line',
        // @ts-ignore
        // @ts-ignore
        draw,
        // @ts-ignore
        // @ts-ignore
        drawShape,
        // @ts-ignore
        drawTextArea,
        // @ts-ignore
        drawTextAreaMatte,
        // @ts-ignore
        drawText,
        // @ts-ignore
        // @ts-ignore
        hitbox,
        // @ts-ignore
        shapeHitbox,
        // @ts-ignore
        textHitbox,
        // @ts-ignore
        efficientHitbox,
        // @ts-ignore
        // @ts-ignore
        activateTextArea,
        // @ts-ignore
    };
};
exports.line = line;
// @ts-ignore
// @ts-ignore
exports.RECT_DEFAULTS = {
    // @ts-ignore
    color: 'black',
    // @ts-ignore
    borderRadius: 0,
    // @ts-ignore
    rotation: 0,
    // @ts-ignore
};
// @ts-ignore
// @ts-ignore
const rect = (options) => {
    // @ts-ignore
    // @ts-ignore
    if (options.borderRadius && options.borderRadius < 0) {
        // @ts-ignore
        throw new Error('borderRadius must be positive');
        // @ts-ignore
    }
    // @ts-ignore
    // @ts-ignore
    const drawShape = drawRectWithCtx(options);
    // @ts-ignore
    // @ts-ignore
    const shapeHitbox = rectHitbox(options);
    // @ts-ignore
    const textHitbox = rectTextHitbox(options);
    // @ts-ignore
    const efficientHitbox = rectEfficientHitbox(options);
    // @ts-ignore
    const hitbox = (point) => {
        // @ts-ignore
        return textHitbox?.(point) || shapeHitbox(point);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const drawTextArea = drawTextAreaOnRect(options);
    // @ts-ignore
    // @ts-ignore
    const drawTextAreaMatte = drawTextAreaMatteOnRect(options);
    // @ts-ignore
    const drawText = drawTextOnRect(options);
    // @ts-ignore
    // @ts-ignore
    const draw = (ctx) => {
        // @ts-ignore
        drawShape(ctx);
        // @ts-ignore
        drawTextArea?.(ctx);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const activateTextArea = (handler) => {
        // @ts-ignore
        if (!options.textArea)
            return;
        // @ts-ignore
        const location = getTextAreaLocationOnRect(options);
        // @ts-ignore
        const fullTextArea = getFullTextArea(options.textArea, location);
        // @ts-ignore
        engageTextarea(fullTextArea, handler);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    return {
        // @ts-ignore
        id: generateId(),
        // @ts-ignore
        name: 'rect',
        // @ts-ignore
        // @ts-ignore
        draw,
        // @ts-ignore
        // @ts-ignore
        drawShape,
        // @ts-ignore
        drawTextArea,
        // @ts-ignore
        drawTextAreaMatte,
        // @ts-ignore
        drawText,
        // @ts-ignore
        // @ts-ignore
        hitbox,
        // @ts-ignore
        shapeHitbox,
        // @ts-ignore
        textHitbox,
        // @ts-ignore
        efficientHitbox,
        // @ts-ignore
        // @ts-ignore
        activateTextArea,
        // @ts-ignore
    };
};
exports.rect = rect;
// @ts-ignore
// @ts-ignore
/**
// @ts-ignore
 * squares use rect default values
// @ts-ignore
 */
// @ts-ignore
const square = (options) => {
    // @ts-ignore
    const drawShape = drawSquareWithCtx(options);
    // @ts-ignore
    // @ts-ignore
    const shapeHitbox = squareHitbox(options);
    // @ts-ignore
    const textHitbox = squareTextHitbox(options);
    // @ts-ignore
    const efficientHitbox = squareEfficientHitbox(options);
    // @ts-ignore
    const hitbox = (point) => {
        // @ts-ignore
        return textHitbox?.(point) || shapeHitbox(point);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const drawTextArea = drawTextAreaOnSquare(options);
    // @ts-ignore
    // @ts-ignore
    const drawTextAreaMatte = drawTextAreaMatteOnSquare(options);
    // @ts-ignore
    const drawText = drawTextOnSquare(options);
    // @ts-ignore
    // @ts-ignore
    const draw = (ctx) => {
        // @ts-ignore
        drawShape(ctx);
        // @ts-ignore
        drawTextArea?.(ctx);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const activateTextArea = (handler) => {
        // @ts-ignore
        if (!options.textArea)
            return;
        // @ts-ignore
        const location = getTextAreaLocationOnSquare(options);
        // @ts-ignore
        const fullTextArea = getFullTextArea(options.textArea, location);
        // @ts-ignore
        engageTextarea(fullTextArea, handler);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    return {
        // @ts-ignore
        id: generateId(),
        // @ts-ignore
        name: 'square',
        // @ts-ignore
        // @ts-ignore
        draw,
        // @ts-ignore
        // @ts-ignore
        drawShape,
        // @ts-ignore
        drawTextArea,
        // @ts-ignore
        drawTextAreaMatte,
        // @ts-ignore
        drawText,
        // @ts-ignore
        // @ts-ignore
        hitbox,
        // @ts-ignore
        shapeHitbox,
        // @ts-ignore
        textHitbox,
        // @ts-ignore
        efficientHitbox,
        // @ts-ignore
        // @ts-ignore
        activateTextArea,
        // @ts-ignore
    };
};
exports.square = square;
// @ts-ignore
// @ts-ignore
exports.TRIANGLE_DEFAULTS = {
    // @ts-ignore
    color: 'black',
    // @ts-ignore
};
// @ts-ignore
// @ts-ignore
const triangle = (options) => {
    // @ts-ignore
    const drawShape = drawTriangleWithCtx(options);
    // @ts-ignore
    const shapeHitbox = triangleHitbox(options);
    // @ts-ignore
    const efficientHitbox = triangleEfficientHitbox(options);
    // @ts-ignore
    const hitbox = (point) => {
        // @ts-ignore
        return shapeHitbox(point); // text not implemented yet
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const draw = (ctx) => {
        // @ts-ignore
        drawShape(ctx);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    return {
        // @ts-ignore
        id: generateId(),
        // @ts-ignore
        name: 'triangle',
        // @ts-ignore
        // @ts-ignore
        draw,
        // @ts-ignore
        drawShape,
        // @ts-ignore
        // @ts-ignore
        hitbox,
        // @ts-ignore
        shapeHitbox,
        // @ts-ignore
        efficientHitbox,
        // @ts-ignore
    };
};
exports.triangle = triangle;
// @ts-ignore
// @ts-ignore
exports.TEXTAREA_DEFAULTS = {
    // @ts-ignore
    color: 'white',
    // @ts-ignore
    // TODO - make active color depend on the color of the text area
    // @ts-ignore
    activeColor: 'white',
    // @ts-ignore
};
// @ts-ignore
// @ts-ignore
exports.TEXT_DEFAULTS = {
    // @ts-ignore
    fontSize: 12,
    // @ts-ignore
    fontWeight: 'normal',
    // @ts-ignore
    color: 'black',
    // @ts-ignore
};
// @ts-ignore
// @ts-ignore
exports.STROKE_DEFAULTS = {
    // @ts-ignore
    color: 'black',
    // @ts-ignore
    width: 0
};
// @ts-ignore
// @ts-ignore
exports.UTURN_DEFAULTS = {
    // @ts-ignore
    color: 'black',
    // @ts-ignore
};
// @ts-ignore
// @ts-ignore
const uturn = (options) => {
    // @ts-ignore
    // @ts-ignore
    if (options.downDistance < 0) {
        // @ts-ignore
        throw new Error('downDistance must be positive');
        // @ts-ignore
    }
    // @ts-ignore
    // @ts-ignore
    if (options.upDistance < 0) {
        // @ts-ignore
        throw new Error('upDistance must be positive');
        // @ts-ignore
    }
    // @ts-ignore
    // @ts-ignore
    const drawShape = drawUTurnWithCtx(options);
    // @ts-ignore
    // @ts-ignore
    const shapeHitbox = uturnHitbox(options);
    // @ts-ignore
    const textHitbox = uturnTextHitbox(options);
    // @ts-ignore
    const efficientHitbox = uturnEfficientHitbox(options);
    // @ts-ignore
    const hitbox = (point) => {
        // @ts-ignore
        return textHitbox?.(point) || shapeHitbox(point);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const drawTextArea = drawTextAreaOnUTurn(options);
    // @ts-ignore
    // @ts-ignore
    const drawTextAreaMatte = drawTextAreaMatteOnUTurn(options);
    // @ts-ignore
    const drawText = drawTextOnUTurn(options);
    // @ts-ignore
    // @ts-ignore
    const draw = (ctx) => {
        // @ts-ignore
        drawShape(ctx);
        // @ts-ignore
        drawTextArea?.(ctx);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const activateTextArea = (handler) => {
        // @ts-ignore
        if (!options.textArea)
            return;
        // @ts-ignore
        const location = getTextAreaLocationOnUTurn(options);
        // @ts-ignore
        const fullTextArea = getFullTextArea(options.textArea, location);
        // @ts-ignore
        engageTextarea(fullTextArea, handler);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    return {
        // @ts-ignore
        id: generateId(),
        // @ts-ignore
        name: 'uturn',
        // @ts-ignore
        // @ts-ignore
        draw,
        // @ts-ignore
        // @ts-ignore
        drawShape,
        // @ts-ignore
        drawTextArea,
        // @ts-ignore
        drawTextAreaMatte,
        // @ts-ignore
        drawText,
        // @ts-ignore
        // @ts-ignore
        hitbox,
        // @ts-ignore
        shapeHitbox,
        // @ts-ignore
        textHitbox,
        // @ts-ignore
        efficientHitbox,
        // @ts-ignore
        // @ts-ignore
        activateTextArea,
        // @ts-ignore
    };
};
exports.uturn = uturn;
// @ts-ignore
// @ts-ignore
exports.PROGRESS_DEFAULTS = {
    // @ts-ignore
    backgroundColor: "white",
    // @ts-ignore
    progressColor: "green",
    // @ts-ignore
    easeTime: 250,
    // @ts-ignore
    progressEasing: "ease-in-out",
    // @ts-ignore
    borderRadius: 0,
    // @ts-ignore
};
