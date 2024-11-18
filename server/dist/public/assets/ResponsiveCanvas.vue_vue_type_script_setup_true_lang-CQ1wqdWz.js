import{s as wt,ap as mt,y as Zt,a2 as te,I as vt,aq as ee,f as S,ar as ne,as as oe,at as bt,H as k,B as O,au as re,af as ae,al as _,d as se,av as ie,G as ce,o as ht,c as ft,x as le,L as ue,a as xt,D as yt}from"./index-DksC2spm.js";function it(t){return ne()?(oe(t),!0):!1}function j(t){return typeof t=="function"?t():Zt(t)}const de=typeof window<"u"&&typeof document<"u";typeof WorkerGlobalScope<"u"&&globalThis instanceof WorkerGlobalScope;const he=Object.prototype.toString,fe=t=>he.call(t)==="[object Object]",At=()=>{};function xe(t,e){function n(...o){return new Promise((r,a)=>{Promise.resolve(t(()=>e.apply(this,o),{fn:e,thisArg:this,args:o})).then(r).catch(a)})}return n}const Tt=t=>t();function ye(t=Tt){const e=S(!0);function n(){e.value=!1}function o(){e.value=!0}const r=(...a)=>{e.value&&t(...a)};return{isActive:vt(e),pause:n,resume:o,eventFilter:r}}function ge(t){return bt()}function we(...t){if(t.length!==1)return te(...t);const e=t[0];return typeof e=="function"?vt(ee(()=>({get:e,set:At}))):S(e)}function me(t,e,n={}){const{eventFilter:o=Tt,...r}=n;return k(t,xe(o,e),r)}function ve(t,e,n={}){const{eventFilter:o,...r}=n,{eventFilter:a,pause:s,resume:i,isActive:u}=ye(o);return{stop:me(t,e,{...r,eventFilter:a}),pause:s,resume:i,isActive:u}}function Z(t,e=!0,n){ge()?wt(t,n):e?t():mt(t)}const P=de?window:void 0;function z(t){var e;const n=j(t);return(e=n==null?void 0:n.$el)!=null?e:n}function at(...t){let e,n,o,r;if(typeof t[0]=="string"||Array.isArray(t[0])?([n,o,r]=t,e=P):[e,n,o,r]=t,!e)return At;Array.isArray(n)||(n=[n]),Array.isArray(o)||(o=[o]);const a=[],s=()=>{a.forEach(h=>h()),a.length=0},i=(h,l,c,x)=>(h.addEventListener(l,c,x),()=>h.removeEventListener(l,c,x)),u=k(()=>[z(e),j(r)],([h,l])=>{if(s(),!h)return;const c=fe(l)?{...l}:l;a.push(...n.flatMap(x=>o.map(y=>i(h,x,y,c))))},{immediate:!0,flush:"post"}),d=()=>{u(),s()};return it(d),d}function be(){const t=S(!1),e=bt();return e&&wt(()=>{t.value=!0},e),t}function pt(t){const e=be();return O(()=>(e.value,!!t()))}function St(t,e={}){const{window:n=P}=e,o=pt(()=>n&&"matchMedia"in n&&typeof n.matchMedia=="function");let r;const a=S(!1),s=d=>{a.value=d.matches},i=()=>{r&&("removeEventListener"in r?r.removeEventListener("change",s):r.removeListener(s))},u=re(()=>{o.value&&(i(),r=n.matchMedia(j(t)),"addEventListener"in r?r.addEventListener("change",s):r.addListener(s),a.value=r.matches)});return it(()=>{u(),i(),r=void 0}),a}const G=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},q="__vueuse_ssr_handlers__",Ae=Te();function Te(){return q in G||(G[q]=G[q]||{}),G[q]}function Mt(t,e){return Ae[t]||e}function Et(t){return St("(prefers-color-scheme: dark)",t)}function pe(t){return t==null?"any":t instanceof Set?"set":t instanceof Map?"map":t instanceof Date?"date":typeof t=="boolean"?"boolean":typeof t=="string"?"string":typeof t=="object"?"object":Number.isNaN(t)?"any":"number"}const Se={boolean:{read:t=>t==="true",write:t=>String(t)},object:{read:t=>JSON.parse(t),write:t=>JSON.stringify(t)},number:{read:t=>Number.parseFloat(t),write:t=>String(t)},any:{read:t=>t,write:t=>String(t)},string:{read:t=>t,write:t=>String(t)},map:{read:t=>new Map(JSON.parse(t)),write:t=>JSON.stringify(Array.from(t.entries()))},set:{read:t=>new Set(JSON.parse(t)),write:t=>JSON.stringify(Array.from(t))},date:{read:t=>new Date(t),write:t=>t.toISOString()}},gt="vueuse-storage";function Lt(t,e,n,o={}){var r;const{flush:a="pre",deep:s=!0,listenToStorageChanges:i=!0,writeDefaults:u=!0,mergeDefaults:d=!1,shallow:h,window:l=P,eventFilter:c,onError:x=f=>{console.error(f)},initOnMounted:y}=o,w=(h?ae:S)(typeof e=="function"?e():e);if(!n)try{n=Mt("getDefaultStorage",()=>{var f;return(f=P)==null?void 0:f.localStorage})()}catch(f){x(f)}if(!n)return w;const A=j(e),M=pe(A),p=(r=o.serializer)!=null?r:Se[M],{pause:E,resume:v}=ve(w,()=>T(w.value),{flush:a,deep:s,eventFilter:c});l&&i&&Z(()=>{n instanceof Storage?at(l,"storage",R):at(l,gt,W),y&&R()}),y||R();function L(f,g){if(l){const m={key:t,oldValue:f,newValue:g,storageArea:n};l.dispatchEvent(n instanceof Storage?new StorageEvent("storage",m):new CustomEvent(gt,{detail:m}))}}function T(f){try{const g=n.getItem(t);if(f==null)L(g,null),n.removeItem(t);else{const m=p.write(f);g!==m&&(n.setItem(t,m),L(g,m))}}catch(g){x(g)}}function C(f){const g=f?f.newValue:n.getItem(t);if(g==null)return u&&A!=null&&n.setItem(t,p.write(A)),A;if(!f&&d){const m=p.read(g);return typeof d=="function"?d(m,A):M==="object"&&!Array.isArray(m)?{...A,...m}:m}else return typeof g!="string"?g:p.read(g)}function R(f){if(!(f&&f.storageArea!==n)){if(f&&f.key==null){w.value=A;return}if(!(f&&f.key!==t)){E();try{(f==null?void 0:f.newValue)!==p.write(w.value)&&(w.value=C(f))}catch(g){x(g)}finally{f?mt(v):v()}}}}function W(f){R(f.detail)}return w}const Me="*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}";function Ee(t={}){const{selector:e="html",attribute:n="class",initialValue:o="auto",window:r=P,storage:a,storageKey:s="vueuse-color-scheme",listenToStorageChanges:i=!0,storageRef:u,emitAuto:d,disableTransition:h=!0}=t,l={auto:"",light:"light",dark:"dark",...t.modes||{}},c=Et({window:r}),x=O(()=>c.value?"dark":"light"),y=u||(s==null?we(o):Lt(s,o,a,{window:r,listenToStorageChanges:i})),w=O(()=>y.value==="auto"?x.value:y.value),A=Mt("updateHTMLAttrs",(v,L,T)=>{const C=typeof v=="string"?r==null?void 0:r.document.querySelector(v):z(v);if(!C)return;const R=new Set,W=new Set;let f=null;if(L==="class"){const m=T.split(/\s/g);Object.values(l).flatMap(H=>(H||"").split(/\s/g)).filter(Boolean).forEach(H=>{m.includes(H)?R.add(H):W.add(H)})}else f={key:L,value:T};if(R.size===0&&W.size===0&&f===null)return;let g;h&&(g=r.document.createElement("style"),g.appendChild(document.createTextNode(Me)),r.document.head.appendChild(g));for(const m of R)C.classList.add(m);for(const m of W)C.classList.remove(m);f&&C.setAttribute(f.key,f.value),h&&(r.getComputedStyle(g).opacity,document.head.removeChild(g))});function M(v){var L;A(e,n,(L=l[v])!=null?L:v)}function p(v){t.onChanged?t.onChanged(v,M):M(v)}k(w,p,{flush:"post",immediate:!0}),Z(()=>p(w.value));const E=O({get(){return d?y.value:w.value},set(v){y.value=v}});try{return Object.assign(E,{store:y,system:x,state:w})}catch{return E}}function Ln(t={}){const{valueDark:e="dark",valueLight:n="",window:o=P}=t,r=Ee({...t,onChanged:(i,u)=>{var d;t.onChanged?(d=t.onChanged)==null||d.call(t,i==="dark",u,i):u(i)},modes:{dark:e,light:n}}),a=O(()=>r.system?r.system.value:Et({window:o}).value?"dark":"light");return O({get(){return r.value==="dark"},set(i){const u=i?"dark":"light";a.value===u?r.value="auto":r.value=u}})}function Le(t,e,n={}){const{window:o=P,...r}=n;let a;const s=pt(()=>o&&"ResizeObserver"in o),i=()=>{a&&(a.disconnect(),a=void 0)},u=O(()=>{const l=j(t);return Array.isArray(l)?l.map(c=>z(c)):[z(l)]}),d=k(u,l=>{if(i(),s.value&&o){a=new ResizeObserver(e);for(const c of l)c&&a.observe(c,r)}},{immediate:!0,flush:"post"}),h=()=>{i(),d()};return it(h),{isSupported:s,stop:h}}function Ce(t,e={width:0,height:0},n={}){const{window:o=P,box:r="content-box"}=n,a=O(()=>{var l,c;return(c=(l=z(t))==null?void 0:l.namespaceURI)==null?void 0:c.includes("svg")}),s=S(e.width),i=S(e.height),{stop:u}=Le(t,([l])=>{const c=r==="border-box"?l.borderBoxSize:r==="content-box"?l.contentBoxSize:l.devicePixelContentBoxSize;if(o&&a.value){const x=z(t);if(x){const y=x.getBoundingClientRect();s.value=y.width,i.value=y.height}}else if(c){const x=Array.isArray(c)?c:[c];s.value=x.reduce((y,{inlineSize:w})=>y+w,0),i.value=x.reduce((y,{blockSize:w})=>y+w,0)}else s.value=l.contentRect.width,i.value=l.contentRect.height},n);Z(()=>{const l=z(t);l&&(s.value="offsetWidth"in l?l.offsetWidth:e.width,i.value="offsetHeight"in l?l.offsetHeight:e.height)});const d=k(()=>z(t),l=>{s.value=l?e.width:0,i.value=l?e.height:0});function h(){u(),d()}return{width:s,height:i,stop:h}}function Cn(t,e,n={}){const{window:o=P}=n;return Lt(t,e,o==null?void 0:o.localStorage,n)}function Hn(t={}){const{window:e=P,initialWidth:n=Number.POSITIVE_INFINITY,initialHeight:o=Number.POSITIVE_INFINITY,listenOrientation:r=!0,includeScrollbar:a=!0,type:s="inner"}=t,i=S(n),u=S(o),d=()=>{e&&(s==="outer"?(i.value=e.outerWidth,u.value=e.outerHeight):a?(i.value=e.innerWidth,u.value=e.innerHeight):(i.value=e.document.documentElement.clientWidth,u.value=e.document.documentElement.clientHeight))};if(d(),Z(d),at("resize",d,{passive:!0}),r){const h=St("(orientation: portrait)");k(h,()=>d())}return{width:i,height:u}}const He=(t,e)=>{let n;return()=>{clearTimeout(n),n=setTimeout(t,e)}},K=t=>e=>{const{start:n,end:o,width:r,color:a}={...N,...t};e.beginPath(),e.moveTo(n.x,n.y),e.lineTo(o.x,o.y),e.lineWidth=r,e.strokeStyle=a,e.stroke(),e.closePath()},Q=t=>e=>{const{at:n,width:o,height:r,color:a,borderRadius:s,rotation:i,stroke:u}={...ct,...t};e.save();const d=n.x+o/2,h=n.y+r/2;if(e.translate(d,h),e.rotate(i),s===0)e.beginPath(),e.rect(-o/2,-r/2,o,r),e.fillStyle=a,e.fill();else{const l=Math.min(s,o/2,r/2);e.beginPath(),e.moveTo(-o/2+l,-r/2),e.lineTo(o/2-l,-r/2),e.arcTo(o/2,-r/2,o/2,-r/2+l,l),e.lineTo(o/2,r/2-l),e.arcTo(o/2,r/2,o/2-l,r/2,l),e.lineTo(-o/2+l,r/2),e.arcTo(-o/2,r/2,-o/2,r/2-l,l),e.lineTo(-o/2,-r/2+l),e.arcTo(-o/2,-r/2,-o/2+l,-r/2,l),e.closePath(),e.fillStyle=a,e.fill()}if(u){const{color:l,width:c,dash:x}=u;e.strokeStyle=l,e.lineWidth=c,e.setLineDash(x||[]),e.stroke(),e.setLineDash([])}e.restore()},Re={color:"white",activeColor:"white"},$={fontSize:12,fontWeight:"normal",color:"black"},Ct={color:"black",width:0},F=t=>({width:t.text.fontSize*2,height:t.text.fontSize*2}),X=t=>{const{at:e,color:n}=t,{width:o,height:r}=F(t),a=It({at:e,width:o,height:r,color:n});return s=>a.drawShape(s)},Y=t=>e=>{const{at:n}=t,{content:o,fontSize:r,fontWeight:a,color:s}=t.text;e.font=`${a} ${r}px Arial`,e.fillStyle=s,e.textAlign="center",e.textBaseline="middle",e.fillText(o,n.x+r,n.y+r)},b=(t,e)=>{const n={...Re,...t},o={...$,...n.text};return{...n,text:o,at:e}},B=(t,e,n)=>{const o=Math.cos(n),r=Math.sin(n),a=t.x-e.x,s=t.y-e.y;return{x:e.x+(a*o-s*r),y:e.y+(a*r+s*o)}},st=(t,e)=>{const{x:n,y:o}=t,{x:r,y:a}=e;return Math.atan2(a-o,r-n)},Rn=(t,e)=>{if(e.length===0)return 0;const[n]=e;if(e.length===1)return st(t,n)+Math.PI;const o=e.map(s=>st(t,s)).sort((s,i)=>s-i);let r=0,a=0;for(let s=0;s<o.length;s++){const i=(s+1)%o.length,u=(o[i]-o[s]+2*Math.PI)%(2*Math.PI);u>r&&(r=u,a=s)}return(o[a]+r/2)%(2*Math.PI)},tt=t=>{const{at:e,width:n,height:o,textArea:r}={...ct,...t};if(!r)throw new Error("no text area provided");const{text:a}=r,{fontSize:s}={...$,...a},i=e.x+n/2,u=e.y+o/2;return{x:i-s,y:u-s}},Ie=t=>{if(!t.textArea)return;const e=tt(t),n=b(t.textArea,e),{width:o,height:r}=F(n),a=I({at:n.at,width:o,height:r});return s=>a(s)},Ht=t=>{if(!t.textArea)return;const e=tt(t),n=b(t.textArea,e),o=X(n);return r=>o(r)},Rt=t=>{if(!t.textArea)return;const e=tt(t),n=b(t.textArea,e),o=Y(n);return r=>o(r)},We=t=>{const e=Ht(t),n=Rt(t);if(!(!e||!n))return o=>{e(o),n(o)}},U=(t,e)=>{const{at:n,text:o,activeColor:r}=t,{x:a,y:s}=n,{color:i,content:u,fontSize:d,fontWeight:h}=o,l=d*2,c=document.createElement("textarea");c.style.position="absolute",c.style.left=`${a}px`,c.style.top=`${s}px`,c.style.width=`${l}px`,c.style.height=`${l}px`,c.style.zIndex="1000",c.style.resize="none",c.style.overflow="hidden",c.style.border="none",c.style.padding="0",c.style.paddingTop="4px",c.style.margin="0",c.style.fontSize=`${d}px`,c.style.color=i,c.style.backgroundColor=r,c.style.fontFamily="Arial",c.style.textAlign="center",c.style.fontWeight=h,c.style.outline="none",c.style.whiteSpace="nowrap",c.value=u;const x=()=>{c.onblur=null,e(c.value),c.remove()};c.onblur=x,c.onkeydown=w=>{w.key==="Enter"&&x()};const y=document.getElementById("responsive-canvas-container");if(!y)throw new Error("responsive canvas container not found");y.appendChild(c),setTimeout(()=>{c.focus(),c.setSelectionRange(0,c.value.length)},10)},ct={color:"black",borderRadius:0,rotation:0},It=t=>{if(t.borderRadius&&t.borderRadius<0)throw new Error("borderRadius must be positive");const e=Q(t),n=I(t),o=Ie(t),r=D(t),a=c=>(o==null?void 0:o(c))||n(c),s=lt(t),i=We(t),u=Ht(t),d=Rt(t),h=c=>{e(c),i==null||i(c)},l=c=>{if(!t.textArea)return;const x=tt(t),y=b(t.textArea,x);U(y,c)};return{id:_(),name:"rect",draw:h,drawShape:e,drawTextArea:i,drawTextAreaMatte:u,drawText:d,hitbox:a,shapeHitbox:n,textHitbox:o,efficientHitbox:r,getBoundingBox:s,activateTextArea:l}},V=t=>e=>{const n=e.x-t.at.x,o=e.y-t.at.y,r={...Ct,...t.stroke},a=t.radius+r.width/2;return n**2+o**2<=a**2},Wt=t=>()=>{const{at:e,radius:n}=t,{width:o}={...Ct,...t.stroke};return{topLeft:{x:e.x-(n+o/2),y:e.y-(n+o/2)},bottomRight:{x:e.x+(n+o/2),y:e.y+(n+o/2)}}},Oe=t=>{const{topLeft:e,bottomRight:n}=Wt(t)(),o=D({at:{x:e.x,y:e.y},width:n.x-e.x,height:n.y-e.y});return r=>o(r)},I=t=>e=>{const{at:n,width:o,height:r,borderRadius:a,rotation:s}={...ct,...t},i=n.x+o/2,u=n.y+r/2,d=B(e,{x:i,y:u},-s),{x:h,y:l}={x:i-o/2,y:u-r/2};if(a===0)return d.x>=h&&d.x<=h+o&&d.y>=l&&d.y<=l+r;const c=Math.min(a,o/2,r/2),x=I({...t,at:{x:h+c,y:l},width:o-2*c,borderRadius:0,rotation:0}),y=I({...t,at:{x:h,y:l+c},height:r-2*c,borderRadius:0,rotation:0});if(x(d)||y(d))return!0;const w=V({at:{x:h+c,y:l+c},radius:c}),A=V({at:{x:h+o-c,y:l+c},radius:c}),M=V({at:{x:h+c,y:l+r-c},radius:c}),p=V({at:{x:h+o-c,y:l+r-c},radius:c});return w(d)||A(d)||M(d)||p(d)},lt=t=>()=>{const{at:e,width:n,height:o}=t,r=Math.min(e.x,e.x+n),a=Math.max(e.x,e.x+n),s=Math.min(e.y,e.y+o),i=Math.max(e.y,e.y+o);return{topLeft:{x:r,y:s},bottomRight:{x:a,y:i}}},D=t=>e=>{const{at:n,width:o,height:r}=e,{topLeft:a,bottomRight:s}=lt(t)(),i=Math.min(n.x,n.x+o),u=Math.max(n.x,n.x+o),d=Math.min(n.y,n.y+r),h=Math.max(n.y,n.y+r);return!(s.x<=i||u<=a.x||s.y<=d||h<=a.y)},ut=t=>e=>{const{start:n,end:o,width:r}={...N,...t},{x:a,y:s}=n,{x:i,y:u}=o,{x:d,y:h}=e,l=(i-a)**2+(u-s)**2;if(l===0)return(d-a)**2+(h-s)**2<=(r/2)**2;const c=((d-a)*(i-a)+(h-s)*(u-s))/l,x=Math.max(0,Math.min(1,c)),y=a+x*(i-a),w=s+x*(u-s);return(d-y)**2+(h-w)**2<=(r/2)**2},Ot=t=>()=>{const{start:e,end:n,width:o}={...N,...t},r=Math.min(e.x,n.x)-o/2,a=Math.min(e.y,n.y)-o/2,s=Math.max(e.x,n.x)+o/2,i=Math.max(e.y,n.y)+o/2;return{topLeft:{x:r,y:a},bottomRight:{x:s,y:i}}},Bt=t=>{const{start:e,end:n,width:o}={...N,...t},r=Math.hypot(n.x-e.x,n.y-e.y),a=Math.atan2(n.y-e.y,n.x-e.x),s=Math.abs(Math.cos(a))+Math.abs(Math.sin(a)),i=Math.min(50,r*s),u=Math.ceil(r/i),d=(n.x-e.x)/r,h=(n.y-e.y)/r,l=Math.min(e.x,n.x)-o/2,c=Math.min(e.y,n.y)-o/2,x=Math.abs(n.x-e.x)+o,y=Math.abs(n.y-e.y)+o,w=D({at:{x:l,y:c},width:x,height:y});return A=>w(A)?Array.from({length:u},(p,E)=>{const v=e.x+d*i*E,L=e.y+h*i*E,T=v+d*i,C=L+h*i,R=Math.min(v,T)-o/2,W=Math.min(L,C)-o/2,f=Math.abs(T-v)+o,g=Math.abs(C-L)+o;return D({at:{x:R,y:W},width:f,height:g})}).some(p=>p(A)):!1},J=t=>{const{textOffsetFromCenter:e,start:n,end:o,textArea:r}={...N,...t};if(!r)throw new Error("no text area provided");const{text:a}=r,{fontSize:s}={...$,...a},i=st(n,o),u=e*Math.cos(i),d=e*Math.sin(i),h=(n.x+o.x)/2+u,l=(n.y+o.y)/2+d;return{x:h-s,y:l-s}},Be=t=>{if(!t.textArea)return;const e=J(t),n=b(t.textArea,e),{width:o,height:r}=F(n),a=I({at:n.at,width:o,height:r});return s=>a(s)},kt=t=>{if(!t.textArea)return;const e=J(t),n=b(t.textArea,e),o=X(n);return r=>o(r)},Pt=t=>{if(!t.textArea)return;const e=J(t),n=b(t.textArea,e),o=Y(n);return r=>o(r)},ke=t=>{const e=kt(t),n=Pt(t);if(!(!e||!n))return o=>{e(o),n(o)}},N={width:10,textOffsetFromCenter:0,color:"black"},Pe=t=>{if(t.width&&t.width<0)throw new Error("lineWidth must be positive");const e=K(t),n=ut(t),o=Be(t),r=Bt(t),a=c=>(o==null?void 0:o(c))||n(c),s=Ot(t),i=ke(t),u=kt(t),d=Pt(t),h=c=>{e(c),i==null||i(c)},l=c=>{if(!t.textArea)return;const x=J(t),y=b(t.textArea,x);U(y,c)};return{id:_(),name:"line",draw:h,drawShape:e,drawTextArea:i,drawTextAreaMatte:u,drawText:d,hitbox:a,shapeHitbox:n,textHitbox:o,efficientHitbox:r,getBoundingBox:s,activateTextArea:l}},ze=t=>e=>{const{point1:n,point2:o,point3:r}=t,{x:a,y:s}=e,i=.5*(-o.y*r.x+n.y*(-o.x+r.x)+n.x*(o.y-r.y)+o.x*r.y),u=1/(2*i)*(n.y*r.x-n.x*r.y+(r.y-n.y)*a+(n.x-r.x)*s),d=1/(2*i)*(n.x*o.y-n.y*o.x+(n.y-o.y)*a+(o.x-n.x)*s);return u>0&&d>0&&1-u-d>0},zt=t=>()=>{const{point1:e,point2:n,point3:o}=t,r=Math.min(e.x,n.x,o.x),a=Math.min(e.y,n.y,o.y),s=Math.max(e.x,n.x,o.x),i=Math.max(e.y,n.y,o.y);return{topLeft:{x:r,y:a},bottomRight:{x:s,y:i}}},De=t=>{const{topLeft:e,bottomRight:n}=zt(t)(),o=D({at:e,width:n.x-e.x,height:n.y-e.y});return r=>o(r)},_e={color:"black"},Fe=t=>{const e=dt(t),n=ze(t),o=De(t),r=i=>n(i),a=zt(t),s=i=>{e(i)};return{id:_(),name:"triangle",draw:s,drawShape:e,hitbox:r,shapeHitbox:n,efficientHitbox:o,getBoundingBox:a}},dt=t=>e=>{const{point1:n,point2:o,point3:r,color:a}={..._e,...t};e.beginPath(),e.moveTo(n.x,n.y),e.lineTo(o.x,o.y),e.lineTo(r.x,r.y),e.fillStyle=a,e.fill(),e.closePath()},Ne=t=>{const{start:e,end:n,width:o,color:r}={...Ft,...t},a=Math.atan2(n.y-e.y,n.x-e.x),s=o*2.5,i={x:n.x-s*Math.cos(a),y:n.y-s*Math.sin(a)},u=s/1.75,d=n,h={x:i.x+u*Math.cos(a+Math.PI/2),y:i.y+u*Math.sin(a+Math.PI/2)},l={x:i.x-u*Math.cos(a+Math.PI/2),y:i.y-u*Math.sin(a+Math.PI/2)},c={start:e,end:{x:i.x+Math.cos(a),y:i.y+Math.sin(a)},width:o,color:r},x=K(c),y=dt({point1:d,point2:h,point3:l,color:r});return w=>{x(w),y(w)}},$e=t=>{const e=ut(t);return n=>e(n)},Xe=t=>Ot(t),Ye=t=>{const e=Bt(t);return n=>e(n)},et=t=>{const{textOffsetFromCenter:e,start:n,end:o,textArea:r,width:a,color:s}={...Ft,...t};if(!r)throw new Error("no text area provided");const i=Math.atan2(o.y-n.y,o.x-n.x),u=a*2.5,d={x:o.x-u*Math.cos(i),y:o.y-u*Math.sin(i)};return J({start:n,end:d,width:a,color:s,textOffsetFromCenter:e,textArea:r})},Ue=t=>{if(!t.textArea)return;const e=et(t),n=b(t.textArea,e),{width:o,height:r}=F(n),a=I({at:n.at,width:o,height:r});return s=>a(s)},Dt=t=>{if(!t.textArea)return;const e=et(t),n=b(t.textArea,e),o=X(n);return r=>o(r)},_t=t=>{if(!t.textArea)return;const e=et(t),n=b(t.textArea,e),o=Y(n);return r=>o(r)},Ve=t=>{const e=Dt(t),n=_t(t);if(!(!e||!n))return o=>{e(o),n(o)}},Ft=N,je=t=>{if(t.width&&t.width<0)throw new Error("width must be positive");const e=Ne(t),n=$e(t),o=Ue(t),r=Ye(t),a=c=>(o==null?void 0:o(c))||n(c),s=Xe(t),i=Ve(t),u=Dt(t),d=_t(t),h=c=>{e(c),i==null||i(c)},l=c=>{if(!t.textArea)return;const x=et(t),y=b(t.textArea,x);U(y,c)};return{id:_(),name:"arrow",draw:h,drawShape:e,drawTextArea:i,drawTextAreaMatte:u,drawText:d,hitbox:a,shapeHitbox:n,textHitbox:o,efficientHitbox:r,getBoundingBox:s,activateTextArea:l}},Je=t=>e=>{const{at:n,radius:o,color:r,stroke:a}={...Xt,...t};if(e.beginPath(),e.arc(n.x,n.y,o,0,2*Math.PI),e.fillStyle=r,e.fill(),a){const{color:s,width:i,dash:u}=a;e.strokeStyle=s,e.lineWidth=i,e.setLineDash(u||[]),e.stroke(),e.setLineDash([])}e.closePath()},nt=t=>{const{at:e,radius:n,textArea:o}={...Xt,...t};if(!o)throw new Error("no text area provided");const{text:r}=o,{fontSize:a}={...$,...r},s=a>=50?.3:.1;return{x:e.x-a,y:e.y+a**s-a}},Ge=t=>{if(!t.textArea)return;const e=nt(t),n=b(t.textArea,e),{width:o,height:r}=F(n),a=I({at:n.at,width:o,height:r});return s=>a(s)},Nt=t=>{if(!t.textArea)return;const e=nt(t),n=b(t.textArea,e),o=X(n);return r=>o(r)},$t=t=>{if(!t.textArea)return;const e=nt(t),n=b(t.textArea,e),o=Y(n);return r=>o(r)},qe=t=>{const e=Nt(t),n=$t(t);if(!(!e||!n))return o=>{e(o),n(o)}},Xt={color:"black"},Ke=t=>{if(t.radius<0)throw new Error("radius must be positive");const e=Je(t),n=V(t),o=Ge(t),r=Oe(t),a=c=>(o==null?void 0:o(c))||n(c),s=Wt(t),i=qe(t),u=Nt(t),d=$t(t),h=c=>{e(c),i==null||i(c)},l=c=>{if(!t.textArea)return;const x=nt(t),y=b(t.textArea,x);U(y,c)};return{id:_(),name:"circle",draw:h,drawShape:e,drawTextArea:i,drawTextAreaMatte:u,drawText:d,hitbox:a,shapeHitbox:n,textHitbox:o,efficientHitbox:r,getBoundingBox:s,activateTextArea:l}},Qe=t=>{const e=Q({width:t.size,height:t.size,...t});return n=>e(n)},ot=t=>{const{at:e,size:n,textArea:o}=t;if(!o)throw new Error("no text area provided");const{text:r}=o,{fontSize:a}={...$,...r},s=e.x+n/2,i=e.y+n/2;return{x:s-a,y:i-a}},Ze=t=>{if(!t.textArea)return;const e=ot(t),n=b(t.textArea,e),{width:o,height:r}=F(n),a=I({at:n.at,width:o,height:r});return s=>a(s)},Yt=t=>{if(!t.textArea)return;const e=ot(t),n=b(t.textArea,e),o=X(n);return r=>o(r)},Ut=t=>{if(!t.textArea)return;const e=ot(t),n=b(t.textArea,e),o=Y(n);return r=>o(r)},tn=t=>{const e=Yt(t),n=Ut(t);if(!(!e||!n))return o=>{e(o),n(o)}},en=t=>{const e=I({at:t.at,width:t.size,height:t.size,borderRadius:t.borderRadius,rotation:t.rotation});return n=>e(n)},nn=t=>lt({at:t.at,width:t.size,height:t.size}),on=t=>{const e=D({at:t.at,width:t.size,height:t.size});return n=>e(n)},rn=t=>{const e=Qe(t),n=en(t),o=Ze(t),r=on(t),a=c=>(o==null?void 0:o(c))||n(c),s=nn(t),i=tn(t),u=Yt(t),d=Ut(t),h=c=>{e(c),i==null||i(c)},l=c=>{if(!t.textArea)return;const x=ot(t),y=b(t.textArea,x);U(y,c)};return{id:_(),name:"square",draw:h,drawShape:e,drawTextArea:i,drawTextAreaMatte:u,drawText:d,hitbox:a,shapeHitbox:n,textHitbox:o,efficientHitbox:r,getBoundingBox:s,activateTextArea:l}},an=t=>{const{spacing:e,at:n,upDistance:o,downDistance:r,rotation:a,lineWidth:s,color:i}={...Gt,...t},u=s*1.4,d=u,h=B({x:n.x,y:n.y-e},n,a),l=B({x:n.x+o,y:n.y-e},n,a),c=B({x:n.x+o,y:n.y+e},n,a),x=B({x:n.x+o-r+u,y:n.y+e},n,a),y=B({x:n.x+o,y:n.y},n,a),w={x:x.x+d*Math.cos(a),y:x.y+d*Math.sin(a)},A=B({x:n.x+o-r,y:n.y+e},n,a),M={x:w.x+d*Math.cos(a+Math.PI/2),y:w.y+d*Math.sin(a+Math.PI/2)},p={x:w.x-d*Math.cos(a+Math.PI/2),y:w.y-d*Math.sin(a+Math.PI/2)},E=dt({point1:A,point2:M,point3:p,color:i}),v=K({start:h,end:l,width:s,color:i}),L=K({start:c,end:x,width:s,color:i});return T=>{v(T),E(T),L(T),T.beginPath(),T.arc(y.x,y.y,e,Math.PI/2+a+.05,-Math.PI/2+a-.05,!0),T.strokeStyle=i,T.stroke(),T.closePath()}},sn=t=>{const{spacing:e,at:n,upDistance:o,lineWidth:r,rotation:a}=t,s=B({x:n.x+o,y:n.y},n,a),i=ut({start:n,end:s,width:2*e+r});return u=>i(u)},Vt=t=>()=>{const{spacing:e,at:n,upDistance:o,rotation:r,lineWidth:a}=t,s=B({x:n.x+o,y:n.y},n,r),i=Math.min(n.x,s.x)-a/2-e,u=Math.min(n.y,s.y)-a/2-e,d=Math.max(n.x,s.x)+a/2+e,h=Math.max(n.y,s.y)+a/2+e;return{topLeft:{x:i,y:u},bottomRight:{x:d,y:h}}},cn=t=>{const{topLeft:e,bottomRight:n}=Vt(t)(),o=n.x-e.x,r=n.y-e.y,a=D({at:{x:e.x,y:e.y},width:o,height:r});return s=>a(s)},rt=t=>{const{at:e,upDistance:n,rotation:o,textArea:r,spacing:a}={...Gt,...t};if(!r)throw new Error("no text area provided");const{text:s}=r,{fontSize:i}={...$,...s},u=B({x:e.x+n+a,y:e.y},e,o);return{x:u.x-i+Math.cos(o)*15,y:u.y-i+Math.sin(o)*15}},ln=t=>{if(!t.textArea)return;const e=rt(t),n=b(t.textArea,e),{width:o,height:r}=F(n),a=I({at:n.at,width:o,height:r});return s=>a(s)},jt=t=>{if(!t.textArea)return;const e=rt(t),n=b(t.textArea,e),o=X(n);return r=>o(r)},Jt=t=>{if(!t.textArea)return;const e=rt(t),n=b(t.textArea,e),o=Y(n);return r=>o(r)},un=t=>{const e=jt(t),n=Jt(t);if(!(!e||!n))return o=>{e(o),n(o)}},Gt={color:"black"},dn=t=>{if(t.downDistance<0)throw new Error("downDistance must be positive");if(t.upDistance<0)throw new Error("upDistance must be positive");const e=an(t),n=sn(t),o=ln(t),r=cn(t),a=c=>(o==null?void 0:o(c))||n(c),s=Vt(t),i=un(t),u=jt(t),d=Jt(t),h=c=>{e(c),i==null||i(c)},l=c=>{if(!t.textArea)return;const x=rt(t),y=b(t.textArea,x);U(y,c)};return{id:_(),name:"uturn",draw:h,drawShape:e,drawTextArea:i,drawTextAreaMatte:u,drawText:d,hitbox:a,shapeHitbox:n,textHitbox:o,efficientHitbox:r,getBoundingBox:s,activateTextArea:l}},hn=t=>{const{at:e,size:n,rotation:o,lineWidth:r,borderRadius:a}={...qt,...t},s=r/2,i=I({at:{x:e.x-n/2,y:e.y-s},width:n,height:r,rotation:o,borderRadius:a}),u=I({at:{x:e.x-s,y:e.y-n/2},width:r,height:n,rotation:o,borderRadius:a});return d=>i(d)||u(d)},fn=t=>()=>{const{at:e,size:n}=t;return{topLeft:{x:e.x-n/2,y:e.y-n/2},bottomRight:{x:e.x+n/2,y:e.y+n/2}}},xn=t=>{const{at:e,size:n}=t,o=D({at:{x:e.x-n/2,y:e.y-n/2},width:n,height:n});return r=>o(r)},yn=t=>{const{at:e,size:n,rotation:o,color:r,lineWidth:a,borderRadius:s}={...qt,...t},i=a/2;return u=>{Q({at:{x:e.x-i,y:e.y-n/2},width:a,height:n,color:r,borderRadius:s,rotation:o})(u),Q({at:{x:e.x-n/2,y:e.y-i},width:n,height:a,color:r,borderRadius:s,rotation:o})(u)}},qt={rotation:0,color:"black",lineWidth:N.width,borderRadius:0},gn=t=>{if(t.lineWidth&&t.lineWidth<0)throw new Error("lineWidth must be positive");const e=yn(t),n=hn(t),o=xn(t),r=i=>n(i),a=fn(t),s=i=>{e(i)};return{id:_(),name:"cross",draw:s,drawShape:e,shapeHitbox:n,hitbox:r,efficientHitbox:o,getBoundingBox:a}},wn=Pe,mn=je,vn=Ke,bn=It,An=rn,Tn=Fe,pn=dn,Kt=gn,In={arrow:mn,circle:vn,line:wn,rect:bn,square:An,triangle:Tn,uturn:pn,cross:Kt},Sn=["width","height"],Mn=["width","height"],Wn=se({__name:"ResponsiveCanvas",props:{color:{},patternColor:{},canvasWidth:{},canvasHeight:{}},emits:["canvasRef","widthChange","heightChange"],setup(t,{emit:e}){const n=S(0),o=S(0),r=S(!0),a=S(),s=t,i=O(()=>(s==null?void 0:s.canvasWidth)??2500),u=O(()=>(s==null?void 0:s.canvasHeight)??2500),d=e,h=["w-full","h-full"],{class:l}=ie();O(()=>{if(l){if(Array.isArray(l))return l;if(typeof l=="string")return l;throw new Error("invalid class attribute")}else return h});const c=f=>d("canvasRef",f),x=S(),{height:y,width:w}=Ce(x),A=async()=>{n.value=i.value,o.value=u.value},M=async()=>x.value?x.value:new Promise(f=>{const g=setInterval(()=>{x.value&&(clearInterval(g),f(x.value))},100)}),p=async()=>new Promise((f,g)=>{const m=setInterval(()=>{if(a.value){const H=a.value.getContext("2d");clearInterval(m),H?f(H):g("2d context not found")}},100)}),E=He(async()=>{const f=await p();f.clearRect(0,0,n.value,o.value);const g=75;for(let m=g/2;m<n.value;m+=g)for(let H=g/2;H<o.value;H+=g)Kt({at:{x:m,y:H},size:2,color:s.patternColor}).draw(f)},250),v=f=>{T.value={x:f.clientX,y:f.clientY},W()};setTimeout(async()=>{E();const f=await M(),g=o.value/2-f.clientHeight/2;f.scrollTop=g;const m=n.value/2-f.clientWidth/2;f.scrollLeft=m,f.addEventListener("scroll",W),f.addEventListener("mousemove",v),r.value=!1},100);const T=S({x:0,y:0}),C=S({x:0,y:0}),R=S({x:0,y:0}),W=async()=>{const f=await M(),{x:g,y:m}=T.value,{scrollLeft:H,scrollTop:Qt}=f;C.value.x=H+g,C.value.y=Qt+m,R.value.x=C.value.x-n.value/2,R.value.y=(C.value.y-o.value/2)*-1};return k(y,()=>{A(),E(),d("widthChange",n.value)}),k(w,()=>{A(),E(),d("heightChange",o.value)}),k(()=>i.value+u.value,()=>{A(),E(),d("widthChange",n.value),d("heightChange",o.value)}),k(()=>s.patternColor,E),ce(async()=>{const f=await M();f.removeEventListener("scroll",W),f.removeEventListener("mousemove",v)}),(f,g)=>(ht(),ft("div",{ref_key:"parentEl",ref:x,class:"h-full w-full overflow-auto relative",id:"responsive-canvas-container"},[r.value?(ht(),ft("div",{key:0,style:le({backgroundColor:f.color}),class:"absolute top-0 left-0 w-full h-full flex items-center justify-center"},null,4)):ue("",!0),xt("canvas",{width:n.value,height:o.value,ref:c,class:yt([`w-[${n.value}px]`,`h-[${o.value}px]`]),id:"responsive-canvas"},null,10,Sn),xt("canvas",{ref_key:"bgCanvas",ref:a,width:n.value,height:o.value,class:yt([`bg-[${f.color}]`,`w-[${n.value}px]`,`h-[${o.value}px]`,"absolute","top-0","-z-10","pointer-events-none"])},null,10,Mn)],512))}});export{Wn as _,Hn as a,Cn as b,vn as c,He as d,An as e,pn as f,Rn as g,mn as h,wn as l,bn as r,In as s,Ln as u};
