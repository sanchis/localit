!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).localit={})}(this,(function(e){"use strict";let t="";const o="_expiration_date";let n=localStorage;const r=e=>`${t}${e}`,s={config({domain:e,type:o="localStorage"}){n="localStorage"===o?localStorage:sessionStorage,t=e?`${e}_`:""},set(e,t,s){if(!e)return console.error("Localit: provide a key to store a value");"object"==typeof t&&(t=JSON.stringify(t)),n.setItem(r(e),t),s&&((e,t)=>{if(!["h","d","m","s"].some((e=>t.includes(e))))return console.warn("Localit: provide a valid expiration time format (e.g. '20h', '160s', '15d'). Your expiration date hasn't been saved.");const s=new Date;let a=0;t.includes("s")&&(a=+t.replace("s",""),s.setSeconds(s.getSeconds()+a)),t.includes("m")&&(a=+t.replace("m",""),s.setMinutes(s.getMinutes()+a)),t.includes("h")&&(a=+t.replace("h",""),s.setHours(s.getHours()+a)),t.includes("d")&&(a=+t.replace("d",""),s.setDate(s.getDate()+a)),n.setItem(`${r(e)}${o}`,JSON.stringify(s))})(e,s)},get(e){if((e=>null!==n.getItem(`${r(e)}${o}`))(e)&&(e=>{const t=JSON.parse(n.getItem(`${r(e)}${o}`)||"null");return new Date>new Date(t)})(e))return this.remove(e),null;try{return JSON.parse(n.getItem(r(e)))}catch(t){return n.getItem(r(e))}},remove(e){n.removeItem(r(e)),n.removeItem(`${r(e)}${o}`)},setDomain(e){t=`${e}_`},clearDomain(e=t){for(let t of Object.keys(n))t.includes(`${e}_`)&&n.removeItem(t)},bust(){n.clear()}};e.localit=s,Object.defineProperty(e,"__esModule",{value:!0})}));
