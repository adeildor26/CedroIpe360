(()=>{
'use strict';
const d=document.createElement('dialog');d.className='ci-simulator ci-qualification';
d.innerHTML=`<button class="ci-close" type="button" aria-label="Fechar">×</button>
<h2>Vamos conhecer seu perfil?</h2><p class="ci-property"></p>
<p class="ci-intro">Responda algumas perguntas. Nossa equipe analisará as informações e retornará com uma estimativa inicial. A proposta completa é preparada no atendimento humano.</p>
<form>
<label>Renda familiar mensal<select name="renda" required><option value="">Selecione</option><option>Até R$ 2.000</option><option>R$ 2.001 a R$ 3.000</option><option>R$ 3.001 a R$ 5.000</option><option>R$ 5.001 a R$ 8.000</option><option>Acima de R$ 8.000</option></select></label>
<label>Entrada disponível<select name="entrada" required><option value="">Selecione</option><option>Até R$ 10 mil</option><option>R$ 10 mil a R$ 25 mil</option><option>R$ 25 mil a R$ 50 mil</option><option>Acima de R$ 50 mil</option><option>Ainda não tenho entrada</option></select></label>
<label>Possui FGTS?<select name="fgts" required><option value="">Selecione</option><option>Sim</option><option>Não</option><option>Preciso consultar</option></select></label>
<label>Situação profissional<select name="trabalho" required><option value="">Selecione</option><option>CLT</option><option>Autônomo</option><option>Empresário</option><option>Aposentado</option><option>Outra</option></select></label>
<label>Quando pretende comprar?<select name="prazo" required><option value="">Selecione</option><option>Imediatamente</option><option>Em até 30 dias</option><option>Em até 3 meses</option><option>Estou pesquisando</option></select></label>
<div class="ci-actions"><button type="submit">Continuar com atendimento humano</button></div>
<small>Não exibimos uma proposta financeira completa automaticamente. Adeildo analisará seu perfil e conversará com você. Estimativas dependem de confirmação das condições e análise de crédito.</small></form>`;
document.body.append(d);const f=d.querySelector('form');let item=null;
d.querySelector('.ci-close').onclick=()=>d.close();
document.addEventListener('click',e=>{const b=e.target.closest('[data-sim]');if(!b)return;item=(window.cedroImoveis||[]).find(x=>String(x.id)===b.dataset.sim);if(!item)return;d.querySelector('.ci-property').textContent=item.titulo||'Empreendimento selecionado';f.reset();d.showModal()});
f.addEventListener('submit',e=>{e.preventDefault();if(!f.reportValidity())return;const data=Object.fromEntries(new FormData(f).entries());const message=`Olá, Adeildo! Gostaria de uma análise inicial para ${item?.titulo||'o empreendimento'}.\nRenda familiar: ${data.renda}\nEntrada disponível: ${data.entrada}\nFGTS: ${data.fgts}\nSituação profissional: ${data.trabalho}\nPrazo de compra: ${data.prazo}\nQuero receber uma estimativa inicial e conversar com uma pessoa da equipe CedroIpê.`;d.close();document.dispatchEvent(new CustomEvent('cedro:lead',{detail:{url:'https://wa.me/'+(window.CONFIG.whatsappAdeildo||window.CONFIG.whatsapp)+'?text='+encodeURIComponent(message),interest:item?.titulo||''}}));});
})();