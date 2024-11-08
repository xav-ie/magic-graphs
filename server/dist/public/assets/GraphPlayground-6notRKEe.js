import{u as Q,a as te,g as W,C as le,b as se,c as ne,_ as ae,i as re}from"./Graph.vue_vue_type_script_setup_true_lang-DUswGn1F.js";import{f as S,l as ie,m as V,n as x,d as y,o as r,c as u,a as b,p as A,F as I,t as w,q as de,s as K,u as ue,b as D,v as ce,x as L,y as B,z as G,A as Z,e as h,B as N,w as F,C as v,D as j,E as ge}from"./index-BxU13IRs.js";import{P as me,R as ve,c as C,g as J,u as be}from"./ResponsiveCanvas.vue_vue_type_script_setup_true_lang-HEyhhU_S.js";import{_ as q,a as pe}from"./InputRange.vue_vue_type_script_setup_true_lang-vr6yB2ey.js";const fe="element-highlight",Ee=1e3,he=1e3,Ce="tutorial",ye=(e,t)=>{const o=S(0),l=ie(t);let s,n;const i=a=>{const{event:g,predicate:d}=typeof a.dismiss=="string"?{event:a.dismiss,predicate:()=>!0}:a.dismiss;if(g==="onInterval"){const T="interval"in a?a.interval:Ee;let k=0;const $=setInterval(()=>{d(++k)&&o.value++},T);return()=>clearInterval($)}const c=(...T)=>{(d==null?void 0:d(...T))&&o.value++};return e.subscribe(g,c),()=>e.unsubscribe(g,c)},p=()=>{var g,d;const a=l.value[o.value];if(a){if((g=a.onInit)==null||g.call(a),(d=a.precondition)!=null&&d.call(a,e)){o.value++;return}a!=null&&a.highlightElement&&(s=_e(a)),n=i(a.dismiss!=="onTimeout"?a:{hint:a.hint,dismiss:"onInterval",interval:a.after})}},f=(a,g)=>{var c;if(a<0)return o.value=0;if(a>l.value.length)return o.value=l.value.length;const d=l.value[g];(c=d==null?void 0:d.onDismiss)==null||c.call(d),n==null||n(),s==null||s(),p()};return V(o,f),V(l,()=>f(o.value,o.value)),p(),{currentStepIndex:o,currentStep:x(()=>l.value[o.value]),sequence:l,nextStep:()=>o.value++,previousStep:()=>o.value--,endTutorial:()=>o.value=l.value.length,restartTutorial:()=>o.value=0,isTutorialOver:x(()=>o.value>=l.value.length)}},_e=e=>{const{highlightElement:t}=e;if(!t)return()=>{};const{id:o,className:l}={id:typeof t=="string"?t:t.id,className:typeof t=="string"||!(t!=null&&t.className)?fe:t.className};if(!o)return()=>{};const s=document.getElementById(o);if(!s)throw new Error(`element with id ${o} not found`);return s.classList.add(l),()=>s.classList.remove(l)},m={reset:"reset",draggable:"draggable",nodeAnchors:"node-anchors",edgeLabels:"edge-labels",edgeLabelsEditable:"edge-labels-editable",userEditable:"user-editable",edgeType:"edge-type",edgeWeight:"edge-weight",nodeSize:"node-size",storageKey:"storage-key",clearLocalStorage:"clear-local-storage",persistentGraphClone:"persistent-graph-clone",testRoom:"test-room",log:"log",bfsColorize:"toggle-bfs-colorize"},Te=e=>({greeting:{hint:"Welcome to the graph editor tutorial",dismiss:"onClick"},goodbye:{hint:"Have fun editing graphs!",dismiss:"onTimeout",after:3e3},createNode:{hint:"Double click anywhere to add a node",dismiss:"onNodeAdded"},moveNode:{hint:"Drag a node to move it",dismiss:"onNodeDrop"},createEdge:{hint:"Create an edge by dragging an anchor onto another node",dismiss:"onEdgeAdded"},createUndirectedEdge:{hint:"Now create an undirected edge by toggling the edge type",highlightElement:m.edgeType,dismiss:{event:"onEdgeAdded",predicate:t=>t.type==="undirected"}},createSelfDirectedEdge:{hint:'You can even create self directed edges! Make sure you are in "directed" mode and drag an anchor inwards',highlightElement:m.edgeType,dismiss:{event:"onEdgeAdded",predicate:t=>t.to===t.from}},editEdgeWeight:{hint:"Edit the edge weight by clicking on it and typing a number",dismiss:"onEdgeLabelChange"},removeElement:Se(e)}),Se=e=>{let t=!1;const o=()=>t=!0,{setTheme:l,removeAllThemes:s}=Q(e,Ce);return{hint:"Remove an edge or node by clicking on it and hitting backspace/delete",dismiss:{event:"onInterval",predicate:()=>t},onInit:()=>{t=!1,l("nodeAnchorColor",n=>n.label==="1"?me:ve),e.subscribe("onEdgeRemoved",o),e.subscribe("onNodeRemoved",o)},onDismiss:()=>{s(),e.unsubscribe("onEdgeRemoved",o),e.unsubscribe("onNodeRemoved",o)}}},Ae=e=>{const{greeting:t,createNode:o,moveNode:l,createEdge:s,createUndirectedEdge:n,editEdgeWeight:i,removeElement:p,goodbye:f}=Te(e);return[t,o,l,s,n,i,p,f]},Le=e=>({basics:Ae(e)}),Re=e=>ye(e,Le(e).basics),Ne=y({__name:"TutorialControls",props:{tutorial:{}},setup(e){return x(()=>`${e.tutorial.currentStepIndex.value+1} / ${e.tutorial.sequence.value.length}`),(t,o)=>(r(),u(I,null,[b("button",{onClick:o[0]||(o[0]=(...l)=>t.tutorial.previousStep&&t.tutorial.previousStep(...l)),class:A("bg-blue-600 text-white px-3 py-1 rounded-lg font-bold")},o[4]||(o[4]=[b("span",{class:"select-none"},"Previous Step",-1)])),b("button",{onClick:o[1]||(o[1]=(...l)=>t.tutorial.nextStep&&t.tutorial.nextStep(...l)),class:A("bg-blue-600 text-white px-3 py-1 rounded-lg font-bold")},o[5]||(o[5]=[b("span",{class:"select-none"},"Next Step",-1)])),b("button",{onClick:o[2]||(o[2]=(...l)=>t.tutorial.endTutorial&&t.tutorial.endTutorial(...l)),class:A("bg-blue-600 text-white px-3 py-1 rounded-lg font-bold")},o[6]||(o[6]=[b("span",{class:"select-none"},"End Tutorial",-1)])),b("button",{onClick:o[3]||(o[3]=(...l)=>t.tutorial.restartTutorial&&t.tutorial.restartTutorial(...l)),class:A("bg-blue-600 text-white px-3 py-1 rounded-lg font-bold")},o[7]||(o[7]=[b("span",{class:"select-none"},"Restart Tutorial",-1)]))],64))}}),Ve={class:"text-3xl font-bold"},Y=300,we=y({__name:"TutorialHint",props:{tutorial:{}},setup(e){const t=S(0),o=x(()=>{var n;return((n=e.tutorial.currentStep.value)==null?void 0:n.hint)??""}),l=S("");let s;return V(o,()=>{t.value=0,clearTimeout(s),s=setTimeout(()=>{l.value=o.value,t.value=1},Y+he)},{immediate:!0}),(n,i)=>(r(),u("div",{class:A(["transition-opacity",`duration-[${Y}ms]`,"select-none","text-center"]),style:de({opacity:t.value})},[b("h1",Ve,w(l.value),1)],6))}}),Ie="product/search-visualizer",ke=(e,t)=>{const o=S({}),l=S(t),{adjacencyList:s}=te(e),n=()=>{if(o.value={},!l.value||!s.value[l.value])return;let i=[l.value];const p=new Set(i);let f=0;for(;i.length>0;){const a=[];for(const g of i){o.value[g]=f;for(const d of s.value[g])p.has(d)||(p.add(d),a.push(d))}i=[],i.push(...a),f++}};return e.subscribe("onStructureChange",n),K(()=>e.unsubscribe("onStructureChange",n)),V(l,n),{bfsLevelRecord:ue(o),startNode:l}},xe=[C.RED_600,C.ORANGE_600,C.YELLOW_600,C.GREEN_600,C.TEAL_600,C.BLUE_600,C.INDIGO_600,C.PURPLE_600],$e=e=>{var g;const t=S(!1),{setTheme:o,removeTheme:l}=Q(e,Ie),{bfsLevelRecord:s,startNode:n}=ke(e,(g=e.nodes.value[0])==null?void 0:g.id),i=()=>{if(n.value===void 0){const[c]=e.nodes.value;c&&(n.value=c.id)}if(!e.nodes.value.find(c=>c.id===n.value)){const[c]=e.nodes.value;n.value=c?c.id:void 0}},p=d=>{if(e.isHighlighted(d.id))return;const c=s.value[d.id];if(c===void 0)return;const T=xe;return T[c%T.length]},f=()=>{o("nodeBorderColor",p),o("nodeAnchorColor",p),t.value=!0},a=()=>{l("nodeBorderColor"),l("nodeAnchorColor"),t.value=!1};return V(t,()=>{t.value?f():a()}),e.subscribe("onNodeRemoved",i),e.subscribe("onNodeAdded",i),K(()=>{e.unsubscribe("onNodeRemoved",i),e.unsubscribe("onNodeAdded",i)}),{isColorized:t,colorize:f,decolorize:a,toggleColorize:()=>t.value=!t.value,bfsLevelRecord:s,startNode:n}},O=e=>e.charAt(0).toUpperCase()+e.slice(1),Ue=e=>{const t=e.replace(/([A-Z])/g," $1");return O(t)},ze=e=>{const t={label:()=>"Reset",action:()=>e.reset(),color:()=>"red",id:m.reset},o={label:()=>e.settings.value.draggable?"Draggable":"Not Draggable",action:()=>e.settings.value.draggable=!e.settings.value.draggable,color:()=>e.settings.value.draggable?"green":"orange",id:m.draggable},l={label:()=>e.settings.value.nodeAnchors?"Anchors":"No Anchors",action:()=>e.settings.value.nodeAnchors=!e.settings.value.nodeAnchors,color:()=>e.settings.value.nodeAnchors?"green":"orange",id:m.nodeAnchors},s={label:()=>e.settings.value.displayEdgeLabels?"Edge Labels":"No Edge Labels",action:()=>e.settings.value.displayEdgeLabels=!e.settings.value.displayEdgeLabels,color:()=>e.settings.value.displayEdgeLabels?"green":"orange",id:m.edgeLabels},n={label:()=>e.settings.value.edgeLabelsEditable?"Edge Labels Editable":"Edge Labels Not Editable",action:()=>e.settings.value.edgeLabelsEditable=!e.settings.value.edgeLabelsEditable,color:()=>e.settings.value.edgeLabelsEditable?"green":"orange",id:m.edgeLabelsEditable},i={label:()=>e.settings.value.userEditable?"Editable":"Not Editable",action:()=>e.settings.value.userEditable=!e.settings.value.userEditable,color:()=>e.settings.value.userEditable?"green":"orange",id:m.userEditable},p={cond:()=>!!e.settings.value.userEditable,label:()=>O(e.settings.value.userEditableAddedEdgeType),action:()=>{e.settings.value.userEditableAddedEdgeType==="directed"?e.settings.value.userEditableAddedEdgeType="undirected":e.settings.value.userEditableAddedEdgeType="directed"},color:()=>{const{userEditableAddedEdgeType:E}=e.settings.value;return E==="directed"?"blue":"purple"},id:m.edgeType},f={cond:()=>!!e.settings.value.userEditable,label:()=>{const{userEditableAddedEdgeLabel:E}=e.settings.value;return`Change Added Edge Weight (${E})`},action:()=>{e.settings.value.userEditableAddedEdgeLabel=J(1,10).toString()},color:()=>"green",id:m.edgeWeight},a={label:()=>`Change Node Size (${e.theme.value.nodeSize})`,action:()=>e.theme.value.nodeSize=J(20,50),color:()=>"pink",id:m.nodeSize},g={label:()=>{const{persistentStorageKey:E}=e.settings.value;return`Change Storage Key (${E})`},action:()=>{const{persistentStorageKey:E}=e.settings.value,_=E==="graph"?"graph2":"graph";e.settings.value.persistentStorageKey=_},color:()=>"blue",id:m.storageKey},d={label:()=>"Clear Local Storage",action:()=>localStorage.clear(),color:()=>"red",id:m.clearLocalStorage},c={label:()=>"Clone Search Visualizer Graph",action:()=>{e.settings.value.persistentStorageKey="search-visualizer-graph"},color:()=>"amber",id:m.persistentGraphClone},T={label:()=>{const{collaborativeRoomId:E,collaboratorCount:_,inCollaborativeRoom:R}=e,U=`Leave ${E.value} Room (${_.value+1} In Room)`;return R.value?U:"Join Test Room"},action:()=>{const E=W(le),_=W(se);e.meAsACollaborator.value.name=E,e.meAsACollaborator.value.color=_;const{joinCollaborativeRoom:R,leaveCollaborativeRoom:U,inCollaborativeRoom:P}=e;P.value?U():R("Test")},color:()=>e.inCollaborativeRoom.value?"red":"green",id:m.testRoom},k={label:()=>"Log",action:()=>{console.log(JSON.stringify(e.collaborators.value,null,2)),console.log(JSON.stringify(e.collaboratorCount.value,null,2)),console.log(JSON.stringify(e.meAsACollaborator.value,null,2))},color:()=>"blue",id:m.log},{toggleColorize:$,isColorized:H,startNode:ee}=$e(e),M={reset:t,clearLocalStorage:d,changeNodeSize:a,toggleEdgeLabelDisplay:s,toggleEdgeLabelsEditable:n,toggleDraggable:o,toggleNodeAnchors:l,toggleUserEditable:i,toggleEdgeType:p,changeEdgeWeight:f,changeStorageKey:g,persistentGraphClone:c,toggleTestRoom:T,bfsColorize:{label:()=>{const E="Colorize",_=e.getNode(ee.value),R=`Stop Colorizing (${_==null?void 0:_.label})`;return H.value?R:E},color:()=>H.value?"red":"pink",action:$,id:"toggle-bfs-colorize"},log:k},oe=Object.values(M);return{...M,btnArr:oe}},De=["onClick","id"],Be={class:"select-none"},Ge=y({__name:"GraphBtns",props:{btns:{}},setup(e){const t=o=>o?o():!0;return(o,l)=>(r(!0),u(I,null,D(o.btns,s=>(r(),u("div",null,[t(s.cond)?(r(),u("button",{key:0,onClick:ce(s.action,["stop"]),class:A(`bg-${s.color()}-600 text-white px-3 py-1 rounded-lg font-bold`),id:s.id},[b("span",Be,w(s.label()),1)],10,De)):L("",!0)]))),256))}}),z=y({__name:"InputText",props:{modelValue:{},modelModifiers:{}},emits:["update:modelValue"],setup(e){const t=B(e,"modelValue");return(o,l)=>G((r(),u("input",{"onUpdate:modelValue":l[0]||(l[0]=s=>t.value=s),type:"text",class:"p-1 border border-gray-300 rounded-md"},null,512)),[[Z,t.value]])}}),X=y({__name:"InputColor",props:{modelValue:{},modelModifiers:{}},emits:["update:modelValue"],setup(e){const t=B(e,"modelValue");return(o,l)=>G((r(),u("input",{"onUpdate:modelValue":l[0]||(l[0]=s=>t.value=s),type:"color",class:A("p-1 w-10 h-full rounded-md appearance-none")},null,512)),[[Z,t.value]])}}),Oe=y({__name:"CollabControls",props:{graph:{}},setup(e){const t=S("graph-playground");return(o,l)=>(r(),u(I,null,[h(z,{modelValue:o.graph.meAsACollaborator.value.name,"onUpdate:modelValue":l[0]||(l[0]=s=>o.graph.meAsACollaborator.value.name=s),disabled:o.graph.inCollaborativeRoom.value,placeholder:"Your Name"},null,8,["modelValue","disabled"]),h(X,{modelValue:o.graph.meAsACollaborator.value.color,"onUpdate:modelValue":l[1]||(l[1]=s=>o.graph.meAsACollaborator.value.color=s),disabled:o.graph.inCollaborativeRoom.value},null,8,["modelValue","disabled"]),h(z,{modelValue:t.value,"onUpdate:modelValue":l[2]||(l[2]=s=>t.value=s),disabled:o.graph.inCollaborativeRoom.value,placeholder:"Collaborative Room ID"},null,8,["modelValue","disabled"]),o.graph.inCollaborativeRoom.value?(r(),N(q,{key:1,onClick:l[4]||(l[4]=s=>o.graph.leaveCollaborativeRoom()),color:v(C).RED_500,textColor:v(C).WHITE},{default:F(()=>l[6]||(l[6]=[j(" Leave Room ")])),_:1},8,["color","textColor"])):(r(),N(q,{key:0,onClick:l[3]||(l[3]=s=>o.graph.joinCollaborativeRoom(t.value))},{default:F(()=>l[5]||(l[5]=[j(" Join Room ")])),_:1}))],64))}}),He={class:"my-2 px-4"},Me={class:"text-white mb-2"},Pe={class:"font-bold text-lg"},We={class:"text-md"},Fe={key:3,class:"text-red-500 font-bold"},je=y({__name:"ThemeControls",props:{graph:{}},setup(e){return(t,o)=>(r(!0),u(I,null,D(t.graph.theme.value,(l,s)=>(r(),u("div",He,[b("div",Me,[b("h3",Pe,w(v(Ue)(s)),1),b("h4",We,w(l),1)]),typeof l=="string"&&s.toLowerCase().includes("color")?(r(),N(X,{key:0,modelValue:t.graph.theme.value[s],"onUpdate:modelValue":n=>t.graph.theme.value[s]=n,style:{width:"100px",height:"30px"}},null,8,["modelValue","onUpdate:modelValue"])):typeof l=="string"?(r(),N(z,{key:1,modelValue:t.graph.theme.value[s],"onUpdate:modelValue":n=>t.graph.theme.value[s]=n},null,8,["modelValue","onUpdate:modelValue"])):typeof l=="number"?(r(),N(pe,{key:2,modelValue:t.graph.theme.value[s],"onUpdate:modelValue":n=>t.graph.theme.value[s]=n,style:{width:"100%"},min:0,max:100},null,8,["modelValue","onUpdate:modelValue"])):(r(),u("h5",Fe," Not Supported "))]))),256))}}),Je=y({__name:"InputCheckbox",props:{modelValue:{type:Boolean},modelModifiers:{}},emits:["update:modelValue"],setup(e){const t=B(e,"modelValue");return(o,l)=>G((r(),u("input",{"onUpdate:modelValue":l[0]||(l[0]=s=>t.value=s),type:"checkbox"},null,512)),[[ge,t.value]])}}),qe=["onClick"],Ye={class:"text-white font-bold"},Qe=y({__name:"GraphPlaygroundControls",props:{playgroundControls:{}},setup(e){return(t,o)=>(r(!0),u(I,null,D(t.playgroundControls,(l,s)=>(r(),u("div",{class:"flex gap-3 items-center pl-3 py-2 hover:bg-gray-800 cursor-pointer",onClick:n=>t.playgroundControls[s]=!t.playgroundControls[s]},[h(Je,{modelValue:t.playgroundControls[s],"onUpdate:modelValue":n=>t.playgroundControls[s]=n,class:"h-6 w-6 rounded-xl cursor-pointer"},null,8,["modelValue","onUpdate:modelValue"]),b("h2",Ye,w(v(O)(s)),1)],8,qe))),256))}}),Ke={class:"relative w-full h-full"},Ze={class:"w-full h-full absolute"},Xe={key:0,class:"absolute flex gap-2 m-2 flex flex-wrap w-[85%]"},eo={key:1,class:"absolute bottom-0 right-0 flex gap-2 h-8 m-2"},oo={key:2,class:"bottom-0 absolute flex gap-2 m-2"},to={key:3,class:"absolute w-full dark:text-white bottom-[10%] grid place-items-center pointer-events-none"},lo={key:4,class:"absolute h-1/2 w-[325px] top-1/4 right-0 overflow-auto bg-gray-800 bg-opacity-80 rounded-l-xl"},so={class:"absolute w-[150px] top-1/4 overflow-auto bg-gray-800 bg-opacity-80 rounded-r-xl"},co=y({__name:"GraphPlayground",setup(e){const t=S(),o=ne(t,{settings:{edgeInputToLabel:i=>{if(re(i))return i;if(!isNaN(Number(i)))return i}}}),l=Re(o),{btnArr:s}=ze(o),n=be("graph-playground-controls",{tutorial:!0,theme:!0,collab:!0,settings:!0});return(i,p)=>(r(),u("div",Ke,[b("div",Ze,[h(ae,{onGraphRef:p[0]||(p[0]=f=>t.value=f),graph:v(o)},null,8,["graph"])]),v(n).settings?(r(),u("div",Xe,[h(Ge,{btns:v(s)},null,8,["btns"])])):L("",!0),v(n).collab?(r(),u("div",eo,[h(Oe,{graph:v(o)},null,8,["graph"])])):L("",!0),v(n).tutorial?(r(),u("div",oo,[h(Ne,{tutorial:v(l)},null,8,["tutorial"])])):L("",!0),v(n).tutorial?(r(),u("div",to,[h(we,{tutorial:v(l)},null,8,["tutorial"])])):L("",!0),v(n).theme?(r(),u("div",lo,[h(je,{graph:v(o)},null,8,["graph"])])):L("",!0),b("div",so,[h(Qe,{playgroundControls:v(n)},null,8,["playgroundControls"])])]))}});export{co as default};
