/* HF-062 - move os controles para o cabecalho da vitrine, sem faixa exclusiva */
(function(){
  "use strict";
  function placeNav(){
    var head=document.querySelector("#destaque .launches-head");
    var nav=document.querySelector("body > .cedro-page-bar.v31-top-nav") ||
             document.querySelector(".cedro-page-bar.v31-top-nav");
    if(!head || !nav) return false;
    if(nav.parentElement!==head){
      var link=head.querySelector(":scope > a");
      if(link) link.insertAdjacentElement("afterend",nav);
      else head.appendChild(nav);
    }
    nav.setAttribute("data-hf062-position","vitrine-head");
    return true;
  }
  function start(){
    if(placeNav()) return;
    var observer=new MutationObserver(function(){
      if(placeNav()) observer.disconnect();
    });
    observer.observe(document.body,{childList:true,subtree:true});
    window.setTimeout(function(){observer.disconnect();},10000);
  }
  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",start,{once:true});
  }else{
    start();
  }
})();
