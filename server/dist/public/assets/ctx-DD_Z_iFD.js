const n=o=>{if(!o)throw new Error("canvas not found");const t="value"in o?o.value:o;if(!t)throw new Error("canvas not found");const r=t.getContext("2d");if(!r)throw new Error("2d context not found");return r};export{n as g};
