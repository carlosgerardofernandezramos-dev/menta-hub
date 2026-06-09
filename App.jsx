import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const SUPABASE_URL = "https://figajocruhwgeggwqvbr.supabase.co";
const SUPABASE_KEY = "sb_publishable_LnnsUkTPfBtsB48E-NQPAw_K4GzyjVs";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);



const C = {
  bg:"#0D0D0D", sidebar:"#111111", card:"#161616", border:"#252525",
  accent:"#2ECC8F", accentBg:"#0f3d2a", text:"#FFFFFF", textSec:"#888888", textTer:"#444444",
  danger:"#E63946", dangerBg:"#2d1215", warning:"#F59E0B", warningBg:"#2d2008",
  info:"#3B82F6", infoBg:"#0f1f3d",
};

const PIE_COLORS = ["#2ECC8F","#3B82F6","#F59E0B"];
const typeColor = (t) => ({ "Reel":{bg:"#2d1215",color:"#E63946"}, "Carrusel":{bg:"#0f1f3d",color:"#3B82F6"}, "Historia":{bg:"#2d2008",color:"#F59E0B"}, "Post":{bg:"#0f3d2a",color:"#2ECC8F"} }[t]||{bg:"#1a1a1a",color:"#888"});
const statusColor = (s) => ({ "listo":{bg:"#0f3d2a",color:"#2ECC8F"}, "en progreso":{bg:"#2d2008",color:"#F59E0B"}, "pendiente":{bg:"#1a1a1a",color:"#555"} }[s]||{bg:"#1a1a1a",color:"#555"});
const tempColor = (t) => ({ "caliente":{bg:"#2d1215",color:"#E63946"}, "tibio":{bg:"#2d2008",color:"#F59E0B"}, "frio":{bg:"#1a1a2a",color:"#3B82F6"} }[t]||{bg:"#1a1a1a",color:"#888"});
const priorityColor = (p) => ({"alta":"#E63946","media":"#F59E0B","baja":"#2ECC8F"}[p]||"#555");

const s = {
  app:{display:"flex",height:"100vh",background:C.bg,color:C.text,fontFamily:"system-ui,-apple-system,sans-serif",overflow:"hidden"},
  sidebar:{width:220,background:C.sidebar,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",flexShrink:0},
  navItem:(a)=>({display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:a?500:400,color:a?C.accent:C.textSec,background:a?C.accentBg:"transparent",marginBottom:2,border:a?`1px solid ${C.accent}22`:"1px solid transparent"}),
  main:{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"},
  topbar:{padding:"16px 24px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:C.sidebar},
  content:{flex:1,overflowY:"auto",padding:24},
  grid4:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20},
  grid2:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16},
  card:{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 18px"},
  metricCard:{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 16px"},
  cardTitle:{fontSize:13,fontWeight:600,color:C.text,marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"},
  tag:(bg,color)=>({fontSize:10,padding:"2px 8px",borderRadius:6,background:bg,color:color,fontWeight:500,whiteSpace:"nowrap"}),
  row:{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${C.border}`,fontSize:13},
  input:{width:"100%",background:"#111",border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",boxSizing:"border-box"},
  btn:(v="primary")=>({padding:"11px 20px",borderRadius:8,border:"none",cursor:"pointer",fontSize:14,fontWeight:600,background:v==="primary"?C.accent:C.card,color:v==="primary"?"#000":C.text,width:"100%"}),
  loginWrap:{display:"flex",height:"100vh",alignItems:"center",justifyContent:"center",background:C.bg},
  loginCard:{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:36,width:380},
  avatar:(size=32)=>({width:size,height:size,borderRadius:"50%",background:C.accentBg,border:`1px solid ${C.accent}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size/3,fontWeight:700,color:C.accent,flexShrink:0}),
  th:{textAlign:"left",fontSize:11,color:C.textSec,padding:"8px 12px",borderBottom:`1px solid ${C.border}`,fontWeight:500,textTransform:"uppercase",letterSpacing:0.5},
  td:{padding:"10px 12px",borderBottom:`1px solid ${C.border}`,color:C.text,verticalAlign:"middle"},
  kanbanCol:{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:14,minHeight:200},
  leadCard:{background:"#1a1a1a",border:`1px solid ${C.border}`,borderRadius:8,padding:12,marginBottom:8},
};

// ─── LOGIN ────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email,setEmail]=useState(""); const [pass,setPass]=useState("");
  const [err,setErr]=useState(""); const [loading,setLoading]=useState(false);
  const handleLogin = async () => {
    setLoading(true); setErr("");
    const {data,error} = await supabase.auth.signInWithPassword({email,password:pass});
    if(error){setErr("Correo o contraseña incorrectos");setLoading(false);return;}
    const {data:profile} = await supabase.from("profiles").select("*").eq("id",data.user.id).single();
    onLogin({...data.user,...profile});
    setLoading(false);
  };
  return (
    <div style={s.loginWrap}>
      <div style={s.loginCard}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:40,lineHeight:1,marginBottom:4}}>🌿</div>
          <div style={{fontSize:22,fontWeight:800,color:C.accent,letterSpacing:-0.5}}>Menta Hub</div>
          <div style={{fontSize:13,color:C.textSec,marginTop:4}}>Panel de gestión para clientes</div>
        </div>
        <div style={{marginBottom:16}}>
          <label style={{fontSize:12,color:C.textSec,marginBottom:6,display:"block"}}>Correo electrónico</label>
          <input style={s.input} value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@correo.com" />
        </div>
        <div style={{marginBottom:16}}>
          <label style={{fontSize:12,color:C.textSec,marginBottom:6,display:"block"}}>Contraseña</label>
          <input style={s.input} type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
        </div>
        {err && <div style={{fontSize:12,color:C.danger,marginBottom:12,background:C.dangerBg,padding:"8px 12px",borderRadius:8}}>{err}</div>}
        <button style={s.btn("primary")} onClick={handleLogin} disabled={loading}>{loading?"Ingresando...":"Ingresar"}</button>
      </div>
    </div>
  );
}

// ─── CAMBIO DE CONTRASEÑA (primer ingreso) ────────────────
function ChangePassword({ user, onDone }) {
  const [pass,setPass]=useState(""); const [confirm,setConfirm]=useState("");
  const [err,setErr]=useState(""); const [loading,setLoading]=useState(false);
  const handleChange = async () => {
    if(pass.length < 8){setErr("Mínimo 8 caracteres");return;}
    if(pass!==confirm){setErr("Las contraseñas no coinciden");return;}
    setLoading(true);
    const {error} = await supabase.auth.updateUser({password:pass});
    if(error){setErr("Error al cambiar contraseña");setLoading(false);return;}
    await supabase.from("profiles").update({password_changed:true}).eq("id",user.id);
    onDone();
    setLoading(false);
  };
  return (
    <div style={s.loginWrap}>
      <div style={s.loginCard}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:32,lineHeight:1,marginBottom:4}}>🌿</div>
          <div style={{fontSize:18,fontWeight:700,color:C.text}}>Bienvenido, {user.name} 👋</div>
          <div style={{fontSize:13,color:C.textSec,marginTop:6}}>Por seguridad, crea tu propia contraseña para continuar.</div>
        </div>
        <div style={{marginBottom:14}}>
          <label style={{fontSize:12,color:C.textSec,marginBottom:6,display:"block"}}>Nueva contraseña</label>
          <input style={s.input} type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Mínimo 8 caracteres" />
        </div>
        <div style={{marginBottom:16}}>
          <label style={{fontSize:12,color:C.textSec,marginBottom:6,display:"block"}}>Confirmar contraseña</label>
          <input style={s.input} type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Repite la contraseña" onKeyDown={e=>e.key==="Enter"&&handleChange()} />
        </div>
        {err && <div style={{fontSize:12,color:C.danger,marginBottom:12,background:C.dangerBg,padding:"8px 12px",borderRadius:8}}>{err}</div>}
        <button style={s.btn("primary")} onClick={handleChange} disabled={loading}>{loading?"Guardando...":"Crear mi contraseña"}</button>
        <div style={{fontSize:11,color:C.textTer,textAlign:"center",marginTop:12}}>Solo tú tendrás acceso a tu cuenta.</div>
      </div>
    </div>
  );
}

// ─── ADMIN HOME — lista de clientes ──────────────────────
function AdminHome({ admin, onSelectClient, onLogout }) {
  const [clients,setClients]=useState([]); const [loading,setLoading]=useState(true);
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({email:"",password:"",name:"",company:""});
  const [saving,setSaving]=useState(false);

  useEffect(()=>{
    supabase.from("profiles").select("*").eq("is_admin",false).order("created_at").then(({data})=>{
      setClients(data||[]); setLoading(false);
    });
  },[]);

  const createClient = async () => {
    setSaving(true);
    const {data,error} = await supabase.auth.admin?.createUser({
      email:form.email, password:form.password,
      user_metadata:{name:form.name, company:form.company},
      email_confirm:true
    });
    if(error){ alert("Error: "+error.message); setSaving(false); return; }
    setTimeout(async()=>{
      const {data:profiles} = await supabase.from("profiles").select("*").eq("is_admin",false).order("created_at");
      setClients(profiles||[]);
    },1000);
    setShowForm(false); setForm({email:"",password:"",name:"",company:""}); setSaving(false);
  };

  return (
    <div style={{...s.app,flexDirection:"column"}}>
      <div style={{background:C.sidebar,borderBottom:`1px solid ${C.border}`,padding:"16px 32px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{fontSize:22,lineHeight:1}}>🌿</div>
          <div>
            <div style={{fontSize:16,fontWeight:700,color:C.accent}}>Menta Hub — Admin</div>
            <div style={{fontSize:12,color:C.textSec}}>Panel de gestión de clientes</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <button onClick={()=>setShowForm(!showForm)} style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${C.accent}`,background:C.accentBg,color:C.accent,fontSize:13,cursor:"pointer",fontWeight:600}}>+ Nuevo cliente</button>
          <div style={{fontSize:12,color:C.textSec}}>Hola, {admin.name}</div>
          <div onClick={onLogout} style={{fontSize:12,color:C.textSec,cursor:"pointer"}}>Salir →</div>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:32}}>
        {showForm && (
          <div style={{...s.card,marginBottom:24}}>
            <div style={{fontSize:14,fontWeight:600,marginBottom:16}}>Crear nuevo cliente</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:12}}>
              {[
                {label:"Nombre",key:"name",placeholder:"Nombre del contacto"},
                {label:"Empresa",key:"company",placeholder:"Nombre de la empresa"},
                {label:"Email",key:"email",placeholder:"correo@empresa.com"},
                {label:"Contraseña temporal",key:"password",placeholder:"min. 8 caracteres"},
              ].map(f=>(
                <div key={f.key}>
                  <label style={{fontSize:11,color:C.textSec,display:"block",marginBottom:4}}>{f.label}</label>
                  <input style={{...s.input,padding:"8px 10px"}} type={f.key==="password"?"password":"text"} value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder} />
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={createClient} disabled={saving||!form.email||!form.name} style={{padding:"8px 20px",borderRadius:8,border:"none",background:C.accent,color:"#000",fontSize:13,fontWeight:600,cursor:"pointer"}}>{saving?"Creando...":"Crear cliente"}</button>
              <button onClick={()=>setShowForm(false)} style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:C.textSec,fontSize:13,cursor:"pointer"}}>Cancelar</button>
            </div>
            <div style={{fontSize:11,color:C.textSec,marginTop:10,padding:"8px 12px",background:"#1a1a1a",borderRadius:8}}>
              ⚠️ La creación de usuarios desde el cliente requiere la <strong>Secret Key</strong>. Para crear usuarios ve a <strong>Supabase → Authentication → Users → Add user</strong> y usa los datos ingresados arriba.
            </div>
          </div>
        )}

        <div style={{fontSize:13,color:C.textSec,marginBottom:16}}>
          {clients.length} cliente{clients.length!==1?"s":""} activo{clients.length!==1?"s":""}
        </div>

        {loading ? (
          <div style={{color:C.textSec,fontSize:13}}>Cargando clientes...</div>
        ) : clients.length===0 ? (
          <div style={{...s.card,textAlign:"center",padding:48}}>
            <div style={{fontSize:32,marginBottom:12}}>👥</div>
            <div style={{fontSize:15,fontWeight:600,marginBottom:8}}>Sin clientes aún</div>
            <div style={{fontSize:13,color:C.textSec}}>Crea el primer cliente con el botón "Nuevo cliente"</div>
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
            {clients.map(c=>(
              <div key={c.id} onClick={()=>onSelectClient(c)} style={{...s.card,cursor:"pointer",transition:"border-color 0.15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                  <div style={s.avatar(40)}>{c.name?.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
                  <div>
                    <div style={{fontSize:14,fontWeight:600}}>{c.name}</div>
                    <div style={{fontSize:12,color:C.textSec}}>{c.company}</div>
                  </div>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:11,color:C.textSec}}>Creado {new Date(c.created_at).toLocaleDateString("es-PE")}</span>
                  <span style={{fontSize:12,color:C.accent,fontWeight:600}}>Entrar →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────
function Dashboard({ setView, contenido, leads, tareas }) {
  const done = contenido.filter(c=>c.status==="listo").length;
  const hotLeads = leads.filter(l=>l.temp==="caliente").length;
  const pending = tareas.filter(t=>!t.done).length;
  const leadsChart = [{sem:"Sem 1",leads:Math.max(1,leads.length-4)},{sem:"Sem 2",leads:Math.max(2,leads.length-2)},{sem:"Sem 3",leads:Math.max(1,leads.length-3)},{sem:"Sem 4",leads:leads.length}];

  return (
    <div>
      <div style={s.grid4}>
        {[
          {label:"Contenidos este mes",value:contenido.length,sub:`${done} listos`,sc:C.accent},
          {label:"Leads recibidos",value:leads.length,sub:"Total acumulado",sc:C.accent},
          {label:"Leads calientes",value:hotLeads,sub:"Requieren seguimiento",sc:C.danger},
          {label:"Tareas pendientes",value:pending,sub:"Sin completar",sc:C.warning},
        ].map(m=>(
          <div key={m.label} style={s.metricCard}>
            <div style={{fontSize:11,color:C.textSec,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>{m.label}</div>
            <div style={{fontSize:28,fontWeight:700,lineHeight:1}}>{m.value}</div>
            <div style={{fontSize:11,marginTop:6,color:m.sc}}>{m.sub}</div>
          </div>
        ))}
      </div>
      <div style={s.grid2}>
        <div style={s.card}>
          <div style={s.cardTitle}>Plan de contenido <span style={{fontSize:11,color:C.accent,cursor:"pointer"}} onClick={()=>setView("contenido")}>Ver todo →</span></div>
          {contenido.slice(0,5).map(c=>{
            const tc=typeColor(c.type); const sc=statusColor(c.status);
            return (
              <div key={c.id} style={{...s.row,fontSize:12}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:sc.color,flexShrink:0}}></div>
                <span style={s.tag(tc.bg,tc.color)}>{c.type}</span>
                <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.title}</span>
                <span style={{color:C.textSec,fontSize:11}}>{c.date}</span>
              </div>
            );
          })}
          {contenido.length===0 && <div style={{color:C.textSec,fontSize:12,padding:"12px 0"}}>Sin contenido cargado aún.</div>}
        </div>
        <div style={s.card}>
          <div style={s.cardTitle}>Últimos leads <span style={{fontSize:11,color:C.accent,cursor:"pointer"}} onClick={()=>setView("leads")}>Ver CRM →</span></div>
          {leads.slice(0,4).map(l=>{
            const tc=tempColor(l.temp);
            return (
              <div key={l.id} style={s.row}>
                <div style={s.avatar(28)}>{l.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:500}}>{l.name}</div>
                  <div style={{fontSize:11,color:C.textSec}}>{l.source}</div>
                </div>
                <span style={s.tag(tc.bg,tc.color)}>{l.temp}</span>
              </div>
            );
          })}
          {leads.length===0 && <div style={{color:C.textSec,fontSize:12,padding:"12px 0"}}>Sin leads registrados aún.</div>}
        </div>
      </div>
      <div style={s.grid2}>
        <div style={s.card}>
          <div style={s.cardTitle}>Leads recientes</div>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={leadsChart}>
              <XAxis dataKey="sem" tick={{fill:C.textSec,fontSize:11}} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:12}} />
              <Line type="monotone" dataKey="leads" stroke={C.accent} strokeWidth={2} dot={{fill:C.accent,r:3}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={s.card}>
          <div style={s.cardTitle}>Tareas pendientes <span style={{fontSize:11,color:C.accent,cursor:"pointer"}} onClick={()=>setView("tareas")}>Ver todas →</span></div>
          {tareas.filter(t=>!t.done).slice(0,4).map(t=>(
            <div key={t.id} style={{...s.row,fontSize:12}}>
              <div style={{width:8,height:8,borderRadius:2,background:priorityColor(t.priority),flexShrink:0}}></div>
              <span style={{flex:1}}>{t.title}</span>
              <span style={{fontSize:11,color:t.due==="Hoy"?C.danger:C.textSec}}>{t.due}</span>
            </div>
          ))}
          {tareas.filter(t=>!t.done).length===0 && <div style={{color:C.accent,fontSize:12,padding:"12px 0"}}>¡Sin tareas pendientes! 🎉</div>}
        </div>
      </div>
    </div>
  );
}

// ─── CONTENIDO ────────────────────────────────────────────
function Contenido({ clientId, contenido, setContenido }) {
  const [filter,setFilter]=useState("todos");
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({type:"Reel",title:"",date:"",status:"pendiente",red:"Instagram"});
  const [saving,setSaving]=useState(false);
  const filtered = filter==="todos" ? contenido : contenido.filter(c=>c.type===filter);
  const save = async () => {
    setSaving(true);
    const {data,error} = await supabase.from("contenido").insert({...form,client_id:clientId}).select().single();
    if(!error){setContenido(prev=>[...prev,data]);setShowForm(false);setForm({type:"Reel",title:"",date:"",status:"pendiente",red:"Instagram"});}
    setSaving(false);
  };
  const updateStatus = async (id,status) => {
    await supabase.from("contenido").update({status}).eq("id",id);
    setContenido(prev=>prev.map(c=>c.id===id?{...c,status}:c));
  };
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {["todos","Reel","Carrusel","Post","Historia"].map(t=>{
            const a=filter===t;
            return <button key={t} onClick={()=>setFilter(t)} style={{padding:"6px 14px",borderRadius:8,border:`1px solid ${a?C.accent:C.border}`,background:a?C.accentBg:C.card,color:a?C.accent:C.textSec,fontSize:12,cursor:"pointer",fontWeight:a?600:400}}>{t}</button>;
          })}
        </div>
        <button onClick={()=>setShowForm(!showForm)} style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${C.accent}`,background:C.accentBg,color:C.accent,fontSize:12,cursor:"pointer",fontWeight:600}}>+ Agregar</button>
      </div>
      {showForm && (
        <div style={{...s.card,marginBottom:16}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:12}}>
            {[{label:"Tipo",key:"type",opts:["Reel","Carrusel","Post","Historia"]},{label:"Red",key:"red",opts:["Instagram","TikTok","Threads"]},{label:"Estado",key:"status",opts:["pendiente","en progreso","listo"]}].map(f=>(
              <div key={f.key}>
                <label style={{fontSize:11,color:C.textSec,display:"block",marginBottom:4}}>{f.label}</label>
                <select value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} style={{...s.input,padding:"8px 10px"}}>
                  {f.opts.map(o=><option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div>
              <label style={{fontSize:11,color:C.textSec,display:"block",marginBottom:4}}>Fecha</label>
              <input style={{...s.input,padding:"8px 10px"}} value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} placeholder="ej: 15/06" />
            </div>
            <div>
              <label style={{fontSize:11,color:C.textSec,display:"block",marginBottom:4}}>Título</label>
              <input style={{...s.input,padding:"8px 10px"}} value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="Título del contenido" />
            </div>
          </div>
          <button onClick={save} disabled={saving||!form.title} style={{padding:"8px 20px",borderRadius:8,border:"none",background:C.accent,color:"#000",fontSize:13,fontWeight:600,cursor:"pointer"}}>{saving?"Guardando...":"Guardar"}</button>
        </div>
      )}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr>{["Tipo","Título","Red","Fecha","Estado"].map(h=><th key={h} style={s.th}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(c=>{
              const tc=typeColor(c.type); const sc=statusColor(c.status);
              return (
                <tr key={c.id}>
                  <td style={s.td}><span style={s.tag(tc.bg,tc.color)}>{c.type}</span></td>
                  <td style={{...s.td,fontWeight:500}}>{c.title}</td>
                  <td style={{...s.td,color:C.textSec}}>{c.red}</td>
                  <td style={{...s.td,color:C.textSec}}>{c.date}</td>
                  <td style={s.td}>
                    <select value={c.status} onChange={e=>updateStatus(c.id,e.target.value)} style={{background:sc.bg,color:sc.color,border:"none",borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:500,cursor:"pointer"}}>
                      {["pendiente","en progreso","listo"].map(o=><option key={o} value={o}>{o}</option>)}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length===0 && <div style={{padding:24,color:C.textSec,fontSize:13,textAlign:"center"}}>Sin contenido. Usa "+ Agregar" para crear el primero.</div>}
      </div>
    </div>
  );
}

// ─── LEADS ────────────────────────────────────────────────
function Leads({ clientId, leads, setLeads }) {
  const cols = ["nuevo","contactado","propuesta","cerrado"];
  const colLabels = {nuevo:"Nuevo",contactado:"Contactado",propuesta:"Propuesta enviada",cerrado:"Cerrado"};
  const colColors = {nuevo:C.info,contactado:C.warning,propuesta:C.accent,cerrado:C.textSec};
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({name:"",email:"",source:"Instagram",temp:"caliente",value:"",status:"nuevo"});
  const [saving,setSaving]=useState(false);
  const save = async () => {
    setSaving(true);
    const {data,error} = await supabase.from("leads").insert({...form,client_id:clientId}).select().single();
    if(!error){setLeads(prev=>[...prev,data]);setShowForm(false);setForm({name:"",email:"",source:"Instagram",temp:"caliente",value:"",status:"nuevo"});}
    setSaving(false);
  };
  const moveStatus = async (id,status) => {
    await supabase.from("leads").update({status}).eq("id",id);
    setLeads(prev=>prev.map(l=>l.id===id?{...l,status}:l));
  };
  return (
    <div>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:16}}>
        <button onClick={()=>setShowForm(!showForm)} style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${C.accent}`,background:C.accentBg,color:C.accent,fontSize:12,cursor:"pointer",fontWeight:600}}>+ Nuevo lead</button>
      </div>
      {showForm && (
        <div style={{...s.card,marginBottom:16}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:12}}>
            {[{label:"Nombre",key:"name",type:"text",ph:"Nombre completo"},{label:"Email",key:"email",type:"email",ph:"email@correo.com"},{label:"Valor estimado",key:"value",type:"text",ph:"S/399"}].map(f=>(
              <div key={f.key}>
                <label style={{fontSize:11,color:C.textSec,display:"block",marginBottom:4}}>{f.label}</label>
                <input style={{...s.input,padding:"8px 10px"}} type={f.type} value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph} />
              </div>
            ))}
            {[{label:"Fuente",key:"source",opts:["Instagram","Meta Ads","WhatsApp","Referido"]},{label:"Temperatura",key:"temp",opts:["caliente","tibio","frio"]},{label:"Estado",key:"status",opts:["nuevo","contactado","propuesta","cerrado"]}].map(f=>(
              <div key={f.key}>
                <label style={{fontSize:11,color:C.textSec,display:"block",marginBottom:4}}>{f.label}</label>
                <select value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} style={{...s.input,padding:"8px 10px"}}>
                  {f.opts.map(o=><option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          <button onClick={save} disabled={saving||!form.name} style={{padding:"8px 20px",borderRadius:8,border:"none",background:C.accent,color:"#000",fontSize:13,fontWeight:600,cursor:"pointer"}}>{saving?"Guardando...":"Guardar lead"}</button>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {cols.map(col=>{
          const colLeads=leads.filter(l=>l.status===col);
          return (
            <div key={col} style={s.kanbanCol}>
              <div style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:1,marginBottom:12,display:"flex",justifyContent:"space-between",color:colColors[col]}}>
                {colLabels[col]}
                <span style={{background:C.border,borderRadius:10,padding:"1px 7px",color:C.textSec,fontSize:11,fontWeight:400}}>{colLeads.length}</span>
              </div>
              {colLeads.map(l=>{
                const tc=tempColor(l.temp);
                return (
                  <div key={l.id} style={s.leadCard}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                      <div style={s.avatar(26)}>{l.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
                      <div>
                        <div style={{fontSize:12,fontWeight:600}}>{l.name}</div>
                        <div style={{fontSize:11,color:C.textSec}}>{l.source}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <span style={s.tag(tc.bg,tc.color)}>{l.temp}</span>
                      {l.value&&<span style={{fontSize:11,color:C.accent,fontWeight:600}}>{l.value}</span>}
                    </div>
                    <select value={l.status} onChange={e=>moveStatus(l.id,e.target.value)} style={{width:"100%",background:"#111",border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 8px",fontSize:11,color:C.textSec,cursor:"pointer"}}>
                      {cols.map(c=><option key={c} value={c}>{colLabels[c]}</option>)}
                    </select>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── TAREAS ───────────────────────────────────────────────
function Tareas({ clientId, tareas, setTareas }) {
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({title:"",priority:"media",due:""});
  const [saving,setSaving]=useState(false);
  const toggle = async (id,done) => {
    await supabase.from("tareas").update({done:!done}).eq("id",id);
    setTareas(prev=>prev.map(t=>t.id===id?{...t,done:!done}:t));
  };
  const save = async () => {
    setSaving(true);
    const {data,error} = await supabase.from("tareas").insert({...form,client_id:clientId}).select().single();
    if(!error){setTareas(prev=>[...prev,data]);setShowForm(false);setForm({title:"",priority:"media",due:""});}
    setSaving(false);
  };
  return (
    <div style={{maxWidth:700}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{display:"flex",gap:12}}>
          {["alta","media","baja"].map(p=>(
            <div key={p} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:C.textSec}}>
              <div style={{width:8,height:8,borderRadius:2,background:priorityColor(p)}}></div>{p}
            </div>
          ))}
        </div>
        <button onClick={()=>setShowForm(!showForm)} style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${C.accent}`,background:C.accentBg,color:C.accent,fontSize:12,cursor:"pointer",fontWeight:600}}>+ Nueva tarea</button>
      </div>
      {showForm && (
        <div style={{...s.card,marginBottom:16,display:"flex",gap:10,alignItems:"flex-end"}}>
          <div style={{flex:2}}>
            <label style={{fontSize:11,color:C.textSec,display:"block",marginBottom:4}}>Tarea</label>
            <input style={{...s.input,padding:"8px 10px"}} value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="Descripción de la tarea" />
          </div>
          <div style={{flex:1}}>
            <label style={{fontSize:11,color:C.textSec,display:"block",marginBottom:4}}>Prioridad</label>
            <select value={form.priority} onChange={e=>setForm(p=>({...p,priority:e.target.value}))} style={{...s.input,padding:"8px 10px"}}>
              {["alta","media","baja"].map(o=><option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div style={{flex:1}}>
            <label style={{fontSize:11,color:C.textSec,display:"block",marginBottom:4}}>Vence</label>
            <input style={{...s.input,padding:"8px 10px"}} value={form.due} onChange={e=>setForm(p=>({...p,due:e.target.value}))} placeholder="Hoy, Mié 11..." />
          </div>
          <button onClick={save} disabled={saving||!form.title} style={{padding:"9px 16px",borderRadius:8,border:"none",background:C.accent,color:"#000",fontSize:13,fontWeight:600,cursor:"pointer",flexShrink:0}}>{saving?"...":"Guardar"}</button>
        </div>
      )}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
        {tareas.map((t,i)=>(
          <div key={t.id} onClick={()=>toggle(t.id,t.done)} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",borderBottom:i<tareas.length-1?`1px solid ${C.border}`:"none",cursor:"pointer"}}>
            <div style={{width:18,height:18,borderRadius:5,border:`1.5px solid ${t.done?C.accent:C.border}`,background:t.done?C.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              {t.done&&<span style={{color:"#000",fontSize:11,fontWeight:800}}>✓</span>}
            </div>
            <div style={{width:6,height:6,borderRadius:2,background:priorityColor(t.priority),flexShrink:0}}></div>
            <span style={{flex:1,fontSize:13,color:t.done?C.textTer:C.text,textDecoration:t.done?"line-through":"none"}}>{t.title}</span>
            <span style={{fontSize:11,color:t.due==="Hoy"&&!t.done?C.danger:C.textSec}}>{t.due}</span>
          </div>
        ))}
        {tareas.length===0 && <div style={{padding:24,color:C.textSec,fontSize:13,textAlign:"center"}}>Sin tareas. Usa "+ Nueva tarea" para agregar.</div>}
      </div>
    </div>
  );
}

// ─── REPORTES ─────────────────────────────────────────────
function Reportes({ leads, contenido }) {
  const sourceCount = leads.reduce((acc,l)=>{acc[l.source]=(acc[l.source]||0)+1;return acc;},{});
  const sourceChart = Object.entries(sourceCount).map(([name,value])=>({name,value}));
  const typeCount = contenido.reduce((acc,c)=>{acc[c.type]=(acc[c.type]||0)+1;return acc;},{});
  const contentChart = Object.entries(typeCount).map(([tipo,cant])=>({tipo,cant}));
  return (
    <div>
      <div style={s.grid2}>
        <div style={s.card}>
          <div style={s.cardTitle}>Fuente de leads</div>
          {sourceChart.length>0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={sourceChart} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({name,value})=>`${name}: ${value}`} fontSize={11}>
                  {sourceChart.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:12}} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div style={{padding:24,color:C.textSec,fontSize:13,textAlign:"center"}}>Sin datos de leads aún.</div>}
        </div>
        <div style={s.card}>
          <div style={s.cardTitle}>Contenido por tipo</div>
          {contentChart.length>0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={contentChart} barSize={32}>
                <XAxis dataKey="tipo" tick={{fill:C.textSec,fontSize:11}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill:C.textSec,fontSize:11}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:12}} />
                <Bar dataKey="cant" fill={C.accent} radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div style={{padding:24,color:C.textSec,fontSize:13,textAlign:"center"}}>Sin contenido cargado aún.</div>}
        </div>
      </div>
      <div style={s.card}>
        <div style={s.cardTitle}>Resumen del mes</div>
        {[
          {label:"Total leads",value:leads.length,color:C.accent},
          {label:"Leads calientes",value:leads.filter(l=>l.temp==="caliente").length,color:C.danger},
          {label:"Leads cerrados",value:leads.filter(l=>l.status==="cerrado").length,color:C.accent},
          {label:"Contenidos cargados",value:contenido.length,color:C.warning},
          {label:"Contenidos listos",value:contenido.filter(c=>c.status==="listo").length,color:C.accent},
        ].map(m=>(
          <div key={m.label} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}>
            <span style={{color:C.textSec}}>{m.label}</span>
            <span style={{fontWeight:700,color:m.color}}>{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── APP SHELL (cliente o admin viendo cliente) ───────────
const NAV = [{id:"dashboard",label:"Dashboard",icon:"⊞"},{id:"contenido",label:"Plan de contenido",icon:"📅"},{id:"leads",label:"Leads / CRM",icon:"👥"},{id:"tareas",label:"Tareas",icon:"✓"},{id:"reportes",label:"Reportes",icon:"📊"}];

function AppShell({ user, clientProfile, onBack, onLogout }) {
  const [view,setView]=useState("dashboard");
  const [contenido,setContenido]=useState([]);
  const [leads,setLeads]=useState([]);
  const [tareas,setTareas]=useState([]);
  const [loading,setLoading]=useState(true);
  const isAdminViewing = user.is_admin && clientProfile;
  const activeClient = isAdminViewing ? clientProfile : user;

  useEffect(()=>{
    const load = async () => {
      setLoading(true);
      const [c,l,t] = await Promise.all([
        supabase.from("contenido").select("*").eq("client_id",activeClient.id).order("created_at"),
        supabase.from("leads").select("*").eq("client_id",activeClient.id).order("created_at",{ascending:false}),
        supabase.from("tareas").select("*").eq("client_id",activeClient.id).order("created_at"),
      ]);
      setContenido(c.data||[]); setLeads(l.data||[]); setTareas(t.data||[]);
      setLoading(false);
    };
    load();
  },[activeClient.id]);

  return (
    <div style={s.app}>
      <div style={s.sidebar}>
        <div style={{padding:"20px 20px 16px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{fontSize:22,lineHeight:1}}>🌿</div>
            <div>
              <div style={{fontSize:15,fontWeight:600,color:C.accent}}>Menta Hub</div>
              <div style={{fontSize:11,color:C.textSec}}>Panel de gestión</div>
            </div>
          </div>
        </div>
        <div style={{margin:"12px 12px 4px",background:C.accentBg,border:`1px solid ${C.accent}22`,borderRadius:8,padding:"8px 12px"}}>
          <div style={{fontSize:12,fontWeight:600,color:C.accent}}>{activeClient.name}</div>
          <div style={{fontSize:11,color:C.textSec,marginTop:1}}>{activeClient.company}</div>
          {isAdminViewing && <div style={{fontSize:10,color:C.warning,marginTop:4}}>👁 Vista admin</div>}
        </div>
        <div style={{flex:1,padding:"8px 8px",overflowY:"auto"}}>
          <div style={{fontSize:10,color:C.textTer,padding:"8px 8px 4px",letterSpacing:1,textTransform:"uppercase"}}>Menú</div>
          {NAV.map(n=>(
            <div key={n.id} style={s.navItem(view===n.id)} onClick={()=>setView(n.id)}>
              <span style={{fontSize:14}}>{n.icon}</span>{n.label}
            </div>
          ))}
        </div>
        <div style={{padding:"12px 16px",borderTop:`1px solid ${C.border}`,display:"flex",flexDirection:"column",gap:8}}>
          {isAdminViewing && (
            <div onClick={onBack} style={{fontSize:12,color:C.accent,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
              ← Volver a clientes
            </div>
          )}
          <div onClick={onLogout} style={{fontSize:12,color:C.textSec,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
            ↩ Cerrar sesión
          </div>
        </div>
      </div>
      <div style={s.main}>
        <div style={s.topbar}>
          <div>
            <div style={{fontSize:16,fontWeight:600}}>{NAV.find(n=>n.id===view)?.label}</div>
            <div style={{fontSize:12,color:C.textSec}}>{activeClient.company} · {new Date().toLocaleDateString("es-PE",{month:"long",year:"numeric"})}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {isAdminViewing && <div style={{fontSize:12,color:C.warning,background:C.warningBg,padding:"4px 10px",borderRadius:6}}>Editando como admin</div>}
            <div style={{fontSize:12,color:C.textSec}}>Gestionado por <span style={{color:C.accent}}>Menta Marketing</span></div>
            <div style={{...s.avatar(32)}}>{activeClient.name?.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
          </div>
        </div>
        <div style={s.content}>
          {loading ? <div style={{color:C.textSec,fontSize:13,padding:24}}>Cargando...</div> : (
            <>
              {view==="dashboard" && <Dashboard setView={setView} contenido={contenido} leads={leads} tareas={tareas} />}
              {view==="contenido" && <Contenido clientId={activeClient.id} contenido={contenido} setContenido={setContenido} />}
              {view==="leads" && <Leads clientId={activeClient.id} leads={leads} setLeads={setLeads} />}
              {view==="tareas" && <Tareas clientId={activeClient.id} tareas={tareas} setTareas={setTareas} />}
              {view==="reportes" && <Reportes leads={leads} contenido={contenido} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────
export default function MentaHub() {
  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(true);
  const [selectedClient,setSelectedClient]=useState(null);

  useEffect(()=>{
    supabase.auth.getSession().then(async({data:{session}})=>{
      if(session){
        const {data:profile} = await supabase.from("profiles").select("*").eq("id",session.user.id).single();
        if(profile) setUser({...session.user,...profile});
      }
      setLoading(false);
    });
  },[]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); setSelectedClient(null);
  };

  const handlePasswordChanged = async () => {
    setUser(prev=>({...prev,password_changed:true}));
  };

  if(loading) return <div style={{...s.loginWrap}}><div style={{color:C.textSec}}>Cargando Menta Hub...</div></div>;
  if(!user) return <LoginScreen onLogin={setUser} />;
  if(!user.password_changed) return <ChangePassword user={user} onDone={handlePasswordChanged} />;
  if(user.is_admin && !selectedClient) return <AdminHome admin={user} onSelectClient={setSelectedClient} onLogout={handleLogout} />;
  return <AppShell user={user} clientProfile={selectedClient} onBack={()=>setSelectedClient(null)} onLogout={handleLogout} />;
}
