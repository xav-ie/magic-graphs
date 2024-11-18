import{u as L,_ as O}from"./Graph.vue_vue_type_script_setup_true_lang-CG7EnnjR.js";import{d as k,o as i,c as p,b as T,F as y,a as d,t as _,x as v,z as o,V as c,f as w,W as A,e as m,y as r,v as x,w as C,L as h,A as b}from"./index-DksC2spm.js";import{_ as R}from"./Button.vue_vue_type_script_setup_true_lang-D_ipOFbs.js";import{b as D}from"./CollabControls.vue_vue_type_script_setup_true_lang-ZjQXtMWz.js";import{_ as G}from"./SimulationPlaybackControls.vue_vue_type_script_setup_true_lang-D6SDaoXP.js";import"./ResponsiveCanvas.vue_vue_type_script_setup_true_lang-CQ1wqdWz.js";const B=["onClick"],I={class:"text-2xl w-6 text-center font-bold"},$=k({__name:"CostDisplay",props:{graph:{}},setup(E){const s=E,l=e=>s.graph.getTheme("nodeText",e),n=e=>{if(e==="Inf")return o.RED_800;const a=Number(e);return a===1/0||isNaN(a)?o.GRAY_500:a===0?o.GREEN_700:a<3?o.GREEN_500:a<5?o.YELLOW_500:a<7?o.ORANGE_500:a<9?o.RED_400:o.RED_600},g=e=>s.graph.getTheme("nodeBorderColor",e)===c.EXPLORED,t=e=>s.graph.getTheme("nodeBorderColor",e)===c.EXPLORING,f=e=>s.graph.getTheme("nodeBorderColor",e)===c.SOURCE,N=e=>g(e)?c.EXPLORED:t(e)?c.EXPLORING:f(e)?c.SOURCE:s.graph.isFocused(e.id)?s.graph.getTheme("nodeBorderColor",e):o.GRAY_600,S=e=>g(e)?"Explored":t(e)?"Exploring":f(e)?"Source":s.graph.isFocused(e.id)?"Highlighted":"Unexplored";return(e,a)=>(i(!0),p(y,null,T(e.graph.nodes.value,u=>(i(),p("div",{onClick:U=>e.graph.setFocus([u.id]),class:"text-white flex items-center gap-3 p-2 hover:bg-gray-900 cursor-pointer rounded-lg"},[d("span",I,_(u.label),1),a[0]||(a[0]=d("span",{class:"font-bold"},"→",-1)),d("div",{class:"text-lg rounded-lg h-8 w-16 grid place-items-center",style:v({backgroundColor:n(l(u))})},_(l(u)),5),d("div",{class:"text-lg rounded-lg h-8 w-32 grid place-items-center font-bold",style:v({backgroundColor:N(u)})},_(S(u)),5)],8,B))),256))}}),P={class:"w-full h-full relative"},F={class:"absolute top-0 p-3 flex gap-3"},V={key:0,class:"absolute p-3 my-3 top-0 right-0 overflow-auto bg-gray-800 bg-opacity-80 rounded-l-xl max-h-[calc(100%-1.5rem)] overflow-auto"},X={key:1,class:"absolute bottom-8 w-full flex justify-center items-center p-3"},j={key:2,class:"absolute right-0 p-3 h-14 flex gap-3 bottom-0"},q=k({__name:"Main",setup(E){const s=w(),l=L(s,{settings:{persistentStorageKey:"dijkstras",userAddedEdgeRuleNoSelfLoops:!0,userAddedEdgeRuleOneEdgePerPath:!0,edgeInputToLabel:g=>{const t=parseInt(g);if(!(isNaN(t)||t<0))return t.toString()}}}),n=A(l);return(g,t)=>(i(),p(y,null,[d("div",P,[m(O,{onGraphRef:t[0]||(t[0]=f=>s.value=f),graph:r(l)},null,8,["graph"])]),d("div",F,[r(n).isActive.value?(i(),x(R,{key:1,onClick:r(n).stop,color:r(o).RED_600,"text-color":r(o).WHITE},{default:C(()=>t[2]||(t[2]=[b(" Stop Simulation ")])),_:1},8,["onClick","color","text-color"])):(i(),x(R,{key:0,onClick:r(n).start},{default:C(()=>t[1]||(t[1]=[b(" Start Simulation ")])),_:1},8,["onClick"]))]),r(n).isActive.value&&r(l).nodes.value.length>0?(i(),p("div",V,[m($,{graph:r(l)},null,8,["graph"])])):h("",!0),r(n).isActive.value?(i(),p("div",X,[m(G,{controls:r(n)},null,8,["controls"])])):h("",!0),r(n).isActive.value?h("",!0):(i(),p("div",j,[m(D,{graph:r(l)},null,8,["graph"])]))],64))}});export{q as default};
