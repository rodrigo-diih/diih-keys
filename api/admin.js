module.exports = function handler(req, res) {
  const senhaCorreta = process.env.ADMIN_PASSWORD;

  if (!senhaCorreta) {
    res.status(500).send('Senha de admin não configurada no servidor.');
    return;
  }

  const auth = req.headers.authorization;
  const esperado = 'Basic ' + Buffer.from('admin:' + senhaCorreta).toString('base64');

  if (!auth || auth !== esperado) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Acesso restrito - DiiH Keys"');
    res.status(401).send('Acesso negado. Digite a senha.');
    return;
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(ADMIN_HTML);
};

const ADMIN_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Admin | DiiH Keys</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*{ margin:0; padding:0; box-sizing:border-box; }
body{ font-family:'Poppins',sans-serif; background:#0b0b0b; color:white; min-height:100vh; }
.header{
background:#111; border-bottom:1px solid rgba(214,179,106,0.2);
padding:18px 40px; display:flex; align-items:center; justify-content:space-between;
position:sticky; top:0; z-index:100;
}
.header-logo{ font-size:1.3rem; font-weight:800; color:#d6b36a; }
.header-logo span{ color:white; font-weight:300; }
.header-right{ display:flex; align-items:center; gap:14px; }
.status-pill{
display:flex; align-items:center; gap:8px; font-size:.82rem; color:#888;
background:#1a1a1a; border:1px solid rgba(255,255,255,0.07);
padding:6px 14px; border-radius:999px;
}
.status-dot{ width:7px; height:7px; border-radius:50%; background:#444; }
.status-dot.on{ background:#4caf50; }
.status-dot.err{ background:#f44336; }
.token-screen{ min-height:100vh; display:flex; align-items:center; justify-content:center; padding:20px; }
.token-card{
background:#111; border:1px solid rgba(214,179,106,0.2); border-radius:24px;
padding:50px 40px; max-width:460px; width:100%; text-align:center;
}
.token-card h2{ font-size:1.8rem; color:#d6b36a; margin-bottom:10px; }
.token-card p{ color:#aaa; font-size:.93rem; line-height:1.7; margin-bottom:28px; }
.token-input{
width:100%; padding:15px 18px; background:#1a1a1a;
border:1px solid rgba(214,179,106,0.25); border-radius:12px;
color:white; font-family:'Poppins',sans-serif; font-size:.93rem;
margin-bottom:14px; outline:none; transition:.3s;
}
.token-input:focus{ border-color:#d6b36a; }
.token-warning{
background:rgba(214,179,106,0.07); border:1px solid rgba(214,179,106,0.18);
border-radius:10px; padding:13px 16px; font-size:.8rem; color:#c9a85a;
margin-bottom:22px; text-align:left; line-height:1.6;
}
.btn-gold{
background:#d6b36a; color:black; border:none; padding:13px 28px; border-radius:11px;
font-family:'Poppins',sans-serif; font-size:.95rem; font-weight:700; cursor:pointer; transition:.3s;
}
.btn-gold:hover{ opacity:.88; transform:translateY(-2px); }
.btn-gold:disabled{ opacity:.4; cursor:not-allowed; transform:none; }
.btn-gold.full{ width:100%; }
.btn-outline{
background:transparent; color:#d6b36a; border:1px solid rgba(214,179,106,0.35);
padding:9px 20px; border-radius:9px; font-family:'Poppins',sans-serif;
font-size:.83rem; font-weight:600; cursor:pointer; transition:.3s;
}
.btn-outline:hover{ border-color:#d6b36a; background:rgba(214,179,106,0.05); }
.btn-outline.sm{ padding:7px 14px; font-size:.78rem; }
.btn-danger{
background:transparent; color:#e57373; border:1px solid rgba(229,115,115,0.3);
padding:9px 20px; border-radius:9px; font-family:'Poppins',sans-serif;
font-size:.83rem; font-weight:600; cursor:pointer; transition:.3s;
}
.btn-danger:hover{ background:rgba(229,115,115,0.1); border-color:#e57373; }
.btn-danger.sm{ padding:7px 14px; font-size:.78rem; }
.btn-edit{
background:transparent; color:#64b5f6; border:1px solid rgba(100,181,246,0.3);
padding:9px 20px; border-radius:9px; font-family:'Poppins',sans-serif;
font-size:.83rem; font-weight:600; cursor:pointer; transition:.3s;
}
.btn-edit:hover{ background:rgba(100,181,246,0.1); border-color:#64b5f6; }
.btn-edit.sm{ padding:7px 14px; font-size:.78rem; }
.btn-upload{
background:transparent; color:#81c784; border:1px solid rgba(129,199,132,0.35);
padding:9px 14px; border-radius:9px; font-family:'Poppins',sans-serif;
font-size:.8rem; font-weight:600; cursor:pointer; transition:.3s; white-space:nowrap;
}
.btn-upload:hover{ background:rgba(129,199,132,0.08); border-color:#81c784; }
.btn-upload:disabled{ opacity:.4; cursor:not-allowed; }
.main{ display:none; }
.main.visible{ display:block; }
.tabs-bar{
background:#111; border-bottom:1px solid rgba(214,179,106,0.12);
padding:0 40px; display:flex; gap:4px;
}
.tab-btn{
padding:16px 24px; background:transparent; border:none; color:#888;
font-family:'Poppins',sans-serif; font-size:.9rem; font-weight:600;
cursor:pointer; border-bottom:2px solid transparent; transition:.25s;
}
.tab-btn:hover{ color:#ccc; }
.tab-btn.active{ color:#d6b36a; border-bottom-color:#d6b36a; }
.tab-panel{ display:none; max-width:1100px; margin:0 auto; padding:40px 20px; }
.tab-panel.active{ display:block; }
.stats{ display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:14px; margin-bottom:40px; }
.stat-card{ background:#111; border:1px solid rgba(214,179,106,0.1); border-radius:16px; padding:22px 18px; text-align:center; }
.stat-number{ font-size:2rem; font-weight:800; color:#d6b36a; }
.stat-label{ font-size:.78rem; color:#888; margin-top:4px; }
.filtros{ display:flex; gap:10px; flex-wrap:wrap; margin-bottom:24px; }
.filtro-btn{
padding:7px 18px; border-radius:999px; border:1px solid rgba(214,179,106,0.2);
background:transparent; color:#888; font-family:'Poppins',sans-serif;
font-size:.8rem; font-weight:600; cursor:pointer; transition:.25s;
}
.filtro-btn:hover{ border-color:#d6b36a; color:#d6b36a; }
.filtro-btn.active{ background:#d6b36a; color:black; border-color:#d6b36a; }
.produtos-lista{ display:flex; flex-direction:column; gap:14px; }
.produto-item{
background:#111; border:1px solid rgba(214,179,106,0.1); border-radius:16px;
padding:18px 22px; display:flex; align-items:center; gap:18px; transition:.3s;
}
.produto-item:hover{ border-color:rgba(214,179,106,0.28); }
.produto-img{ width:60px; height:60px; border-radius:10px; object-fit:cover; background:#1e1e1e; flex-shrink:0; }
.produto-info{ flex:1; min-width:0; }
.produto-nome{ font-size:.97rem; font-weight:600; margin-bottom:5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.produto-meta{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.badge{ font-size:.7rem; padding:3px 9px; border-radius:999px; font-weight:600; }
.badge-cat{ background:rgba(214,179,106,0.1); color:#d6b36a; border:1px solid rgba(214,179,106,0.25); }
.badge-dest{ background:rgba(255,214,0,0.08); color:#ffd700; border:1px solid rgba(255,214,0,0.2); }
.badge-inativo{ background:rgba(100,100,100,0.1); color:#666; border:1px solid rgba(100,100,100,0.2); }
.badge-preco{ color:#aaa; font-size:.8rem; }
.produto-acoes{ display:flex; gap:8px; flex-shrink:0; flex-wrap:wrap; }
.edit-panel{
background:#0f0f0f; border:1px solid rgba(100,181,246,0.2);
border-radius:14px; padding:24px; margin-top:10px; display:none;
}
.edit-panel.open{ display:block; }
.form-card{ background:#111; border:1px solid rgba(214,179,106,0.13); border-radius:20px; padding:36px; }
.form-card-title{ font-size:1.1rem; font-weight:700; color:#d6b36a; margin-bottom:24px; padding-bottom:16px; border-bottom:1px solid rgba(255,255,255,0.06); }
.form-grid{ display:grid; grid-template-columns:1fr 1fr; gap:18px; }
.form-group{ display:flex; flex-direction:column; gap:7px; }
.form-group.full{ grid-column:1/-1; }
.form-label{ font-size:.83rem; font-weight:600; color:#ccc; }
.form-label span{ color:#666; font-weight:400; font-size:.78rem; }
.form-input,.form-select,.form-textarea{
padding:12px 15px; background:#1a1a1a; border:1px solid rgba(214,179,106,0.18);
border-radius:10px; color:white; font-family:'Poppins',sans-serif;
font-size:.88rem; outline:none; transition:.3s;
}
.form-input:focus,.form-select:focus,.form-textarea:focus{ border-color:#d6b36a; }
.form-select option{ background:#1a1a1a; }
.form-textarea{ resize:vertical; min-height:90px; }
.form-checkboxes{ display:flex; gap:22px; flex-wrap:wrap; }
.form-checkbox{ display:flex; align-items:center; gap:9px; cursor:pointer; font-size:.88rem; color:#bbb; }
.form-checkbox input{ width:16px; height:16px; accent-color:#d6b36a; cursor:pointer; }
.form-actions{ display:flex; justify-content:flex-end; gap:10px; margin-top:26px; padding-top:20px; border-top:1px solid rgba(255,255,255,0.05); }
.upload-row{ display:flex; gap:10px; align-items:center; }
.upload-row .form-input{ flex:1; }
.upload-hidden{ display:none; }
.upload-preview-img{
width:100%; max-height:140px; object-fit:cover;
border-radius:10px; margin-top:8px; display:none;
border:1px solid rgba(214,179,106,0.2);
}
.upload-preview-img.show{ display:block; }
.upload-bar{
height:4px; background:#1e1e1e; border-radius:999px;
margin-top:8px; overflow:hidden; display:none;
}
.upload-bar.show{ display:block; }
.upload-bar-fill{ height:100%; background:#d6b36a; border-radius:999px; width:0%; transition:width .3s; }
.upload-status{ font-size:.76rem; margin-top:5px; }
.upload-status.ok{ color:#81c784; }
.upload-status.err{ color:#e57373; }
.upload-status.loading{ color:#888; }
.loading{ text-align:center; padding:40px; color:#666; }
.spinner{ display:inline-block; width:22px; height:22px; border:2px solid rgba(214,179,106,0.15); border-top-color:#d6b36a; border-radius:50%; animation:spin .7s linear infinite; margin-bottom:10px; }
@keyframes spin{ to{ transform:rotate(360deg); } }
.empty{ text-align:center; padding:50px; color:#555; }
.empty-icon{ font-size:2.8rem; margin-bottom:12px; }
.modal-overlay{ position:fixed; inset:0; background:rgba(0,0,0,0.88); z-index:300; display:flex; align-items:center; justify-content:center; padding:20px; opacity:0; pointer-events:none; transition:.3s; }
.modal-overlay.show{ opacity:1; pointer-events:all; }
.modal{ background:#111; border:1px solid rgba(214,179,106,0.2); border-radius:20px; padding:34px; max-width:400px; width:100%; text-align:center; }
.modal h3{ font-size:1.2rem; margin-bottom:10px; }
.modal p{ color:#aaa; font-size:.88rem; line-height:1.7; margin-bottom:26px; }
.modal-actions{ display:flex; gap:10px; justify-content:center; }
.toast{ position:fixed; bottom:28px; right:28px; background:#1a1a1a; border:1px solid rgba(214,179,106,0.25); border-radius:14px; padding:14px 22px; font-size:.88rem; color:white; z-index:999; transform:translateY(80px); opacity:0; transition:.35s ease; max-width:300px; }
.toast.show{ transform:translateY(0); opacity:1; }
.toast.success{ border-color:#4caf50; color:#81c784; }
.toast.error{ border-color:#f44336; color:#e57373; }
@media(max-width:768px){
.header{ padding:14px 16px; }
.tabs-bar{ padding:0 16px; overflow-x:auto; }
.tab-btn{ padding:14px 16px; font-size:.82rem; white-space:nowrap; }
.form-grid{ grid-template-columns:1fr; }
.form-card{ padding:20px 16px; }
.produto-item{ flex-wrap:wrap; }
.produto-acoes{ width:100%; justify-content:flex-end; }
.upload-row{ flex-wrap:wrap; }
}
</style>
</head>
<body>
<div class="header">
<div class="header-logo">DiiH<span> Keys</span> · Admin</div>
<div class="header-right">
<div class="status-pill">
<div class="status-dot" id="statusDot"></div>
<span id="statusText">Desconectado</span>
</div>
<button class="btn-danger sm" id="btnLogout" style="display:none" onclick="logout()">Sair</button>
</div>
</div>
<div class="token-screen" id="tokenScreen">
<div class="token-card">
<h2>🔐 Acesso Admin</h2>
<p>Cole seu token do GitHub para acessar o painel da DiiH Keys.</p>
<input type="password" class="token-input" id="tokenInput" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"/>
<div class="token-warning">⚠️ Nunca compartilhe seu token. Ele da acesso ao seu repositorio.</div>
<button class="btn-gold full" id="btnEntrar" onclick="entrar()">Entrar</button>
</div>
</div>
<div class="main" id="mainPanel">
<div class="tabs-bar">
<button class="tab-btn active" onclick="mudarAba('dashboard')">📊 Dashboard</button>
<button class="tab-btn" onclick="mudarAba('produtos')">📦 Produtos</button>
<button class="tab-btn" onclick="mudarAba('adicionar')">➕ Adicionar</button>
</div>
<div class="tab-panel active" id="aba-dashboard">
<div class="stats">
<div class="stat-card"><div class="stat-number" id="statTotal">0</div><div class="stat-label">Total</div></div>
<div class="stat-card"><div class="stat-number" id="statAtivos">0</div><div class="stat-label">Ativos</div></div>
<div class="stat-card"><div class="stat-number" id="statDestaque">0</div><div class="stat-label">Destaque</div></div>
<div class="stat-card"><div class="stat-number" id="statCategorias">0</div><div class="stat-label">Categorias</div></div>
</div>
<div style="background:#111;border:1px solid rgba(214,179,106,0.1);border-radius:16px;padding:28px;">
<div style="font-size:1rem;font-weight:700;color:#d6b36a;margin-bottom:18px;">📋 Resumo por Categoria</div>
<div id="resumoCategorias" style="display:flex;flex-direction:column;gap:12px;"></div>
</div>
</div>
<div class="tab-panel" id="aba-produtos">
<div class="filtros" id="filtros"></div>
<div id="listaProdutos" class="produtos-lista">
<div class="loading"><div class="spinner"></div><div>Carregando...</div></div>
</div>
</div>
<div class="tab-panel" id="aba-adicionar">
<div class="form-card">
<div class="form-card-title">➕ Novo Produto</div>
<div class="form-grid">
<div class="form-group full">
<label class="form-label">Nome do Pack</label>
<input type="text" class="form-input" id="fNome" placeholder="Ex: Grand Worship Piano"/>
</div>
<div class="form-group">
<label class="form-label">Categoria</label>
<select class="form-select" id="fCategoria">
<option value="">Selecione...</option>
<option>Piano</option><option>Keyboard</option><option>Organ</option>
<option>Guitar</option><option>Strings</option><option>Brass</option><option>Synth</option>
</select>
</div>
<div class="form-group">
<label class="form-label">Preco</label>
<input type="text" class="form-input" id="fPreco" placeholder="Ex: R$ 49,90"/>
</div>
<div class="form-group full">
<label class="form-label">Tags <span>(separadas por virgula)</span></label>
<input type="text" class="form-input" id="fTags" placeholder="Ex: Grand Piano, Worship, Live"/>
</div>
<div class="form-group full">
<label class="form-label">Descricao</label>
<textarea class="form-textarea" id="fDescricao" placeholder="Descreva o pack..."></textarea>
</div>
<div class="form-group">
<label class="form-label">Imagem do Pack <span>(.jpg ou .png)</span></label>
<div class="upload-row">
<input type="text" class="form-input" id="fImagem" placeholder="nome-do-arquivo.jpg" readonly/>
<button class="btn-upload" onclick="document.getElementById('fileImagem').click()">📁 Escolher</button>
<input type="file" class="upload-hidden" id="fileImagem" accept="image/*" onchange="uploadArquivo(this,'imagem','f')"/>
</div>
<img class="upload-preview-img" id="previewImg"/>
<div class="upload-bar" id="barImagem"><div class="upload-bar-fill" id="fillImagem"></div></div>
<div class="upload-status" id="statusImagem"></div>
</div>
<div class="form-group">
<label class="form-label">Audio Demo <span>(.mp3)</span></label>
<div class="upload-row">
<input type="text" class="form-input" id="fAudio" placeholder="nome-do-arquivo.mp3" readonly/>
<button class="btn-upload" onclick="document.getElementById('fileAudio').click()">🎵 Escolher</button>
<input type="file" class="upload-hidden" id="fileAudio" accept="audio/mp3,audio/mpeg" onchange="uploadArquivo(this,'audio','f')"/>
</div>
<div class="upload-bar" id="barAudio"><div class="upload-bar-fill" id="fillAudio"></div></div>
<div class="upload-status" id="statusAudio"></div>
</div>
<div class="form-group full">
<label class="form-label">Link de Compra <span>(Kiwify, Gumroad, etc.)</span></label>
<input type="text" class="form-input" id="fLink" placeholder="https://pay.kiwify.com.br/..."/>
</div>
<div class="form-group full">
<label class="form-label">Opcoes</label>
<div class="form-checkboxes">
<label class="form-checkbox"><input type="checkbox" id="fDestaque" checked/> ⭐ Exibir na home</label>
<label class="form-checkbox"><input type="checkbox" id="fAtivo" checked/> ✅ Produto ativo</label>
</div>
</div>
</div>
<div class="form-actions">
<button class="btn-outline" onclick="limparForm()">Limpar</button>
<button class="btn-gold" id="btnSalvar" onclick="salvarProduto()">💾 Salvar Produto</button>
</div>
</div>
</div>
</div>
<div class="modal-overlay" id="modalOverlay">
<div class="modal">
<h3>Remover Produto</h3>
<p id="modalMsg"></p>
<div class="modal-actions">
<button class="btn-outline" onclick="fecharModal()">Cancelar</button>
<button class="btn-danger" id="btnConfirmarRemover">Remover</button>
</div>
</div>
</div>
<div class="toast" id="toast"></div>
<script>
var OWNER = 'rodrigo-diih';
var REPO = 'diih-keys';
var JSON_PATH = 'produtos.json';
var TOKEN = '';
var produtos = [];
var fileSha = '';
var indiceRemover = -1;
var filtroAtivo = 'Todos';

async function entrar(){
var t = document.getElementById('tokenInput').value.trim();
if(!t){ showToast('Cole seu token!','error'); return; }
TOKEN = t;
setBtnEntrar(true);
await carregarProdutos();
}
function logout(){
TOKEN=''; produtos=[]; fileSha='';
document.getElementById('tokenScreen').style.display='flex';
document.getElementById('mainPanel').classList.remove('visible');
document.getElementById('btnLogout').style.display='none';
document.getElementById('tokenInput').value='';
setBtnEntrar(false); setStatus(null);
}
function setBtnEntrar(loading){
var b=document.getElementById('btnEntrar');
b.disabled=loading; b.textContent=loading?'Conectando...':'Entrar';
}
function setStatus(ok,msg){
var dot=document.getElementById('statusDot'), text=document.getElementById('statusText');
dot.className='status-dot'+(ok===true?' on':ok===false?' err':'');
text.textContent=msg||(ok===true?'Conectado':ok===false?'Erro':'Desconectado');
}
function ghHeaders(){
return { 'Authorization':'token '+TOKEN, 'Accept':'application/vnd.github.v3+json' };
}
async function ghGet(path){
return fetch('https://api.github.com/repos/'+OWNER+'/'+REPO+'/contents/'+path,{ headers:ghHeaders() });
}
async function ghPut(path, b64content, sha, msg){
var body = { message:msg, content:b64content };
if(sha) body.sha = sha;
return fetch('https://api.github.com/repos/'+OWNER+'/'+REPO+'/contents/'+path,{
method:'PUT',
headers:Object.assign({'Content-Type':'application/json'}, ghHeaders()),
body: JSON.stringify(body)
});
}
async function carregarProdutos(){
try{
var r = await ghGet(JSON_PATH);
if(r.status===401){ showToast('Token invalido!','error'); setStatus(false); setBtnEntrar(false); return; }
if(!r.ok) throw new Error();
var data = await r.json();
fileSha = data.sha;
produtos = JSON.parse(decodeURIComponent(escape(atob(data.content))));
produtos = produtos.map(function(p){ return Object.assign({destaque:true,ativo:true},p); });
setStatus(true);
document.getElementById('tokenScreen').style.display='none';
document.getElementById('mainPanel').classList.add('visible');
document.getElementById('btnLogout').style.display='inline-block';
renderTudo();
}catch(e){
showToast('Erro ao conectar.','error'); setStatus(false); setBtnEntrar(false);
}
}
async function salvarJSON(msg){
var r = await ghPut(JSON_PATH, btoa(unescape(encodeURIComponent(JSON.stringify(produtos,null,2)))), fileSha, msg);
if(!r.ok) throw new Error();
var data = await r.json();
fileSha = data.content.sha;
}
async function uploadArquivo(input, tipo, prefixo){
var arquivo = input.files[0];
if(!arquivo) return;
var pasta = tipo==='imagem' ? 'assets/covers/' : 'assets/demos/';
var caminho = pasta + arquivo.name;
var inputId = prefixo==='f' ? (tipo==='imagem'?'fImagem':'fAudio') : ('e'+prefixo+'-'+(tipo==='imagem'?'img':'audio'));
var barId = prefixo==='f' ? (tipo==='imagem'?'barImagem':'barAudio') : ('ebar'+prefixo+'-'+tipo);
var fillId = prefixo==='f' ? (tipo==='imagem'?'fillImagem':'fillAudio') : ('efill'+prefixo+'-'+tipo);
var statusId= prefixo==='f' ? (tipo==='imagem'?'statusImagem':'statusAudio') : ('estatus'+prefixo+'-'+tipo);
if(tipo==='imagem' && prefixo==='f'){
var prev = document.getElementById('previewImg');
prev.src = URL.createObjectURL(arquivo);
prev.classList.add('show');
}
setUploadStatus(statusId, 'loading', '⏳ Enviando...');
setBar(barId, fillId, true, 30);
var b64 = await lerBase64(arquivo);
setBar(barId, fillId, true, 60);
var sha = null;
try{
var check = await ghGet(caminho);
if(check.ok){ var cd = await check.json(); sha = cd.sha; }
}catch(e){}
setBar(barId, fillId, true, 85);
try{
var r = await ghPut(caminho, b64, sha, 'Admin: upload de '+arquivo.name);
if(!r.ok) throw new Error();
setBar(barId, fillId, true, 100);
setUploadStatus(statusId, 'ok', '✅ '+arquivo.name+' enviado!');
document.getElementById(inputId).value = caminho;
setTimeout(function(){ setBar(barId, fillId, false, 0); }, 1500);
showToast(arquivo.name+' enviado com sucesso!','success');
}catch(e){
setBar(barId, fillId, false, 0);
setUploadStatus(statusId, 'err', '❌ Erro ao enviar. Tente novamente.');
showToast('Erro ao enviar arquivo.','error');
}
input.value='';
}
function lerBase64(arquivo){
return new Promise(function(resolve, reject){
var reader = new FileReader();
reader.onload = function(e){ resolve(e.target.result.split(',')[1]); };
reader.onerror = reject;
reader.readAsDataURL(arquivo);
});
}
function setBar(barId, fillId, show, pct){
var bar = document.getElementById(barId);
var fill = document.getElementById(fillId);
if(!bar||!fill) return;
bar.className = 'upload-bar'+(show?' show':'');
fill.style.width = pct+'%';
}
function setUploadStatus(id, tipo, msg){
var el = document.getElementById(id);
if(!el) return;
el.className = 'upload-status '+tipo;
el.textContent = msg;
}
function renderTudo(){ renderStats(); renderResumo(); renderFiltros(); renderLista(); }
function renderStats(){
document.getElementById('statTotal').textContent = produtos.length;
document.getElementById('statAtivos').textContent = produtos.filter(function(p){return p.ativo;}).length;
document.getElementById('statDestaque').textContent = produtos.filter(function(p){return p.destaque;}).length;
document.getElementById('statCategorias').textContent = new Set(produtos.map(function(p){return p.categoria;})).size;
}
function renderResumo(){
var cats={};
produtos.forEach(function(p){ cats[p.categoria]=(cats[p.categoria]||0)+1; });
var el=document.getElementById('resumoCategorias');
var keys=Object.keys(cats);
if(!keys.length){ el.innerHTML='<div style="color:#555">Nenhum produto ainda.</div>'; return; }
el.innerHTML=keys.map(function(cat){
var qtd=cats[cat];
return '<div style="display:flex;align-items:center;gap:12px;">'+
'<span style="min-width:110px;color:#d6b36a;font-size:.88rem;font-weight:600">'+esc(cat)+'</span>'+
'<div style="flex:1;height:6px;background:#1e1e1e;border-radius:999px;overflow:hidden">'+
'<div style="width:'+Math.min(100,(qtd/produtos.length)*100)+'%;height:100%;background:#d6b36a;border-radius:999px"></div>'+
'</div>'+
'<span style="color:#888;font-size:.82rem;min-width:24px;text-align:right">'+qtd+'</span>'+
'</div>';
}).join('');
}
function renderFiltros(){
var cats=['Todos'].concat(Array.from(new Set(produtos.map(function(p){return p.categoria;}))));
document.getElementById('filtros').innerHTML=cats.map(function(c){
return '<button class="filtro-btn'+(filtroAtivo===c?' active':'')+'" onclick="filtrar('+JSON.stringify(c)+',this)">'+esc(c)+'</button>';
}).join('');
}
function filtrar(cat,btn){
filtroAtivo=cat;
document.querySelectorAll('.filtro-btn').forEach(function(b){b.classList.remove('active');});
btn.classList.add('active');
renderLista();
}
function renderLista(){
var el=document.getElementById('listaProdutos');
var lista=filtroAtivo==='Todos'?produtos:produtos.filter(function(p){return p.categoria===filtroAtivo;});
if(!lista.length){
el.innerHTML='<div class="empty"><div class="empty-icon">🎹</div><div>Nenhum produto encontrado.</div></div>';
return;
}
el.innerHTML=lista.map(function(p){
var i=produtos.indexOf(p);
var cats=['Piano','Keyboard','Organ','Guitar','Strings','Brass','Synth'];
return '<div id="item-'+i+'">'+
'<div class="produto-item">'+
'<img class="produto-img" src="'+esc(p.imagem||'')+'" alt="'+esc(p.nome)+'" onerror="this.style.background=\\'#1e1e1e\\';this.removeAttribute(\\'src\\')"/>'+
'<div class="produto-info">'+
'<div class="produto-nome">'+esc(p.nome)+'</div>'+
'<div class="produto-meta">'+
'<span class="badge badge-cat">'+esc(p.categoria)+'</span>'+
'<span class="badge-preco">'+esc(p.preco||'—')+'</span>'+
(p.destaque?'<span class="badge badge-dest">⭐ Destaque</span>':'')+
(!p.ativo?'<span class="badge badge-inativo">Inativo</span>':'')+
'</div>'+
'</div>'+
'<div class="produto-acoes">'+
'<button class="btn-edit sm" onclick="toggleEdit('+i+')">✏️ Editar</button>'+
'<button class="btn-outline sm" onclick="toggleDestaque('+i+')">'+(p.destaque?'Remover destaque':'⭐ Destacar')+'</button>'+
'<button class="btn-outline sm" onclick="toggleAtivo('+i+')">'+(p.ativo?'Desativar':'Ativar')+'</button>'+
'<button class="btn-danger sm" onclick="confirmarRemover('+i+')">🗑 Remover</button>'+
'</div>'+
'</div>'+
'<div class="edit-panel" id="edit-'+i+'">'+
'<div style="font-size:.9rem;font-weight:700;color:#64b5f6;margin-bottom:16px;">✏️ Editando: '+esc(p.nome)+'</div>'+
'<div class="form-grid">'+
'<div class="form-group full"><label class="form-label">Nome</label><input type="text" class="form-input" id="e'+i+'-nome" value="'+esc(p.nome)+'"/></div>'+
'<div class="form-group"><label class="form-label">Categoria</label><select class="form-select" id="e'+i+'-cat">'+cats.map(function(c){return '<option'+(p.categoria===c?' selected':'')+'>'+c+'</option>';}).join('')+'</select></div>'+
'<div class="form-group"><label class="form-label">Preco</label><input type="text" class="form-input" id="e'+i+'-preco" value="'+esc(p.preco||'')+'"/></div>'+
'<div class="form-group full"><label class="form-label">Tags</label><input type="text" class="form-input" id="e'+i+'-tags" value="'+esc((p.tags||[]).join(', '))+'"/></div>'+
'<div class="form-group full"><label class="form-label">Descricao</label><textarea class="form-textarea" id="e'+i+'-desc">'+esc(p.descricao||'')+'</textarea></div>'+
'<div class="form-group">'+
'<label class="form-label">Imagem</label>'+
'<div class="upload-row">'+
'<input type="text" class="form-input" id="e'+i+'-img" value="'+esc(p.imagem||'')+'"/>'+
'<button class="btn-upload" onclick="document.getElementById(\\'efileimg'+i+'\\').click()">📁 Trocar</button>'+
'<input type="file" class="upload-hidden" id="efileimg'+i+'" accept="image/*" onchange="uploadArquivo(this,\\'imagem\\','+i+')"/>'+
'</div>'+
'<div class="upload-bar" id="ebar'+i+'-imagem"><div class="upload-bar-fill" id="efill'+i+'-imagem"></div></div>'+
'<div class="upload-status" id="estatus'+i+'-imagem"></div>'+
'</div>'+
'<div class="form-group">'+
'<label class="form-label">Audio</label>'+
'<div class="upload-row">'+
'<input type="text" class="form-input" id="e'+i+'-audio" value="'+esc(p.audio||'')+'"/>'+
'<button class="btn-upload" onclick="document.getElementById(\\'efileaudio'+i+'\\').click()">🎵 Trocar</button>'+
'<input type="file" class="upload-hidden" id="efileaudio'+i+'" accept="audio/mp3,audio/mpeg" onchange="uploadArquivo(this,\\'audio\\','+i+')"/>'+
'</div>'+
'<div class="upload-bar" id="ebar'+i+'-audio"><div class="upload-bar-fill" id="efill'+i+'-audio"></div></div>'+
'<div class="upload-status" id="estatus'+i+'-audio"></div>'+
'</div>'+
'<div class="form-group full"><label class="form-label">Link de Compra</label><input type="text" class="form-input" id="e'+i+'-link" value="'+esc(p.link||'')+'"/></div>'+
'<div class="form-group full"><div class="form-checkboxes">'+
'<label class="form-checkbox"><input type="checkbox" id="e'+i+'-dest"'+(p.destaque?' checked':'')+'/> ⭐ Destaque</label>'+
'<label class="form-checkbox"><input type="checkbox" id="e'+i+'-ativo"'+(p.ativo?' checked':'')+'/> ✅ Ativo</label>'+
'</div></div>'+
'</div>'+
'<div class="form-actions">'+
'<button class="btn-outline" onclick="toggleEdit('+i+')">Cancelar</button>'+
'<button class="btn-gold" onclick="salvarEdicao('+i+')">💾 Salvar Alteracoes</button>'+
'</div>'+
'</div>'+
'</div>';
}).join('');
}
function esc(str){ return String(str).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function toggleEdit(i){ document.getElementById('edit-'+i).classList.toggle('open'); }
async function salvarEdicao(i){
var nome=document.getElementById('e'+i+'-nome').value.trim();
if(!nome){ showToast('Nome nao pode ser vazio!','error'); return; }
var novoDestaque=document.getElementById('e'+i+'-dest').checked;
if(novoDestaque && produtos.filter(function(p,idx){return p.destaque&&idx!==i;}).length>=6){
showToast('Maximo 6 em destaque!','error'); return;
}
produtos[i]=Object.assign({},produtos[i],{
nome:nome,
categoria:document.getElementById('e'+i+'-cat').value,
preco:document.getElementById('e'+i+'-preco').value.trim(),
tags:document.getElementById('e'+i+'-tags').value.split(',').map(function(t){return t.trim();}).filter(Boolean),
descricao:document.getElementById('e'+i+'-desc').value.trim(),
imagem:document.getElementById('e'+i+'-img').value.trim(),
audio:document.getElementById('e'+i+'-audio').value.trim(),
link:document.getElementById('e'+i+'-link').value.trim(),
destaque:novoDestaque,
ativo:document.getElementById('e'+i+'-ativo').checked
});
try{ await salvarJSON('Admin: editou "'+nome+'"'); renderTudo(); showToast('"'+nome+'" atualizado!','success'); }
catch(e){ showToast('Erro ao salvar.','error'); }
}
async function toggleDestaque(i){
if(!produtos[i].destaque && produtos.filter(function(p){return p.destaque;}).length>=6){
showToast('Maximo 6 em destaque!','error'); return;
}
produtos[i].destaque=!produtos[i].destaque;
try{ await salvarJSON('Admin: destaque "'+produtos[i].nome+'"'); renderTudo(); showToast('Salvo!','success'); }
catch(e){ showToast('Erro ao salvar.','error'); }
}
async function toggleAtivo(i){
produtos[i].ativo=!produtos[i].ativo;
try{ await salvarJSON('Admin: '+(produtos[i].ativo?'ativou':'desativou')+' "'+produtos[i].nome+'"'); renderTudo(); showToast('Salvo!','success'); }
catch(e){ showToast('Erro ao salvar.','error'); }
}
function confirmarRemover(i){
indiceRemover=i;
document.getElementById('modalMsg').textContent='Tem certeza que deseja remover "'+produtos[i].nome+'"? Esta acao nao pode ser desfeita.';
document.getElementById('btnConfirmarRemover').onclick=removerProduto;
document.getElementById('modalOverlay').classList.add('show');
}
function fecharModal(){ document.getElementById('modalOverlay').classList.remove('show'); indiceRemover=-1; }
async function removerProduto(){
fecharModal();
var nome=produtos[indiceRemover].nome;
produtos.splice(indiceRemover,1);
try{ await salvarJSON('Admin: removeu "'+nome+'"'); renderTudo(); showToast('"'+nome+'" removido!','success'); }
catch(e){ showToast('Erro ao remover.','error'); }
}
async function salvarProduto(){
var nome=document.getElementById('fNome').value.trim();
var categoria=document.getElementById('fCategoria').value;
if(!nome||!categoria){ showToast('Preencha nome e categoria!','error'); return; }
var destaque=document.getElementById('fDestaque').checked;
if(destaque && produtos.filter(function(p){return p.destaque;}).length>=6){ showToast('Maximo 6 em destaque!','error'); return; }
var novo={
nome:nome, categoria:categoria,
tags:document.getElementById('fTags').value.split(',').map(function(t){return t.trim();}).filter(Boolean),
descricao:document.getElementById('fDescricao').value.trim(),
preco:document.getElementById('fPreco').value.trim(),
imagem:document.getElementById('fImagem').value.trim(),
audio:document.getElementById('fAudio').value.trim(),
link:document.getElementById('fLink').value.trim()||'#',
destaque:destaque,
ativo:document.getElementById('fAtivo').checked
};
produtos.push(novo);
var btn=document.getElementById('btnSalvar');
btn.disabled=true; btn.textContent='Salvando...';
try{
await salvarJSON('Admin: adicionou "'+nome+'"');
renderTudo(); limparForm(); mudarAba('produtos');
showToast('"'+nome+'" adicionado!','success');
}catch(e){ produtos.pop(); showToast('Erro ao salvar.','error'); }
btn.disabled=false; btn.textContent='💾 Salvar Produto';
}
function limparForm(){
['fNome','fCategoria','fPreco','fTags','fDescricao','fImagem','fAudio','fLink'].forEach(function(id){ document.getElementById(id).value=''; });
document.getElementById('fDestaque').checked=true;
document.getElementById('fAtivo').checked=true;
document.getElementById('previewImg').classList.remove('show');
document.getElementById('statusImagem').textContent='';
document.getElementById('statusAudio').textContent='';
setBar('barImagem','fillImagem',false,0);
setBar('barAudio','fillAudio',false,0);
}
function mudarAba(id){
var ids=['dashboard','produtos','adicionar'];
document.querySelectorAll('.tab-btn').forEach(function(b,i){ b.classList.toggle('active',ids[i]===id); });
document.querySelectorAll('.tab-panel').forEach(function(p){ p.classList.remove('active'); });
document.getElementById('aba-'+id).classList.add('active');
}
function showToast(msg,type){
var t=document.getElementById('toast');
t.textContent=msg; t.className='toast '+(type||'')+' show';
setTimeout(function(){ t.classList.remove('show'); },3500);
}
document.getElementById('modalOverlay').addEventListener('click',function(e){ if(e.target===e.currentTarget) fecharModal(); });
document.getElementById('tokenInput').addEventListener('keydown',function(e){ if(e.key==='Enter') entrar(); });
</script>
</body>
</html>`;
