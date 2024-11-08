"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TUTORIAL_THEME_ID = exports.DELAY_UNTIL_NEXT_STEP = exports.NON_COLOR_THEMES = exports.resolveThemeForEdge = exports.resolveThemeForNode = exports.THEMES = exports.getThemeResolver = exports.DEFAULT_GRAPH_SETTINGS = exports.getInitialEventBus = void 0;
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
        onNodeRemoved: new Set(),
        // @ts-ignore
        onNodeMoved: new Set(),
        // @ts-ignore
        // @ts-ignore
        onEdgeAdded: new Set(),
        // @ts-ignore
        onEdgeRemoved: new Set(),
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
    ...DEFAULT_USER_EDITABLE_SETTINGS,
    // @ts-ignore
    ...DEFAULT_PERSISTENT_SETTINGS,
    // @ts-ignore
    ...DEFAULT_COLLABORATIVE_SETTINGS,
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
