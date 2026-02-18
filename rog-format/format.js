const Format = {
  buildHtml(
  messages,
  title="整形済みログ",
  channelStyles={},
  castList=[],
  castHeadingLevel=2,
  bgMode="color",
  bgColor="#fff",
  bgImageUrl="",
  accentColor="#000"
){

  function hexToRgba(hex, alpha){
    hex = hex.replace("#","");

    if(hex.length===3){
      hex = hex.split("").map(c=>c+c).join("");
    }

    const r = parseInt(hex.slice(0,2),16);
    const g = parseInt(hex.slice(2,4),16);
    const b = parseInt(hex.slice(4,6),16);

    return `rgba(${r},${g},${b},${alpha})`;
  }

  // accentColor から薄いライン色を生成
  const lineColor = hexToRgba(accentColor, 0.45);
    
    let charIdCounter = 0;
    const charClassMap = {};
    const charColors={};

    messages.forEach(m=>{
      if(m.type==="talk" && !charColors[m.speaker]){
        charColors[m.speaker] = m.color || "#000";
        const base = m.speaker.trim().replace(/\s+/g,"_").replace(/[^a-zA-Z0-9_-]/g,"_") || "unk";
        charIdCounter++;
        charClassMap[m.speaker] = "char-" + base + "-" + charIdCounter;
      }
    });
    let charCss="<style>\n";
    Object.entries(charColors).forEach(([n,c])=>{
      const sn = charClassMap[n];
      charCss += `.${sn} dt,.${sn} dd{color:${c};}\n`;
    });
    Object.entries(channelStyles).forEach(([ch, st])=>{
      if(st.mode==="sub"){
        const safeCh = "sub-" + ch.replace(/[^\w]/g,"_");
        charCss += `.${safeCh} { background: ${st.bg}; border: 1px solid ${st.border}; }\n`;
      }
    });

    charCss+=`
      .subTalk{margin-left:100px;font-size:0.8em;padding:20px 30px;border-radius:4px;}
      body{font-family:"Yu Mincho",serif;margin: 40px 40px 40px 30px;background: ${bgMode==="color" ? bgColor : `url(${bgImageUrl}) no-repeat center/cover`};}
      h1,h2,h3,h4,h5,h6{color:${accentColor};}
      dl{margin-bottom:15px;} dt{font-weight:bold;font-size:0.9em;} dd{margin-left:1em;padding:6px 0;}
      .mainTalk dd{margin-left:1em;padding:6px 0;}
      #castBox{margin:20px 0;} .castItem{margin-bottom:12px;} .castItem dt{font-weight:bold;font-size:0.9em;}
      .castItem dd{margin-left:1em;padding:4px 0;} .castItem a{color:gray;text-decoration:underline;}
      .castOutputHr{border:none;margin:40px 0;border-top:1px solid ${lineColor};}
      hr{border:none;border-top:1px solid ${lineColor};}
      #tocContainer{position:fixed;top:20px;right:30px;z-index:9999;}
      .menu-btn{width:50px;height:50px;background:none;border:none;cursor:pointer;padding:0;opacity:0.5;
        position:relative;display:inline-flex;align-items:center;justify-content:center;}
      .inn{position:relative;width:30px;height:24px;display:inline-block;}
      .line{position:absolute;left:0;width:100%;height:2px;background:${accentColor};transition:0.3s;}
      .line:nth-of-type(1){top:0;} .line:nth-of-type(2){top:50%;transform:translateY(-50%);}
      .line:nth-of-type(3){bottom:0;}
      .menu-btn.is-open .line:nth-of-type(1){top:50%;transform:translateY(-50%) rotate(45deg);}
      .menu-btn.is-open .line:nth-of-type(2){opacity:0;}
      .menu-btn.is-open .line:nth-of-type(3){top:50%;transform:translateY(-50%) rotate(-45deg);bottom:auto;}
      .menu{position:absolute;top:50px;right:-280px;width:240px;max-height:85vh;background:#fff;border:1px solid #ccc;
        padding:20px;overflow-y:auto;transition:right 0.25s,opacity 0.25s,transform 0.25s;pointer-events:none;opacity:0;transform:translateY(-10px);}
      .menu.is-open{right:0;pointer-events:auto;opacity:1;transform:translateY(0);}
      #tocContent ul{padding-left:0;} #tocContent li{list-style:none;margin:6px 0;}
      #tocContent a{text-decoration:none;color:${accentColor};} #tocContent a:hover{text-decoration:underline;}
      #tocContent label{display:block;margin-bottom:4px;} #main{margin:15px;}
      .castItem.hasImage{display:flex;align-items:center;gap:12px;}
      .castImg{width:90px;height:90px;object-fit:cover;border-radius:10px;border:1px solid #ccc;}
      .castItem.hasImage .castTextBox{transform:translate(20px,-4px);}
      .castItem.hasImage dd { margin-left: 0;padding-left: 0;}
      .castItem.hasImage dd a {display: inline-block;font-size: 0.8em;max-width: calc(70vw - 90px - 12px);white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}
      @media (max-width:600px){body{margin:15px;}.subTalk{margin-left:20px;padding:12px;}}
    </style>\n`;

let content = "", headings = [];let castHtml = "";

if(castList?.length){
  headings.push({id:"castSection",text:"登場人物",level:castHeadingLevel});
  castHtml+=`<h${castHeadingLevel} id="castSection">登場人物</h${castHeadingLevel}><div id="castBox">`;
  castList.forEach(c=>{
    if(!c.name.trim()&&!c.image?.trim()&&!c.sheet?.trim()) return;
    const hasImage=c.image?.trim();
    const imgHtml=hasImage?`<div class="castImgBox"><img src="${c.image}" class="castImg"></div>`:"";
    const sheetLink=c.sheet?.trim()?`<a href="${c.sheet}" target="_blank">${c.sheet}</a>`:"";
    castHtml+=`<dl class="castItem ${hasImage?"hasImage":"noImage"}">${imgHtml}<div class="castTextBox"><dt>${c.name||"（名前なし）"}</dt><dd>${sheetLink}</dd></div></dl>`;
  });
  castHtml+=`</div><hr class="castOutputHr">`;
}

let openSub=false,lastChannel="";
messages.forEach(m=>{
  if(m.type==="space"){if(openSub){content+="</dl>\n";openSub=false;}content+="<br>\n";return;}
  if(m.type==="hr"){if(openSub){content+="</dl>\n";openSub=false;}content+="<hr>\n";return;}
  if(m.type==="heading"){if(openSub){content+="</dl>\n";openSub=false;}const l=m.level||2,hid="head_"+m.id;headings.push({id:hid,text:m.text,level:l});content+=`<h${l} id="${hid}">${m.text}</h${l}>\n`;return;}
  if(m.type!=="talk") return;
  const charClass=charClassMap[m.speaker];
  const st=channelStyles[m.channel]||{mode:m.channel==="main"?"main":"sub",bg:"#f5f5f5",border:"#ddd"};
  const subClass=st.mode==="sub"?"sub-"+m.channel.replace(/[^\w]/g,"_"):"";
  if(st.mode==="main"){if(openSub){content+="</dl>\n";openSub=false;}content+=`<dl class="mainTalk ${charClass}" data-channel="main"><dt>${m.speaker}</dt><dd>${m.text}</dd></dl>`;return;}
  if(openSub&&m.channel!==lastChannel){content+="</dl>\n";openSub=false;}
  if(!openSub){content+=`<dl class="subTalk ${charClass} ${subClass}" data-channel="sub">`;openSub=true;lastChannel=m.channel;}
  content+=`<dt>${m.speaker}</dt><dd>${m.text}</dd>`;
});
if(openSub) content+="</dl>\n";
let minLevel=6;headings.forEach(h=>{if(h.level<minLevel) minLevel=h.level;});
let tocHtml="";
if(headings.length){
  tocHtml=`<div id="tocContainer"><button id="tocToggle" class="menu-btn"><span class="inn"><span class="line"></span><span class="line"></span><span class="line"></span></span></button><div id="tocContent" class="menu"><h3>目次</h3><label><input type="checkbox" id="mainOnly"> メインのみ表示</label><label><input type="checkbox" id="groupTalkCheckbox"> 発言をまとめる</label><ul>`;
  headings.forEach(h=>{const i=h.level-minLevel;tocHtml+=`<li style="margin-left:${i*16}px;"><a href="#${h.id}">${h.text}</a></li>`;});
  tocHtml+="</ul></div></div>";
}

return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
${charCss}
</head>
<body>
${tocHtml}
<div id="main"><h1>${title}</h1>${castHtml}${content}</div>

<script>
const btn=document.getElementById("tocToggle"),menu=document.getElementById("tocContent");
if(btn&&menu)btn.addEventListener("click",()=>{btn.classList.toggle("is-open");menu.classList.toggle("is-open");});
document.querySelectorAll("#tocContent a").forEach(link=>{
  link.addEventListener("click",e=>{
    e.preventDefault();
    const target=document.getElementById(link.getAttribute("href").slice(1));
    if(target)target.scrollIntoView({behavior:"smooth",block:"start"});
  });
});

const mainOnlyCheck=document.getElementById("mainOnly"),
      groupTalkCheckbox=document.getElementById("groupTalkCheckbox"),
      mainContainer=document.getElementById("main");
let allDLs=null;

function initDLs(){
  if(allDLs)return;
  allDLs=Array.from(mainContainer.querySelectorAll("dl.mainTalk,dl.subTalk"));
  allDLs.forEach(dl=>{
    const dd=dl.querySelector("dd");
    dl.dataset.originalDD=dd?dd.innerHTML:"";
    dl.dataset.originalDisplay=dl.style.display||"";
  });
}

function applyMainOnly(){
  if(!mainOnlyCheck)return;
  const hideSub=mainOnlyCheck.checked;
  document.querySelectorAll("[data-channel='sub']").forEach(dl=>dl.style.display=hideSub?"none":"");
}

function applyGroupTalk(){
  if(!groupTalkCheckbox||!mainContainer)return;
  initDLs();
  const group=groupTalkCheckbox.checked;
  allDLs.forEach(dl=>{const dd=dl.querySelector("dd");if(dd)dd.innerHTML=dl.dataset.originalDD;dl.style.display="";});
  if(!group)return;
  let lastSpeaker=null,lastChannel=null,lastDL=null;
  const breakTags=["H1","H2","H3","H4","H5","H6","HR","BR"];
  allDLs.forEach(dl=>{
    const dt=dl.querySelector("dt"),dd=dl.querySelector("dd");
    if(!dt||!dd)return;
    const speaker=dt.textContent.trim(),channel=dl.dataset.channel;
    const prev=dl.previousElementSibling;
    if(prev&&breakTags.includes(prev.tagName)){lastSpeaker=null;lastChannel=null;lastDL=null;}
    if(lastSpeaker===speaker&&lastChannel===channel&&lastDL){lastDL.querySelector("dd").innerHTML+="<br>"+dd.innerHTML;dl.style.display="none";return;}
    lastSpeaker=speaker;lastChannel=channel;lastDL=dl;
  });
}

function refreshView(){applyGroupTalk();applyMainOnly();}

if(mainOnlyCheck) mainOnlyCheck.addEventListener("change",refreshView);
if(groupTalkCheckbox)groupTalkCheckbox.addEventListener("change",refreshView);
</script>

</body></html>`;
  }

}; 
