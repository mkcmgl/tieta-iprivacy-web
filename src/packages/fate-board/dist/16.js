"use strict";(self.webpackChunkfate_board=self.webpackChunkfate_board||[]).push([[16],{44016:(e,a,t)=>{t.r(a),t.d(a,{default:()=>Be});var l=t(32288),s=t(12416),n=t(9596),o=t(73709),u=t(17997),i=t(45723);function c(e,a){return i.s.confirm("The job will continue from where it end, it may take few seconds to  update job status.","Retry",{confirmButtonText:"Sure",cancelButtonText:"Cancel",type:"warning"}).then((()=>u.A.dispatch("retryJob",e))).catch((()=>{}))}const r=e=>((0,l.Qi)("data-v-1ee1ae95"),e=e(),(0,l.jt)(),e),d={class:"f-graphic"},p=r((()=>(0,l.Lk)("article",{class:"f-graphic-title"},"Outputs From Job",-1))),f=r((()=>(0,l.Lk)("article",{class:"f-graphic-subtitle"},[(0,l.eW)(" Main Graph "),(0,l.Lk)("span",null,"Click component to view details")],-1))),m={class:"f-graphic-dag"},v=(0,l.pM)({__name:"Graphic",emits:["retry","choose"],setup(e,{emit:a}){const t=a,n=(0,o.Pj)(),u=(0,l.EW)((()=>n.state.job.dag)),i=(0,s.KR)(!0),r=()=>{i.value=!1},v=e=>{t("choose",e)},b=async e=>{const a=await c();t("retry",a)};return(e,a)=>{const t=(0,l.g2)("FDag"),s=(0,l.gN)("loading");return(0,l.uX)(),(0,l.CE)("section",d,[p,f,(0,l.Lk)("section",m,[(0,l.bo)((0,l.bF)(t,{data:u.value,onLoaded:r,onChoose:v,onRetry:b},null,8,["data"]),[[s,i.value]])])])}}});var b=t(47433);const g=(0,b.A)(v,[["__scopeId","data-v-1ee1ae95"]]);var h=t(16231),k=t(51784);const y={class:"f-info-data-container"},_={class:"f-info-data-header"},w={class:"f-info-data-title"},E=(e=>((0,l.Qi)("data-v-2231690e"),e=e(),(0,l.jt)(),e))((()=>(0,l.Lk)("span",null,"(only 100 instance are shown in the table)",-1))),C=(0,l.pM)({__name:"DataOutput",setup(e,{expose:a}){const t=(0,o.Pj)(),n=(0,s.KR)([]),u=(0,s.KR)(n.value[0]?n.value[0].value:""),i=(0,s.KR)([]),c=(0,s.KR)([]),r=(0,s.KR)([]),d=(0,s.KR)(0),p=async()=>{try{const e=await t.dispatch("dataOutput"),{output_data:a}=e,l=[],s=[],o=[],u=[];if(a)for(let e=0;e<a.length;e++){const t=a[e],{data:n,metadata:i}=t,{anonymous_summary:c,fields:r}=i.schema_meta;l.push({label:c.site_name,value:e}),s.push((()=>{const e=[];for(const a of r)e.push({label:a.name,prop:a.name});return e})()),o.push((()=>{const e=s[s.length-1],a=[];for(const t of n){const l={};for(let a=0;a<e.length;a++)l[e[a].prop]=t[a];a.push(l)}return a})()),u.push(t.total)}n.value=l,i.value=s,c.value=o,r.value=u}catch(e){i.value=[],c.value=[],r.value=[]}d.value++};return(0,l.wB)((()=>n.value),(()=>{u.value=n.value[0]?n.value[0].value:""}),{deep:!0}),(0,l.wB)((()=>t.state.comp.information),(()=>{p()}),{deep:!0}),(0,l.sV)((async()=>{await p()})),a({refresh:()=>{p()}}),(e,a)=>{const t=(0,l.g2)("FSelection"),s=(0,l.g2)("FTable");return(0,l.uX)(),(0,l.CE)("section",y,[(0,l.Lk)("section",_,[(0,l.Lk)("article",w,[(0,l.eW)(" Outputting "+(0,k.toDisplayString)(r.value[u.value&&Number(u.value)||0])+" instance ",1),E]),n.value.length>1?((0,l.uX)(),(0,l.Wv)(t,{key:0,modelValue:u.value,"onUpdate:modelValue":a[0]||(a[0]=e=>u.value=e),options:n.value,class:"f-info-data-selection"},null,8,["modelValue","options"])):(0,l.Q3)("v-if",!0)]),((0,l.uX)(),(0,l.CE)("section",{class:"f-info-data-body",key:d.value},[(0,l.bF)(s,{header:i.value[u.value&&Number(u.value)||0]||[],data:c.value[u.value&&Number(u.value)||0]||[],column:!0,index:!0,class:"f-info-data-table"},null,8,["header","data"])]))])}}}),L=(0,b.A)(C,[["__scopeId","data-v-2231690e"]]);var R=t(96977),F=t(66500);const K={class:"f-info-log-container"},j={key:0,class:"f-info-log-hint"},I={key:1,class:"f-info-log-hint"},W=(0,l.pM)({__name:"LogOutput",setup(e,{expose:a}){const t=(0,o.Pj)();let n=null;const u=(0,s.KR)(null),i=(0,s.KR)(0),c=(0,s.KR)("");let r;async function d(){const e=await t.dispatch("GET_JOBID"),a=await t.dispatch("GET_PARTYID"),l=await t.dispatch("GET_JOB_ROLE"),s=await t.dispatch("getComponentName");e&&l&&a&&s||console.warn("Missing required parameters"),r=new F.WSConnect(`/log/new/${e}/${l}/${a}/${s}`),r.addEventListener("message",(e=>{!function(e){switch(parseInt(e.componentInfo)===e.componentInfo?"logSize":"componentInfo"){case"logSize":!function(e){const a=Object.entries(e)[0];c.value=a[0],i.value=a[1]}(e);break;case"componentInfo":!function(e){const{data:a}=e,t=u.value||[];let l=[];if(t.length){l=l.concat(t,a),l.sort(((e,a)=>e.lineNum-a.lineNum));let e,s=l.length;for(;--s>-1;)e===l[s].lineNum?l.splice(s,1):e=l[s].lineNum}else l=a;l=l.map((e=>Object.freeze(e))),u.value=l}(e)}}(JSON.parse(e.data))})),r.addEventListener("open",(()=>{!function(){const e=()=>{r&&r.send(JSON.stringify({type:"logSize"}));const e=t.state.comp.information.status;e&&!e.match(/wait|running/i)&&n&&(clearInterval(n),n=null,u.value||(u.value=[]))};e(),n=setInterval(e,1e4)}()}))}function p(){f()}function f(e=!0){const a=i.value,t=u.value||[];let l,s;if(t.length?e?(s=t[0].lineNum-1,l=Math.max(1,s-50)):(l=t[t.length-1].lineNum+1,s=a):(s=a,l=Math.max(s-50,1)),a>0){if(s<l)return;r&&r.send(JSON.stringify({type:c.value,begin:l,end:s}))}else u.value=[]}function m(){n&&clearInterval(n),n=null,u.value=null,i.value=0,c.value=""}function v(){r&&r.close(),r=null}return(0,l.wB)((()=>i.value),(e=>{e&&f(!1)})),(0,l.wB)((()=>t.state.comp.information),(()=>{m(),v(),d()}),{deep:!0}),(0,l.KC)((async()=>{await d()})),(0,l.xo)((()=>{m(),v()})),a({refresh:(m(),v(),void d())}),(e,a)=>((0,l.uX)(),(0,l.CE)("section",K,[u.value?u.value.length?((0,l.uX)(),(0,l.Wv)(R.A,{key:2,logs:u.value,onScrollTop:p,class:"f-info-log-logger"},null,8,["logs"])):((0,l.uX)(),(0,l.CE)("section",I,"No Data")):((0,l.uX)(),(0,l.CE)("section",j,"Loading..."))]))}}),D=(0,b.A)(W,[["__scopeId","data-v-5b4dd8b3"]]),S=(0,l.pM)({__name:"ModelOutput",setup(e,{expose:a}){const t=(0,s.KR)(void 0),n=(0,s.KR)(0),u=(0,o.Pj)(),i=(0,l.EW)((()=>u.state.comp.information.name));let c=!1;const r=()=>{t.value=void 0,i.value&&(t.value=(0,l.$V)((async()=>{const e=u.state.comp.hasLoaded[i.value];return e&&e.instance?e.instance.toVue():(c=!0,{})})),n.value++)};return(0,l.wB)((()=>u.state.comp.hasLoaded),(()=>{u.state.comp.hasLoaded[i.value]&&c&&(r(),c=!1)}),{deep:!0}),(0,l.wB)((()=>i.value),(()=>{r()}),{deep:!0}),(0,l.KC)((()=>{r()})),a({refresh:async()=>{await u.dispatch("modelRefresh")}}),(e,a)=>((0,l.uX)(),(0,l.Wv)((0,l.$y)(t.value),{key:n.value,class:"f-detail-item-content"}))}}),X=S,x={class:"f-detail-container"},V={class:"f-detail-operation"},A=(0,l.pM)({__name:"outputs",emits:["refresh"],setup(e,{expose:a,emit:t}){const n=t,u=(0,s.KR)(!1),i=(0,s.KR)(!0),c=(0,s.KR)("model"),r=(0,o.Pj)(),d=(0,s.KR)(!0),p=(0,l.EW)((()=>r.state.comp.information.name)),f=(0,l.EW)((()=>r.state.comp.information.type)),m=(0,l.EW)((()=>{let e="summary";return f.value.match(new RegExp(`(${["evaluation","scorecard"].join("|")})`,"i"))?e="metrics":f.value.match(new RegExp(`(${["boost","linr","lr","poisson","nn","fm","mf","svd","svd","gmf","kmeans"].join("|")})`,"i"))&&(e="model"),e})),v=(0,s.KR)(),b=(0,s.KR)(),g=(0,s.KR)(),k=async()=>{d.value=!0,v.value&&await v.value.refresh(),b.value&&await b.value.refresh(),g.value&&await g.value.refresh(),n("refresh")};return a({on:()=>{u.value=!0},off:()=>{u.value=!1},refreshed:()=>{d.value=!1}}),(e,a)=>{const t=(0,l.g2)("el-link"),n=(0,l.g2)("el-tab-pane"),o=(0,l.g2)("el-tabs"),r=(0,l.g2)("el-dialog"),f=(0,l.gN)("loading");return(0,l.uX)(),(0,l.Wv)(r,{modelValue:u.value,"onUpdate:modelValue":a[1]||(a[1]=e=>u.value=e),width:i.value?"100%":"80%",title:p.value,top:"48px","append-to-body":"","lock-scroll":"",modal:!1,class:"f-output-dialog"},{default:(0,l.k6)((()=>[(0,l.bo)(((0,l.uX)(),(0,l.CE)("section",x,[(0,l.Lk)("section",V,[(0,l.bF)(t,{icon:(0,s.R1)(h.Refresh),type:"primary",class:"f-d-refresh",onClick:k},{default:(0,l.k6)((()=>[(0,l.eW)("Refresh")])),_:1},8,["icon"])]),(0,l.bF)(o,{modelValue:c.value,"onUpdate:modelValue":a[0]||(a[0]=e=>c.value=e),class:"f-detail-tabs"},{default:(0,l.k6)((()=>[(0,l.bF)(n,{label:m.value,name:"model",class:"f-detail-item"},{default:(0,l.k6)((()=>[(0,l.bF)(X,{ref_key:"model",ref:v,class:"f-detail-item-content"},null,512)])),_:1},8,["label"]),(0,l.bF)(n,{label:"data",name:"data",lazy:!0,class:"f-detail-item"},{default:(0,l.k6)((()=>[(0,l.bF)(L,{ref_key:"data",ref:b,class:"f-detail-item-content"},null,512)])),_:1}),(0,l.bF)(n,{label:"log",name:"log",lazy:!0,class:"f-detail-item"},{default:(0,l.k6)((()=>[(0,l.bF)(D,{ref_key:"log",ref:g,class:"f-detail-item-content"},null,512)])),_:1})])),_:1},8,["modelValue"])])),[[f,d.value]])])),_:1},8,["modelValue","width","title"])}}}),B=A;var N=t(45250),O=t(72746);const T=e=>((0,l.Qi)("data-v-5148a32b"),e=e(),(0,l.jt)(),e),M={class:"f-dataset"},P=T((()=>(0,l.Lk)("span",{class:"f-dataset-title"},[(0,l.eW)("dataset "),(0,l.Lk)("span",{class:"f-dataset-seperator"},":")],-1))),$={class:"f-dataset-content f-dataset-hidden"},J={class:"f-dataset-title"},z=T((()=>(0,l.Lk)("span",{class:"f-dataset-seperator"},":",-1))),U={class:"f-dataset-popover"},Q={class:"f-dataset-content f-dataset-pop-content"},G=T((()=>(0,l.Lk)("section",{class:"f-d-c-row f-d-c-title"},[(0,l.Lk)("article",null,"Party ID"),(0,l.Lk)("article",null,"Dataset")],-1))),Y={class:"f-d-c-col"},q=(0,l.pM)({__name:"Dataset",props:["dataset"],setup(e){const a=e,t=(0,s.KR)(0),n=(0,o.Pj)(),u=(e,a)=>{if(e?.[a]){const t=Object.keys(e[a]);if(t.length>0){const l=e[a][t[0]];if(l&&l.length>0)return e[a]}}},i=(0,l.EW)((()=>u(a.dataset,"guest"))),c=(0,l.EW)((()=>u(a.dataset,"host"))),r=(0,l.EW)((()=>u(a.dataset,"arbiter"))),d=(0,l.EW)((()=>n.state.job.details?.fRole)),p=(0,l.EW)((()=>n.state.job.details?.fPartyId)),f=(0,l.EW)((()=>{if(d.value){if(d.value.match(/guest/i))return i.value?.[p.value];if(d.value.match(/host/i))return c.value?.[p.value];if(d.value.match(/arbiter/i))return r.value?.[p.value]}})),m=(0,l.EW)((()=>{if(d.value){const e={};return!d.value.match(/guest/i)&&i.value&&(e.guest=i.value),!d.value.match(/host/i)&&c.value&&(e.host=c.value),!d.value.match(/arbiter/i)&&r.value&&(e.arbiter=r.value),e}}));return(0,l.wB)((()=>a.dataset),(()=>{t.value++})),(0,l.wB)((()=>d.value),(()=>{t.value++})),(0,l.wB)((()=>p.value),(()=>{t.value++})),(e,a)=>{const s=(0,l.g2)("FRow"),n=(0,l.g2)("el-link"),o=(0,l.g2)("el-popover");return(0,l.uX)(),(0,l.CE)("section",{key:t.value,class:"f-dataset-container"},[(0,l.bo)((0,l.Lk)("article",M,[P,(0,l.Lk)("section",$,[((0,l.uX)(!0),(0,l.CE)(l.FK,null,(0,l.pI)(f.value,((e,a)=>((0,l.uX)(),(0,l.Wv)(s,{key:a,content:`${e.namespace}.${e.name}`,contentClassName:"f-dataset-item"},null,8,["content"])))),128))])],512),[[O.vShow,f.value]]),(0,l.bo)((0,l.Lk)("article",null,[((0,l.uX)(!0),(0,l.CE)(l.FK,null,(0,l.pI)(m.value,((e,a)=>((0,l.uX)(),(0,l.CE)("article",{key:a,class:"f-dataset"},[(0,l.Lk)("span",J,[(0,l.eW)((0,k.toDisplayString)(a)+" ",1),z]),(0,l.bF)(o,{placement:"right",trigger:"click",width:"350"},{reference:(0,l.k6)((()=>[(0,l.Lk)("section",U,[(0,l.Lk)("span",null,(0,k.toDisplayString)(Object.keys(e).length),1),(0,l.bF)(n,{type:"primary",class:"f-dataset-view"},{default:(0,l.k6)((()=>[(0,l.eW)("view")])),_:1})])])),default:(0,l.k6)((()=>[(0,l.Lk)("section",Q,[G,((0,l.uX)(!0),(0,l.CE)(l.FK,null,(0,l.pI)(e,((e,a)=>((0,l.uX)(),(0,l.CE)("section",{key:a,class:"f-d-c-row"},[(0,l.Lk)("article",null,(0,k.toDisplayString)(a),1),(0,l.Lk)("article",Y,[((0,l.uX)(!0),(0,l.CE)(l.FK,null,(0,l.pI)(e,(e=>((0,l.uX)(),(0,l.CE)("span",null,(0,k.toDisplayString)(`${e.namespace}. ${e.name}`),1)))),256))])])))),128))])])),_:2},1024)])))),128))],512),[[O.vShow,m.value]])])}}}),H=(0,b.A)(q,[["__scopeId","data-v-5148a32b"]]);var Z=t(93935);const ee={class:"f-summary-download"},ae=(0,l.pM)({__name:"Download",setup(e){const a=(0,o.Pj)(),t=(0,l.EW)((()=>a.state.job.jobId)),s=(0,l.EW)((()=>a.state.job.role)),n=(0,l.EW)((()=>a.state.job.partyId));return(e,a)=>{const o=(0,l.g2)("Download",!0),u=(0,l.g2)("el-icon"),i=(0,l.g2)("FRow");return(0,l.uX)(),(0,l.CE)("article",ee,[(0,l.bF)(i,{content:"DAG Download",onClick:a[0]||(a[0]=e=>{s.value.match(/arbiter/i)||Z.A.jobDownload({jobId:t.value,role:s.value,partyId:n.value})}),class:(0,k.normalizeClass)(["f-summary-download-text",{"f-summary-download-disable":s.value.match(/arbiter/i)}]),contentClassName:"f-summary-link"},{prefix:(0,l.k6)((()=>[(0,l.bF)(u,{class:"f-history-download-icon"},{default:(0,l.k6)((()=>[(0,l.bF)(o)])),_:1})])),_:1},8,["class"])])}}}),te=(0,b.A)(ae,[["__scopeId","data-v-4059cc9b"]]),le={class:"f-summary-notes"},se={class:"f-summary-notes-title"},ne={class:"f-summary-notes-content"},oe={class:"fb-table-dialog"},ue={class:"fb-table-dialog--footer"},ie=(0,l.pM)({__name:"Edit",props:["content","title"],setup(e){const a=e,t=(0,s.KR)(a.content),n=(0,s.KR)(!1),u=(0,s.KR)(t.value),i=(0,o.Pj)(),c=()=>{n.value=!0},r=e=>{e&&d(),n.value=!1},d=async()=>{await Z.A.noteUpdate({job_id:i.state.job.jobId,role:i.state.job.role,party_id:i.state.job.partyId,notes:u.value})&&(t.value=u.value)};return(0,l.wB)((()=>a.content),(()=>{t.value=a.content,u.value=a.content}),{deep:!0}),(a,o)=>{const i=(0,l.g2)("Edit",!0),d=(0,l.g2)("el-icon"),p=(0,l.g2)("el-input"),f=(0,l.g2)("el-button"),m=(0,l.g2)("el-dialog");return(0,l.uX)(),(0,l.CE)("article",le,[(0,l.Lk)("article",se,[(0,l.Lk)("span",null,(0,k.toDisplayString)(e.title),1),(0,l.bF)(d,{onClick:c,class:"f-summary-notes-icon"},{default:(0,l.k6)((()=>[(0,l.bF)(i)])),_:1})]),(0,l.Lk)("article",ne,(0,k.toDisplayString)(t.value),1),(0,l.bF)(m,{modelValue:n.value,"onUpdate:modelValue":o[3]||(o[3]=e=>n.value=e),title:(0,s.R1)(N.capitalize)(e.title)+" Update",width:"40%","append-to-body":""},{footer:(0,l.k6)((()=>[(0,l.Lk)("span",ue,[(0,l.bF)(f,{onClick:o[1]||(o[1]=e=>r())},{default:(0,l.k6)((()=>[(0,l.eW)("Cancel")])),_:1}),(0,l.bF)(f,{type:"primary",onClick:o[2]||(o[2]=e=>r(!0))},{default:(0,l.k6)((()=>[(0,l.eW)("Confirm")])),_:1})])])),default:(0,l.k6)((()=>[(0,l.Lk)("section",oe,[(0,l.bF)(p,{modelValue:u.value,"onUpdate:modelValue":o[0]||(o[0]=e=>u.value=e),rows:3,type:"textarea"},null,8,["modelValue"])])])),_:1},8,["modelValue","title"])])}}}),ce=(0,b.A)(ie,[["__scopeId","data-v-622cef03"]]),re={class:"f-text-title"},de=(e=>((0,l.Qi)("data-v-16925a6c"),e=e(),(0,l.jt)(),e))((()=>(0,l.Lk)("span",{class:"f-text-seperator"},":",-1))),pe={class:"f-text-content"},fe=(0,l.pM)({__name:"Text",props:["title","content","col"],setup:e=>(a,t)=>((0,l.uX)(),(0,l.CE)("article",{class:(0,k.normalizeClass)({"f-text":!0,"f-text-col":e.col})},[(0,l.Lk)("span",re,[(0,l.eW)((0,k.toDisplayString)(e.title)+" ",1),de]),(0,l.Lk)("span",pe,(0,k.toDisplayString)(e.content),1)],2))}),me=(0,b.A)(fe,[["__scopeId","data-v-16925a6c"]]),ve={class:"f-summary-list"},be=(0,l.pM)({__name:"Summary",props:["data","dataset"],setup(e){const a=e,t=(0,s.Kh)({fJobId:{tag:me,title:"Job ID",col:!0},fStatus:{tag:me,title:"status",col:!0},fDescription:{tag:ce,title:"notes"},fRole:{tag:me,title:"role"},fPartyId:{tag:me,title:"party ID"},fDataset:{tag:H,dataset:a.dataset},fDownload:{tag:te},fCreateTime:{tag:me,title:"submission time",col:!0},fStartTime:{tag:me,title:"start time",col:!0},fEndTime:{tag:me,title:"end time",col:!0},fElapsed:{tag:me,title:"duration",col:!0}}),n=()=>{for(const e in a.data)if(t[e]){const l=a.data[e];(0,N.isObject)(l)?t[e]=Object.assign(t[e],l):e.match(/(time)/i)?t[e].content=(0,F.toDate)(l):e.match(/elapsed/i)?t[e].content=(0,F.toTime)(l):t[e].content=l}};return(0,l.KC)((()=>n())),(0,l.wB)((()=>a.data),n,{deep:!0}),(0,l.wB)((()=>a.dataset),(()=>{t.fDataset.dataset=a.dataset}),{deep:!0}),(e,a)=>((0,l.uX)(),(0,l.CE)("section",ve,[((0,l.uX)(!0),(0,l.CE)(l.FK,null,(0,l.pI)(t,((e,a)=>((0,l.uX)(),(0,l.Wv)((0,l.$y)(e.tag),(0,l.v6)({key:a,ref_for:!0},e,{class:"f-summary-item"}),null,16)))),128))]))}}),ge=(0,b.A)(be,[["__scopeId","data-v-1c4103c3"]]),he={class:"f-summary"},ke=(e=>((0,l.Qi)("data-v-c64b3500"),e=e(),(0,l.jt)(),e))((()=>(0,l.Lk)("article",{class:"f-summary-title"},"Job Summary",-1))),ye=(0,l.pM)({__name:"SummaryCard",props:["data","dataset"],setup:e=>(a,t)=>((0,l.uX)(),(0,l.CE)("section",he,[ke,(0,l.bF)(ge,{data:e.data,dataset:e.dataset},null,8,["data","dataset"])]))}),_e=(0,b.A)(ye,[["__scopeId","data-v-c64b3500"]]),we={class:"f-parameter"},Ee={class:"f-parameter-title"},Ce={class:"f-parameter-subtitle"},Le={class:"f-parameter-operation"},Re={class:"f-parameter-tree"},Fe=(0,l.pM)({__name:"Parameter",setup(e,{expose:a}){const t=(0,s.KR)(""),n=(0,s.KR)(),u=(0,s.KR)(!0),i=(0,s.KR)(!1),c=(0,o.Pj)(),r=(0,s.KR)(!1),d=(0,s.KR)(0);(0,l.wB)(t,(e=>{n.value.filter(e)}));const p=(e,a)=>!e||a.label.includes(e),f=(0,s.Kh)([]);let m;(0,l.wB)((()=>c.state.comp.parameters),(()=>{f.length=0,f.push(...c.state.comp.parameters||[]),d.value=f.length,t.value="",i.value=!1,m&&(clearTimeout(m),m=void 0)}));const v=()=>{r.value=!r.value,u.value=!1,(0,l.dY)((()=>{u.value=!0}))};return a({getParameter:async e=>{try{i.value=!0,await c.dispatch("chooseComp",e),i.value=!1}catch(e){m&&(clearTimeout(m),m=void 0),m=setTimeout((()=>{i.value=!1,m=void 0}))}}}),(e,a)=>{const o=(0,l.g2)("el-input"),c=(0,l.g2)("el-icon"),m=(0,l.g2)("el-tooltip"),b=(0,l.g2)("el-tree"),g=(0,l.gN)("loading");return(0,l.bo)(((0,l.uX)(),(0,l.CE)("section",we,[(0,l.Lk)("article",Ee,[(0,l.eW)(" Parameters "),(0,l.Lk)("span",Ce,"("+(0,k.toDisplayString)(d.value)+")",1)]),(0,l.Lk)("section",Le,[(0,l.bF)(o,{modelValue:t.value,"onUpdate:modelValue":a[0]||(a[0]=e=>t.value=e),class:"f-parameter-filter",placeholder:"Filter"},null,8,["modelValue"]),(0,l.bF)(m,{content:r.value?"Fold All":"Unfold All",effect:"dark",placement:"top"},{default:(0,l.k6)((()=>[(0,l.bF)(c,{class:"f-parameter-expand",onClick:v},{default:(0,l.k6)((()=>[(0,l.bo)((0,l.bF)((0,s.R1)(h.Expand),null,null,512),[[O.vShow,r.value]]),(0,l.eW)(),(0,l.bo)((0,l.bF)((0,s.R1)(h.Fold),null,null,512),[[O.vShow,!r.value]])])),_:1})])),_:1},8,["content"])]),(0,l.Lk)("section",Re,[u.value?((0,l.uX)(),(0,l.Wv)(b,{key:0,ref_key:"parameters",ref:n,data:f,"node-key":"id",class:"f-parameter-tree-item","default-expand-all":r.value,"filter-node-method":p},null,8,["data","default-expand-all"])):(0,l.Q3)("v-if",!0)])])),[[g,i.value]])}}}),Ke=(0,b.A)(Fe,[["__scopeId","data-v-c890bb50"]]),je={class:"f-detail"},Ie={class:"f-detail-header"},We={class:"f-detail-main"},De={class:"f-detail-summary"},Se={class:"f-detail-summary-btn"},Xe={class:"f-detail-graphic"},xe={class:"f-detail-parameter"},Ve={class:"f-detail-parameter-btn"},Ae=(0,l.pM)({__name:"Detail",setup(e){const a=(0,o.Pj)(),t=(0,s.KR)(!0),u=(0,s.KR)(),i=(0,l.EW)((()=>a.state.job.details)),c=(0,l.EW)((()=>a.state.job.dataset?.dataset)),r=(0,s.KR)(!0),d=async e=>{await u.value.getParameter(e),r.value=!1,v.value.refreshed()},p=e=>{e&&a.dispatch("SET_BASIC",{rerun:!0})},f=()=>a.dispatch("toDashboard"),m=()=>Object.keys(a.state.job.dag).length>0;(0,l.wB)(m,(()=>t.value=!1)),m()&&(t.value=!1);const v=(0,s.KR)(),b=()=>{v.value.on()};return(0,l.sV)((()=>{setTimeout((()=>{t.value=!1}),4e3)})),(e,a)=>{const o=(0,l.g2)("el-button"),m=(0,l.gN)("loading");return(0,l.uX)(),(0,l.CE)(l.FK,null,[(0,l.bo)(((0,l.uX)(),(0,l.CE)("div",je,[(0,l.Lk)("section",Ie,[(0,l.bF)((0,s.R1)(n.L))]),(0,l.Lk)("section",We,[(0,l.Lk)("section",De,[(0,l.bF)(_e,{data:i.value,dataset:c.value,class:"f-detail-summary-list"},null,8,["data","dataset"]),(0,l.Lk)("section",Se,[(0,l.bF)(o,{type:"primary",onClick:f},{default:(0,l.k6)((()=>[(0,l.eW)("Dashboard")])),_:1})])]),(0,l.Lk)("section",Xe,[(0,l.bF)(g,{class:"f-detail-graphic-dag",onChoose:d,onRetry:p})]),(0,l.Lk)("section",xe,[(0,l.bF)(Ke,{ref_key:"parameter",ref:u,class:"f-detail-parameter-info"},null,512),(0,l.Lk)("section",Ve,[(0,l.bF)(o,{type:"primary",disabled:r.value,onClick:b},{default:(0,l.k6)((()=>[(0,l.eW)("View the Outputs")])),_:1},8,["disabled"])])])])])),[[m,t.value]]),(0,l.bF)(B,{ref_key:"dialog",ref:v,onRefresh:d},null,512)],64)}}}),Be=(0,b.A)(Ae,[["__scopeId","data-v-022eabe4"]])}}]);