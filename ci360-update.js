
(()=>{const grid=document.getElementById('grid'),buttons=document.querySelectorAll('[data-ci-view]');if(!grid||!buttons.length)return;
const apply=mode=>{grid.classList.toggle('ci-list-view',mode==='list');buttons.forEach(b=>{const on=b.dataset.ciView===mode;b.classList.toggle('is-active',on);b.setAttribute('aria-pressed',String(on))});try{sessionStorage.setItem('ci360_catalog_view',mode)}catch(e){}};
buttons.forEach(b=>b.addEventListener('click',()=>apply(b.dataset.ciView)));let mode='cards';try{mode=sessionStorage.getItem('ci360_catalog_view')||mode}catch(e){}apply(mode)})();
