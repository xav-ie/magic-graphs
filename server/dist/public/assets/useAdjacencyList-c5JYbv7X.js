import{l as m}from"./ResponsiveCanvas.vue_vue_type_script_setup_true_lang-8dwR3Anj.js";import{f as d,u as b,y as j}from"./index-GBEZEBPp.js";const f=({nodes:e,edges:r})=>e.value.reduce((s,n)=>(s[n.id]=r.value.filter(t=>m(t,n)).map(t=>t.type==="undirected"?t.from===n.id?t.to:t.from:t.to),s),{}),L=({nodes:e,edges:r,getNode:s})=>{const n=f({nodes:e,edges:r});return Object.entries(n).reduce((o,[u,i])=>{const c=s(u);if(!c)return o;const a=i.map(l=>s(l)).filter(Boolean).map(l=>l.label);return o[c.label]=a,o},{})},p=e=>{const r=d({}),s=d({}),n=()=>{r.value=f(e),s.value=L(e)},t=b(()=>{const o=Object.entries(r.value),u={};for(const[i,c]of o)u[i]=c.map(a=>e.getNode(a));return u});return n(),e.subscribe("onStructureChange",n),j(()=>e.unsubscribe("onStructureChange",n)),{adjacencyList:r,labelAdjacencyList:s,fullNodeAdjacencyList:t}};export{f as g,p as u};
