// ---- Menu mobile ----
const btn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');
btn.addEventListener('click', () => {
  btn.setAttribute('aria-expanded', menu.classList.toggle('aberto'));
});
menu.addEventListener('click', () => menu.classList.remove('aberto'));

// ---- Filtro por busca e categoria ----
const cards = document.querySelectorAll('.card');
const busca = document.getElementById('busca');
const botoes = document.querySelectorAll('#categorias button');
let categoria = '';

function filtrar() {
  const termo = busca.value.trim().toLowerCase();
  let visiveis = 0;
  cards.forEach(c => {
    const nome = c.querySelector('h3').textContent.toLowerCase();
    const mostra = nome.includes(termo) && (!categoria || c.dataset.categoria === categoria);
    c.hidden = !mostra;
    if (mostra) visiveis++;
  });
  document.getElementById('contagem').textContent = visiveis + (visiveis === 1 ? ' produto' : ' produtos');
  document.getElementById('vazio').hidden = visiveis > 0;
}
busca.addEventListener('input', filtrar);
botoes.forEach(b => b.addEventListener('click', () => {
  botoes.forEach(x => x.classList.remove('ativo'));
  b.classList.add('ativo');
  categoria = b.dataset.cat;
  filtrar();
}));
filtrar();

// ---- "Pedir orçamento" preenche o campo do formulário ----
document.querySelectorAll('[data-produto]').forEach(a =>
  a.addEventListener('click', () => { document.getElementById('produto').value = a.dataset.produto; })
);

// ---- Imagem ampliada ----
const lb = document.getElementById('lightbox');
const lbImg = lb.querySelector('img');
document.querySelectorAll('.card img').forEach(img => img.addEventListener('click', () => {
  lbImg.src = img.src; lbImg.alt = img.alt; lb.hidden = false;
}));
lb.addEventListener('click', () => { lb.hidden = true; });
document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.hidden = true; });

// ---- Formulário: máscara do telefone e validação ----
const form = document.getElementById('form-orcamento');
const tel = document.getElementById('telefone');
tel.addEventListener('input', () => {
  const d = tel.value.replace(/\D/g, '').slice(0, 11);
  tel.value = d.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{4,5})(\d{4})$/, '$1-$2');
});

function marcar(campo, erro) {
  campo.classList.toggle('invalido', !!erro);
  let m = campo.parentElement.querySelector('.msg-campo');
  if (erro && !m) { m = document.createElement('div'); m.className = 'msg-campo'; campo.parentElement.appendChild(m); }
  if (m) { if (erro) m.textContent = erro; else m.remove(); }
  return !erro;
}

form.addEventListener('submit', ev => {
  const f = form.elements;
  const ok = [
    marcar(f.nome, f.nome.value.trim() ? '' : 'Informe seu nome ou empresa.'),
    marcar(f.telefone, f.telefone.value.replace(/\D/g, '').length >= 10 ? '' : 'Telefone inválido (use DDD).'),
    marcar(f.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value) ? '' : 'E-mail inválido.'),
    marcar(f.mensagem, f.mensagem.value.trim().length >= 10 ? '' : 'Escreva pelo menos 10 caracteres.'),
  ];
  if (ok.includes(false)) { ev.preventDefault(); form.querySelector('.invalido').focus(); }
});

// ---- Mensagem de retorno do PHP ----
const p = new URLSearchParams(location.search);
if (p.get('status')) {
  const aviso = document.getElementById('aviso');
  const ok = p.get('status') === 'ok';
  aviso.className = 'aviso ' + (ok ? 'ok' : 'erro');
  aviso.textContent = ok ? 'Pedido enviado. Entraremos em contato em breve.' : (p.get('msg') || 'Não foi possível enviar. Tente novamente.');
  aviso.hidden = false;
}
