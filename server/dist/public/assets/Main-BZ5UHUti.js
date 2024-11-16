import{c as O,u as K,b as U,_ as j}from"./Graph.vue_vue_type_script_setup_true_lang-DZdbGwNi.js";import{b as X}from"./CollabControls.vue_vue_type_script_setup_true_lang-CQXg_9hE.js";import{f as m,G as h,d as x,u as Y,o as f,c as S,a as y,K as G,z as i,e as C,F as z,B as R,w as M,A,b as q,t as J,y as L}from"./index-jfH_lu32.js";import{i as F,c as _}from"./ResponsiveCanvas.vue_vue_type_script_setup_true_lang-BuzAFiyo.js";import{_ as Q}from"./SimulationPlaybackControls.vue_vue_type_script_setup_true_lang-ClCpNN6p.js";import{_ as N}from"./Button.vue_vue_type_script_setup_true_lang-Bn5TR-zN.js";const Z=o=>{const e=m([]),l=(s,t)=>(s.get(t)!==t&&s.set(t,l(s,s.get(t))),s.get(t)),g=(s,t,r,c)=>{const a=l(s,r),d=l(s,c);if(a!==d){const p=t.get(a),b=t.get(d);p<b?s.set(a,d):p>b?s.set(d,a):(s.set(d,a),t.set(a,p+1))}},u=()=>{const s=Object.values(O(o.edges.value)).sort((a,d)=>Number(a.label)-Number(d.label)),t=new Map,r=new Map;o.nodes.value.forEach(a=>{t.set(a.id,a.id),r.set(a.id,0)});const c=[];for(const a of s){const d=l(t,a.from),p=l(t,a.to);if(d!==p&&(c.push(a),g(t,r,d,p),c.length===o.nodes.value.length-1))break}return c},n=()=>{e.value=u()};return o.subscribe("onStructureChange",n),o.subscribe("onEdgeLabelChange",n),o.subscribe("onGraphReset",n),e},D=o=>{const e=m([]),l=(n,s)=>{let t=null;for(const r of n)(s.has(r.from)&&!s.has(r.to)||s.has(r.to)&&!s.has(r.from))&&(!t||Number(r.label)<Number(t.label))&&(t=r);return t},g=()=>{if(o.nodes.value.length===0)return[];const n=[],s=new Set,t=o.nodes.value[0].id;s.add(t);const r=Object.values(O(o.edges.value));for(;n.length<o.nodes.value.length-1;){const c=l(r,s);if(!c)break;n.push(c),s.add(c.from),s.add(c.to)}return n},u=()=>{e.value=g()};return o.subscribe("onStructureChange",u),o.subscribe("onEdgeLabelChange",u),o.subscribe("onGraphReset",u),e},H=20,ee="mst",I=(o,e)=>{const{setTheme:l,removeAllThemes:g}=K(o,ee),u=r=>{if(o.isFocused(r.id))return;const c=e.value.some(d=>d.id===r.id),a=F(o.theme.value.edgeColor,r);return c?a:a+H},n=r=>{if(o.isFocused(r.id))return;const c=e.value.some(d=>d.id===r.id),a=F(o.theme.value.edgeTextColor,r);return c?a:a+H};return{colorize:()=>{l("edgeColor",u),l("edgeTextColor",n)},decolorize:()=>{g()}}},W=["kruskal","prim"],se=(o,e)=>{const l=Z(o),g=D(o),u=h(()=>e.value==="prim"?g.value:l.value),n=m(0),s=m(!0),t=m(1500),r=m(!1),c=m(),a=h(()=>n.value>0),d=h(()=>n.value===u.value.length+1),p=h(()=>u.value.slice(0,n.value)),{colorize:b,decolorize:P}=I(o,p),v=()=>{s.value=!1,r.value=!0,n.value=0,b(),c.value=setInterval(()=>{d.value||s.value||w()},t.value)},T=()=>{c.value&&clearInterval(c.value),r.value=!1,P()},w=()=>{d.value||n.value++};return{nextStep:w,prevStep:()=>{a.value&&n.value--},setStep:k=>{k<-1||k>u.value.length||(n.value=k)},trace:h(()=>u.value),step:h(()=>n.value),start:v,stop:T,paused:s,playbackSpeed:t,isOver:d,hasBegun:a,isActive:h(()=>r.value)}},E={backgroundColor:"white",progressColor:"green",easeTime:250,progressEasing:"ease-in-out",borderRadius:0},te=x({__name:"Progressbar",props:{theme:{},startProgress:{},currentProgress:{},endProgress:{},setProgress:{type:Function}},setup(o){var a,d,p,b,P;const e=o,l=((a=e.theme)==null?void 0:a.backgroundColor)||E.backgroundColor,g=((d=e.theme)==null?void 0:d.progressColor)||E.progressColor,u=((p=e.theme)==null?void 0:p.easeTime)||E.easeTime,n=((b=e.theme)==null?void 0:b.progressEasing)||E.progressEasing,s=((P=e.theme)==null?void 0:P.borderRadius)||E.borderRadius,t=m(0),r=h(()=>{const v=e.endProgress-e.startProgress;return Math.min(Math.max(e.currentProgress-e.startProgress,0),v)/v*100}),c=v=>{const T=v.currentTarget,w=v.offsetX,$=T.offsetWidth,B=w/$,k=e.endProgress-e.startProgress,V=e.startProgress+B*k;e.setProgress(Math.round(V))};return Y(()=>r.value,v=>{t.value=v},{immediate:!0}),(v,T)=>(f(),S("div",{onClick:c,class:"relative overflow-hidden h-[25px] w-full",style:G({backgroundColor:i(l),borderRadius:`${i(s)}px`})},[y("div",{class:"absolute top-0 left-0 h-[25px] w-full",style:G({width:`${t.value}%`,backgroundColor:i(g),transition:`width ${i(u)}ms ${i(n)}`})},null,4)],4))}}),oe=x({__name:"SimulationControls",props:{controls:{}},setup(o){return(e,l)=>(f(),S(z,null,[C(te,{class:"w-[300px] border-gray-200 border-2 mb-8",theme:{progressColor:i(_).GRAY_200,backgroundColor:i(_).SLATE_500,borderRadius:20},"start-progress":0,"current-progress":e.controls.step.value,"end-progress":e.controls.trace.value.length,"set-progress":e.controls.setStep},null,8,["theme","current-progress","end-progress","set-progress"]),C(Q,{controls:e.controls},null,8,["controls"])],64))}}),re={persistentStorageKey:"min-spanning-tree",userAddedEdgeType:"undirected",edgeInputToLabel:o=>{const e=Number(o),l=e<0,g=isNaN(e);if(!(l||g))return e.toString()}},ne="s",le=x({__name:"TopRightToolbar",props:{graph:{}},setup(o){const e=o,l=D(e.graph),{colorize:g,decolorize:u}=I(e.graph,l),n=m(!1),s=()=>{n.value=!0,g()},t=()=>{n.value=!1,u()};return e.graph.subscribe("onKeyDown",r=>{r.key.toLowerCase()===ne&&(n.value?t():s())}),(r,c)=>n.value?(f(),R(N,{key:1,onClick:t,color:i(_).RED_600,"text-color":i(_).WHITE,style:{"min-width":"135px"}},{default:M(()=>c[1]||(c[1]=[A(" Hide MST (S) ")])),_:1},8,["color","text-color"])):(f(),R(N,{key:0,onClick:s,color:i(_).BLUE_500,"text-color":i(_).WHITE,style:{"min-width":"135px"}},{default:M(()=>c[0]||(c[0]=[A(" Show MST (S) ")])),_:1},8,["color","text-color"]))}}),ae={key:0,class:"gap-3 flex"},ce=x({__name:"TopLeftToolbar",props:{graph:{},simControls:{},startSimulation:{type:Function}},setup(o){return(e,l)=>e.simControls.isActive.value?(f(),R(N,{key:1,onClick:e.simControls.stop,color:i(_).RED_600,"text-color":i(_).WHITE,class:"capitalize"},{default:M(()=>l[0]||(l[0]=[A(" Stop Simulation ")])),_:1},8,["onClick","color","text-color"])):(f(),S("div",ae,[(f(!0),S(z,null,q(i(W),g=>(f(),R(N,{onClick:()=>e.startSimulation(g),class:"capitalize"},{default:M(()=>[A(" Run "+J(g)+"s ",1)]),_:2},1032,["onClick"]))),256))]))}}),ue={class:"w-full h-full relative"},ie={class:"absolute top-0 p-3 flex gap-3"},de={class:"absolute top-0 right-0 p-3 flex gap-3"},ge={key:0,class:"absolute bottom-8 w-full flex flex-col justify-center items-center p-3"},pe={key:1,class:"absolute right-0 p-3 h-14 flex gap-3 bottom-0"},Ce=x({__name:"Main",setup(o){const e=m(),l=U(e,{settings:re}),g=m(W[0]),u=se(l,g),n=s=>{g.value=s,u.start()};return(s,t)=>(f(),S(z,null,[y("div",ue,[C(j,{onGraphRef:t[0]||(t[0]=r=>e.value=r),graph:i(l)},null,8,["graph"])]),y("div",ie,[C(ce,{graph:i(l),simControls:i(u),startSimulation:n},null,8,["graph","simControls"])]),y("div",de,[C(le,{graph:i(l)},null,8,["graph"])]),i(u).isActive.value?(f(),S("div",ge,[C(oe,{controls:i(u)},null,8,["controls"])])):L("",!0),i(u).isActive.value?L("",!0):(f(),S("div",pe,[C(X,{graph:i(l)},null,8,["graph"])]))],64))}});export{Ce as default};
