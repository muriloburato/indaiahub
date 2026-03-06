import { NextRequest, NextResponse } from 'next/server'

const DEST = 'murilo.mbsmbs@gmail.com'

function buildHtml(d: {
  nome: string; empresa: string; email: string; telefone: string
  ncm: string; tipo: string; mensagem: string
}) {
  const tipoLbl = d.tipo === 'imp' ? 'Importação' : 'Exportação'
  const tipoClr = '#1565C0'
  const now     = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'long', timeStyle: 'short' })

  const row = (label: string, value: string) =>
    `<tr><td style="padding:12px 24px;border-top:1px solid #EEF2F7;">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:#94A3B8;margin-bottom:3px;">${label}</div>
      <div style="font-size:14px;font-weight:600;color:#0F172A;line-height:1.4;">${value}</div>
    </td></tr>`

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#EEF2F7;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF2F7;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <tr><td style="background:linear-gradient(145deg,#0A1628 0%,#0D2048 55%,#1565C0 100%);border-radius:20px 20px 0 0;padding:40px 40px 0;overflow:hidden;">
    <table cellpadding="0" cellspacing="0"><tr>
      <td style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);border-radius:10px;padding:7px 16px;">
        <span style="font-size:18px;font-weight:900;letter-spacing:.05em;color:#fff;">INDAIA</span>
      </td>
      <td style="padding-left:12px;"><span style="font-size:10px;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,0.3);">Logística Internacional</span></td>
    </tr></table>
    <div style="display:inline-block;margin-top:24px;background:rgba(66,165,245,0.15);border:1px solid rgba(66,165,245,0.3);border-radius:100px;padding:5px 14px;">
      <span style="font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#42A5F5;">Nova Solicitação · ${tipoLbl}</span>
    </div>
    <h1 style="font-size:30px;font-weight:800;color:#fff;margin:14px 0 6px;letter-spacing:-.02em;line-height:1.15;">Cotação recebida!</h1>
    <p style="font-size:12px;color:rgba(255,255,255,0.35);margin:0 0 36px;">${now}</p>
    <div style="line-height:0;margin:0 -40px;">
      <svg viewBox="0 0 600 36" width="600" style="display:block;width:100%;" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path d="M0 36 Q150 0 300 18 Q450 36 600 8 L600 36 Z" fill="#fff"/>
      </svg>
    </div>
  </td></tr>

  <tr><td style="background:#fff;padding:8px 0;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:24px 40px 20px;">
        <p style="font-size:14px;color:#475569;line-height:1.75;margin:0;">
          Nova solicitação de cotação enviada pelo portal <strong style="color:#1565C0;">INDAIA</strong>. Dados do cliente abaixo.
        </p>
      </td></tr>

      <tr><td style="padding:0 40px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;">
          <tr><td style="background:linear-gradient(90deg,#1565C0,#1976D2);padding:11px 24px;">
            <span style="font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,0.85);">Dados do Cliente</span>
          </td></tr>
          ${row('Nome completo', d.nome)}
          ${row('Empresa', d.empresa)}
          ${row('E-mail', '<a href="mailto:' + d.email + '" style="color:#1565C0;text-decoration:none;">' + d.email + '</a>')}
          ${row('Telefone', d.telefone || '<span style="color:#94A3B8;">Não informado</span>')}
        </table>
      </td></tr>

      <tr><td style="padding:0 40px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;">
          <tr><td style="background:linear-gradient(90deg,#0D2048,#1565C0);padding:11px 24px;">
            <span style="font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,0.85);">Operação · ${tipoLbl}</span>
          </td></tr>
          ${row('Tipo de operação', '<span style="background:' + tipoClr + ';color:#fff;padding:2px 10px;border-radius:5px;font-size:12px;font-weight:700;">' + tipoLbl + '</span>')}
          ${row('NCM / Produto', d.ncm || '<span style="color:#94A3B8;">Não informado</span>')}
        </table>
      </td></tr>

      ${d.mensagem ? `<tr><td style="padding:0 40px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;">
          <tr><td style="background:#F8FAFC;padding:11px 24px;border-bottom:1px solid #E2E8F0;">
            <span style="font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#64748B;">Mensagem</span>
          </td></tr>
          <tr><td style="padding:18px 24px;">
            <p style="font-size:14px;color:#334155;line-height:1.8;margin:0;font-style:italic;border-left:3px solid #1565C0;padding-left:14px;">"${d.mensagem}"</p>
          </td></tr>
        </table>
      </td></tr>` : ''}

      <tr><td style="padding:4px 40px 36px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#EFF6FF,#DBEAFE);border:1px solid #BFDBFE;border-radius:14px;">
          <tr><td style="padding:28px 24px;text-align:center;">
            <p style="font-size:15px;font-weight:700;color:#1E40AF;margin:0 0 6px;">Responda em até 4 horas úteis</p>
            <p style="font-size:12px;color:#3B82F6;margin:0 0 18px;">O cliente aguarda o retorno da equipe INDAIA.</p>
            <a href="mailto:${d.email}?subject=Re: Cotação INDAIA · ${tipoLbl}"
               style="display:inline-block;background:#1565C0;color:#fff;text-decoration:none;padding:12px 28px;border-radius:9px;font-size:14px;font-weight:700;box-shadow:0 4px 12px rgba(21,101,192,0.3);">
              Responder ao cliente →
            </a>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="background:linear-gradient(145deg,#0A1628,#0D2048);border-radius:0 0 20px 20px;padding:24px 40px;text-align:center;">
    <p style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.4);margin:0 0 4px;letter-spacing:.06em;">INDAIA LOGÍSTICA INTERNACIONAL</p>
    <p style="font-size:11px;color:rgba(255,255,255,0.2);margin:0;">58 anos de experiência em COMEX · Santos, SP · Brasil</p>
  </td></tr>

</table>
</td></tr></table>
</body></html>`
}

export async function POST(req: NextRequest) {
  try {
    const b = await req.json()
    const { nome, empresa, email, telefone, ncm, tipo, mensagem } = b
    if (!nome || !empresa || !email)
      return NextResponse.json({ ok: false, error: 'Campos obrigatórios ausentes.' }, { status: 400 })

    const html      = buildHtml({ nome, empresa, email, telefone: telefone||'', ncm: ncm||'', tipo: tipo||'imp', mensagem: mensagem||'' })
    const tipoLabel = tipo === 'imp' ? 'Importação' : 'Exportação'
    const API_KEY   = process.env.RESEND_API_KEY

    if (!API_KEY) {
      console.log(`\n[COTACAO] Email simulado — defina RESEND_API_KEY no .env.local para enviar de verdade`)
      console.log(`  Para: ${DEST}  |  Cliente: ${nome} <${email}>  |  Tipo: ${tipoLabel}`)
      return NextResponse.json({ ok: true, mode: 'dev' })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
      body: JSON.stringify({
        from:     'INDAIA Portal <onboarding@resend.dev>',
        to:       [DEST],
        reply_to: email,
        subject:  `Nova Cotação INDAIA · ${tipoLabel} · ${empresa}`,
        html,
      }),
    })
    if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[COTACAO API]', err)
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : 'Erro' }, { status: 500 })
  }
}
