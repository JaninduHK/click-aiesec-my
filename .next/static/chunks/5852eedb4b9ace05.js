(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,5766,e=>{"use strict";let t,r;var a,s=e.i(71645);let o={data:""},i=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,n=/\/\*[^]*?\*\/|  +/g,l=/\n+/g,d=(e,t)=>{let r="",a="",s="";for(let o in e){let i=e[o];"@"==o[0]?"i"==o[1]?r=o+" "+i+";":a+="f"==o[1]?d(i,o):o+"{"+d(i,"k"==o[1]?"":t)+"}":"object"==typeof i?a+=d(i,t?t.replace(/([^,])+/g,e=>o.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):o):null!=i&&(o=/^--/.test(o)?o:o.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=d.p?d.p(o,i):o+":"+i+";")}return r+(t&&s?t+"{"+s+"}":s)+a},c={},u=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+u(e[r]);return t}return e};function m(e){let t,r,a,s=this||{},m=e.call?e(s.p):e;return((e,t,r,a,s)=>{var o;let m=u(e),p=c[m]||(c[m]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(m));if(!c[p]){let t=m!==e?e:(e=>{let t,r,a=[{}];for(;t=i.exec(e.replace(n,""));)t[4]?a.shift():t[3]?(r=t[3].replace(l," ").trim(),a.unshift(a[0][r]=a[0][r]||{})):a[0][t[1]]=t[2].replace(l," ").trim();return a[0]})(e);c[p]=d(s?{["@keyframes "+p]:t}:t,r?"":"."+p)}let h=r&&c.g?c.g:null;return r&&(c.g=c[p]),o=c[p],h?t.data=t.data.replace(h,o):-1===t.data.indexOf(o)&&(t.data=a?o+t.data:t.data+o),p})(m.unshift?m.raw?(t=[].slice.call(arguments,1),r=s.p,m.reduce((e,a,s)=>{let o=t[s];if(o&&o.call){let e=o(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;o=t?"."+t:e&&"object"==typeof e?e.props?"":d(e,""):!1===e?"":e}return e+a+(null==o?"":o)},"")):m.reduce((e,t)=>Object.assign(e,t&&t.call?t(s.p):t),{}):m,(a=s.target,"object"==typeof window?((a?a.querySelector("#_goober"):window._goober)||Object.assign((a||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:a||o),s.g,s.o,s.k)}m.bind({g:1});let p,h,f,g=m.bind({k:1});function b(e,t){let r=this||{};return function(){let a=arguments;function s(o,i){let n=Object.assign({},o),l=n.className||s.className;r.p=Object.assign({theme:h&&h()},n),r.o=/ *go\d+/.test(l),n.className=m.apply(r,a)+(l?" "+l:""),t&&(n.ref=i);let d=e;return e[0]&&(d=n.as||e,delete n.as),f&&d[0]&&f(n),p(d,n)}return t?t(s):s}}var y=(e,t)=>"function"==typeof e?e(t):e,x=(t=0,()=>(++t).toString()),v=()=>{if(void 0===r&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r},w=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,20)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return w(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:a}=t;return{...e,toasts:e.toasts.map(e=>e.id===a||void 0===a?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let s=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+s}))}}},k=[],j={toasts:[],pausedAt:void 0},E=e=>{j=w(j,e),k.forEach(e=>{e(j)})},C={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},L=e=>(t,r)=>{let a=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||x()}))(t,e,r);return E({type:2,toast:a}),a.id},N=(e,t)=>L("blank")(e,t);N.error=L("error"),N.success=L("success"),N.loading=L("loading"),N.custom=L("custom"),N.dismiss=e=>{E({type:3,toastId:e})},N.remove=e=>E({type:4,toastId:e}),N.promise=(e,t,r)=>{let a=N.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let s=t.success?y(t.success,e):void 0;return s?N.success(s,{id:a,...r,...null==r?void 0:r.success}):N.dismiss(a),e}).catch(e=>{let s=t.error?y(t.error,e):void 0;s?N.error(s,{id:a,...r,...null==r?void 0:r.error}):N.dismiss(a)}),e};var T=(e,t)=>{E({type:1,toast:{id:e,height:t}})},S=()=>{E({type:5,time:Date.now()})},$=new Map,O=1e3,M=g`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,A=g`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,P=g`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,D=b("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${M} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${A} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${P} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,H=g`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,z=b("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${H} 1s linear infinite;
`,I=g`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,V=g`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,Z=b("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${I} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${V} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,B=b("div")`
  position: absolute;
`,F=b("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,_=g`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,K=b("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${_} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,W=({toast:e})=>{let{icon:t,type:r,iconTheme:a}=e;return void 0!==t?"string"==typeof t?s.createElement(K,null,t):t:"blank"===r?null:s.createElement(F,null,s.createElement(z,{...a}),"loading"!==r&&s.createElement(B,null,"error"===r?s.createElement(D,{...a}):s.createElement(Z,{...a})))},R=b("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,U=b("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Y=s.memo(({toast:e,position:t,style:r,children:a})=>{let o=e.height?((e,t)=>{let r=e.includes("top")?1:-1,[a,s]=v()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*r}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*r}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${g(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${g(s)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},i=s.createElement(W,{toast:e}),n=s.createElement(U,{...e.ariaProps},y(e.message,e));return s.createElement(R,{className:e.className,style:{...o,...r,...e.style}},"function"==typeof a?a({icon:i,message:n}):s.createElement(s.Fragment,null,i,n))});a=s.createElement,d.p=void 0,p=a,h=void 0,f=void 0;var q=({id:e,className:t,style:r,onHeightUpdate:a,children:o})=>{let i=s.useCallback(t=>{if(t){let r=()=>{a(e,t.getBoundingClientRect().height)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,a]);return s.createElement("div",{ref:i,className:t,style:r},o)},J=m`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,G=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:a,children:o,containerStyle:i,containerClassName:n})=>{let{toasts:l,handlers:d}=(e=>{let{toasts:t,pausedAt:r}=((e={})=>{let[t,r]=(0,s.useState)(j),a=(0,s.useRef)(j);(0,s.useEffect)(()=>(a.current!==j&&r(j),k.push(r),()=>{let e=k.indexOf(r);e>-1&&k.splice(e,1)}),[]);let o=t.toasts.map(t=>{var r,a,s;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(a=e[t.type])?void 0:a.duration)||(null==e?void 0:e.duration)||C[t.type],style:{...e.style,...null==(s=e[t.type])?void 0:s.style,...t.style}}});return{...t,toasts:o}})(e);(0,s.useEffect)(()=>{if(r)return;let e=Date.now(),a=t.map(t=>{if(t.duration===1/0)return;let r=(t.duration||0)+t.pauseDuration-(e-t.createdAt);if(r<0){t.visible&&N.dismiss(t.id);return}return setTimeout(()=>N.dismiss(t.id),r)});return()=>{a.forEach(e=>e&&clearTimeout(e))}},[t,r]);let a=(0,s.useCallback)(()=>{r&&E({type:6,time:Date.now()})},[r]),o=(0,s.useCallback)((e,r)=>{let{reverseOrder:a=!1,gutter:s=8,defaultPosition:o}=r||{},i=t.filter(t=>(t.position||o)===(e.position||o)&&t.height),n=i.findIndex(t=>t.id===e.id),l=i.filter((e,t)=>t<n&&e.visible).length;return i.filter(e=>e.visible).slice(...a?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+s,0)},[t]);return(0,s.useEffect)(()=>{t.forEach(e=>{if(e.dismissed)((e,t=O)=>{if($.has(e))return;let r=setTimeout(()=>{$.delete(e),E({type:4,toastId:e})},t);$.set(e,r)})(e.id,e.removeDelay);else{let t=$.get(e.id);t&&(clearTimeout(t),$.delete(e.id))}})},[t]),{toasts:t,handlers:{updateHeight:T,startPause:S,endPause:a,calculateOffset:o}}})(r);return s.createElement("div",{id:"_rht_toaster",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...i},className:n,onMouseEnter:d.startPause,onMouseLeave:d.endPause},l.map(r=>{let i,n,l=r.position||t,c=d.calculateOffset(r,{reverseOrder:e,gutter:a,defaultPosition:t}),u=(i=l.includes("top"),n=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:v()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${c*(i?1:-1)}px)`,...i?{top:0}:{bottom:0},...n});return s.createElement(q,{id:r.id,key:r.id,onHeightUpdate:d.updateHeight,className:r.visible?J:"",style:u},"custom"===r.type?y(r.message,r):o?o(r):s.createElement(Y,{toast:r,position:l}))}))};e.s(["Toaster",()=>G,"default",()=>N],5766)},63178,e=>{"use strict";var t=e.i(71645),r=(e,t,r,a,s,o,i,n)=>{let l=document.documentElement,d=["light","dark"];function c(t){var r;(Array.isArray(e)?e:[e]).forEach(e=>{let r="class"===e,a=r&&o?s.map(e=>o[e]||e):s;r?(l.classList.remove(...a),l.classList.add(o&&o[t]?o[t]:t)):l.setAttribute(e,t)}),r=t,n&&d.includes(r)&&(l.style.colorScheme=r)}if(a)c(a);else try{let e=localStorage.getItem(t)||r,a=i&&"system"===e?window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":e;c(a)}catch(e){}},a=["light","dark"],s="(prefers-color-scheme: dark)",o="undefined"==typeof window,i=t.createContext(void 0),n={setTheme:e=>{},themes:[]},l=()=>{var e;return null!=(e=t.useContext(i))?e:n},d=e=>t.useContext(i)?t.createElement(t.Fragment,null,e.children):t.createElement(u,{...e}),c=["light","dark"],u=({forcedTheme:e,disableTransitionOnChange:r=!1,enableSystem:o=!0,enableColorScheme:n=!0,storageKey:l="theme",themes:d=c,defaultTheme:u=o?"system":"light",attribute:g="data-theme",value:b,children:y,nonce:x,scriptProps:v})=>{let[w,k]=t.useState(()=>p(l,u)),[j,E]=t.useState(()=>"system"===w?f():w),C=b?Object.values(b):d,L=t.useCallback(e=>{let t=e;if(!t)return;"system"===e&&o&&(t=f());let s=b?b[t]:t,i=r?h(x):null,l=document.documentElement,d=e=>{"class"===e?(l.classList.remove(...C),s&&l.classList.add(s)):e.startsWith("data-")&&(s?l.setAttribute(e,s):l.removeAttribute(e))};if(Array.isArray(g)?g.forEach(d):d(g),n){let e=a.includes(u)?u:null,r=a.includes(t)?t:e;l.style.colorScheme=r}null==i||i()},[x]),N=t.useCallback(e=>{let t="function"==typeof e?e(w):e;k(t);try{localStorage.setItem(l,t)}catch(e){}},[w]),T=t.useCallback(t=>{E(f(t)),"system"===w&&o&&!e&&L("system")},[w,e]);t.useEffect(()=>{let e=window.matchMedia(s);return e.addListener(T),T(e),()=>e.removeListener(T)},[T]),t.useEffect(()=>{let e=e=>{e.key===l&&(e.newValue?k(e.newValue):N(u))};return window.addEventListener("storage",e),()=>window.removeEventListener("storage",e)},[N]),t.useEffect(()=>{L(null!=e?e:w)},[e,w]);let S=t.useMemo(()=>({theme:w,setTheme:N,forcedTheme:e,resolvedTheme:"system"===w?j:w,themes:o?[...d,"system"]:d,systemTheme:o?j:void 0}),[w,N,e,j,o,d]);return t.createElement(i.Provider,{value:S},t.createElement(m,{forcedTheme:e,storageKey:l,attribute:g,enableSystem:o,enableColorScheme:n,defaultTheme:u,value:b,themes:d,nonce:x,scriptProps:v}),y)},m=t.memo(({forcedTheme:e,storageKey:a,attribute:s,enableSystem:o,enableColorScheme:i,defaultTheme:n,value:l,themes:d,nonce:c,scriptProps:u})=>{let m=JSON.stringify([s,a,n,e,d,l,o,i]).slice(1,-1);return t.createElement("script",{...u,suppressHydrationWarning:!0,nonce:"undefined"==typeof window?c:"",dangerouslySetInnerHTML:{__html:`(${r.toString()})(${m})`}})}),p=(e,t)=>{let r;if(!o){try{r=localStorage.getItem(e)||void 0}catch(e){}return r||t}},h=e=>{let t=document.createElement("style");return e&&t.setAttribute("nonce",e),t.appendChild(document.createTextNode("*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}")),document.head.appendChild(t),()=>{window.getComputedStyle(document.body),setTimeout(()=>{document.head.removeChild(t)},1)}},f=e=>(e||(e=window.matchMedia(s)),e.matches?"dark":"light");e.s(["ThemeProvider",()=>d,"useTheme",()=>l])},34816,e=>{"use strict";var t=e.i(43476),r=e.i(17255),a=e.i(63178),s=e.i(57688),o=e.i(22016),i=e.i(18566),n=e.i(71645);e.s(["default",0,()=>{let{data:e}=(0,r.useSession)(),l=(0,i.usePathname)(),[d,c]=(0,n.useState)(!1),u=()=>{window.scrollY>=80?c(!0):c(!1)};(0,n.useEffect)(()=>(window.addEventListener("scroll",u),()=>window.removeEventListener("scroll",u)),[]);let{theme:m,setTheme:p}=(0,a.useTheme)();return(0,t.jsx)(t.Fragment,{children:(0,t.jsx)("header",{className:`ud-header left-0 top-0 z-40 flex w-full items-center ${d?"shadow-nav fixed z-[999] border-b border-stroke bg-white/80 backdrop-blur-[5px] dark:border-dark-3/20 dark:bg-dark/10":"absolute bg-transparent"}`,children:(0,t.jsx)("div",{className:"container",children:(0,t.jsxs)("div",{className:"relative -mx-4 flex items-center justify-between",children:[(0,t.jsx)("div",{className:"w-60 max-w-full px-4",children:(0,t.jsx)(o.default,{href:"/",className:`navbar-logo block w-full ${d?"py-4":"py-5"} `,children:"/"!==l?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.default,{src:"/images/logo/Blue-Logo.png",alt:"logo",width:400,height:120,className:"header-logo w-full dark:hidden"}),(0,t.jsx)(s.default,{src:"/images/logo/White-Blue-Logo.png",alt:"logo",width:400,height:120,className:"header-logo hidden w-full dark:block"})]}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.default,{src:d?"/images/logo/Blue-Logo.png":"/images/logo/White-Blue-Logo.png",alt:"logo",width:320,height:95,className:"header-logo w-full dark:hidden"}),(0,t.jsx)(s.default,{src:"/images/logo/White-Blue-Logo.png",alt:"logo",width:320,height:95,className:"header-logo hidden w-full dark:block"})]})})}),(0,t.jsx)("div",{className:"flex w-full items-center justify-end px-4",children:(0,t.jsxs)("div",{className:"flex items-center gap-4",children:["/"!==l&&(0,t.jsx)("button",{"aria-label":"theme toggler",onClick:()=>p("dark"===m?"light":"dark"),className:"flex h-9 w-9 items-center justify-center rounded-full text-body-color duration-300 dark:text-white cursor-pointer border border-stroke/60 dark:border-dark-3",children:(0,t.jsxs)("span",{children:[(0,t.jsx)("svg",{viewBox:"0 0 16 16",className:"hidden h-[20px] w-[20px] fill-current dark:block",children:(0,t.jsx)("path",{d:"M4.50663 3.2267L3.30663 2.03337L2.36663 2.97337L3.55996 4.1667L4.50663 3.2267ZM2.66663 7.00003H0.666626V8.33337H2.66663V7.00003ZM8.66663 0.366699H7.33329V2.33337H8.66663V0.366699V0.366699ZM13.6333 2.97337L12.6933 2.03337L11.5 3.2267L12.44 4.1667L13.6333 2.97337ZM11.4933 12.1067L12.6866 13.3067L13.6266 12.3667L12.4266 11.1734L11.4933 12.1067ZM13.3333 7.00003V8.33337H15.3333V7.00003H13.3333ZM7.99996 3.6667C5.79329 3.6667 3.99996 5.46003 3.99996 7.6667C3.99996 9.87337 5.79329 11.6667 7.99996 11.6667C10.2066 11.6667 12 9.87337 12 7.6667C12 5.46003 10.2066 3.6667 7.99996 3.6667ZM7.33329 14.9667H8.66663V13H7.33329V14.9667ZM2.36663 12.36L3.30663 13.3L4.49996 12.1L3.55996 11.16L2.36663 12.36Z"})}),(0,t.jsx)("svg",{viewBox:"0 0 23 23",className:`h-[24px] w-[24px] fill-current text-dark dark:hidden ${!d&&"/"===l&&"text-white"}`,children:(0,t.jsx)("g",{clipPath:"url(#clip0_40_125)",children:(0,t.jsx)("path",{d:"M16.6111 15.855C17.591 15.1394 18.3151 14.1979 18.7723 13.1623C16.4824 13.4065 14.1342 12.4631 12.6795 10.4711C11.2248 8.47905 11.0409 5.95516 11.9705 3.84818C10.8449 3.9685 9.72768 4.37162 8.74781 5.08719C5.7759 7.25747 5.12529 11.4308 7.29558 14.4028C9.46586 17.3747 13.6392 18.0253 16.6111 15.855Z"})})})]})}),e?.user?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(o.default,{href:"/dashboard",className:`${"/"!==l||d?"rounded-lg border border-stroke px-5 py-3 text-base font-medium text-dark duration-300 hover:border-primary hover:text-primary dark:text-white dark:hover:text-primary":"rounded-lg border border-white/40 px-5 py-3 text-base font-medium text-white duration-300 hover:border-white"}`,children:"Dashboard"}),"/"!==l||d?(0,t.jsx)("button",{onClick:()=>(0,r.signOut)(),className:"rounded-lg bg-primary px-6 py-3 text-base font-medium text-white duration-300 ease-in-out hover:bg-primary/90",children:"Sign Out"}):(0,t.jsx)("button",{onClick:()=>(0,r.signOut)(),className:"rounded-lg bg-white/20 px-6 py-3 text-base font-medium text-white duration-300 ease-in-out hover:bg-white/30",children:"Sign Out"})]}):(0,t.jsx)(o.default,{href:"/signin",className:`${"/"!==l||d?"rounded-lg bg-primary px-6 py-3 text-base font-medium text-white duration-300 ease-in-out hover:bg-primary/90":"rounded-lg bg-white/20 px-6 py-3 text-base font-medium text-white duration-300 ease-in-out hover:bg-white/30"}`,children:"Sign In"})]})})]})})})})}])},41885,e=>{"use strict";var t=e.i(43476),r=e.i(71645);function a(){let[e,a]=(0,r.useState)(!1);return(0,r.useEffect)(()=>{let e=()=>{window.pageYOffset>300?a(!0):a(!1)};return window.addEventListener("scroll",e),()=>window.removeEventListener("scroll",e)},[]),(0,t.jsx)("div",{className:"fixed bottom-8 right-8 z-[999]",children:e&&(0,t.jsx)("div",{onClick:()=>{window.scrollTo({top:0,behavior:"smooth"})},"aria-label":"scroll to top",className:"back-to-top flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-primary text-white shadow-md transition duration-300 ease-in-out hover:bg-dark",children:(0,t.jsx)("span",{className:"mt-[6px] h-3 w-3 rotate-45 border-l border-t border-white"})})})}e.s(["default",()=>a])},44636,e=>{"use strict";var t=e.i(43476),r=e.i(17255),a=e.i(63178),s=e.i(5766);function o({children:e}){return(0,t.jsx)(r.SessionProvider,{children:(0,t.jsxs)(a.ThemeProvider,{attribute:"class",enableSystem:!1,defaultTheme:"light",children:[(0,t.jsx)(s.Toaster,{}),e]})})}e.s(["default",()=>o])}]);