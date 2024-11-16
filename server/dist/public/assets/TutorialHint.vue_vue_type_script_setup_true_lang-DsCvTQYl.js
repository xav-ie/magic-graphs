import{f as m,N,u as h,G as v,d as A,o as D,c as S,L as x,q as H,K as b,a as B,t as w}from"./index-B4XpbrsQ.js";const C="element-highlight",G=1e3,U=1e3,$="tutorial",k=(o,n)=>{const t=m(-1),a=N(n),i=m(!1),r=m(!1);let u,d;const p=e=>{const{event:l,predicate:s}=typeof e.dismiss=="string"?{event:e.dismiss,predicate:()=>!0}:e.dismiss;if(l==="onInterval"){const f="interval"in e?e.interval:G;let E=0;const L=setInterval(()=>{s(++E)&&t.value++},f);return()=>clearInterval(L)}const c=(...f)=>{(s==null?void 0:s(...f))&&t.value++};return o.subscribe(l,c),()=>o.unsubscribe(l,c)},g=()=>{var l,s;const e=a.value[t.value];if(e){if((l=e.onInit)==null||l.call(e),(s=e.precondition)!=null&&s.call(e,o)){t.value++;return}e!=null&&e.highlightElement&&(u=q(e)),d=p(e.dismiss!=="onTimeout"?e:{hint:e.hint,dismiss:"onInterval",interval:e.after})}},T=(e,l)=>{var c;if(e<0)return t.value=0;if(e>a.value.length)return t.value=a.value.length;const s=a.value[l];(c=s==null?void 0:s.onDismiss)==null||c.call(s),d==null||d(),u==null||u(),g()};h(t,(e,l)=>{r.value||T(e,l)}),h(a,()=>T(t.value,t.value));const y=()=>{t.value=0,i.value=!0},I=()=>{t.value=a.value.length,i.value=!1};return{sequence:a,step:v(()=>t.value),setStep:e=>t.value=e,paused:r,nextStep:()=>t.value++,prevStep:()=>t.value--,stop:I,start:y,isActive:v(()=>i.value),hasBegun:v(()=>t.value>-1),isOver:v(()=>t.value>=a.value.length)}},q=o=>{const{highlightElement:n}=o;if(!n)return()=>{};const{id:t,className:a}={id:typeof n=="string"?n:n.id,className:typeof n=="string"||!(n!=null&&n.className)?C:n.className};if(!t)return()=>{};const i=document.getElementById(t);if(!i)throw new Error(`element with id ${t} not found`);return i.classList.add(a),()=>i.classList.remove(a)},F={class:"text-3xl font-bold"},_=300,z=A({__name:"TutorialHint",props:{tutorial:{}},setup(o){const n=m(0),t=v(()=>{var r;return((r=o.tutorial.sequence.value[o.tutorial.step.value])==null?void 0:r.hint)??""}),a=m("");let i;return h(t,()=>{n.value=0,clearTimeout(i),i=setTimeout(()=>{a.value=t.value,n.value=1},_+U)},{immediate:!0}),(r,u)=>(D(),S("div",{class:H(["transition-opacity",`duration-[${_}ms]`,"select-none","text-center"]),style:b({opacity:n.value})},[x(r.$slots,"default",{hint:a.value},()=>[B("h1",F,w(a.value),1)])],6))}});export{$ as T,z as _,k as u};
