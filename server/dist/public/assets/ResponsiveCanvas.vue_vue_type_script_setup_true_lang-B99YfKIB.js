import{Q as yt,U as At,z as Xt,N as jt,v as Et,V as Zt,f as v,W as qt,X as Jt,Y as _t,u as P,G as N,Z as Qt,O as te,d as ee,$ as ne,s as oe,o as ut,c as dt,K as se,y as re,a as ht,q as xt}from"./index-B4XpbrsQ.js";function ct(t){return qt()?(Jt(t),!0):!1}function K(t){return typeof t=="function"?t():Xt(t)}const ae=typeof window<"u"&&typeof document<"u";typeof WorkerGlobalScope<"u"&&globalThis instanceof WorkerGlobalScope;const ce=Object.prototype.toString,ie=t=>ce.call(t)==="[object Object]",gt=()=>{};function le(t,e){function n(...o){return new Promise((s,r)=>{Promise.resolve(t(()=>e.apply(this,o),{fn:e,thisArg:this,args:o})).then(s).catch(r)})}return n}const bt=t=>t();function fe(t=bt){const e=v(!0);function n(){e.value=!1}function o(){e.value=!0}const s=(...r)=>{e.value&&t(...r)};return{isActive:Et(e),pause:n,resume:o,eventFilter:s}}function ue(t){return _t()}function de(...t){if(t.length!==1)return jt(...t);const e=t[0];return typeof e=="function"?Et(Zt(()=>({get:e,set:gt}))):v(e)}function he(t,e,n={}){const{eventFilter:o=bt,...s}=n;return P(t,le(o,e),s)}function xe(t,e,n={}){const{eventFilter:o,...s}=n,{eventFilter:r,pause:a,resume:i,isActive:l}=fe(o);return{stop:he(t,e,{...s,eventFilter:r}),pause:a,resume:i,isActive:l}}function Q(t,e=!0,n){ue()?yt(t,n):e?t():At(t)}const D=ae?window:void 0;function W(t){var e;const n=K(t);return(e=n==null?void 0:n.$el)!=null?e:n}function rt(...t){let e,n,o,s;if(typeof t[0]=="string"||Array.isArray(t[0])?([n,o,s]=t,e=D):[e,n,o,s]=t,!e)return gt;Array.isArray(n)||(n=[n]),Array.isArray(o)||(o=[o]);const r=[],a=()=>{r.forEach(d=>d()),r.length=0},i=(d,c,f,x)=>(d.addEventListener(c,f,x),()=>d.removeEventListener(c,f,x)),l=P(()=>[W(e),K(s)],([d,c])=>{if(a(),!d)return;const f=ie(c)?{...c}:c;r.push(...n.flatMap(x=>o.map(A=>i(d,x,A,f))))},{immediate:!0,flush:"post"}),u=()=>{l(),a()};return ct(u),u}function we(){const t=v(!1),e=_t();return e&&yt(()=>{t.value=!0},e),t}function Tt(t){const e=we();return N(()=>(e.value,!!t()))}function mt(t,e={}){const{window:n=D}=e,o=Tt(()=>n&&"matchMedia"in n&&typeof n.matchMedia=="function");let s;const r=v(!1),a=u=>{r.value=u.matches},i=()=>{s&&("removeEventListener"in s?s.removeEventListener("change",a):s.removeListener(a))},l=Qt(()=>{o.value&&(i(),s=n.matchMedia(K(t)),"addEventListener"in s?s.addEventListener("change",a):s.addListener(a),r.value=s.matches)});return ct(()=>{l(),i(),s=void 0}),r}const j=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Z="__vueuse_ssr_handlers__",ye=Ae();function Ae(){return Z in j||(j[Z]=j[Z]||{}),j[Z]}function vt(t,e){return ye[t]||e}function St(t){return mt("(prefers-color-scheme: dark)",t)}function Ee(t){return t==null?"any":t instanceof Set?"set":t instanceof Map?"map":t instanceof Date?"date":typeof t=="boolean"?"boolean":typeof t=="string"?"string":typeof t=="object"?"object":Number.isNaN(t)?"any":"number"}const _e={boolean:{read:t=>t==="true",write:t=>String(t)},object:{read:t=>JSON.parse(t),write:t=>JSON.stringify(t)},number:{read:t=>Number.parseFloat(t),write:t=>String(t)},any:{read:t=>t,write:t=>String(t)},string:{read:t=>t,write:t=>String(t)},map:{read:t=>new Map(JSON.parse(t)),write:t=>JSON.stringify(Array.from(t.entries()))},set:{read:t=>new Set(JSON.parse(t)),write:t=>JSON.stringify(Array.from(t))},date:{read:t=>new Date(t),write:t=>t.toISOString()}},wt="vueuse-storage";function Lt(t,e,n,o={}){var s;const{flush:r="pre",deep:a=!0,listenToStorageChanges:i=!0,writeDefaults:l=!0,mergeDefaults:u=!1,shallow:d,window:c=D,eventFilter:f,onError:x=h=>{console.error(h)},initOnMounted:A}=o,y=(d?te:v)(typeof e=="function"?e():e);if(!n)try{n=vt("getDefaultStorage",()=>{var h;return(h=D)==null?void 0:h.localStorage})()}catch(h){x(h)}if(!n)return y;const b=K(e),S=Ee(b),m=(s=o.serializer)!=null?s:_e[S],{pause:L,resume:_}=xe(y,()=>T(y.value),{flush:r,deep:a,eventFilter:f});c&&i&&Q(()=>{n instanceof Storage?rt(c,"storage",I):rt(c,wt,C),A&&I()}),A||I();function p(h,w){if(c){const E={key:t,oldValue:h,newValue:w,storageArea:n};c.dispatchEvent(n instanceof Storage?new StorageEvent("storage",E):new CustomEvent(wt,{detail:E}))}}function T(h){try{const w=n.getItem(t);if(h==null)p(w,null),n.removeItem(t);else{const E=m.write(h);w!==E&&(n.setItem(t,E),p(w,E))}}catch(w){x(w)}}function M(h){const w=h?h.newValue:n.getItem(t);if(w==null)return l&&b!=null&&n.setItem(t,m.write(b)),b;if(!h&&u){const E=m.read(w);return typeof u=="function"?u(E,b):S==="object"&&!Array.isArray(E)?{...b,...E}:E}else return typeof w!="string"?w:m.read(w)}function I(h){if(!(h&&h.storageArea!==n)){if(h&&h.key==null){y.value=b;return}if(!(h&&h.key!==t)){L();try{(h==null?void 0:h.newValue)!==m.write(y.value)&&(y.value=M(h))}catch(w){x(w)}finally{h?At(_):_()}}}}function C(h){I(h.detail)}return y}const ge="*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}";function be(t={}){const{selector:e="html",attribute:n="class",initialValue:o="auto",window:s=D,storage:r,storageKey:a="vueuse-color-scheme",listenToStorageChanges:i=!0,storageRef:l,emitAuto:u,disableTransition:d=!0}=t,c={auto:"",light:"light",dark:"dark",...t.modes||{}},f=St({window:s}),x=N(()=>f.value?"dark":"light"),A=l||(a==null?de(o):Lt(a,o,r,{window:s,listenToStorageChanges:i})),y=N(()=>A.value==="auto"?x.value:A.value),b=vt("updateHTMLAttrs",(_,p,T)=>{const M=typeof _=="string"?s==null?void 0:s.document.querySelector(_):W(_);if(!M)return;const I=new Set,C=new Set;let h=null;if(p==="class"){const E=T.split(/\s/g);Object.values(c).flatMap(R=>(R||"").split(/\s/g)).filter(Boolean).forEach(R=>{E.includes(R)?I.add(R):C.add(R)})}else h={key:p,value:T};if(I.size===0&&C.size===0&&h===null)return;let w;d&&(w=s.document.createElement("style"),w.appendChild(document.createTextNode(ge)),s.document.head.appendChild(w));for(const E of I)M.classList.add(E);for(const E of C)M.classList.remove(E);h&&M.setAttribute(h.key,h.value),d&&(s.getComputedStyle(w).opacity,document.head.removeChild(w))});function S(_){var p;b(e,n,(p=c[_])!=null?p:_)}function m(_){t.onChanged?t.onChanged(_,S):S(_)}P(y,m,{flush:"post",immediate:!0}),Q(()=>m(y.value));const L=N({get(){return u?A.value:y.value},set(_){A.value=_}});try{return Object.assign(L,{store:A,system:x,state:y})}catch{return L}}function Ma(t={}){const{valueDark:e="dark",valueLight:n="",window:o=D}=t,s=be({...t,onChanged:(i,l)=>{var u;t.onChanged?(u=t.onChanged)==null||u.call(t,i==="dark",l,i):l(i)},modes:{dark:e,light:n}}),r=N(()=>s.system?s.system.value:St({window:o}).value?"dark":"light");return N({get(){return s.value==="dark"},set(i){const l=i?"dark":"light";r.value===l?s.value="auto":s.value=l}})}function Te(t,e,n={}){const{window:o=D,...s}=n;let r;const a=Tt(()=>o&&"ResizeObserver"in o),i=()=>{r&&(r.disconnect(),r=void 0)},l=N(()=>{const c=K(t);return Array.isArray(c)?c.map(f=>W(f)):[W(c)]}),u=P(l,c=>{if(i(),a.value&&o){r=new ResizeObserver(e);for(const f of c)f&&r.observe(f,s)}},{immediate:!0,flush:"post"}),d=()=>{i(),u()};return ct(d),{isSupported:a,stop:d}}function me(t,e={width:0,height:0},n={}){const{window:o=D,box:s="content-box"}=n,r=N(()=>{var c,f;return(f=(c=W(t))==null?void 0:c.namespaceURI)==null?void 0:f.includes("svg")}),a=v(e.width),i=v(e.height),{stop:l}=Te(t,([c])=>{const f=s==="border-box"?c.borderBoxSize:s==="content-box"?c.contentBoxSize:c.devicePixelContentBoxSize;if(o&&r.value){const x=W(t);if(x){const A=x.getBoundingClientRect();a.value=A.width,i.value=A.height}}else if(f){const x=Array.isArray(f)?f:[f];a.value=x.reduce((A,{inlineSize:y})=>A+y,0),i.value=x.reduce((A,{blockSize:y})=>A+y,0)}else a.value=c.contentRect.width,i.value=c.contentRect.height},n);Q(()=>{const c=W(t);c&&(a.value="offsetWidth"in c?c.offsetWidth:e.width,i.value="offsetHeight"in c?c.offsetHeight:e.height)});const u=P(()=>W(t),c=>{a.value=c?e.width:0,i.value=c?e.height:0});function d(){l(),u()}return{width:a,height:i,stop:d}}function Ra(t,e,n={}){const{window:o=D}=n;return Lt(t,e,o==null?void 0:o.localStorage,n)}function Ia(t={}){const{window:e=D,initialWidth:n=Number.POSITIVE_INFINITY,initialHeight:o=Number.POSITIVE_INFINITY,listenOrientation:s=!0,includeScrollbar:r=!0,type:a="inner"}=t,i=v(n),l=v(o),u=()=>{e&&(a==="outer"?(i.value=e.outerWidth,l.value=e.outerHeight):r?(i.value=e.innerWidth,l.value=e.innerHeight):(i.value=e.document.documentElement.clientWidth,l.value=e.document.documentElement.clientHeight))};if(u(),Q(u),rt("resize",u,{passive:!0}),s){const d=mt("(orientation: portrait)");P(d,()=>u())}return{width:i,height:l}}const Oa=t=>/^#[0-9A-F]{6}$/i.test(t),Ca=t=>/^#[0-9A-F]{8}$/i.test(t),Na=(t,e)=>{const n=parseInt(t.slice(1),16);return`#${[(n>>16)+e,(n>>8&255)+e,(n&255)+e].map(r=>Math.min(Math.max(r,0),255).toString(16).padStart(2,"0")).join("")}`},ve="#f9fafb",Se="#f3f4f6",Le="#e5e7eb",pe="#d1d5db",Me="#9ca3af",Re="#6b7280",Ie="#4b5563",Oe="#374151",Ce="#1f2937",Ne="#111827",He="#fef2f2",Pe="#fee2e2",De="#fecaca",We="#fca5a5",Ue="#f87171",Ye="#ef4444",ke="#dc2626",ze="#b91c1c",Fe="#991b1b",Ge="#7f1d1d",Be="#fff7ed",$e="#ffedd5",Ve="#fed7aa",Ke="#fdba74",Xe="#fb923c",je="#f97316",Ze="#ea580c",qe="#c2410c",Je="#9a3412",Qe="#7c2d12",tn="#fffbeb",en="#fef3c7",nn="#fde68a",on="#fcd34d",sn="#fbbf24",rn="#f59e0b",an="#d97706",cn="#b45309",ln="#92400e",fn="#78350f",un="#fefce8",dn="#fef9c3",hn="#fef08a",xn="#fde047",wn="#facc15",yn="#eab308",An="#ca8a04",En="#a16207",_n="#854d0e",gn="#713f12",bn="#f7fee7",Tn="#ecfccb",mn="#d9f99d",vn="#bef264",Sn="#a3e635",Ln="#84cc16",pn="#65a30d",Mn="#4d7c0f",Rn="#3f6212",In="#365314",On="#f0fdf4",Cn="#dcfce7",Nn="#bbf7d0",Hn="#86efac",Pn="#4ade80",Dn="#22c55e",Wn="#16a34a",Un="#15803d",Yn="#166534",kn="#14532d",zn="#ecfdf5",Fn="#d1fae5",Gn="#a7f3d0",Bn="#6ee7b7",$n="#34d399",Vn="#10b981",Kn="#059669",Xn="#047857",jn="#065f46",Zn="#064e3b",qn="#f0fdfa",Jn="#ccfbf1",Qn="#99f6e4",to="#5eead4",eo="#2dd4bf",no="#14b8a6",oo="#0d9488",so="#0f766e",ro="#115e59",ao="#134e4a",co="#ecfeff",io="#cffafe",lo="#a5f3fc",fo="#67e8f9",uo="#22d3ee",ho="#06b6d4",xo="#0891b2",wo="#0e7490",yo="#155e75",Ao="#164e63",Eo="#f0f9ff",_o="#e0f2fe",go="#bae6fd",bo="#7dd3fc",To="#38bdf8",mo="#0ea5e9",vo="#0284c7",So="#0369a1",Lo="#075985",po="#0c4a6e",Mo="#eff6ff",Ro="#dbeafe",Io="#bfdbfe",Oo="#93c5fd",Co="#60a5fa",No="#3b82f6",Ho="#2563eb",Po="#1d4ed8",Do="#1e40af",Wo="#1e3a8a",Uo="#eef2ff",Yo="#e0e7ff",ko="#c7d2fe",zo="#a5b4fc",Fo="#818cf8",Go="#6366f1",Bo="#4f46e5",$o="#4338ca",Vo="#3730a3",Ko="#312e81",Xo="#f5f3ff",jo="#ede9fe",Zo="#ddd6fe",qo="#c4b5fd",Jo="#a78bfa",Qo="#8b5cf6",ts="#7c3aed",es="#6d28d9",ns="#5b21b6",os="#4c1d95",ss="#faf5ff",rs="#f3e8ff",as="#e9d5ff",cs="#d8b4fe",is="#c084fc",ls="#a855f7",fs="#9333ea",us="#7e22ce",ds="#6b21a8",hs="#581c87",xs="#fdf4ff",ws="#fae8ff",ys="#f5d0fe",As="#f0abfc",Es="#e879f9",_s="#d946ef",gs="#c026d3",bs="#a21caf",Ts="#86198f",ms="#701a75",vs="#fdf2f8",Ss="#fce7f3",Ls="#fbcfe8",ps="#f9a8d4",Ms="#f472b6",Rs="#ec4899",Is="#db2777",Os="#be185d",Cs="#9d174d",Ns="#831843",Hs="#fff1f2",Ps="#ffe4e6",Ds="#fecdd3",Ws="#fda4af",Us="#fb7185",Ys="#f43f5e",ks="#e11d48",zs="#be123c",Fs="#9f1239",Gs="#881337",Bs="#f5f7fa",$s="#e4e7eb",Vs="#cbd2d9",Ks="#9fa6b2",Xs="#6b7280",js="#4b5563",Zs="#374151",qs="#252f3f",Js="#161e2e",Qs="#0d131e",tr="#f9fafb",er="#f4f5f7",nr="#e5e7eb",or="#d2d6dc",sr="#9fa6b2",rr="#6b7280",ar="#4b5563",cr="#374151",ir="#252f3f",lr="#161e2e",fr="#f9fafb",ur="#f4f5f7",dr="#e5e7eb",hr="#d2d6dc",xr="#9fa6b2",wr="#6b7280",yr="#4b5563",Ar="#374151",Er="#252f3f",_r="#161e2e",gr="#f4f5f7",br="#e5e7eb",Tr="#d2d6dc",mr="#9fa6b2",vr="#6b7280",Sr="#4b5563",Lr="#374151",pr="#252f3f",Mr="#161e2e",Rr="#0d131e",Ir="#ffffff",Or="#000000",Cr="#00000000",Ha={WHITE:Ir,BLACK:Or,TRANSPARENT:Cr,GRAY_50:ve,GRAY_100:Se,GRAY_200:Le,GRAY_300:pe,GRAY_400:Me,GRAY_500:Re,GRAY_600:Ie,GRAY_700:Oe,GRAY_800:Ce,GRAY_900:Ne,RED_50:He,RED_100:Pe,RED_200:De,RED_300:We,RED_400:Ue,RED_500:Ye,RED_600:ke,RED_700:ze,RED_800:Fe,RED_900:Ge,ORANGE_50:Be,ORANGE_100:$e,ORANGE_200:Ve,ORANGE_300:Ke,ORANGE_400:Xe,ORANGE_500:je,ORANGE_600:Ze,ORANGE_700:qe,ORANGE_800:Je,ORANGE_900:Qe,AMBER_50:tn,AMBER_100:en,AMBER_200:nn,AMBER_300:on,AMBER_400:sn,AMBER_500:rn,AMBER_600:an,AMBER_700:cn,AMBER_800:ln,AMBER_900:fn,YELLOW_50:un,YELLOW_100:dn,YELLOW_200:hn,YELLOW_300:xn,YELLOW_400:wn,YELLOW_500:yn,YELLOW_600:An,YELLOW_700:En,YELLOW_800:_n,YELLOW_900:gn,LIME_50:bn,LIME_100:Tn,LIME_200:mn,LIME_300:vn,LIME_400:Sn,LIME_500:Ln,LIME_600:pn,LIME_700:Mn,LIME_800:Rn,LIME_900:In,GREEN_50:On,GREEN_100:Cn,GREEN_200:Nn,GREEN_300:Hn,GREEN_400:Pn,GREEN_500:Dn,GREEN_600:Wn,GREEN_700:Un,GREEN_800:Yn,GREEN_900:kn,EMERALD_50:zn,EMERALD_100:Fn,EMERALD_200:Gn,EMERALD_300:Bn,EMERALD_400:$n,EMERALD_500:Vn,EMERALD_600:Kn,EMERALD_700:Xn,EMERALD_800:jn,EMERALD_900:Zn,TEAL_50:qn,TEAL_100:Jn,TEAL_200:Qn,TEAL_300:to,TEAL_400:eo,TEAL_500:no,TEAL_600:oo,TEAL_700:so,TEAL_800:ro,TEAL_900:ao,CYAN_50:co,CYAN_100:io,CYAN_200:lo,CYAN_300:fo,CYAN_400:uo,CYAN_500:ho,CYAN_600:xo,CYAN_700:wo,CYAN_800:yo,CYAN_900:Ao,SKY_50:Eo,SKY_100:_o,SKY_200:go,SKY_300:bo,SKY_400:To,SKY_500:mo,SKY_600:vo,SKY_700:So,SKY_800:Lo,SKY_900:po,BLUE_50:Mo,BLUE_100:Ro,BLUE_200:Io,BLUE_300:Oo,BLUE_400:Co,BLUE_500:No,BLUE_600:Ho,BLUE_700:Po,BLUE_800:Do,BLUE_900:Wo,INDIGO_50:Uo,INDIGO_100:Yo,INDIGO_200:ko,INDIGO_300:zo,INDIGO_400:Fo,INDIGO_500:Go,INDIGO_600:Bo,INDIGO_700:$o,INDIGO_800:Vo,INDIGO_900:Ko,VIOLET_50:Xo,VIOLET_100:jo,VIOLET_200:Zo,VIOLET_300:qo,VIOLET_400:Jo,VIOLET_500:Qo,VIOLET_600:ts,VIOLET_700:es,VIOLET_800:ns,VIOLET_900:os,PURPLE_50:ss,PURPLE_100:rs,PURPLE_200:as,PURPLE_300:cs,PURPLE_400:is,PURPLE_500:ls,PURPLE_600:fs,PURPLE_700:us,PURPLE_800:ds,PURPLE_900:hs,FUCHSIA_50:xs,FUCHSIA_100:ws,FUCHSIA_200:ys,FUCHSIA_300:As,FUCHSIA_400:Es,FUCHSIA_500:_s,FUCHSIA_600:gs,FUCHSIA_700:bs,FUCHSIA_800:Ts,FUCHSIA_900:ms,PINK_50:vs,PINK_100:Ss,PINK_200:Ls,PINK_300:ps,PINK_400:Ms,PINK_500:Rs,PINK_600:Is,PINK_700:Os,PINK_800:Cs,PINK_900:Ns,ROSE_50:Hs,ROSE_100:Ps,ROSE_200:Ds,ROSE_300:Ws,ROSE_400:Us,ROSE_500:Ys,ROSE_600:ks,ROSE_700:zs,ROSE_800:Fs,ROSE_900:Gs,STONE_50:Bs,STONE_100:$s,STONE_200:Vs,STONE_300:Ks,STONE_400:Xs,STONE_500:js,STONE_600:Zs,STONE_700:qs,STONE_800:Js,STONE_900:Qs,NEUTRAL_50:tr,NEUTRAL_100:er,NEUTRAL_200:nr,NEUTRAL_300:or,NEUTRAL_400:sr,NEUTRAL_500:rr,NEUTRAL_600:ar,NEUTRAL_700:cr,NEUTRAL_800:ir,NEUTRAL_900:lr,ZINC_50:fr,ZINC_100:ur,ZINC_200:dr,ZINC_300:hr,ZINC_400:xr,ZINC_500:wr,ZINC_600:yr,ZINC_700:Ar,ZINC_800:Er,ZINC_900:_r,SLATE_50:gr,SLATE_100:br,SLATE_200:Tr,SLATE_300:mr,SLATE_400:vr,SLATE_500:Sr,SLATE_600:Lr,SLATE_700:pr,SLATE_800:Mr,SLATE_900:Rr},Pa=(t,...e)=>typeof t=="function"?t(...e):t,Y=()=>Math.random().toString(36).substring(2,9),Nr=(t,e)=>{const n=e.find(l=>l.id===t);if(!n)return;const o=e.map(l=>l.priority),[s,r]=[Math.max(...o),Math.min(...o)],a=s-r,i=Number((a/e.length).toFixed(2));n.priority=s,e.sort((l,u)=>l.priority-u.priority);for(let l=0;l<e.length;l++)e[l].id!==t&&(e[l].priority=r+i*l)},Da=(t,e)=>{const n=e.filter(o=>o.graphType==="node");Nr(t,n)},Wa=(t,e)=>Math.round(Math.random()*(e-t)+t),Ua=(t,e)=>{const n=e.getNode(t.from),o=e.getNode(t.to);if(!n||!o)throw new Error("nodes not found");return{from:n,to:o}},Ya=(t,e)=>e.filter(n=>n.from===t.id||n.to===t.id),ka=(t,{nodes:e,edges:n})=>n.value.filter(o=>o.type==="undirected"&&o.from===t||o.to===t),za=(t,{nodes:e,edges:n})=>n.value.filter(o=>o.type==="undirected"?o.from===t||o.to===t:o.from===t),Fa=(t,e)=>t.type==="undirected"?t.from===e.id||t.to===e.id:t.from===e.id,q=t=>e=>{const{start:n,end:o,width:s,color:r}={...$,...t};e.beginPath(),e.moveTo(n.x,n.y),e.lineTo(o.x,o.y),e.lineWidth=s,e.strokeStyle=r,e.stroke(),e.closePath()},J=t=>e=>{const{at:n,width:o,height:s,color:r,borderRadius:a,rotation:i,stroke:l}={...it,...t};e.save();const u=n.x+o/2,d=n.y+s/2;if(e.translate(u,d),e.rotate(i),a===0)e.beginPath(),e.rect(-o/2,-s/2,o,s),e.fillStyle=r,e.fill();else{const c=Math.min(a,o/2,s/2);e.beginPath(),e.moveTo(-o/2+c,-s/2),e.lineTo(o/2-c,-s/2),e.arcTo(o/2,-s/2,o/2,-s/2+c,c),e.lineTo(o/2,s/2-c),e.arcTo(o/2,s/2,o/2-c,s/2,c),e.lineTo(-o/2+c,s/2),e.arcTo(-o/2,s/2,-o/2,s/2-c,c),e.lineTo(-o/2,-s/2+c),e.arcTo(-o/2,-s/2,-o/2+c,-s/2,c),e.closePath(),e.fillStyle=r,e.fill()}if(l){const{color:c,width:f,dash:x}=l;e.strokeStyle=c,e.lineWidth=f,e.setLineDash(x||[]),e.stroke(),e.setLineDash([])}e.restore()},Hr={color:"white",activeColor:"white"},z={fontSize:12,fontWeight:"normal",color:"black"},pt={color:"black",width:0},k=t=>({width:t.text.fontSize*2,height:t.text.fontSize*2}),F=t=>{const{at:e,color:n}=t,{width:o,height:s}=k(t),r=It({at:e,width:o,height:s,color:n});return a=>r.drawShape(a)},G=t=>e=>{const{at:n}=t,{content:o,fontSize:s,fontWeight:r,color:a}=t.text;e.font=`${r} ${s}px Arial`,e.fillStyle=a,e.textAlign="center",e.textBaseline="middle",e.fillText(o,n.x+s,n.y+s)},g=(t,e)=>{const n={...Hr,...t},o={...z,...n.text};return{...n,text:o,at:e}},H=(t,e,n)=>{const o=Math.cos(n),s=Math.sin(n),r=t.x-e.x,a=t.y-e.y;return{x:e.x+(r*o-a*s),y:e.y+(r*s+a*o)}},at=(t,e)=>{const{x:n,y:o}=t,{x:s,y:r}=e;return Math.atan2(r-o,s-n)},Ga=(t,e)=>{if(e.length===0)return 0;const[n]=e;if(e.length===1)return at(t,n)+Math.PI;const o=e.map(a=>at(t,a)).sort((a,i)=>a-i);let s=0,r=0;for(let a=0;a<o.length;a++){const i=(a+1)%o.length,l=(o[i]-o[a]+2*Math.PI)%(2*Math.PI);l>s&&(s=l,r=a)}return(o[r]+s/2)%(2*Math.PI)},tt=t=>{const{at:e,width:n,height:o,textArea:s}={...it,...t};if(!s)throw new Error("no text area provided");const{text:r}=s,{fontSize:a}={...z,...r},i=e.x+n/2,l=e.y+o/2;return{x:i-a,y:l-a}},Pr=t=>{if(!t.textArea)return;const e=tt(t),n=g(t.textArea,e),{width:o,height:s}=k(n),r=O({at:n.at,width:o,height:s});return a=>r(a)},Mt=t=>{if(!t.textArea)return;const e=tt(t),n=g(t.textArea,e),o=F(n);return s=>o(s)},Rt=t=>{if(!t.textArea)return;const e=tt(t),n=g(t.textArea,e),o=G(n);return s=>o(s)},Dr=t=>{const e=Mt(t),n=Rt(t);if(!(!e||!n))return o=>{e(o),n(o)}},B=(t,e)=>{const{at:n,text:o,activeColor:s}=t,{x:r,y:a}=n,{color:i,content:l,fontSize:u,fontWeight:d}=o,c=u*2,f=document.createElement("textarea");f.style.position="absolute",f.style.left=`${r}px`,f.style.top=`${a}px`,f.style.width=`${c}px`,f.style.height=`${c}px`,f.style.zIndex="1000",f.style.resize="none",f.style.overflow="hidden",f.style.border="none",f.style.padding="0",f.style.paddingTop="4px",f.style.margin="0",f.style.fontSize=`${u}px`,f.style.color=i,f.style.backgroundColor=s,f.style.fontFamily="Arial",f.style.textAlign="center",f.style.fontWeight=d,f.style.outline="none",f.style.whiteSpace="nowrap",f.value=l;const x=()=>{f.onblur=null,e(f.value),f.remove()};f.onblur=x,f.onkeydown=y=>{y.key==="Enter"&&x()};const A=document.getElementById("responsive-canvas-container");if(!A)throw new Error("responsive canvas container not found");A.appendChild(f),setTimeout(()=>{f.focus(),f.setSelectionRange(0,f.value.length)},10)},it={color:"black",borderRadius:0,rotation:0},It=t=>{if(t.borderRadius&&t.borderRadius<0)throw new Error("borderRadius must be positive");const e=J(t),n=O(t),o=Pr(t),s=U(t),r=c=>(o==null?void 0:o(c))||n(c),a=Dr(t),i=Mt(t),l=Rt(t),u=c=>{e(c),a==null||a(c)},d=c=>{if(!t.textArea)return;const f=tt(t),x=g(t.textArea,f);B(x,c)};return{id:Y(),name:"rect",draw:u,drawShape:e,drawTextArea:a,drawTextAreaMatte:i,drawText:l,hitbox:r,shapeHitbox:n,textHitbox:o,efficientHitbox:s,activateTextArea:d}},V=t=>e=>{const n=e.x-t.at.x,o=e.y-t.at.y,s={...pt,...t.stroke},r=t.radius+s.width/2;return n**2+o**2<=r**2},Wr=t=>{const{at:e,radius:n}=t,{width:o}={...pt,...t.stroke},s=U({at:{x:e.x-(n+o/2),y:e.y-(n+o/2)},width:2*n+o,height:2*n+o});return r=>s(r)},O=t=>e=>{const{at:n,width:o,height:s,borderRadius:r,rotation:a}={...it,...t},i=n.x+o/2,l=n.y+s/2,u=H(e,{x:i,y:l},-a),{x:d,y:c}={x:i-o/2,y:l-s/2};if(r===0)return u.x>=d&&u.x<=d+o&&u.y>=c&&u.y<=c+s;const f=Math.min(r,o/2,s/2),x=O({...t,at:{x:d+f,y:c},width:o-2*f,borderRadius:0,rotation:0}),A=O({...t,at:{x:d,y:c+f},height:s-2*f,borderRadius:0,rotation:0});if(x(u)||A(u))return!0;const y=V({at:{x:d+f,y:c+f},radius:f}),b=V({at:{x:d+o-f,y:c+f},radius:f}),S=V({at:{x:d+f,y:c+s-f},radius:f}),m=V({at:{x:d+o-f,y:c+s-f},radius:f});return y(u)||b(u)||S(u)||m(u)},U=t=>e=>{const{at:n,width:o,height:s}=t,{at:r,width:a,height:i}=e,l=Math.min(n.x,n.x+o),u=Math.max(n.x,n.x+o),d=Math.min(n.y,n.y+s),c=Math.max(n.y,n.y+s),f=Math.min(r.x,r.x+a),x=Math.max(r.x,r.x+a),A=Math.min(r.y,r.y+i),y=Math.max(r.y,r.y+i);return!(u<=f||x<=l||c<=A||y<=d)},lt=t=>e=>{const{start:n,end:o,width:s}={...$,...t},{x:r,y:a}=n,{x:i,y:l}=o,{x:u,y:d}=e,c=(i-r)**2+(l-a)**2;if(c===0)return(u-r)**2+(d-a)**2<=(s/2)**2;const f=((u-r)*(i-r)+(d-a)*(l-a))/c,x=Math.max(0,Math.min(1,f)),A=r+x*(i-r),y=a+x*(l-a);return(u-A)**2+(d-y)**2<=(s/2)**2},Ot=t=>{const{start:e,end:n,width:o}={...$,...t},s=Math.hypot(n.x-e.x,n.y-e.y),r=Math.atan2(n.y-e.y,n.x-e.x),a=Math.abs(Math.cos(r))+Math.abs(Math.sin(r)),i=Math.min(50,s*a),l=Math.ceil(s/i),u=(n.x-e.x)/s,d=(n.y-e.y)/s,c=Math.min(e.x,n.x)-o/2,f=Math.min(e.y,n.y)-o/2,x=Math.abs(n.x-e.x)+o,A=Math.abs(n.y-e.y)+o,y=U({at:{x:c,y:f},width:x,height:A});return b=>y(b)?Array.from({length:l},(m,L)=>{const _=e.x+u*i*L,p=e.y+d*i*L,T=_+u*i,M=p+d*i,I=Math.min(_,T)-o/2,C=Math.min(p,M)-o/2,h=Math.abs(T-_)+o,w=Math.abs(M-p)+o;return U({at:{x:I,y:C},width:h,height:w})}).some(m=>m(b)):!1},X=t=>{const{textOffsetFromCenter:e,start:n,end:o,textArea:s}={...$,...t};if(!s)throw new Error("no text area provided");const{text:r}=s,{fontSize:a}={...z,...r},i=at(n,o),l=e*Math.cos(i),u=e*Math.sin(i),d=(n.x+o.x)/2+l,c=(n.y+o.y)/2+u;return{x:d-a,y:c-a}},Ur=t=>{if(!t.textArea)return;const e=X(t),n=g(t.textArea,e),{width:o,height:s}=k(n),r=O({at:n.at,width:o,height:s});return a=>r(a)},Ct=t=>{if(!t.textArea)return;const e=X(t),n=g(t.textArea,e),o=F(n);return s=>o(s)},Nt=t=>{if(!t.textArea)return;const e=X(t),n=g(t.textArea,e),o=G(n);return s=>o(s)},Yr=t=>{const e=Ct(t),n=Nt(t);if(!(!e||!n))return o=>{e(o),n(o)}},$={width:10,textOffsetFromCenter:0,color:"black"},kr=t=>{if(t.width&&t.width<0)throw new Error("lineWidth must be positive");const e=q(t),n=lt(t),o=Ur(t),s=Ot(t),r=c=>(o==null?void 0:o(c))||n(c),a=Yr(t),i=Ct(t),l=Nt(t),u=c=>{e(c),a==null||a(c)},d=c=>{if(!t.textArea)return;const f=X(t),x=g(t.textArea,f);B(x,c)};return{id:Y(),name:"line",draw:u,drawShape:e,drawTextArea:a,drawTextAreaMatte:i,drawText:l,hitbox:r,shapeHitbox:n,textHitbox:o,efficientHitbox:s,activateTextArea:d}},zr=t=>e=>{const{point1:n,point2:o,point3:s}=t,{x:r,y:a}=e,i=.5*(-o.y*s.x+n.y*(-o.x+s.x)+n.x*(o.y-s.y)+o.x*s.y),l=1/(2*i)*(n.y*s.x-n.x*s.y+(s.y-n.y)*r+(n.x-s.x)*a),u=1/(2*i)*(n.x*o.y-n.y*o.x+(n.y-o.y)*r+(o.x-n.x)*a);return l>0&&u>0&&1-l-u>0},Fr=t=>{const{point1:e,point2:n,point3:o}=t,s=Math.min(e.x,n.x,o.x),r=Math.min(e.y,n.y,o.y),a=Math.max(e.x,n.x,o.x)-s,i=Math.max(e.y,n.y,o.y)-r,l=U({at:{x:s,y:r},width:a,height:i});return u=>l(u)},Gr={color:"black"},Br=t=>{const e=ft(t),n=zr(t),o=Fr(t),s=a=>n(a),r=a=>{e(a)};return{id:Y(),name:"triangle",draw:r,drawShape:e,hitbox:s,shapeHitbox:n,efficientHitbox:o}},ft=t=>e=>{const{point1:n,point2:o,point3:s,color:r}={...Gr,...t};e.beginPath(),e.moveTo(n.x,n.y),e.lineTo(o.x,o.y),e.lineTo(s.x,s.y),e.fillStyle=r,e.fill(),e.closePath()},$r=t=>{const{start:e,end:n,width:o,color:s}={...Dt,...t},r=Math.atan2(n.y-e.y,n.x-e.x),a=o*2.5,i={x:n.x-a*Math.cos(r),y:n.y-a*Math.sin(r)},l=a/1.75,u=n,d={x:i.x+l*Math.cos(r+Math.PI/2),y:i.y+l*Math.sin(r+Math.PI/2)},c={x:i.x-l*Math.cos(r+Math.PI/2),y:i.y-l*Math.sin(r+Math.PI/2)},f={start:e,end:{x:i.x+Math.cos(r),y:i.y+Math.sin(r)},width:o,color:s},x=q(f),A=ft({point1:u,point2:d,point3:c,color:s});return y=>{x(y),A(y)}},Vr=t=>{const e=lt(t);return n=>e(n)},Kr=t=>{const e=Ot(t);return n=>e(n)},et=t=>{const{textOffsetFromCenter:e,start:n,end:o,textArea:s,width:r,color:a}={...Dt,...t};if(!s)throw new Error("no text area provided");const i=Math.atan2(o.y-n.y,o.x-n.x),l=r*2.5,u={x:o.x-l*Math.cos(i),y:o.y-l*Math.sin(i)};return X({start:n,end:u,width:r,color:a,textOffsetFromCenter:e,textArea:s})},Xr=t=>{if(!t.textArea)return;const e=et(t),n=g(t.textArea,e),{width:o,height:s}=k(n),r=O({at:n.at,width:o,height:s});return a=>r(a)},Ht=t=>{if(!t.textArea)return;const e=et(t),n=g(t.textArea,e),o=F(n);return s=>o(s)},Pt=t=>{if(!t.textArea)return;const e=et(t),n=g(t.textArea,e),o=G(n);return s=>o(s)},jr=t=>{const e=Ht(t),n=Pt(t);if(!(!e||!n))return o=>{e(o),n(o)}},Dt=$,Zr=t=>{if(t.width&&t.width<0)throw new Error("width must be positive");const e=$r(t),n=Vr(t),o=Xr(t),s=Kr(t),r=c=>(o==null?void 0:o(c))||n(c),a=jr(t),i=Ht(t),l=Pt(t),u=c=>{e(c),a==null||a(c)},d=c=>{if(!t.textArea)return;const f=et(t),x=g(t.textArea,f);B(x,c)};return{id:Y(),name:"arrow",draw:u,drawShape:e,drawTextArea:a,drawTextAreaMatte:i,drawText:l,hitbox:r,shapeHitbox:n,textHitbox:o,efficientHitbox:s,activateTextArea:d}},qr=t=>e=>{const{at:n,radius:o,color:s,stroke:r}={...Yt,...t};if(e.beginPath(),e.arc(n.x,n.y,o,0,2*Math.PI),e.fillStyle=s,e.fill(),r){const{color:a,width:i,dash:l}=r;e.strokeStyle=a,e.lineWidth=i,e.setLineDash(l||[]),e.stroke(),e.setLineDash([])}e.closePath()},nt=t=>{const{at:e,radius:n,textArea:o}={...Yt,...t};if(!o)throw new Error("no text area provided");const{text:s}=o,{fontSize:r}={...z,...s},a=r>=50?.3:.1;return{x:e.x-r,y:e.y+r**a-r}},Jr=t=>{if(!t.textArea)return;const e=nt(t),n=g(t.textArea,e),{width:o,height:s}=k(n),r=O({at:n.at,width:o,height:s});return a=>r(a)},Wt=t=>{if(!t.textArea)return;const e=nt(t),n=g(t.textArea,e),o=F(n);return s=>o(s)},Ut=t=>{if(!t.textArea)return;const e=nt(t),n=g(t.textArea,e),o=G(n);return s=>o(s)},Qr=t=>{const e=Wt(t),n=Ut(t);if(!(!e||!n))return o=>{e(o),n(o)}},Yt={color:"black"},ta=t=>{if(t.radius<0)throw new Error("radius must be positive");const e=qr(t),n=V(t),o=Jr(t),s=Wr(t),r=c=>(o==null?void 0:o(c))||n(c),a=Qr(t),i=Wt(t),l=Ut(t),u=c=>{e(c),a==null||a(c)},d=c=>{if(!t.textArea)return;const f=nt(t),x=g(t.textArea,f);B(x,c)};return{id:Y(),name:"circle",draw:u,drawShape:e,drawTextArea:a,drawTextAreaMatte:i,drawText:l,hitbox:r,shapeHitbox:n,textHitbox:o,efficientHitbox:s,activateTextArea:d}},ea=t=>{const e=J({width:t.size,height:t.size,...t});return n=>e(n)},ot=t=>{const{at:e,size:n,textArea:o}=t;if(!o)throw new Error("no text area provided");const{text:s}=o,{fontSize:r}={...z,...s},a=e.x+n/2,i=e.y+n/2;return{x:a-r,y:i-r}},na=t=>{if(!t.textArea)return;const e=ot(t),n=g(t.textArea,e),{width:o,height:s}=k(n),r=O({at:n.at,width:o,height:s});return a=>r(a)},kt=t=>{if(!t.textArea)return;const e=ot(t),n=g(t.textArea,e),o=F(n);return s=>o(s)},zt=t=>{if(!t.textArea)return;const e=ot(t),n=g(t.textArea,e),o=G(n);return s=>o(s)},oa=t=>{const e=kt(t),n=zt(t);if(!(!e||!n))return o=>{e(o),n(o)}},sa=t=>{const e=O({at:t.at,width:t.size,height:t.size,borderRadius:t.borderRadius,rotation:t.rotation});return n=>e(n)},ra=t=>{const e=U({at:t.at,width:t.size,height:t.size});return n=>e(n)},aa=t=>{const e=ea(t),n=sa(t),o=na(t),s=ra(t),r=c=>(o==null?void 0:o(c))||n(c),a=oa(t),i=kt(t),l=zt(t),u=c=>{e(c),a==null||a(c)},d=c=>{if(!t.textArea)return;const f=ot(t),x=g(t.textArea,f);B(x,c)};return{id:Y(),name:"square",draw:u,drawShape:e,drawTextArea:a,drawTextAreaMatte:i,drawText:l,hitbox:r,shapeHitbox:n,textHitbox:o,efficientHitbox:s,activateTextArea:d}},ca=t=>{const{spacing:e,at:n,upDistance:o,downDistance:s,rotation:r,lineWidth:a,color:i}={...Bt,...t},l=a*1.4,u=l,d=H({x:n.x,y:n.y-e},n,r),c=H({x:n.x+o,y:n.y-e},n,r),f=H({x:n.x+o,y:n.y+e},n,r),x=H({x:n.x+o-s+l,y:n.y+e},n,r),A=H({x:n.x+o,y:n.y},n,r),y={x:x.x+u*Math.cos(r),y:x.y+u*Math.sin(r)},b=H({x:n.x+o-s,y:n.y+e},n,r),S={x:y.x+u*Math.cos(r+Math.PI/2),y:y.y+u*Math.sin(r+Math.PI/2)},m={x:y.x-u*Math.cos(r+Math.PI/2),y:y.y-u*Math.sin(r+Math.PI/2)},L=ft({point1:b,point2:S,point3:m,color:i}),_=q({start:d,end:c,width:a,color:i}),p=q({start:f,end:x,width:a,color:i});return T=>{_(T),L(T),p(T),T.beginPath(),T.arc(A.x,A.y,e,Math.PI/2+r+.05,-Math.PI/2+r-.05,!0),T.strokeStyle=i,T.stroke(),T.closePath()}},ia=t=>{const{spacing:e,at:n,upDistance:o,lineWidth:s,rotation:r}=t,a=H({x:n.x+o,y:n.y},n,r),i=lt({start:n,end:a,width:2*e+s});return l=>i(l)},la=t=>{const{spacing:e,at:n,upDistance:o,rotation:s,lineWidth:r}=t,a=H({x:n.x+o,y:n.y},n,s),i=Math.min(n.x,a.x),l=Math.min(n.y,a.y),u=Math.abs(n.x-a.x),d=Math.abs(n.y-a.y),c=U({at:{x:i-r/2-e,y:l-r/2-e},width:u+r+2*e,height:d+r+2*e});return f=>c(f)},st=t=>{const{at:e,upDistance:n,rotation:o,textArea:s,spacing:r}={...Bt,...t};if(!s)throw new Error("no text area provided");const{text:a}=s,{fontSize:i}={...z,...a},l=H({x:e.x+n+r,y:e.y},e,o);return{x:l.x-i+Math.cos(o)*15,y:l.y-i+Math.sin(o)*15}},fa=t=>{if(!t.textArea)return;const e=st(t),n=g(t.textArea,e),{width:o,height:s}=k(n),r=O({at:n.at,width:o,height:s});return a=>r(a)},Ft=t=>{if(!t.textArea)return;const e=st(t),n=g(t.textArea,e),o=F(n);return s=>o(s)},Gt=t=>{if(!t.textArea)return;const e=st(t),n=g(t.textArea,e),o=G(n);return s=>o(s)},ua=t=>{const e=Ft(t),n=Gt(t);if(!(!e||!n))return o=>{e(o),n(o)}},Bt={color:"black"},da=t=>{if(t.downDistance<0)throw new Error("downDistance must be positive");if(t.upDistance<0)throw new Error("upDistance must be positive");const e=ca(t),n=ia(t),o=fa(t),s=la(t),r=c=>(o==null?void 0:o(c))||n(c),a=ua(t),i=Ft(t),l=Gt(t),u=c=>{e(c),a==null||a(c)},d=c=>{if(!t.textArea)return;const f=st(t),x=g(t.textArea,f);B(x,c)};return{id:Y(),name:"uturn",draw:u,drawShape:e,drawTextArea:a,drawTextAreaMatte:i,drawText:l,hitbox:r,shapeHitbox:n,textHitbox:o,efficientHitbox:s,activateTextArea:d}},ha=t=>{const{at:e,size:n,rotation:o,lineWidth:s,borderRadius:r}={...$t,...t},a=s/2,i=O({at:{x:e.x-n/2,y:e.y-a},width:n,height:s,rotation:o,borderRadius:r}),l=O({at:{x:e.x-a,y:e.y-n/2},width:s,height:n,rotation:o,borderRadius:r});return u=>i(u)||l(u)},xa=t=>{const{at:e,size:n}=t,o=U({at:{x:e.x-n/2,y:e.y-n/2},width:n,height:n});return s=>o(s)},wa=t=>{const{at:e,size:n,rotation:o,color:s,lineWidth:r,borderRadius:a}={...$t,...t},i=r/2;return l=>{J({at:{x:e.x-i,y:e.y-n/2},width:r,height:n,color:s,borderRadius:a,rotation:o})(l),J({at:{x:e.x-n/2,y:e.y-i},width:n,height:r,color:s,borderRadius:a,rotation:o})(l)}},$t={rotation:0,color:"black",lineWidth:$.width,borderRadius:0},ya=t=>{if(t.lineWidth&&t.lineWidth<0)throw new Error("lineWidth must be positive");const e=wa(t),n=ha(t),o=xa(t),s=a=>n(a),r=a=>{e(a)};return{id:Y(),name:"cross",draw:r,drawShape:e,shapeHitbox:n,hitbox:s,efficientHitbox:o}},Aa=kr,Ea=Zr,_a=ta,ga=It,ba=aa,Ta=Br,ma=da,Vt=ya,Ba={arrow:Ea,circle:_a,line:Aa,rect:ga,square:ba,triangle:Ta,uturn:ma,cross:Vt},va=(t,e)=>{let n;return()=>{clearTimeout(n),n=setTimeout(t,e)}},Sa=["width","height"],La=["width","height"],$a=ee({__name:"ResponsiveCanvas",props:{color:{},patternColor:{},canvasWidth:{},canvasHeight:{}},emits:["canvasRef","widthChange","heightChange"],setup(t,{emit:e}){const n=v(0),o=v(0),s=v(!0),r=v(),a=t,i=N(()=>(a==null?void 0:a.canvasWidth)??2500),l=N(()=>(a==null?void 0:a.canvasHeight)??2500),u=e,d=["w-full","h-full"],{class:c}=ne();N(()=>{if(c){if(Array.isArray(c))return c;if(typeof c=="string")return c;throw new Error("invalid class attribute")}else return d});const f=h=>u("canvasRef",h),x=v(),{height:A,width:y}=me(x),b=async()=>{n.value=i.value,o.value=l.value},S=async()=>x.value?x.value:new Promise(h=>{const w=setInterval(()=>{x.value&&(clearInterval(w),h(x.value))},100)}),m=async()=>new Promise((h,w)=>{const E=setInterval(()=>{if(r.value){const R=r.value.getContext("2d");clearInterval(E),R?h(R):w("2d context not found")}},100)}),L=va(async()=>{const h=await m();h.clearRect(0,0,n.value,o.value);const w=75;for(let E=w/2;E<n.value;E+=w)for(let R=w/2;R<o.value;R+=w)Vt({at:{x:E,y:R},size:2,color:a.patternColor}).draw(h)},250),_=h=>{T.value={x:h.clientX,y:h.clientY},C()};setTimeout(async()=>{L();const h=await S(),w=o.value/2-h.clientHeight/2;h.scrollTop=w;const E=n.value/2-h.clientWidth/2;h.scrollLeft=E,h.addEventListener("scroll",C),h.addEventListener("mousemove",_),s.value=!1},100);const T=v({x:0,y:0}),M=v({x:0,y:0}),I=v({x:0,y:0}),C=async()=>{const h=await S(),{x:w,y:E}=T.value,{scrollLeft:R,scrollTop:Kt}=h;M.value.x=R+w,M.value.y=Kt+E,I.value.x=M.value.x-n.value/2,I.value.y=(M.value.y-o.value/2)*-1};return P(A,()=>{b(),L(),u("widthChange",n.value)}),P(y,()=>{b(),L(),u("heightChange",o.value)}),P(()=>i.value+l.value,()=>{b(),L(),u("widthChange",n.value),u("heightChange",o.value)}),P(()=>a.patternColor,L),oe(async()=>{const h=await S();h.removeEventListener("scroll",C),h.removeEventListener("mousemove",_)}),(h,w)=>(ut(),dt("div",{ref_key:"parentEl",ref:x,class:"h-full w-full overflow-auto relative",id:"responsive-canvas-container"},[s.value?(ut(),dt("div",{key:0,style:se({backgroundColor:h.color}),class:"absolute top-0 left-0 w-full h-full flex items-center justify-center"},null,4)):re("",!0),ht("canvas",{width:n.value,height:o.value,ref:f,class:xt([`w-[${n.value}px]`,`h-[${o.value}px]`]),id:"responsive-canvas"},null,10,Sa),ht("canvas",{ref_key:"bgCanvas",ref:r,width:n.value,height:o.value,class:xt([`bg-[${h.color}]`,`w-[${n.value}px]`,`h-[${o.value}px]`,"absolute","top-0","-z-10","pointer-events-none"])},null,10,La)],512))}});export{sn as A,us as P,ze as R,$a as _,_a as a,Ma as b,Ha as c,va as d,Ia as e,ka as f,Wa as g,za as h,Pa as i,Na as j,Ca as k,Oa as l,Fa as m,ba as n,Ua as o,Ga as p,ma as q,Aa as r,Ba as s,Ea as t,Ra as u,Y as v,Ya as w,Da as x,ga as y};
