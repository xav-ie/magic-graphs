"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pointInterpolation = exports.easeFunction = exports.PROGRESS_DEFAULTS = exports.triangle = exports.TRIANGLE_DEFAULTS = exports.scribble = exports.ERASER_BRUSH_WEIGHT = exports.SCRIBBLE_DEFAULTS = exports.useSimulationRunner = exports.useMSTSimulationRunner = exports.kruskal = exports.useMarkupSizer = exports.useMarkupColorizer = exports.dijkstras = exports.INF = exports.getWeightedAdjacencyList = exports.TUTORIAL_THEME_ID = exports.DELAY_UNTIL_NEXT_STEP = exports.ThemeToGraphColors = exports.NON_COLOR_THEMES = exports.resolveThemeForEdge = exports.resolveThemeForNode = exports.THEMES = exports.getThemeResolver = exports.DEFAULT_GRAPH_SETTINGS = exports.selectFromGraph = exports.getInitialEventBus = exports.useGraphCursor = void 0;
// @ts-ignore
// @ts-ignore
/**
// @ts-ignore
 * manages the cursor type when hovering over the graph
// @ts-ignore
 *
// @ts-ignore
 * @param subscribe - the event subscriber
// @ts-ignore
 * @param canvas - the canvas element
// @ts-ignore
 * @param graphAtMousePosition - the graph items at the mouse position
// @ts-ignore
 * @returns the cursor manager
// @ts-ignore
 */
// @ts-ignore
const useGraphCursor = ({ 
// @ts-ignore
subscribe, 
// @ts-ignore
canvas, 
// @ts-ignore
graphAtMousePosition,
// @ts-ignore
 }) => {
    // @ts-ignore
    const isMouseDown = ref(false);
    // @ts-ignore
    const graphCursorDisabled = ref(false);
    // @ts-ignore
    // @ts-ignore
    const graphToCursorMap = ref({
        // @ts-ignore
        'node': 'grab',
        // @ts-ignore
        'edge': 'pointer',
        // @ts-ignore
        'node-anchor': 'grab',
        // @ts-ignore
        'encapsulated-node-box': 'move',
        // @ts-ignore
    });
    // @ts-ignore
    // @ts-ignore
    const isItemSelectable = ref();
    // @ts-ignore
    const inSelectMode = computed(() => !!isItemSelectable.value);
    // @ts-ignore
    // @ts-ignore
    const activateCursorSelectMode = (predicate) => {
        // @ts-ignore
        isItemSelectable.value = predicate;
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const deactivateCursorSelectMode = () => {
        // @ts-ignore
        isItemSelectable.value = undefined;
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const getCursorType = (item) => {
        // @ts-ignore
        if (!item)
            return 'default';
        // @ts-ignore
        // @ts-ignore
        if (inSelectMode.value) {
            // @ts-ignore
            const isSelectable = isItemSelectable.value?.(item) ?? false;
            // @ts-ignore
            return isSelectable ? 'pointer' : 'default';
            // @ts-ignore
        }
        // @ts-ignore
        // @ts-ignore
        const cursor = graphToCursorMap.value[item.graphType] ?? 'default';
        // @ts-ignore
        if (cursor === 'grab' && isMouseDown.value)
            return 'grabbing';
        // @ts-ignore
        // @ts-ignore
        return cursor;
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const changeCursorType = ({ items }) => {
        // @ts-ignore
        if (!canvas.value || graphCursorDisabled.value)
            return;
        // @ts-ignore
        const topItem = items.at(-1);
        // @ts-ignore
        canvas.value.style.cursor = getCursorType(topItem);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    subscribe('onMouseDown', (ev) => {
        // @ts-ignore
        isMouseDown.value = true;
        // @ts-ignore
        changeCursorType(ev);
        // @ts-ignore
    });
    // @ts-ignore
    // @ts-ignore
    subscribe('onMouseUp', (ev) => {
        // @ts-ignore
        isMouseDown.value = false;
        // @ts-ignore
        changeCursorType(ev);
        // @ts-ignore
    });
    // @ts-ignore
    // @ts-ignore
    subscribe('onMouseMove', changeCursorType);
    // @ts-ignore
    // @ts-ignore
    watch(graphToCursorMap, () => {
        // @ts-ignore
        changeCursorType({
            // @ts-ignore
            items: graphAtMousePosition.value.items
            // @ts-ignore
        });
        // @ts-ignore
    }, { deep: true });
    // @ts-ignore
    // @ts-ignore
    return {
        // @ts-ignore
        /**
    // @ts-ignore
         * maps graph schema item types to browser cursor.
    // @ts-ignore
         * changing this mapping will change the cursor type when hovering over the graph.
    // @ts-ignore
         */
        // @ts-ignore
        graphToCursorMap,
        // @ts-ignore
        /**
    // @ts-ignore
         * activates a cursor select mode, where only the schema items that pass the
    // @ts-ignore
         * `predicate` will receive a pointer cursor.
    // @ts-ignore
         * everything else will receive the default cursor as long as this mode is active.
    // @ts-ignore
         * @param predicate - a predicate that determines, given a schema item, whether it is selectable.
    // @ts-ignore
         * @example activateCursorSelectMode((item) => item.graphType === 'node')
    // @ts-ignore
         * // in select mode
    // @ts-ignore
         * // only nodes will receive a pointer cursor
    // @ts-ignore
         */
        // @ts-ignore
        activateCursorSelectMode,
        // @ts-ignore
        /**
    // @ts-ignore
         * deactivates the cursor select mode. to be called after `activateCursorSelectMode`.
    // @ts-ignore
         * @example activateCursorSelectMode((item) => item.graphType === 'node')
    // @ts-ignore
         * // in select mode
    // @ts-ignore
         * deactivateCursorSelectMode()
    // @ts-ignore
         * // no longer in select mode
    // @ts-ignore
         */
        // @ts-ignore
        deactivateCursorSelectMode,
        // @ts-ignore
        /**
    // @ts-ignore
         * when the graph cursor is disabled, the cursor will always be the default cursor.
    // @ts-ignore
         */
        // @ts-ignore
        graphCursorDisabled,
        // @ts-ignore
    };
    // @ts-ignore
};
exports.useGraphCursor = useGraphCursor;
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
        onEdgeLabelEdited: new Set(),
        // @ts-ignore
        // @ts-ignore
        onRepaint: new Set(),
        // @ts-ignore
        onNodeHoverChange: new Set(),
        // @ts-ignore
        // @ts-ignore
        onGraphLoaded: new Set(),
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
        onKeyDown: new Set(),
        // @ts-ignore
        onKeyUp: new Set(),
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
        // @ts-ignore
        /**
    // @ts-ignore
         * MarqueeGraphEvents
    // @ts-ignore
         */
        // @ts-ignore
        onGroupDragStart: new Set(),
        // @ts-ignore
        onGroupDrop: new Set(),
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    return eventBus;
};
exports.getInitialEventBus = getInitialEventBus;
// @ts-ignore
// @ts-ignore
/**
// @ts-ignore
 * default predicate for `selectFromGraph`
// @ts-ignore
 */
// @ts-ignore
const DEFAULT_PREDICATE = () => true;
// @ts-ignore
// @ts-ignore
/**
// @ts-ignore
 * waits for the user to click on an item in the graph and resolves to the selected item
// @ts-ignore
 * or undefined if the cancel handler is invoked
// @ts-ignore
 *
// @ts-ignore
 * @param graph the graph to select from
// @ts-ignore
 * @param options options for the selection process
// @ts-ignore
 * @returns a promise that resolves to the selected item or undefined if the selection was cancelled
// @ts-ignore
 * @example const { selectedItemPromise, cancelSelection } = selectFromGraph(graph);
// @ts-ignore
 * const selectedItem = await selectedItemPromise;
// @ts-ignore
 * if (!selectedItem) return; // selection was cancelled
// @ts-ignore
 * // selection resolved. do something with the selected item
// @ts-ignore
 */
// @ts-ignore
const selectFromGraph = (graph, { 
// @ts-ignore
predicate = DEFAULT_PREDICATE,
// @ts-ignore
 } = {}) => {
    // @ts-ignore
    let resolver;
    // @ts-ignore
    // @ts-ignore
    const selectedItemPromise = new Promise((res) => resolver = res);
    // @ts-ignore
    // @ts-ignore
    const onClick = ({ items }) => {
        // @ts-ignore
        const topItem = items.at(-1);
        // @ts-ignore
        if (!topItem || !predicate(topItem))
            return;
        // @ts-ignore
        resolve(topItem);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const initialInteractive = graph.settings.value.interactive;
    // @ts-ignore
    const initialFocusable = graph.settings.value.focusable;
    // @ts-ignore
    // @ts-ignore
    /**
  // @ts-ignore
     * initializes the selection process
  // @ts-ignore
     */
    // @ts-ignore
    const init = () => {
        // @ts-ignore
        graph.subscribe('onClick', onClick);
        // @ts-ignore
        graph.settings.value.interactive = false;
        // @ts-ignore
        graph.settings.value.focusable = false;
        // @ts-ignore
        const cursorPredicate = predicate === DEFAULT_PREDICATE ? ((item) => !!item) : predicate;
        // @ts-ignore
        graph.activateCursorSelectMode(cursorPredicate);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    /**
  // @ts-ignore
     * cleans up the selection process
  // @ts-ignore
     */
    // @ts-ignore
    const cleanup = () => {
        // @ts-ignore
        graph.unsubscribe('onClick', onClick);
        // @ts-ignore
        graph.settings.value.interactive = initialInteractive;
        // @ts-ignore
        graph.settings.value.focusable = initialFocusable;
        // @ts-ignore
        graph.deactivateCursorSelectMode();
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    /**
  // @ts-ignore
     * resolves the selection process and returns the selected item from the promise
  // @ts-ignore
     */
    // @ts-ignore
    const resolve = (item) => {
        // @ts-ignore
        cleanup();
        // @ts-ignore
        resolver(item);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    /**
  // @ts-ignore
     * cancels the selection process and returns undefined from the promise (public)
  // @ts-ignore
     */
    // @ts-ignore
    const cancelSelection = () => {
        // @ts-ignore
        cleanup();
        // @ts-ignore
        resolver(undefined);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    init();
    // @ts-ignore
    // @ts-ignore
    return {
        // @ts-ignore
        /**
    // @ts-ignore
         * resolves to the selected item or undefined if the
    // @ts-ignore
         * selection was cancelled by calling the cancel handler
    // @ts-ignore
         */
        // @ts-ignore
        selectedItemPromise,
        // @ts-ignore
        cancelSelection,
        // @ts-ignore
    };
    // @ts-ignore
};
exports.selectFromGraph = selectFromGraph;
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
    ...DEFAULT_BASE_SETTINGS,
    // @ts-ignore
    ...DEFAULT_FOCUS_SETTINGS,
    // @ts-ignore
    ...DEFAULT_DRAGGABLE_SETTINGS,
    // @ts-ignore
    ...DEFAULT_NODE_ANCHOR_SETTINGS,
    // @ts-ignore
    ...DEFAULT_MARQUEE_SETTINGS,
    // @ts-ignore
    ...DEFAULT_INTERACTIVE_SETTINGS,
    // @ts-ignore
    ...DEFAULT_PERSISTENT_SETTINGS,
    // @ts-ignore
    ...DEFAULT_SHORTCUT_SETTINGS,
    // @ts-ignore
};
// @ts-ignore
// @ts-ignore
// @ts-ignore
const getThemeResolver = (
// @ts-ignore
themeName, 
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
        return themeValue !== undefined;
        // @ts-ignore
    });
    // @ts-ignore
    const getter = themeMapEntry?.value ?? exports.THEMES[themeName.value][prop];
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
    edgeText: getTheme('edgeText', edge),
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
    edgeText: ({ label }) => label,
    // @ts-ignore
    edgeTextFontWeight: 'bold',
    // @ts-ignore
    linkPreviewWidth: 10,
};
// @ts-ignore
// @ts-ignore
exports.ThemeToGraphColors = {
    // @ts-ignore
    light: {
        // @ts-ignore
        primary: colors.GRAY_300,
        // @ts-ignore
        secondary: colors.GRAY_200,
        // @ts-ignore
        tertiary: colors.GRAY_400,
        // @ts-ignore
        contrast: colors.GRAY_800,
        // @ts-ignore
        text: colors.GRAY_900,
        // @ts-ignore
        brand: 'magic'
        // @ts-ignore
    },
    // @ts-ignore
    dark: {
        // @ts-ignore
        primary: colors.GRAY_800,
        // @ts-ignore
        secondary: colors.GRAY_700,
        // @ts-ignore
        tertiary: colors.GRAY_900,
        // @ts-ignore
        contrast: colors.GRAY_200,
        // @ts-ignore
        text: colors.GRAY_100,
        // @ts-ignore
        brand: 'magic'
        // @ts-ignore
    },
    // @ts-ignore
    girl: {
        // @ts-ignore
        primary: colors.PINK_700,
        // @ts-ignore
        secondary: colors.PINK_600,
        // @ts-ignore
        tertiary: colors.PINK_800,
        // @ts-ignore
        contrast: colors.PINK_200,
        // @ts-ignore
        text: colors.WHITE,
        // @ts-ignore
        brand: 'girl-magic'
        // @ts-ignore
    }
};
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
 * creates an adjacency list mapping node ids to nodes along with a added field `weight` that
// @ts-ignore
 * represents the weight of the edge connecting them
// @ts-ignore
 *
// @ts-ignore
 * @param graph the graph instance
// @ts-ignore
 * @param fallbackWeight the weight between two adjacent nodes if the label of the edge connecting them
// @ts-ignore
 * cannot be parsed as a number. defaults to 1
// @ts-ignore
 * @returns an adjacency list using ids of nodes as keys and the full node objects with weights as values
// @ts-ignore
 * @example getWeightedAdjacencyList(graph)
// @ts-ignore
 * // {
// @ts-ignore
 * //   'abc123': [{ id: 'def456', label: 'B', weight: 1, x: 0, y: 0 }],
// @ts-ignore
 * //   'def456': [{ id: 'abc123', label: 'A', weight: 1, x: 100, y: 100 }]
// @ts-ignore
 * // }
// @ts-ignore
 */
// @ts-ignore
const getWeightedAdjacencyList = (graph, fallbackWeight = 1) => {
    // @ts-ignore
    const adjList = getAdjacencyList(graph);
    // @ts-ignore
    const adjListEntries = Object.entries(adjList);
    // @ts-ignore
    // @ts-ignore
    return adjListEntries.reduce((acc, [keyNodeId, toNodeIds]) => {
        // @ts-ignore
        acc[keyNodeId] = toNodeIds.map(toNodeId => ({
            // @ts-ignore
            ...graph.getNode(toNodeId),
            // @ts-ignore
            weight: getWeightBetweenNodes(keyNodeId, toNodeId, graph, fallbackWeight)
            // @ts-ignore
        }));
        // @ts-ignore
        return acc;
        // @ts-ignore
    }, {});
};
exports.getWeightedAdjacencyList = getWeightedAdjacencyList;
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
const dijkstras = (graph, startingNodeId) => {
    // @ts-ignore
    const { getInboundEdges, getOutboundEdges } = graph.helpers;
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
        getInboundEdges(sourceNode.id).length === 0 &&
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
        getOutboundEdges(sourceNode.id).forEach((edge) => {
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
exports.dijkstras = dijkstras;
// @ts-ignore
// @ts-ignore
const useMarkupColorizer = (graph) => {
    // @ts-ignore
    const { setTheme, removeAllThemes } = useTheme(graph, MARKUP_USETHEME_ID);
    // @ts-ignore
    // @ts-ignore
    const colorMap = useLocalStorage('markup-color-map', new Map());
    // @ts-ignore
    // @ts-ignore
    // TODO
    // @ts-ignore
    // go through all keys in the colorMap and remove inactive nodes/edges
    // @ts-ignore
    // for (const key of colorMap.value.keys()) {
    // @ts-ignore
    //   if (!graph.nodes.value[key] && !graph.edges.value[key]) {
    // @ts-ignore
    //     colorMap.value.delete(key);
    // @ts-ignore
    //   }
    // @ts-ignore
    // }
    // @ts-ignore
    // @ts-ignore
    const colorNode = (node) => {
        // @ts-ignore
        const color = colorMap.value.get(node.id);
        // @ts-ignore
        if (!color)
            return;
        // @ts-ignore
        return graph.baseTheme.value.nodeColor;
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const colorNodeBorder = (node) => {
        // @ts-ignore
        const color = colorMap.value.get(node.id);
        // @ts-ignore
        if (!color)
            return;
        // @ts-ignore
        if (graph.isFocused(node.id))
            return adjustHex(color, 30);
        // @ts-ignore
        return color;
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const colorEdge = (edge) => {
        // @ts-ignore
        const color = colorMap.value.get(edge.id);
        // @ts-ignore
        if (!color)
            return;
        // @ts-ignore
        if (graph.isFocused(edge.id))
            return adjustHex(color, 30);
        // @ts-ignore
        return color;
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const encapsulatedNodeBoxBorderColor = () => {
        // @ts-ignore
        const themes = {
            // @ts-ignore
            dark: colors.WHITE,
            // @ts-ignore
            light: colors.BLACK,
            // @ts-ignore
            girl: colors.PURPLE_800,
            // @ts-ignore
        };
        // @ts-ignore
        // @ts-ignore
        return themes[graph.themeName.value] + '80';
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const colorize = () => {
        // @ts-ignore
        setTheme('nodeColor', colorNode);
        // @ts-ignore
        // @ts-ignore
        setTheme('nodeBorderColor', colorNodeBorder);
        // @ts-ignore
        setTheme('nodeFocusBorderColor', colorNodeBorder);
        // @ts-ignore
        setTheme('nodeAnchorColor', colorNodeBorder);
        // @ts-ignore
        setTheme('nodeAnchorColorWhenParentFocused', colorNodeBorder);
        // @ts-ignore
        setTheme('edgeColor', colorEdge);
        // @ts-ignore
        // @ts-ignore
        setTheme('marqueeSelectionBoxColor', colors.TRANSPARENT);
        // @ts-ignore
        setTheme('marqueeEncapsulatedNodeBoxBorderColor', encapsulatedNodeBoxBorderColor);
        // @ts-ignore
        setTheme('marqueeEncapsulatedNodeBoxColor', colors.TRANSPARENT);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const decolorize = () => {
        // @ts-ignore
        removeAllThemes();
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    return {
        // @ts-ignore
        colorize,
        // @ts-ignore
        decolorize,
        // @ts-ignore
        colorMap,
        // @ts-ignore
    };
};
exports.useMarkupColorizer = useMarkupColorizer;
// @ts-ignore
// @ts-ignore
const useMarkupSizer = (graph) => {
    // @ts-ignore
    const { setTheme, removeAllThemes } = useTheme(graph, MARKUP_USETHEME_ID);
    // @ts-ignore
    // @ts-ignore
    const sizeMap = useLocalStorage('markup-size-map', new Map());
    // @ts-ignore
    // @ts-ignore
    const sizeNode = (node) => {
        // @ts-ignore
        const size = sizeMap.value.get(node.id);
        // @ts-ignore
        if (!size)
            return;
        // @ts-ignore
        return SIZE_TO_RADIUS[size];
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const sizeEdge = (edge) => {
        // @ts-ignore
        const size = sizeMap.value.get(edge.id);
        // @ts-ignore
        if (!size)
            return;
        // @ts-ignore
        return SIZE_TO_WIDTH[size];
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const size = () => {
        // @ts-ignore
        setTheme('nodeSize', sizeNode);
        // @ts-ignore
        setTheme('edgeWidth', sizeEdge);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const desize = () => {
        // @ts-ignore
        removeAllThemes();
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    return {
        // @ts-ignore
        size,
        // @ts-ignore
        desize,
        // @ts-ignore
        sizeMap
        // @ts-ignore
    };
    // @ts-ignore
};
exports.useMarkupSizer = useMarkupSizer;
// @ts-ignore
// @ts-ignore
const kruskal = (graph) => {
    // @ts-ignore
    const { nodes, edges } = graph;
    // @ts-ignore
    const { getEdgeWeight } = graph.helpers;
    // @ts-ignore
    // @ts-ignore
    const find = (parent, nodeId) => {
        // @ts-ignore
        if (parent.get(nodeId) !== nodeId) {
            // @ts-ignore
            parent.set(nodeId, find(parent, parent.get(nodeId)));
            // @ts-ignore
        }
        // @ts-ignore
        return parent.get(nodeId);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const union = (parent, rank, nodeA, nodeB) => {
        // @ts-ignore
        const rootA = find(parent, nodeA);
        // @ts-ignore
        const rootB = find(parent, nodeB);
        // @ts-ignore
        // @ts-ignore
        if (rootA !== rootB) {
            // @ts-ignore
            const rankA = rank.get(rootA);
            // @ts-ignore
            const rankB = rank.get(rootB);
            // @ts-ignore
            // @ts-ignore
            if (rankA < rankB) {
                // @ts-ignore
                parent.set(rootA, rootB);
                // @ts-ignore
            }
            else if (rankA > rankB) {
                // @ts-ignore
                parent.set(rootB, rootA);
                // @ts-ignore
            }
            else {
                // @ts-ignore
                parent.set(rootB, rootA);
                // @ts-ignore
                rank.set(rootA, rankA + 1);
                // @ts-ignore
            }
            // @ts-ignore
        }
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const run = () => {
        // @ts-ignore
        const sortedEdges = Object.values(edges.value).sort((edgeA, edgeB) => {
            // @ts-ignore
            return getEdgeWeight(edgeA.id) - getEdgeWeight(edgeB.id);
            // @ts-ignore
        });
        // @ts-ignore
        // @ts-ignore
        const parent = new Map();
        // @ts-ignore
        const rank = new Map();
        // @ts-ignore
        // @ts-ignore
        graph.nodes.value.forEach((node) => {
            // @ts-ignore
            parent.set(node.id, node.id);
            // @ts-ignore
            rank.set(node.id, 0);
            // @ts-ignore
        });
        // @ts-ignore
        // @ts-ignore
        const mst = [];
        // @ts-ignore
        for (const edge of sortedEdges) {
            // @ts-ignore
            const sourceRoot = find(parent, edge.from);
            // @ts-ignore
            const targetRoot = find(parent, edge.to);
            // @ts-ignore
            // @ts-ignore
            if (sourceRoot !== targetRoot) {
                // @ts-ignore
                mst.push(edge);
                // @ts-ignore
                union(parent, rank, sourceRoot, targetRoot);
                // @ts-ignore
                // @ts-ignore
                if (mst.length === nodes.value.length - 1)
                    break;
                // @ts-ignore
            }
            // @ts-ignore
        }
        // @ts-ignore
        return mst;
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    return run();
};
exports.kruskal = kruskal;
// @ts-ignore
// @ts-ignore
const useMSTSimulationRunner = (
// @ts-ignore
graph, 
// @ts-ignore
trace
// @ts-ignore
) => {
    // @ts-ignore
    const simControls = useSimulationControls(trace);
    // @ts-ignore
    const { activate, deactivate } = useSimulationTheme(graph, simControls);
    // @ts-ignore
    return {
        // @ts-ignore
        simControls,
        // @ts-ignore
        start: () => {
            // @ts-ignore
            activate();
            // @ts-ignore
            simControls.start();
            // @ts-ignore
        },
        // @ts-ignore
        stop: () => {
            // @ts-ignore
            deactivate();
            // @ts-ignore
            simControls.stop();
            // @ts-ignore
        },
        // @ts-ignore
    };
};
exports.useMSTSimulationRunner = useMSTSimulationRunner;
// @ts-ignore
// @ts-ignore
const useSimulationRunner = (graph) => {
    // @ts-ignore
    const { text } = useTextTip();
    // @ts-ignore
    // @ts-ignore
    const { 
    // @ts-ignore
    activate: activeEdgeThickener, 
    // @ts-ignore
    deactivate: deactivateEdgeThickener
    // @ts-ignore
     } = useEdgeThickener(graph, FLOW_USETHEME_ID + '-runner');
    // @ts-ignore
    // @ts-ignore
    const { 
    // @ts-ignore
    stylize: activateFlowColorizer, 
    // @ts-ignore
    destylize: deactivateFlowColorizer
    // @ts-ignore
     } = useSourceSinkTheme(graph, FLOW_USETHEME_ID + '-runner');
    // @ts-ignore
    // @ts-ignore
    const { createResidualEdges, cleanupResidualEdges } = useResidualEdges(graph);
    // @ts-ignore
    // @ts-ignore
    const { sourceNode, sinkNode } = state;
    // @ts-ignore
    const { trace } = useFordFulkerson(graph);
    // @ts-ignore
    const simControls = useSimulationControls(trace, {
        // @ts-ignore
        allowEditingDuringPlayback: false,
        // @ts-ignore
    });
    // @ts-ignore
    // @ts-ignore
    const { activate: activateTheme, deactivate: deactivateTheme } = useSimulationTheme(graph, simControls);
    // @ts-ignore
    // @ts-ignore
    let cancelled = false;
    // @ts-ignore
    // @ts-ignore
    const start = async () => {
        // @ts-ignore
        graph.settings.value.persistent = false;
        // @ts-ignore
        // @ts-ignore
        activateFlowColorizer();
        // @ts-ignore
        activeEdgeThickener();
        // @ts-ignore
        // @ts-ignore
        if (!sourceNode.value) {
            // @ts-ignore
            text.value = 'Select a source node';
            // @ts-ignore
            await state.setNode(graph, sourceNode);
            // @ts-ignore
        }
        // @ts-ignore
        // @ts-ignore
        if (cancelled)
            return;
        // @ts-ignore
        // @ts-ignore
        if (!sinkNode.value) {
            // @ts-ignore
            text.value = 'Select a sink node';
            // @ts-ignore
            await state.setNode(graph, sinkNode);
            // @ts-ignore
        }
        // @ts-ignore
        // @ts-ignore
        text.value = undefined;
        // @ts-ignore
        // @ts-ignore
        if (cancelled)
            return;
        // @ts-ignore
        // @ts-ignore
        createResidualEdges();
        // @ts-ignore
        activateTheme();
        // @ts-ignore
        // @ts-ignore
        simControls.start();
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const stop = async () => {
        // @ts-ignore
        cancelled = true;
        // @ts-ignore
        // @ts-ignore
        state.cancelNodeSelection.value?.();
        // @ts-ignore
        // @ts-ignore
        simControls.stop();
        // @ts-ignore
        cleanupResidualEdges();
        // @ts-ignore
        deactivateTheme();
        // @ts-ignore
        // @ts-ignore
        deactivateFlowColorizer();
        // @ts-ignore
        deactivateEdgeThickener();
        // @ts-ignore
        // @ts-ignore
        text.value = undefined;
        // @ts-ignore
        graph.settings.value.persistent = true;
        // @ts-ignore
        // @ts-ignore
        setTimeout(() => cancelled = false, 0);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    return {
        // @ts-ignore
        start,
        // @ts-ignore
        stop,
        // @ts-ignore
        simControls,
        // @ts-ignore
    };
};
exports.useSimulationRunner = useSimulationRunner;
// @ts-ignore
// @ts-ignore
exports.SCRIBBLE_DEFAULTS = {
    // @ts-ignore
    color: "red",
    // @ts-ignore
    brushWeight: 3,
    // @ts-ignore
};
// @ts-ignore
// @ts-ignore
exports.ERASER_BRUSH_WEIGHT = 50;
// @ts-ignore
// @ts-ignore
const scribble = (options) => {
    // @ts-ignore
    // @ts-ignore
    if (options.points.length < 1) {
        // @ts-ignore
        throw new Error('not enough points to draw scribble');
        // @ts-ignore
    }
    // @ts-ignore
    if (options.brushWeight && options.brushWeight < 1) {
        // @ts-ignore
        throw new Error('brushWeight must be at least "1"');
        // @ts-ignore
    }
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    const shapeHitbox = scribbleHitbox(options);
    // @ts-ignore
    const efficientHitbox = scribbleEfficientHitbox(options);
    // @ts-ignore
    const hitbox = (point) => {
        // @ts-ignore
        return shapeHitbox(point);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    const getBoundingBox = getScribbleBoundingBox(options);
    // @ts-ignore
    // @ts-ignore
    const drawShape = drawScribbleWithCtx(options);
    // @ts-ignore
    // @ts-ignore
    const draw = (ctx) => {
        // @ts-ignore
        drawShape(ctx);
        // @ts-ignore
    };
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return {
        // @ts-ignore
        id: options.id ?? generateId(),
        // @ts-ignore
        name: 'scribble',
        // @ts-ignore
        // @ts-ignore
        drawShape,
        // @ts-ignore
        draw,
        // @ts-ignore
        // @ts-ignore
        hitbox,
        // @ts-ignore
        shapeHitbox,
        // @ts-ignore
        efficientHitbox,
        // @ts-ignore
        getBoundingBox,
        // @ts-ignore
    };
};
exports.scribble = scribble;
// @ts-ignore
// @ts-ignore
exports.TRIANGLE_DEFAULTS = {
    // @ts-ignore
    color: "black",
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
    const textHitbox = triangleTextHitbox(options);
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
    const getBoundingBox = getTriangleBoundingBox(options);
    // @ts-ignore
    // @ts-ignore
    const drawTextArea = drawTextAreaOnTriangle(options);
    // @ts-ignore
    // @ts-ignore
    const drawTextAreaMatte = drawTextAreaMatteOnTriangle(options);
    // @ts-ignore
    const drawText = drawTextOnTriangle(options);
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
    return {
        // @ts-ignore
        id: options.id ?? generateId(),
        // @ts-ignore
        name: "triangle",
        // @ts-ignore
        // @ts-ignore
        draw,
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
        getBoundingBox,
        // @ts-ignore
    };
    // @ts-ignore
};
exports.triangle = triangle;
// @ts-ignore
// @ts-ignore
exports.PROGRESS_DEFAULTS = {
    // @ts-ignore
    transitionTimeMs: 250,
    // @ts-ignore
    transitionEasing: "ease-in-out",
    // @ts-ignore
    color: colors.GRAY_200,
    // @ts-ignore
};
// @ts-ignore
// @ts-ignore
// @ts-ignore
/**
// @ts-ignore
 *
// @ts-ignore
 * @param {number} progress the current progress
// @ts-ignore
 * @param {EasingFunction} ease the easing function
// @ts-ignore
 * @returns
// @ts-ignore
 */
// @ts-ignore
const easeFunction = (progress, ease) => {
    // @ts-ignore
    if (typeof ease === "function")
        return ease(progress);
    // @ts-ignore
    // @ts-ignore
    switch (ease) {
        // @ts-ignore
        case "linear":
            // @ts-ignore
            return progress;
        // @ts-ignore
        case "in":
            // @ts-ignore
            return progress * progress;
        // @ts-ignore
        case "out":
            // @ts-ignore
            return progress * (2 - progress);
        // @ts-ignore
        case "in-out":
            // @ts-ignore
            return progress < 0.5
                // @ts-ignore
                ? 2 * progress * progress
                // @ts-ignore
                : -1 + (4 - 2 * progress) * progress;
        // @ts-ignore
        default:
            // @ts-ignore
            throw new Error("invalid easing function");
        // @ts-ignore
    }
    // @ts-ignore
};
exports.easeFunction = easeFunction;
// @ts-ignore
// @ts-ignore
/**
// @ts-ignore
 *
// @ts-ignore
 * @param {number} startPosition the start position of the element
// @ts-ignore
 * @param {number} endPosition the end position of the element
// @ts-ignore
 * @param {number} steps the number of steps to get from `startPosition` to `endPosition`
// @ts-ignore
 * @param {EasingFunction} easing the easing function
// @ts-ignore
 * @returns {Coordinate[]} list of coordinates following the `easing` function between `startPosition` and `endPosition`
// @ts-ignore
 *
// @ts-ignore
 * @example
// @ts-ignore
 * pointInterpolation({ x: 0, y: 0 }, { x: 100, y: 50 }, 5, 'linear')
// @ts-ignore
 * // returns
// @ts-ignore
 * // {x: 20, y: 10}
// @ts-ignore
 * // {x: 40, y: 20}
// @ts-ignore
 * // {x: 60, y: 30}
// @ts-ignore
 * // {x: 80, y: 40}
// @ts-ignore
 * // {x: 100, y: 50}
// @ts-ignore
 */
// @ts-ignore
const pointInterpolation = (
// @ts-ignore
startPosition, 
// @ts-ignore
endPosition, 
// @ts-ignore
steps, 
// @ts-ignore
easing = "linear"
// @ts-ignore
) => {
    // @ts-ignore
    if (steps < 1)
        throw new Error('Steps must be greater than 0');
    // @ts-ignore
    if (steps % 1 !== 0)
        throw new Error('Step must be integer');
    // @ts-ignore
    // @ts-ignore
    const result = [];
    // @ts-ignore
    // @ts-ignore
    for (let i = 1; i <= steps; i++) {
        // @ts-ignore
        const progress = i / steps;
        // @ts-ignore
        const easedProgress = (0, exports.easeFunction)(progress, easing);
        // @ts-ignore
        // @ts-ignore
        const x = Math.round(startPosition.x + (endPosition.x - startPosition.x) * easedProgress);
        // @ts-ignore
        const y = Math.round(startPosition.y + (endPosition.y - startPosition.y) * easedProgress);
        // @ts-ignore
        // @ts-ignore
        result.push({ x, y });
        // @ts-ignore
    }
    // @ts-ignore
    // @ts-ignore
    return result;
    // @ts-ignore
};
exports.pointInterpolation = pointInterpolation;
