import{P as X,R as K,c as C,g as P,u as ee}from"./ResponsiveCanvas.vue_vue_type_script_setup_true_lang-p2bUJyZt.js";import{u as W,g as M,C as te,a as oe,T as le,b as se,_ as ne,i as ae}from"./Graph.vue_vue_type_script_setup_true_lang-CTaBmmpA.js";import{f as x,p as re,q as R,s as I,d as S,o as r,c as d,a as i,u as N,F as w,t as T,v as ie,x as j,y as de,b as k,z as ue,A as L,B as g,e as E,w as ce,C as ge,D as A,E as ve,G as be,H as me}from"./index-BwD5cFD_.js";import{u as pe}from"./useAdjacencyList-BVmHohm5.js";import{_ as q,a as J,b as he}from"./CollabControls.vue_vue_type_script_setup_true_lang-DFHh9ZL5.js";import{_ as fe}from"./InputRange.vue_vue_type_script_setup_true_lang-Dy2qVBVP.js";import{_ as Ee}from"./Button.vue_vue_type_script_setup_true_lang-A9vCViIy.js";const _e="element-highlight",ye=1e3,Ce=1e3,Te="tutorial",Se=(e,t)=>{const o=x(0),l=re(t);let s,n;const u=a=>{const{event:b,predicate:c}=typeof a.dismiss=="string"?{event:a.dismiss,predicate:()=>!0}:a.dismiss;if(b==="onInterval"){const y="interval"in a?a.interval:ye;let V=0;const U=setInterval(()=>{c(++V)&&o.value++},y);return()=>clearInterval(U)}const v=(...y)=>{(c==null?void 0:c(...y))&&o.value++};return e.subscribe(b,v),()=>e.unsubscribe(b,v)},p=()=>{var b,c;const a=l.value[o.value];if(a){if((b=a.onInit)==null||b.call(a),(c=a.precondition)!=null&&c.call(a,e)){o.value++;return}a!=null&&a.highlightElement&&(s=Le(a)),n=u(a.dismiss!=="onTimeout"?a:{hint:a.hint,dismiss:"onInterval",interval:a.after})}},h=(a,b)=>{var v;if(a<0)return o.value=0;if(a>l.value.length)return o.value=l.value.length;const c=l.value[b];(v=c==null?void 0:c.onDismiss)==null||v.call(c),n==null||n(),s==null||s(),p()};return R(o,h),R(l,()=>h(o.value,o.value)),p(),{currentStepIndex:o,currentStep:I(()=>l.value[o.value]),sequence:l,nextStep:()=>o.value++,previousStep:()=>o.value--,endTutorial:()=>o.value=l.value.length,restartTutorial:()=>o.value=0,isTutorialOver:I(()=>o.value>=l.value.length)}},Le=e=>{const{highlightElement:t}=e;if(!t)return()=>{};const{id:o,className:l}={id:typeof t=="string"?t:t.id,className:typeof t=="string"||!(t!=null&&t.className)?_e:t.className};if(!o)return()=>{};const s=document.getElementById(o);if(!s)throw new Error(`element with id ${o} not found`);return s.classList.add(l),()=>s.classList.remove(l)},m={reset:"reset",draggable:"draggable",nodeAnchors:"node-anchors",edgeLabels:"edge-labels",edgeLabelsEditable:"edge-labels-editable",userEditable:"user-editable",edgeType:"edge-type",edgeWeight:"edge-weight",nodeSize:"node-size",storageKey:"storage-key",clearLocalStorage:"clear-local-storage",persistentGraphClone:"persistent-graph-clone",testRoom:"test-room",log:"log",bfsColorize:"toggle-bfs-colorize"},xe=e=>({greeting:{hint:"Welcome to the graph editor tutorial",dismiss:"onClick"},goodbye:{hint:"Have fun editing graphs!",dismiss:"onTimeout",after:3e3},createNode:{hint:"Double click anywhere to add a node",dismiss:"onNodeAdded"},moveNode:{hint:"Drag a node to move it",dismiss:"onNodeDrop"},createEdge:{hint:"Create an edge by dragging an anchor onto another node",dismiss:"onEdgeAdded"},createUndirectedEdge:{hint:"Now create an undirected edge by toggling the edge type",highlightElement:m.edgeType,dismiss:{event:"onEdgeAdded",predicate:t=>t.type==="undirected"}},createSelfDirectedEdge:{hint:'You can even create self directed edges! Make sure you are in "directed" mode and drag an anchor inwards',highlightElement:m.edgeType,dismiss:{event:"onEdgeAdded",predicate:t=>t.to===t.from}},editEdgeWeight:{hint:"Edit the edge weight by clicking on it and typing a number",dismiss:"onEdgeLabelChange"},removeElement:Ne(e)}),Ne=e=>{let t=!1;const o=()=>t=!0,{setTheme:l,removeAllThemes:s}=W(e,Te);return{hint:"Remove an edge or node by clicking on it and hitting backspace/delete",dismiss:{event:"onInterval",predicate:()=>t},onInit:()=>{t=!1,l("nodeAnchorColor",n=>n.label==="1"?X:K),e.subscribe("onEdgeRemoved",o),e.subscribe("onNodeRemoved",o)},onDismiss:()=>{s(),e.unsubscribe("onEdgeRemoved",o),e.unsubscribe("onNodeRemoved",o)}}},Ae=e=>{const{greeting:t,createNode:o,moveNode:l,createEdge:s,createUndirectedEdge:n,editEdgeWeight:u,removeElement:p,goodbye:h}=xe(e);return[t,o,l,s,n,u,p,h]},Re=e=>({basics:Ae(e)}),we=e=>Se(e,Re(e).basics),$e=S({__name:"TutorialControls",props:{tutorial:{}},setup(e){return I(()=>`${e.tutorial.currentStepIndex.value+1} / ${e.tutorial.sequence.value.length}`),(t,o)=>(r(),d(w,null,[i("button",{onClick:o[0]||(o[0]=(...l)=>t.tutorial.previousStep&&t.tutorial.previousStep(...l)),class:N("bg-blue-600 text-white px-3 py-1 rounded-lg font-bold")},o[4]||(o[4]=[i("span",{class:"select-none"},"Previous Step",-1)])),i("button",{onClick:o[1]||(o[1]=(...l)=>t.tutorial.nextStep&&t.tutorial.nextStep(...l)),class:N("bg-blue-600 text-white px-3 py-1 rounded-lg font-bold")},o[5]||(o[5]=[i("span",{class:"select-none"},"Next Step",-1)])),i("button",{onClick:o[2]||(o[2]=(...l)=>t.tutorial.endTutorial&&t.tutorial.endTutorial(...l)),class:N("bg-blue-600 text-white px-3 py-1 rounded-lg font-bold")},o[6]||(o[6]=[i("span",{class:"select-none"},"End Tutorial",-1)])),i("button",{onClick:o[3]||(o[3]=(...l)=>t.tutorial.restartTutorial&&t.tutorial.restartTutorial(...l)),class:N("bg-blue-600 text-white px-3 py-1 rounded-lg font-bold")},o[7]||(o[7]=[i("span",{class:"select-none"},"Restart Tutorial",-1)]))],64))}}),ke={class:"text-3xl font-bold"},F=300,Ve=S({__name:"TutorialHint",props:{tutorial:{}},setup(e){const t=x(0),o=I(()=>{var n;return((n=e.tutorial.currentStep.value)==null?void 0:n.hint)??""}),l=x("");let s;return R(o,()=>{t.value=0,clearTimeout(s),s=setTimeout(()=>{l.value=o.value,t.value=1},F+Ce)},{immediate:!0}),(n,u)=>(r(),d("div",{class:N(["transition-opacity",`duration-[${F}ms]`,"select-none","text-center"]),style:ie({opacity:t.value})},[i("h1",ke,T(l.value),1)],6))}}),Ie="product/search-visualizer",Ue=(e,t)=>{const o=x({}),l=x(t),{adjacencyList:s}=pe(e),n=()=>{if(o.value={},!l.value||!s.value[l.value])return;let u=[l.value];const p=new Set(u);let h=0;for(;u.length>0;){const a=[];for(const b of u){o.value[b]=h;for(const c of s.value[b])p.has(c)||(p.add(c),a.push(c))}u=[],u.push(...a),h++}};return e.subscribe("onStructureChange",n),j(()=>e.unsubscribe("onStructureChange",n)),R(l,n),{bfsLevelRecord:de(o),startNode:l}},ze=[C.RED_600,C.ORANGE_600,C.YELLOW_600,C.GREEN_600,C.TEAL_600,C.BLUE_600,C.INDIGO_600,C.PURPLE_600],De=e=>{var b;const t=x(!1),{setTheme:o,removeTheme:l}=W(e,Ie),{bfsLevelRecord:s,startNode:n}=Ue(e,(b=e.nodes.value[0])==null?void 0:b.id),u=()=>{if(n.value===void 0){const[v]=e.nodes.value;v&&(n.value=v.id)}if(!e.nodes.value.find(v=>v.id===n.value)){const[v]=e.nodes.value;n.value=v?v.id:void 0}},p=c=>{if(e.isHighlighted(c.id))return;const v=s.value[c.id];if(v===void 0)return;const y=ze;return y[v%y.length]},h=()=>{o("nodeBorderColor",p),o("nodeAnchorColor",p),t.value=!0},a=()=>{l("nodeBorderColor"),l("nodeAnchorColor"),t.value=!1};return R(t,()=>{t.value?h():a()}),e.subscribe("onNodeRemoved",u),e.subscribe("onNodeAdded",u),j(()=>{e.unsubscribe("onNodeRemoved",u),e.unsubscribe("onNodeAdded",u)}),{isColorized:t,colorize:h,decolorize:a,toggleColorize:()=>t.value=!t.value,bfsLevelRecord:s,startNode:n}},B=e=>e.charAt(0).toUpperCase()+e.slice(1),D=e=>{const t=e.replace(/([A-Z])/g," $1");return B(t)},Be=e=>{const t={label:()=>"Reset",action:()=>e.reset(),color:()=>"red",id:m.reset},o={label:()=>e.settings.value.draggable?"Draggable":"Not Draggable",action:()=>e.settings.value.draggable=!e.settings.value.draggable,color:()=>e.settings.value.draggable?"green":"orange",id:m.draggable},l={label:()=>e.settings.value.nodeAnchors?"Anchors":"No Anchors",action:()=>e.settings.value.nodeAnchors=!e.settings.value.nodeAnchors,color:()=>e.settings.value.nodeAnchors?"green":"orange",id:m.nodeAnchors},s={label:()=>e.settings.value.displayEdgeLabels?"Edge Labels":"No Edge Labels",action:()=>e.settings.value.displayEdgeLabels=!e.settings.value.displayEdgeLabels,color:()=>e.settings.value.displayEdgeLabels?"green":"orange",id:m.edgeLabels},n={label:()=>e.settings.value.edgeLabelsEditable?"Edge Labels Editable":"Edge Labels Not Editable",action:()=>e.settings.value.edgeLabelsEditable=!e.settings.value.edgeLabelsEditable,color:()=>e.settings.value.edgeLabelsEditable?"green":"orange",id:m.edgeLabelsEditable},u={label:()=>e.settings.value.userEditable?"Editable":"Not Editable",action:()=>e.settings.value.userEditable=!e.settings.value.userEditable,color:()=>e.settings.value.userEditable?"green":"orange",id:m.userEditable},p={cond:()=>!!e.settings.value.userEditable,label:()=>B(e.settings.value.userEditableAddedEdgeType),action:()=>{e.settings.value.userEditableAddedEdgeType==="directed"?e.settings.value.userEditableAddedEdgeType="undirected":e.settings.value.userEditableAddedEdgeType="directed"},color:()=>{const{userEditableAddedEdgeType:f}=e.settings.value;return f==="directed"?"blue":"purple"},id:m.edgeType},h={cond:()=>!!e.settings.value.userEditable,label:()=>{const{userEditableAddedEdgeLabel:f}=e.settings.value;return`Change Added Edge Weight (${f})`},action:()=>{e.settings.value.userEditableAddedEdgeLabel=P(1,10).toString()},color:()=>"green",id:m.edgeWeight},a={label:()=>`Change Node Size (${e.theme.value.nodeSize})`,action:()=>e.theme.value.nodeSize=P(20,50),color:()=>"pink",id:m.nodeSize},b={label:()=>{const{persistentStorageKey:f}=e.settings.value;return`Change Storage Key (${f})`},action:()=>{const{persistentStorageKey:f}=e.settings.value,_=f==="graph"?"graph2":"graph";e.settings.value.persistentStorageKey=_},color:()=>"blue",id:m.storageKey},c={label:()=>"Clear Local Storage",action:()=>localStorage.clear(),color:()=>"red",id:m.clearLocalStorage},v={label:()=>"Clone Search Visualizer Graph",action:()=>{e.settings.value.persistentStorageKey="search-visualizer-graph"},color:()=>"amber",id:m.persistentGraphClone},y={label:()=>{const{collaborativeRoomId:f,collaboratorCount:_,inCollaborativeRoom:$}=e,z=`Leave ${f.value} Room (${_.value+1} In Room)`;return $.value?z:"Join Test Room"},action:()=>{const f=M(te),_=M(oe);e.meAsACollaborator.value.name=f,e.meAsACollaborator.value.color=_;const{joinCollaborativeRoom:$,leaveCollaborativeRoom:z,inCollaborativeRoom:H}=e;H.value?z():$("Test")},color:()=>e.inCollaborativeRoom.value?"red":"green",id:m.testRoom},V={label:()=>"Log",action:()=>{console.log(JSON.stringify(e.collaborators.value,null,2)),console.log(JSON.stringify(e.collaboratorCount.value,null,2)),console.log(JSON.stringify(e.meAsACollaborator.value,null,2))},color:()=>"blue",id:m.log},{toggleColorize:U,isColorized:G,startNode:Y}=De(e),O={reset:t,clearLocalStorage:c,changeNodeSize:a,toggleEdgeLabelDisplay:s,toggleEdgeLabelsEditable:n,toggleDraggable:o,toggleNodeAnchors:l,toggleUserEditable:u,toggleEdgeType:p,changeEdgeWeight:h,changeStorageKey:b,persistentGraphClone:v,toggleTestRoom:y,bfsColorize:{label:()=>{const f="Colorize",_=e.getNode(Y.value),$=`Stop Colorizing (${_==null?void 0:_.label})`;return G.value?$:f},color:()=>G.value?"red":"pink",action:U,id:"toggle-bfs-colorize"},log:V},Z=Object.values(O);return{...O,btnArr:Z}},Ge=["onClick","id"],Oe={class:"select-none"},He=S({__name:"GraphBtns",props:{btns:{}},setup(e){const t=o=>o?o():!0;return(o,l)=>(r(!0),d(w,null,k(o.btns,s=>(r(),d("div",null,[t(s.cond)?(r(),d("button",{key:0,onClick:ue(s.action,["stop"]),class:N(`bg-${s.color()}-600 text-white px-3 py-1 rounded-lg font-bold`),id:s.id},[i("span",Oe,T(s.label()),1)],10,Ge)):L("",!0)]))),256))}}),Pe={class:"px-4 my-2"},Me={class:"my-2"},Fe={class:"flex flex-wrap gap-3"},We=["onClick"],je={class:"my-2"},qe={class:"text-white mb-2"},Je={class:"font-bold text-lg"},Qe={class:"text-md"},Ye={key:3,class:"text-red-500 font-bold"},Ze=S({__name:"ThemeControls",props:{graph:{}},setup(e){return(t,o)=>(r(),d("div",Pe,[o[1]||(o[1]=i("div",null,[i("h2",{class:"text-2xl font-bold text-white"},"Theme Controls")],-1)),i("div",Me,[o[0]||(o[0]=i("div",{class:"mb-2"},[i("h1",{class:"text-xl font-bold text-white"},"Presets")],-1)),i("div",Fe,[(r(!0),d(w,null,k(g(le),(l,s)=>(r(),d("div",{onClick:n=>t.graph.theme.value=l},[E(Ee,{color:l.secondaryColor,"text-color":l.secondaryTextColor,style:{width:"120px","text-align":"center"}},{default:ce(()=>[ge(T(g(D)(s)),1)]),_:2},1032,["color","text-color"])],8,We))),256))])]),(r(!0),d(w,null,k(t.graph.theme.value,(l,s)=>(r(),d("div",je,[i("div",qe,[i("h3",Je,T(g(D)(s)),1),i("h4",Qe,T(l),1)]),typeof l=="string"&&s.toLowerCase().includes("color")?(r(),A(q,{key:0,modelValue:t.graph.theme.value[s],"onUpdate:modelValue":n=>t.graph.theme.value[s]=n,style:{width:"100px",height:"30px"}},null,8,["modelValue","onUpdate:modelValue"])):typeof l=="string"?(r(),A(J,{key:1,modelValue:t.graph.theme.value[s],"onUpdate:modelValue":n=>t.graph.theme.value[s]=n},null,8,["modelValue","onUpdate:modelValue"])):typeof l=="number"?(r(),A(fe,{key:2,modelValue:t.graph.theme.value[s],"onUpdate:modelValue":n=>t.graph.theme.value[s]=n,style:{width:"100%"},min:0,max:100},null,8,["modelValue","onUpdate:modelValue"])):(r(),d("h5",Ye," Not Supported "))]))),256))]))}}),Q=S({__name:"InputCheckbox",props:{modelValue:{type:Boolean},modelModifiers:{}},emits:["update:modelValue"],setup(e){const t=ve(e,"modelValue");return(o,l)=>be((r(),d("input",{"onUpdate:modelValue":l[0]||(l[0]=s=>t.value=s),type:"checkbox"},null,512)),[[me,t.value]])}}),Xe=["onClick"],Ke={class:"text-white font-bold"},et=S({__name:"GraphPlaygroundControls",props:{playgroundControls:{}},setup(e){return(t,o)=>(r(!0),d(w,null,k(t.playgroundControls,(l,s)=>(r(),d("div",{class:"flex gap-3 items-center pl-3 py-2 hover:bg-gray-800 cursor-pointer",onClick:n=>t.playgroundControls[s]=!t.playgroundControls[s]},[E(Q,{modelValue:t.playgroundControls[s],"onUpdate:modelValue":n=>t.playgroundControls[s]=n,class:"h-6 w-6 rounded-xl cursor-pointer"},null,8,["modelValue","onUpdate:modelValue"]),i("h2",Ke,T(g(B)(s)),1)],8,Xe))),256))}}),tt={class:"my-2 px-4"},ot={class:"text-white mb-2"},lt={class:"font-bold text-lg"},st={class:"text-md"},nt={key:3,class:"text-red-500 font-bold"},at=S({__name:"SettingsControls",props:{graph:{}},setup(e){return(t,o)=>(r(!0),d(w,null,k(t.graph.settings.value,(l,s)=>(r(),d("div",tt,[i("div",ot,[i("h3",lt,T(g(D)(s)),1),i("h4",st,T(l),1)]),typeof l=="string"&&s.toLowerCase().includes("color")?(r(),A(q,{key:0,modelValue:t.graph.settings.value[s],"onUpdate:modelValue":n=>t.graph.settings.value[s]=n,style:{width:"100px",height:"30px"}},null,8,["modelValue","onUpdate:modelValue"])):typeof l=="string"?(r(),A(J,{key:1,modelValue:t.graph.settings.value[s],"onUpdate:modelValue":n=>t.graph.settings.value[s]=n},null,8,["modelValue","onUpdate:modelValue"])):typeof l=="boolean"?(r(),A(Q,{key:2,modelValue:t.graph.settings.value[s],"onUpdate:modelValue":n=>t.graph.settings.value[s]=n,class:"h-6 w-6 rounded-xl cursor-pointer"},null,8,["modelValue","onUpdate:modelValue"])):(r(),d("h5",nt," Not Supported "))]))),256))}}),rt={class:"relative w-full h-full"},it={class:"w-full h-full absolute"},dt={key:0,class:"absolute flex gap-2 m-2 flex flex-wrap w-[85%]"},ut={key:1,class:"absolute bottom-0 right-0 flex gap-2 h-8 m-2"},ct={key:2,class:"bottom-0 absolute flex gap-2 m-2"},gt={key:3,class:"absolute w-full dark:text-white bottom-[10%] grid place-items-center pointer-events-none"},vt={class:"absolute h-3/4 top-[100px] right-0"},bt={key:0,class:"w-[325px] h-1/2 overflow-auto bg-gray-800 bg-opacity-80 rounded-l-xl mb-3"},mt={key:1,class:"w-[325px] h-1/2 overflow-auto bg-gray-800 bg-opacity-80 rounded-l-xl"},pt={class:"absolute w-[150px] top-1/4 overflow-auto bg-gray-800 bg-opacity-80 rounded-r-xl"},Lt=S({__name:"GraphPlayground",setup(e){const t=x(),o=se(t,{settings:{edgeInputToLabel:u=>{if(ae(u))return u;if(!isNaN(Number(u)))return u}}}),l=we(o),{btnArr:s}=Be(o),n=ee("graph-playground-controls",{tutorial:!0,theme:!0,settings:!0,collab:!0,buttons:!0});return R(n,()=>{n.value.tutorial?l.restartTutorial():l.endTutorial()},{immediate:!0,deep:!0}),(u,p)=>(r(),d("div",rt,[i("div",it,[E(ne,{onGraphRef:p[0]||(p[0]=h=>t.value=h),graph:g(o)},null,8,["graph"])]),g(n).buttons?(r(),d("div",dt,[E(He,{btns:g(s)},null,8,["btns"])])):L("",!0),g(n).collab?(r(),d("div",ut,[E(he,{graph:g(o)},null,8,["graph"])])):L("",!0),g(n).tutorial?(r(),d("div",ct,[E($e,{tutorial:g(l)},null,8,["tutorial"])])):L("",!0),g(n).tutorial?(r(),d("div",gt,[E(Ve,{tutorial:g(l)},null,8,["tutorial"])])):L("",!0),i("div",vt,[g(n).theme?(r(),d("div",bt,[E(Ze,{graph:g(o)},null,8,["graph"])])):L("",!0),g(n).settings?(r(),d("div",mt,[E(at,{graph:g(o)},null,8,["graph"])])):L("",!0)]),i("div",pt,[E(et,{playgroundControls:g(n)},null,8,["playgroundControls"])])]))}});export{Lt as default};
