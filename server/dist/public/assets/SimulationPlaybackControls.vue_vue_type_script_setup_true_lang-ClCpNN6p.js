import{_ as r}from"./Button.vue_vue_type_script_setup_true_lang-Bn5TR-zN.js";import{d as L,H as f,o,c as a,e as i,w as n,z as s,B as c,a as l}from"./index-jfH_lu32.js";var m="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z",x="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z",C="M14,19H18V5H14M6,19H10V5H6V19Z",w="M8,5.14V19.14L19,12.14L8,5.14Z",B="M12,4C14.1,4 16.1,4.8 17.6,6.3C20.7,9.4 20.7,14.5 17.6,17.6C15.8,19.5 13.3,20.2 10.9,19.9L11.4,17.9C13.1,18.1 14.9,17.5 16.2,16.2C18.5,13.9 18.5,10.1 16.2,7.7C15.1,6.6 13.5,6 12,6V10.6L7,5.6L12,0.6V4M6.3,17.6C3.7,15 3.3,11 5.1,7.9L6.6,9.4C5.5,11.6 5.9,14.4 7.8,16.2C8.3,16.7 8.9,17.1 9.6,17.4L9,19.4C8,19 7.1,18.4 6.3,17.6Z";const g={class:"flex gap-[60px] fill-white dark:fill-black"},k=["viewBox"],$=["d"],y=["viewBox"],V=["d"],b=["viewBox"],M=["d"],S=["viewBox"],H=["d"],t=24,N=L({__name:"SimulationPlaybackControls",props:{controls:{}},setup(d){const e=d,{isOver:p}=f(e.controls),_=()=>{e.controls.prevStep(),e.controls.paused.value=!0},h=()=>{e.controls.nextStep(),e.controls.paused.value=!0},u=()=>{e.controls.paused.value=!e.controls.paused.value},v=()=>{e.controls.stop(),e.controls.start()};return(Z,P)=>(o(),a("div",g,[i(r,{onClick:_,style:{"border-radius":"100px",transform:"scale(2)"}},{default:n(()=>[(o(),a("svg",{width:t,height:t,viewBox:`0 0 ${t} ${t}`},[l("path",{d:s(m)},null,8,$)],8,k))]),_:1}),s(p)?(o(),c(r,{key:0,style:{"border-radius":"100px",transform:"scale(2)"},onClick:v},{default:n(()=>[(o(),a("svg",{width:t,height:t,viewBox:`0 0 ${t} ${t}`},[l("path",{d:s(B)},null,8,V)],8,y))]),_:1})):(o(),c(r,{key:1,style:{"border-radius":"100px",transform:"scale(2)"},onClick:u},{default:n(()=>[(o(),a("svg",{width:t,height:t,viewBox:`0 0 ${t} ${t}`},[l("path",{d:e.controls.paused.value?s(w):s(C)},null,8,M)],8,b))]),_:1})),i(r,{style:{"border-radius":"100px",transform:"scale(2)"},onClick:h},{default:n(()=>[(o(),a("svg",{width:t,height:t,viewBox:`0 0 ${t} ${t}`},[l("path",{d:s(x)},null,8,H)],8,S))]),_:1})]))}});export{N as _};
