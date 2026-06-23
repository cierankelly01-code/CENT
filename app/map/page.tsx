import { Metadata } from "next";

export const metadata: Metadata = { title: "Architecture Map — Centaur Ops" };
export const dynamic = "force-dynamic";

async function getStatus() {
  try {
    const base =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const res = await fetch(`${base}/api/status`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function MapPage() {
  const status = await getStatus();
  const checks: Record<string, boolean> = {};
  if (status?.checks) {
    for (const c of status.checks) checks[c.name] = c.ok;
  }

  const dbOk = checks["Database (public)"] ?? null;
  const serviceOk = checks["Database (staff/builds)"] ?? null;
  const emailOk = checks["Email (Resend)"] ?? null;
  const siteUrlOk = checks["Site URL"] ?? null;
  const staffOk = checks["Staff login allowlist"] ?? null;

  // Serialise to JSON for the client component
  const statusJson = JSON.stringify({ dbOk, serviceOk, emailOk, siteUrlOk, staffOk });

  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#c9d1d9] font-sans flex flex-col">
      <header className="bg-[#0d1117] border-b border-[#21262d] px-6 py-3.5 flex items-center justify-between flex-shrink-0">
        <div className="font-bold text-sm text-[#e6edf3] tracking-tight">
          Centaur <span className="text-[#58a6ff]">Ops</span> — Architecture Map
        </div>
        <div className="flex items-center gap-4 text-[11px] text-[#484f58]">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-[#2d6fa8]" />Marketing</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-[#2d8a5a]" />Configurator</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-[#2d6a8a]" />Fleet</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-[#7a2d5a]" />Staff</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-[#7a7a2d]" />API</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-[#4a4aaa]" />Database</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-[#aa4a2d]" />External</span>
          <a href="/status" className="text-[#58a6ff] hover:underline ml-2">← Status</a>
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        <canvas id="map" className="w-full h-full" data-status={statusJson} />
      </div>
      <script dangerouslySetInnerHTML={{ __html: MAP_SCRIPT }} />
    </div>
  );
}

// All logic runs client-side in a <canvas> — no React hydration needed, fully portable
const MAP_SCRIPT = `
(function() {
  const canvas = document.getElementById('map');
  const status = JSON.parse(canvas.dataset.status);
  const dpr = window.devicePixelRatio || 1;

  function resize() {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    draw();
  }

  // ── node definitions ─────────────────────────────────────────────────────
  // Each node: { id, label, sub, col, row, color, check }
  // check = key in status object; null = always green

  const COLS = {
    marketing:    { x: 0.04, color: '#1e3a5f', border: '#2d6fa8' },
    configurator: { x: 0.21, color: '#1a3a2a', border: '#2d8a5a' },
    fleet:        { x: 0.36, color: '#1a2a3a', border: '#2d6a8a' },
    staff:        { x: 0.51, color: '#2a1a2a', border: '#7a2d5a' },
    api:          { x: 0.66, color: '#2a2a1a', border: '#7a7a2d' },
    db:           { x: 0.79, color: '#1a1a3a', border: '#4a4aaa' },
    ext:          { x: 0.91, color: '#2a1a1a', border: '#aa4a2d' },
  };

  const NODES = [
    // Marketing
    { id:'home',      label:'/',              sub:'Home',         col:'marketing',    row:0 },
    { id:'product',   label:'/the-centaur',   sub:'Product',      col:'marketing',    row:1 },
    { id:'story',     label:'/story',         sub:'Founder',      col:'marketing',    row:2 },
    { id:'whofor',    label:'/who-its-for',   sub:'Audience',     col:'marketing',    row:3 },
    { id:'whyus',     label:'/why-us',        sub:'Credibility',  col:'marketing',    row:4 },
    { id:'news',      label:'/news',          sub:'Blog',         col:'marketing',    row:5 },
    { id:'privacy',   label:'/privacy',       sub:'Privacy',      col:'marketing',    row:6 },
    { id:'a11y',      label:'/accessibility', sub:'A11y stmt',    col:'marketing',    row:7 },
    // Configurator
    { id:'configure', label:'/configure',     sub:'Entry',        col:'configurator', row:0, check:'siteUrlOk' },
    { id:'build',     label:'/build/[ref]',   sub:'Token-gated',  col:'configurator', row:2, check:'serviceOk' },
    { id:'track',     label:'/track/[ref]',   sub:'Customer tracking', col:'configurator', row:4 },
    { id:'libconf',   label:'lib/configurator', sub:'options·validate·refs', col:'configurator', row:6 },
    // Fleet
    { id:'fleet',     label:'/fleet',         sub:'Overview',     col:'fleet',        row:0 },
    { id:'fleetorg',  label:'/fleet/[org]',   sub:'Org detail',   col:'fleet',        row:2 },
    { id:'fleetchair',label:'/fleet/[org]/[serial]', sub:'Chair telemetry', col:'fleet', row:4 },
    // Staff
    { id:'staffdash', label:'/staff',         sub:'Dashboard',    col:'staff',        row:0, check:'staffOk' },
    { id:'stafflogin',label:'/staff/login',   sub:'Auth gate',    col:'staff',        row:1 },
    { id:'enquiries', label:'/staff/enquiries',sub:'Quote inbox', col:'staff',        row:2 },
    { id:'builds',    label:'/staff/builds',  sub:'All configs',  col:'staff',        row:3, check:'serviceOk' },
    { id:'pipeline',  label:'/staff/pipeline',sub:'Kanban',       col:'staff',        row:4, check:'serviceOk' },
    { id:'quotes',    label:'/staff/quotes',  sub:'BOM→price',    col:'staff',        row:5 },
    { id:'production',label:'/staff/production',sub:'Mfg status', col:'staff',        row:6 },
    { id:'inventory', label:'/staff/inventory',sub:'Parts stock', col:'staff',        row:7 },
    // API
    { id:'apibuild',  label:'POST /api/build',sub:'Create draft', col:'api',          row:1, check:'serviceOk' },
    { id:'apiload',   label:'GET /api/build/[ref]',sub:'Load build', col:'api',       row:2, check:'serviceOk' },
    { id:'autosave',  label:'POST /api/build/[ref]',sub:'Autosave', col:'api',        row:3, check:'serviceOk' },
    { id:'submit',    label:'POST …/submit',  sub:'Customer submit', col:'api',       row:4, check:'serviceOk' },
    { id:'notify',    label:'POST /api/enquiry/notify', sub:'Trigger emails', col:'api', row:5, check:'emailOk' },
    // DB
    { id:'qr',        label:'quote_requests', sub:'Enquiry leads',col:'db',           row:1, check:'dbOk' },
    { id:'bc',        label:'build_configs',  sub:'Active orders', col:'db',          row:3, check:'serviceOk' },
    { id:'bv',        label:'build_versions', sub:'Snapshots',    col:'db',           row:5, check:'serviceOk' },
    { id:'events',    label:'build_events',   sub:'Audit log',    col:'db',           row:6, check:'serviceOk' },
    // External
    { id:'resend',    label:'Resend',         sub:'Email',        col:'ext',          row:2, check:'emailOk' },
    { id:'vercel',    label:'Vercel',         sub:'Hosting',      col:'ext',          row:4 },
    { id:'supabase',  label:'Supabase',       sub:'Database',     col:'ext',          row:6, check:'dbOk' },
  ];

  const EDGES = [
    // marketing → api/db
    ['home','notify'], ['home','qr'],
    // configurator → api
    ['configure','apibuild'],
    ['build','apiload'], ['build','autosave'], ['build','submit'],
    ['track','bc'],
    // staff → api/db
    ['staffdash','bc'], ['enquiries','qr'], ['enquiries','apibuild'],
    ['builds','bc'], ['pipeline','bc'],
    // api → db
    ['apibuild','bc'], ['apiload','bc'], ['autosave','bc'], ['submit','bc'], ['submit','bv'], ['submit','events'],
    ['notify','resend'], ['notify','qr'],
    // db → ext
    ['bc','supabase'], ['qr','supabase'], ['bv','supabase'], ['events','supabase'],
    // fleet → fleet pages
    ['fleet','fleetorg'], ['fleetorg','fleetchair'],
    // staff auth
    ['stafflogin','staffdash'],
    // lib
    ['libconf','apibuild'], ['libconf','apiload'], ['libconf','autosave'], ['libconf','submit'],
    // vercel
    ['home','vercel'], ['configure','vercel'],
  ];

  // ── layout ────────────────────────────────────────────────────────────────
  const NW = 140, NH = 44, GUTTER = 8;

  function nodePos(node, W, H) {
    const col = COLS[node.col];
    const totalRows = NODES.filter(n => n.col === node.col).length;
    const colH = totalRows * (NH + GUTTER);
    const startY = (H - colH) / 2;
    return {
      x: col.x * W,
      y: startY + node.row * (NH + GUTTER),
    };
  }

  function statusColor(node) {
    if (!node.check) return null; // no check = always green lines
    const val = status[node.check];
    if (val === null || val === undefined) return '#484f58'; // unknown
    return val ? '#3fb950' : '#f85149';
  }

  // ── draw ──────────────────────────────────────────────────────────────────
  function draw() {
    const W = canvas.width / dpr, H = canvas.height / dpr;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // Build position map
    const pos = {};
    for (const n of NODES) pos[n.id] = nodePos(n, W, H);

    // Draw edges
    for (const [fromId, toId] of EDGES) {
      const f = pos[fromId], t = pos[toId];
      if (!f || !t) continue;
      const fn = NODES.find(n => n.id === fromId);
      const tn = NODES.find(n => n.id === toId);
      const fc = statusColor(fn), tc = statusColor(tn);
      // Use the "worse" color
      let lineColor = '#2a3040';
      if (fc === '#f85149' || tc === '#f85149') lineColor = '#f8514940';
      else if (fc === '#3fb950' && tc === '#3fb950') lineColor = '#3fb95040';
      else if (fc === '#3fb950' || tc === '#3fb950') lineColor = '#3fb95030';

      const x1 = f.x + NW, y1 = f.y + NH / 2;
      const x2 = t.x,       y2 = t.y + NH / 2;
      const mx = (x1 + x2) / 2;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.bezierCurveTo(mx, y1, mx, y2, x2, y2);
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Arrow head
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 6, y2 - 3);
      ctx.lineTo(x2 - 6, y2 + 3);
      ctx.closePath();
      ctx.fillStyle = lineColor;
      ctx.fill();
    }

    // Draw nodes
    for (const n of NODES) {
      const { x, y } = pos[n.id];
      const col = COLS[n.col];
      const sc = statusColor(n);
      const borderColor = sc || col.border;

      // Box
      ctx.beginPath();
      roundRect(ctx, x, y, NW, NH, 6);
      ctx.fillStyle = col.color;
      ctx.fill();
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = sc === '#f85149' ? 1.5 : 1;
      ctx.stroke();

      // Status dot
      if (sc) {
        ctx.beginPath();
        ctx.arc(x + NW - 8, y + 8, 3, 0, Math.PI * 2);
        ctx.fillStyle = sc;
        ctx.fill();
      }

      // Label
      ctx.fillStyle = '#e6edf3';
      ctx.font = \`600 10px Inter, system-ui, sans-serif\`;
      ctx.fillText(truncate(ctx, n.label, NW - 16), x + 8, y + 16);

      // Sub
      ctx.fillStyle = '#8b949e';
      ctx.font = \`400 9px Inter, system-ui, sans-serif\`;
      ctx.fillText(truncate(ctx, n.sub, NW - 16), x + 8, y + 30);
    }

    // Column headers
    const drawn = new Set();
    for (const n of NODES) {
      if (drawn.has(n.col)) continue;
      drawn.add(n.col);
      const col = COLS[n.col];
      const x = col.x * W;
      ctx.fillStyle = '#484f58';
      ctx.font = \`700 9px Inter, system-ui, sans-serif\`;
      ctx.fillText(n.col.toUpperCase(), x, 30);
    }
  }

  function truncate(ctx, text, maxW) {
    if (ctx.measureText(text).width <= maxW) return text;
    while (text.length > 0 && ctx.measureText(text + '…').width > maxW) text = text.slice(0, -1);
    return text + '…';
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // Tooltip on hover
  const tooltip = document.createElement('div');
  Object.assign(tooltip.style, {
    position:'fixed', background:'#161b22', border:'1px solid #30363d',
    borderRadius:'8px', padding:'8px 12px', fontSize:'11px', color:'#e6edf3',
    pointerEvents:'none', display:'none', zIndex:'100', maxWidth:'220px', lineHeight:'1.5'
  });
  document.body.appendChild(tooltip);

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const W = canvas.offsetWidth, H = canvas.offsetHeight;
    let hit = null;
    for (const n of NODES) {
      const { x, y } = nodePos(n, W, H);
      if (mx >= x && mx <= x + NW && my >= y && my <= y + NH) { hit = n; break; }
    }
    if (hit) {
      const sc = statusColor(hit);
      const stateText = sc === '#3fb950' ? '✓ Healthy' : sc === '#f85149' ? '✗ Issue detected' : sc ? '? Unknown' : '';
      tooltip.innerHTML = \`<strong>\${hit.label}</strong><br>\${hit.sub}\${stateText ? '<br><span style="color:' + sc + '">' + stateText + '</span>' : ''}\`;
      tooltip.style.display = 'block';
      tooltip.style.left = (e.clientX + 12) + 'px';
      tooltip.style.top  = (e.clientY + 12) + 'px';
      canvas.style.cursor = 'pointer';
    } else {
      tooltip.style.display = 'none';
      canvas.style.cursor = 'default';
    }
  });
  canvas.addEventListener('mouseleave', () => { tooltip.style.display = 'none'; });

  // Scroll/pan support
  let offsetX = 0, offsetY = 0, dragging = false, startX, startY;
  canvas.addEventListener('mousedown', e => { dragging = true; startX = e.clientX - offsetX; startY = e.clientY - offsetY; });
  window.addEventListener('mouseup', () => dragging = false);
  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    offsetX = e.clientX - startX; offsetY = e.clientY - startY;
    draw();
  });

  window.addEventListener('resize', resize);
  resize();
})();
`;
