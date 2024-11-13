import{c as t,d as U,a as W,b as M,e as N,_ as D,s as B,A as G}from"./ResponsiveCanvas.vue_vue_type_script_setup_true_lang-DE9sOoH1.js";import{f as E,s as C,q as y,d as z,I,o as H,c as P,e as x,w as L,B as f,a as g,t as T,J as O,A as Y,F as $,C as A}from"./index-BAaHHSBP.js";import{_ as S}from"./Button.vue_vue_type_script_setup_true_lang-C783rVOI.js";import{_ as V}from"./InputRange.vue_vue_type_script_setup_true_lang-DtU-k6E_.js";const b=u=>{if(!u)throw new Error("canvas not found");const r="value"in u?u.value:u;if(!r)throw new Error("canvas not found");const c=r.getContext("2d");if(!c)throw new Error("2d context not found");return c},F=t.GREEN_500,q=t.RED_500,J=t.YELLOW_500,X=(u,r)=>{const c=E(!1),v=E(4),o=E(99),i=E(0),l=C(()=>o.value<1?"00":o.value<10?`0${o.value}`:o.value>99?"":o.value.toString()),a=document.createElement("canvas"),R=()=>{if(!u.value)throw new Error("target canvas not found");const{width:p,height:w}=u.value.getBoundingClientRect();a.width=p,a.height=w,a.style.position="absolute",a.style.top="0",a.style.left="0",a.style.pointerEvents="none";const m=document.getElementById("responsive-canvas-container");if(!m)throw new Error("Canvas container not found");m.appendChild(a)},s=p=>{const w=r.value.findLast(_=>_.shapeHitbox(p)),m=r.value.findLast(_=>{var k;return(k=_.textHitbox)==null?void 0:k.call(_,p)}),d={at:p,radius:2,color:F+l.value};m?d.color=J+l.value:w&&(d.color=q+l.value);const h=b(a);W(d).draw(h)},e=async()=>{if(b(a).clearRect(0,0,a.width,a.height),i.value=0,!a||!c.value)return;const{width:w,height:m}=a.getBoundingClientRect();for(let d=0;d<m;d+=v.value)for(let h=0;h<w;h+=v.value)i.value%2e4===0&&await new Promise(_=>setTimeout(_,10)),s({x:h,y:d}),i.value++};y(c,e);const n=U(e,500);return y(v,n),y(o,n),y(r,n),setTimeout(R,500),{heatmapActive:c,heatmapOpacity:o,heatmapResolution:v,runHeatmap:e,runHeatmapDebounced:n,pointsSampled:i}},j={key:0,class:"flex items-center gap-3 text-white h-6 mt-1 text-sm font-bold"},K=z({__name:"Toolbar",props:{canvas:{},items:{},draw:{type:Function}},setup(u){const r=u,{items:c,canvas:v}=I(r),{heatmapActive:o,heatmapOpacity:i,heatmapResolution:l}=X(v,c),a=C(()=>o.value?"Hide Heatmap":"Show Heatmap"),R=()=>{var s,e;(e=(s=c.value[2]).activateTextArea)==null||e.call(s,n=>{console.log("value",n)})};return(s,e)=>(H(),P($,null,[x(S,{onClick:s.draw},{default:L(()=>e[3]||(e[3]=[A("Redraw")])),_:1},8,["onClick"]),x(S,{onClick:e[0]||(e[0]=n=>o.value=!f(o))},{default:L(()=>[A(T(a.value),1)]),_:1}),x(S,{onClick:R},{default:L(()=>e[4]||(e[4]=[A(" Micro Control ")])),_:1}),f(o)?(H(),P("div",j,[g("div",null,[g("p",null,"Opacity "+T(f(i)),1),x(V,{modelValue:f(i),"onUpdate:modelValue":e[1]||(e[1]=n=>O(i)?i.value=n:null),modelModifiers:{number:!0},min:"0",max:"100"},null,8,["modelValue"])]),g("div",null,[g("p",null,"Resolution "+T(f(l)),1),x(V,{modelValue:f(l),"onUpdate:modelValue":e[2]||(e[2]=n=>O(l)?l.value=n:null),modelModifiers:{number:!0},min:"1",max:"10"},null,8,["modelValue"])])])):Y("",!0)],64))}}),Q={class:"h-full w-full"},Z={class:"absolute m-3 flex gap-3 z-50"},nt=z({__name:"ShapePlayground",setup(u){const r=E(),c=M(),v=C(()=>c.value?t.GRAY_800:t.GRAY_200),o=E([]),i=C(()=>(c.value?t.GRAY_200:t.GRAY_700)+"15"),l=()=>{const s=b(r);s.clearRect(0,0,s.canvas.width,s.canvas.height);const{circle:e,uturn:n,cross:p,rect:w,square:m}=B;o.value.push(e({at:{x:200,y:200},radius:50,color:t.BLUE_500,stroke:{color:t.BLUE_700,width:10,dash:[10,5]},textArea:{text:{content:"51",color:t.WHITE,fontSize:20},color:t.TRANSPARENT}})),o.value.push(n({at:{x:600,y:100},downDistance:50,upDistance:50,lineWidth:10,color:t.BLUE_500,rotation:Math.PI*.2,spacing:20,textArea:{color:t.PURPLE_500,activeColor:t.PURPLE_600,text:{content:"5",color:t.WHITE,fontSize:20}}}));const d=B.line({start:{x:100,y:100},end:{x:600,y:900},color:t.GRAY_900,width:10,textArea:{color:t.PURPLE_500,activeColor:t.PURPLE_600,text:{content:"5",color:t.WHITE,fontSize:20}}});o.value.push(d),o.value.push(p({at:{x:500,y:300},color:t.SLATE_600,size:150,rotation:Math.PI/.6,borderRadius:10,lineWidth:80})),o.value.push(m({at:{x:600,y:400},size:120,rotation:Math.PI/.7,color:t.GREEN_600,borderRadius:25,stroke:{color:t.YELLOW_200,width:10,dash:[10,5]},textArea:{text:{content:"13",color:t.WHITE,fontSize:20},color:G}})),o.value.forEach(h=>h.draw(s))};document.addEventListener("resize",l),document.addEventListener("keyup",s=>{s.code==="Space"&&l()}),setTimeout(l,100);const{width:a,height:R}=N();return(s,e)=>(H(),P("div",Q,[g("div",Z,[x(K,{canvas:r.value,items:o.value,draw:l},null,8,["canvas","items"])]),x(D,{onCanvasRef:e[0]||(e[0]=n=>r.value=n),color:v.value,"pattern-color":i.value,"canvas-width":f(a),"canvas-height":f(R)},null,8,["color","pattern-color","canvas-width","canvas-height"])]))}});export{nt as default};
