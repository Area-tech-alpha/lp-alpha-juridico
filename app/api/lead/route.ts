import { LEAD_ORIGIN } from "@/lib/config";

// Repassa o formulário ao CRM (Dashcom), que classifica o lead e o distribui. Fica no servidor
// porque a chave do CRM não pode ir para o navegador. Substitui o webhook do n8n.
export async function POST(request: Request) {
  const baseUrl = process.env.CRM_API_URL;
  const apiKey = process.env.CRM_EXTERNAL_LEADS_API_KEY;
  if (!baseUrl || !apiKey) {
    console.error("[api/lead] CRM_API_URL / CRM_EXTERNAL_LEADS_API_KEY não definidas");
    return Response.json({ ok: false, error: "crm_not_configured" }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  try {
    const res = await fetch(`${baseUrl.replace(/\/+$/, "")}/external/leads/lp`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      // A origem vem da configuração da LP, não do navegador.
      body: JSON.stringify({ ...body, origem: LEAD_ORIGIN }),
      signal: AbortSignal.timeout(25_000),
    });
    const text = await res.text();
    if (!res.ok) console.error(`[api/lead] CRM retornou ${res.status}: ${text.slice(0, 500)}`);
    return new Response(text, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[api/lead] Erro de rede ao chamar o CRM:", err);
    return Response.json({ ok: false, error: "crm_unreachable" }, { status: 502 });
  }
}
