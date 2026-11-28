const cfg=window.CONFIG, demo=window.DEMO_IMOVEIS;
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const zap=(txt='Olá! Vi os empreendimentos no site CedroIpê Imóveis e gostaria de mais informações.')=>`https://wa.me/${cfg.whatsappAdeildo||cfg.whatsapp}?text=${encodeURIComponent(txt)}`;
const money=v=>!(Number(v)>0)?'Consulte valores':Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0});
const priceLabel=i=>Number(i.preco)>0?((i.finalidade==='alugar'?'Aluguel: ':'A partir de ')+money(i.preco)):'Preço em atualização';
const area=v=>v==null?'Consulte':Number(v).toLocaleString('pt-BR',{maximumFractionDigits:2})+' m²';
// HF-045: commercial facts from approved API fields.
const options=(i,k)=>{const fields={quartos:'dormitorios_opcoes',banheiros:'banheiros_opcoes',vagas:'vagas_opcoes'};const a=i[fields[k]];if(Array.isArray(a)&&a.length)return [...new Set(a.filter(v=>v!==null&&v!==''&&Number.isInteger(Number(v))&&Number(v)>=(k==='quartos'?1:0)).map(Number))].sort((a,b)=>a-b);const v=i[k];return v!=null&&v!==''&&Number.isInteger(Number(v))&&Number(v)>=(k==='quartos'?1:0)?[Number(v)]:[];};
const optionText=(i,k)=>options(i,k).join(' e ')||null;
const bedroomLabel=i=>optionText(i,'quartos')?optionText(i,'quartos')+' dormitório(s)':'Dormitórios em atualização';
const areaRange=i=>Number(i.area_min)>0?(area(i.area_min)+(Number(i.area_max)>Number(i.area_min)?' a '+area(i.area_max):'')):(Number(i.area_max)>0?area(i.area_max):null);
const fieldValues=(i,k)=>['quartos','banheiros','vagas'].includes(k)?options(i,k):[i[k]];
const completeness=i=>Number(Number(i.preco)>0)*4+Number(options(i,'quartos').length>0)*2+Number(!!areaRange(i))+Number(!!i.imagens?.length);
let db=null;
async function getDB(){if(!cfg.supabaseUrl||!cfg.supabaseAnonKey)return null;const {createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');return createClient(cfg.supabaseUrl,cfg.supabaseAnonKey);}
async function getImoveis(){
 const status=$('#catalogStatus');
 try {
  const res=await fetch('/api/catalogo',{cache:'no-store'});
  if(!res.ok)throw Error('HTTP '+res.status);
  const rows=await res.json();if(!Array.isArray(rows))throw Error('Resposta inválida');
  const items=rows.map(r=>({...r,id:String(r.id),finalidade:/alug|locaç/i.test(r.tipo||'')?'alugar':'comprar',imagens:(r.midias||[]).length?r.midias.filter(m=>!isVideo(m.url)).map(m=>m.url):(Array.isArray(r.imagens)?r.imagens:[]),caracteristicas:Array.isArray(r.caracteristicas)?r.caracteristicas:[],status:r.status||'Consulte disponibilidade'}));
  if(status)status.textContent=items.length+' empreendimentos publicados no catálogo.';
  return items;
 }catch(e){if(status)status.textContent='Catálogo temporariamente indisponível. Tente novamente.';console.error(e);return [];}
}
function isVideo(url){try{return new URL(url,location.href).pathname.toLowerCase().endsWith('.mp4')}catch{return false}}
async function carregarMidias(i){
 const res=await fetch('/api/catalogo?id='+encodeURIComponent(i.id),{cache:'no-store'});
 if(!res.ok)throw Error('Galeria indisponível');
 const rows=await res.json();const r=rows.find(x=>String(x.id)===String(i.id));if(!r)throw Error('Empreendimento não disponível');
 Object.assign(i,Object.fromEntries(Object.entries(r).filter(([k,v])=>!['id','midias','imagens'].includes(k)&&v!=null&&v!=='')));i.midias=r.midias||i.midias||[];i.imagens=i.midias.length?i.midias.filter(m=>!isVideo(m.url)).map(m=>m.url):i.imagens;i.videos=i.midias.filter(m=>isVideo(m.url)).map(m=>m.url);return i;
}
function imgUrl(i){const x=i?.imagens?.[0];return x||'assets/capa-indisponivel.svg'}
function mediaUrl(src){if(!src)return '';try{const u=new URL(src,location.href);return ['https:','http:'].includes(u.protocol)?u.href:''}catch{return ''}}
function videosHtml(i){return (Array.isArray(i.videos)?i.videos:[]).map((raw,j)=>{const url=mediaUrl(raw);if(!url)return '';try{if(new URL(url).pathname.toLowerCase().endsWith('.mp4'))return `<video controls preload="metadata" src="${esc(url)}"></video>`}catch{}return ''}).join('')}
function contatoImovel(i,acao,tecnico=false){const nome=i.titulo||'Empreendimento';const local=[i.bairro,i.cidade].filter(Boolean).join(', ');const texto=`Olá! Tenho interesse no empreendimento ${nome}${local?' ('+local+')':''}. ${acao} Vi no site CedroIpê Imóveis.`;return 'https://wa.me/'+(tecnico?cfg.whatsappTecnico:cfg.whatsappAdeildo||cfg.whatsapp)+'?text='+encodeURIComponent(texto)}
function card(i){return `<article class="property"><button type="button" class="property-image" data-detail="${esc(i.id)}" aria-label="Ver detalhes de ${esc(i.titulo)}"><img loading="lazy" src="${esc(imgUrl(i))}" alt="Imagem do imóvel ${esc(i.titulo)}"><span class="tag">${esc(i.tipo||'Empreendimento')}</span></button><div class="property-body"><div class="property-location">${esc([i.bairro,i.cidade].filter(Boolean).join(', '))}${i.construtora?' · '+esc(i.construtora):''}</div><h3>${esc(i.titulo)}</h3><div class="property-meta"><span>⌂ ${esc(bedroomLabel(i))}</span><span>▧ ${esc(areaRange(i)||'Área em atualização')}</span></div><div class="property-bottom"><div><div><b style="font-size:1.25rem;color:#102747">${esc(priceLabel(i))}</b></div></div><button type="button" class="ci-text-button" data-detail="${esc(i.id)}">Ver detalhes</button></div><div class="ci-card-actions"><button type="button" class="btn btn-primary" data-lead="${esc(i.id)}">Falar com Adeildo · atendimento humano</button><button type="button" class="btn btn-outline ci-sim" data-sim="${esc(i.id)}">Simular parcelas</button></div></div></article>`}

function wireZap(){for(const id of ['#navZap','#ctaZap','#topZap','#stripZap','#floatZap','#mobileZap'])if($(id))$(id).href=zap();if($('#navZapTecnico'))$('#navZapTecnico').href='https://wa.me/'+cfg.whatsappTecnico;if($('#creciFooter')&&cfg.creci)$('#creciFooter').textContent='CRECI '+cfg.creci+' · '+(cfg.creciResponsavel||'');}
function renderLaunches(items){const grid=$('#launchesGrid');if(!grid)return;const title=$('#launchesTitle'),summary=$('#launchesSummary');const count=items.length;if(title)title.textContent=`${count} opções de imóveis`;if(summary)summary.textContent=`Consulte ${count} opções disponíveis no catálogo e fale diretamente com nossa equipe.`;let page=0;const size=6;const pager=$('#catalogPager');function paint(){grid.innerHTML=items.slice(page*size,(page+1)*size).map(i=>{const image=imgUrl(i);const name=i.titulo||'Empreendimento';const place=[i.bairro,i.cidade].filter(Boolean).join(' · ')||'Localização sob consulta';return `<article class="launch-card"><a class="launch-image" aria-label="Ver ${esc(name)}" href="imovel.html?id=${encodeURIComponent(i.id)}"><img src="${esc(image)}" alt="Imagem de ${esc(name)}" loading="lazy" onerror="this.onerror=null;this.src='assets/capa-indisponivel.svg'"><span>EMPREENDIMENTO</span></a><div class="launch-content"><p class="launch-place">${esc(place)}</p><h3>${esc(name)}</h3><strong style="display:block;font-size:1.25rem;color:#102747">${esc(priceLabel(i))}</strong><p>${esc(bedroomLabel(i))} · ${esc(areaRange(i)||'Área em atualização')}</p><p>${esc(String(i.descricao||'Informações complementares em atualização.').replace(/https?:\/\/\S+/gi,'').trim())}</p><div class="launch-actions"><a class="launch-primary" href="imovel.html?id=${encodeURIComponent(i.id)}">Ver empreendimento</a><button type="button" class="launch-secondary" data-lead="${esc(i.id)}">Falar com Adeildo · atendimento humano</button><button type="button" class="ci-sim" data-sim="${esc(i.id)}">Simular parcelas</button></div></div></article>`}).join('');if(pager){pager.innerHTML=`<button type="button" ${page===0?'disabled':''} data-step="-1">‹ Anterior</button><span>Página ${page+1} de ${Math.max(1,Math.ceil(count/size))}</span><button type="button" ${page+1>=Math.ceil(count/size)?'disabled':''} data-step="1">Próxima ›</button>`;pager.querySelectorAll('button').forEach(b=>b.onclick=()=>{page+=Number(b.dataset.step);paint()})}}paint();}

function initCatalog(items){
 const grid=$('#grid'),busca=$('#busca'),q=$('#quartos'),boxes=$('#ciFilterBoxes');
 const availablePurpose=[...new Set(items.map(i=>String(i.finalidade||'').trim()).filter(Boolean))];
 let finalidade=availablePurpose.includes('comprar')?'comprar':(availablePurpose[0]||'comprar');
 document.querySelectorAll('[data-purpose]').forEach(b=>{b.hidden=availablePurpose.length>0&&!availablePurpose.includes(b.dataset.purpose);});
 const specs=[
  ['construtora','Construtora'],['tipo','Tipo de imóvel'],['bairro','Bairro'],['cidade','Cidade'],
  ['quartos','Dormitórios'],['banheiros','Banheiros'],['vagas','Vagas'],['status','Disponibilidade']
 ];
 const norm=v=>String(v??'').trim();
 const unique=values=>[...new Set(values.map(norm).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR',{numeric:true}));
 const controls={};
 function makeSelect(key,label,values,first){
   if(!values.length)return null;
   const wrap=document.createElement('label');wrap.className='ci-filter-box';
   const caption=document.createElement('span');caption.textContent=label;
   const select=document.createElement('select');select.setAttribute('aria-label',label);select.dataset.filter=key;
   select.add(new Option(first,''));
   values.forEach(v=>select.add(new Option(v,v)));
   wrap.append(caption,select);boxes.append(wrap);controls[key]=select;select.addEventListener('change',render);return select;
 }
 if(boxes){
   boxes.innerHTML='';
   for(const [key,label] of specs){
     const vals=unique(items.flatMap(i=>fieldValues(i,key)));
     makeSelect(key,label,vals,'Todos');
   }
   // O seletor rápido de dormitórios também usa exclusivamente os valores do catálogo.
   if(q){q.innerHTML='<option value="">Quartos</option>';unique(items.flatMap(i=>options(i,'quartos'))).forEach(v=>q.add(new Option(v+' quarto(s)',v)));}
   if(!boxes.children.length){boxes.innerHTML='<p class="ci-filter-empty">Os filtros detalhados serão exibidos quando houver esses dados cadastrados.</p>';}
 }
 function render(){
   const t=busca?.value.trim().toLocaleLowerCase('pt-BR')||'';
   const list=items.filter(i=>{
     const text=[i.titulo,i.bairro,i.cidade,i.construtora,i.endereco].join(' ').toLocaleLowerCase('pt-BR');
     if(availablePurpose.length&&i.finalidade!==finalidade)return false;
     if(!availablePurpose.length&&finalidade==='alugar'&&i.finalidade!=='alugar')return false;
     if(t&&!text.includes(t))return false;
     if(q?.value&&!options(i,'quartos').includes(Number(q.value)))return false;
     for(const [key,control] of Object.entries(controls)){if(control.value&&!fieldValues(i,key).map(norm).includes(control.value))return false;}
     return true;
   });
   grid.innerHTML=list.map(card).join('');
   $('#contador').textContent=`${list.length} ${list.length===1?'imóvel encontrado':'imóveis encontrados'}`;
   $('#vazio').hidden=!!list.length;
   const lp=list.filter(i=>/planta|lançamento/i.test(i.tipo||'')),lr=list.filter(i=>/pronto/i.test(i.tipo||''));
   $('#vitrinePlanta').innerHTML=lp.length?lp.map(card).join(''):'';
   $('#vitrineProntos').innerHTML=lr.length?lr.map(card).join(''):'';
   $('#vitrinePlantaTitulo').hidden=!lp.length;$('#vitrineProntosTitulo').hidden=!lr.length;
   $('#vitrinePlanta').hidden=!lp.length;$('#vitrineProntos').hidden=!lr.length;
   const buttons=$('#botoesProjetos');buttons.innerHTML='';
   buttons.hidden=true;
 }
 document.querySelectorAll('[data-purpose]').forEach(b=>b.addEventListener('click',()=>{finalidade=b.dataset.purpose;document.querySelectorAll('[data-purpose]').forEach(x=>x.classList.toggle('purpose-active',x===b));render()}));
 $('#buscar').onclick=()=>{$('#imoveis').scrollIntoView({behavior:'smooth'});render()};
 $('#limpar').onclick=()=>{finalidade='comprar';document.querySelectorAll('[data-purpose]').forEach(b=>b.classList.toggle('purpose-active',b.dataset.purpose===finalidade));if(busca)busca.value='';if(q)q.value='';Object.values(controls).forEach(x=>x.value='');render()};
 if(busca)busca.addEventListener('input',render);if(q)q.addEventListener('change',render);
 // Ações permanecem dentro do site; detalhes são exibidos em modal.
 document.addEventListener('click',e=>{
   const detail=e.target.closest('[data-detail]');if(detail){const item=items.find(x=>String(x.id)===detail.dataset.detail);if(item)location.href='imovel.html?id='+encodeURIComponent(item.id);}
   const lead=e.target.closest('[data-lead]');if(lead){const item=items.find(x=>String(x.id)===lead.dataset.lead);const interest=item?.titulo||lead.dataset.lead||'empreendimentos CedroIpê';const message=item?contatoImovel(item,'Gostaria de receber informações, valores e condições.'):zap('Olá! Tenho interesse em '+interest+'. Gostaria de conversar com a equipe CedroIpê.');document.dispatchEvent(new CustomEvent('cedro:lead',{detail:{url:message,interest}}));}
 });
 render();
}
async function openDetailModal(i){
 const modal=$('#ciDetailModal'),content=$('#ciDetailContent');if(!modal||!content)return;
 modal.hidden=false;document.body.style.overflow='hidden';content.textContent='Carregando fotos do empreendimento…';modal.querySelectorAll('[data-close-detail]').forEach(b=>b.onclick=()=>{modal.hidden=true;document.body.style.overflow='';});
 const token=Symbol();modal.ciRequest=token;try{await carregarMidias(i)}catch(e){if(modal.ciRequest===token&&!modal.hidden)content.textContent='Não foi possível carregar as fotos. Feche e tente novamente.';return;}if(modal.ciRequest!==token||modal.hidden)return;
 const photos=(i.imagens||[]).filter(Boolean);
 const img=photos[0]||imgUrl(i);
 content.innerHTML=`<div class="ci-detail-layout"><div><img class="ci-detail-image" src="${esc(img)}" alt="Imagem de ${esc(i.titulo)}"><div class="ci-detail-thumbs">${photos.slice(1,5).map((p,n)=>`<button type="button" data-photo="${esc(p)}" aria-label="Ver foto ${n+2}"><img src="${esc(p)}" alt=""></button>`).join('')}</div></div><div class="ci-detail-copy"><span class="section-kicker">${esc(i.construtora||'CEDROIPÊ IMÓVEIS')}</span><h2 id="ciDetailTitle">${esc(i.titulo)}</h2><p>${esc([i.bairro,i.cidade].filter(Boolean).join(', ')||'Localização sob consulta')}</p><p>${esc(i.descricao||'Consulte as informações e condições atualizadas com nossa equipe.')}</p><h3>${esc(money(i.preco))}</h3><p>${esc(bedroomLabel(i))} · ${esc(areaRange(i)||'Área em atualização')}</p><div class="ci-detail-actions"><button type="button" class="btn btn-primary" data-lead="${esc(i.id)}">Falar com Adeildo · atendimento humano</button><button type="button" class="btn btn-outline ci-sim" data-sim="${esc(i.id)}">Simular parcelas</button></div><small>Valores, unidades e condições sujeitos à confirmação. Atendimento realizado pela CedroIpê.</small></div></div>`;
 const gallery=document.createElement('div');gallery.className='ci-category-gallery';
 for(const cat of [...new Set((i.midias||[]).map(m=>m.categoria||'Mídias'))]){
  const section=document.createElement('details');const label=document.createElement('summary');const group=i.midias.filter(m=>(m.categoria||'Mídias')===cat);label.textContent=cat+' ('+group.length+')';section.append(label);
  const grid=document.createElement('div');grid.className='ci-category-grid';section.append(grid);section.addEventListener('toggle',()=>{if(!section.open||grid.children.length)return;for(const m of group){if(isVideo(m.url)){const v=document.createElement('video');v.controls=true;v.preload='none';v.src=m.url;grid.append(v);}else{const b=document.createElement('button');b.type='button';const im=document.createElement('img');im.loading='lazy';im.src=m.url;im.alt=m.descricao||cat;b.append(im);b.onclick=()=>{content.querySelector('.ci-detail-image').src=m.url;};grid.append(b);}}});gallery.append(section);
 }
 content.append(gallery);
 content.querySelectorAll('[data-photo]').forEach(b=>b.addEventListener('click',()=>{content.querySelector('.ci-detail-image').src=b.dataset.photo;}));
 modal.hidden=false;document.body.style.overflow='hidden';
 modal.querySelectorAll('[data-close-detail]').forEach(b=>b.onclick=()=>{modal.hidden=true;document.body.style.overflow='';});
}

async function initDetail(items){
 const id=new URLSearchParams(location.search).get('id')||new URLSearchParams(location.search).get('imovel');const el=$('#detalhe');let i=items.find(x=>String(x.id)===id);
 if(!i){el.innerHTML='<h1>Imóvel não encontrado ou catálogo indisponível</h1><a href="index.html#imoveis">Voltar ao catálogo</a>';return;}
 try{await carregarMidias(i)}catch(e){console.error(e)}
 document.title=i.titulo+' | CedroIpê Imóveis';
 const photos=[...new Set((i.imagens||[]).map(mediaUrl).filter(Boolean))];const price=Number(i.preco)>0;const loc=[i.bairro,i.cidade,i.uf].filter(Boolean).join(' · ');
 const fact=(label,value)=>`<div><small>${label}</small><strong>${esc(value??'Em atualização')}</strong></div>`;
 const description=String(i.descricao||'Informações complementares em atualização.').replace(/https?:\/\/\S+/gi,'').trim();
 el.innerHTML=`<section class="ci36-hero" aria-label="Carrossel de fotos"><div class="ci36-stage">${photos.length?'<img class="ci36-photo" alt="Foto do empreendimento">':'<p>Fotos em atualização</p>'}</div>${photos.length>1?'<button class="ci36-prev" aria-label="Foto anterior">‹</button><button class="ci36-next" aria-label="Próxima foto">›</button><div class="ci36-controls"><span class="ci36-count"></span><button class="ci36-pause">Pausar</button></div>':''}</section>
 <section class="ci36-heading"><div><span class="kicker">${esc(i.construtora||'CedroIpê Imóveis')}</span><h1>${esc(i.titulo)}</h1><p>${esc(loc)}</p></div><div class="ci36-price"><small>${price?'A partir de':'Preço inicial em atualização'}</small><strong>${price?esc(money(i.preco)):'Valor não confirmado'}</strong><small>Valores e disponibilidade sujeitos à confirmação.</small></div></section>
 <section class="ci36-facts">${fact('Dormitórios',optionText(i,'quartos'))}${fact('Área',areaRange(i))}${fact('Tipo',i.tipo)}${fact('Status',i.status)}${fact('Banheiros',optionText(i,'banheiros'))}${fact('Vagas',optionText(i,'vagas'))}${i.previsao_entrega?fact('Previsão de entrega',String(i.previsao_entrega).slice(0,10).split('-').reverse().join('/')):''}</section>
 <section class="ci36-actions"><button class="btn btn-primary" data-sim="${esc(i.id)}">Simular financiamento</button><a class="btn btn-outline" href="${esc(contatoImovel(i,'Gostaria de consultar entrada e subsídio.'))}">Entrada e subsídio</a><a class="btn btn-primary" href="${esc(contatoImovel(i,'Gostaria de agendar uma visita.'))}">Agendar visita</a><a class="btn btn-outline" href="${esc(contatoImovel(i,'Gostaria de informações sobre documentação e contrato.',true))}">Contratos e documentação</a><a class="btn btn-outline" href="${esc(contatoImovel(i,'Gostaria de falar com a equipe comercial.'))}">Falar com Adeildo</a></section>
 <section class="ci36-info"><article><h2>Sobre o empreendimento</h2><p>${esc(description||'Informações complementares em atualização.')}</p>${i.caracteristicas?.length?'<h3>Diferenciais</h3><div class="chips">'+i.caracteristicas.map(x=>`<span>${esc(x)}</span>`).join('')+'</div>':''}</article><article><h2>Compra e documentação</h2><p>Consulte condições de entrada, financiamento, análise de crédito e documentação. A equipe técnica orienta sobre o contrato aplicável antes da assinatura.</p><p>Atendimento humano · CRECI-SP 317363.</p></article></section>${videosHtml(i)?'<section><h2>Vídeos</h2><div class="v181-videos">'+videosHtml(i)+'</div></section>':''}`;
 if(!photos.length)return;const img=el.querySelector('.ci36-photo');let index=0,timer,paused=matchMedia('(prefers-reduced-motion: reduce)').matches;const count=el.querySelector('.ci36-count'),pause=el.querySelector('.ci36-pause');
 function show(n){index=(n+photos.length)%photos.length;img.src=photos[index];img.alt=`Foto ${index+1} de ${i.titulo}`;if(count)count.textContent=`${index+1} / ${photos.length}`;}
 function start(){clearInterval(timer);if(!paused&&photos.length>1&&!document.hidden)timer=setInterval(()=>show(index+1),2000);if(pause)pause.textContent=paused?'Reproduzir':'Pausar';}
 show(0);if(pause){pause.onclick=()=>{paused=!paused;start()};el.querySelector('.ci36-prev').onclick=()=>{show(index-1);start()};el.querySelector('.ci36-next').onclick=()=>{show(index+1);start()};document.addEventListener('visibilitychange',start);start();}
}
function initFeatured(items){const box=$('#featured');if(!box)return;const priced=items.filter(i=>Number(i.preco)>0);const list=priced.filter(i=>i.destaque);const all=list.length?list:priced.length?priced:items;if(!all.length){box.innerHTML='<p>Novos imóveis serão divulgados em breve.</p>';return;}let idx=0;function render(){const i=all[idx];box.innerHTML=`<div class="featured-photo"><img src="${esc(imgUrl(i))}" alt="Imagem de ${esc(i.titulo)}"><span class="featured-badge">EM DESTAQUE</span></div><div class="featured-copy"><div class="featured-kicker">${esc(i.construtora||'Empreendimento')} · ${esc(i.bairro||'')}</div><h3>${esc(i.titulo)}</h3><p>${esc(i.descricao||'Consulte as informações deste empreendimento.')}</p><div class="featured-stats"><span>⌂ ${esc(bedroomLabel(i))}</span><span>▦ ${esc(areaRange(i)||'Área em atualização')}</span><span>⌖ ${esc(i.cidade||'')}</span></div><div class="featured-price">${esc(priceLabel(i))}</div><div class="featured-buttons"><button class="btn btn-primary" type="button" data-detail="${esc(i.id)}">Conhecer empreendimento →</button><button class="btn btn-outline" type="button" data-lead="${esc(i.id)}">☎ Tenho interesse</button></div><small>Preços, imagens e disponibilidade sujeitos a confirmação.</small></div>`;}$('#slidePrev').onclick=()=>{idx=(idx-1+all.length)%all.length;render()};$('#slideNext').onclick=()=>{idx=(idx+1)%all.length;render()};render();}
function initLead(){const f=$('#leadForm');if(!f)return;f.addEventListener('submit',e=>{e.preventDefault();const nome=$('#leadNome').value.trim(),reg=$('#leadRegiao').value.trim(),tipo=$('#leadTipo').value;if(!nome)return;const msg=`Olá! Meu nome é ${nome}. Procuro: ${tipo}. Região de interesse: ${reg||'a definir'}. Gostaria de conhecer as opções disponíveis. Aguardo seu retorno assim que possível.`;document.dispatchEvent(new CustomEvent('cedro:lead',{detail:{url:zap(msg),interest:msg}}));});}
wireZap();const items=(await getImoveis()).sort((a,b)=>completeness(b)-completeness(a));
const first=items.find(i=>i.imagens.length);if(first){const hero=$('.hero-visual img');if(hero){hero.src=imgUrl(first);hero.alt=first.titulo;}const label=$('.hero-photo-label');if(label){label.innerHTML='<span>'+esc(first.construtora)+'</span><strong>'+esc(first.titulo)+'</strong><small>'+esc([first.bairro,first.cidade].filter(Boolean).join(' · '))+'</small><strong>'+esc(priceLabel(first))+'</strong><small>'+esc(bedroomLabel(first))+'</small>';}const reel=$('#reelPhoto');if(reel){reel.src=imgUrl(first);reel.alt=first.titulo;$('#reelTitle').textContent=first.titulo;$('#reelOpen').dataset.detail=first.id;}}window.cedroImoveis=items;renderLaunches(items);initFeatured(items);initLead();if($('#grid'))initCatalog(items);if($('#detalhe'))await initDetail(items);window.dispatchEvent(new CustomEvent("cedro:imoveis"));
