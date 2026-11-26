import { LEAD_ORIGIN } from "@/lib/config";

// Repassa o formulário à entrada de leads do CRM (Dashcom):
//   POST {CRM_API_URL}/external/lead-intake/food/lp, header x-api-key = CRM_LEAD_INTAKE_FOOD_KEY
// (a LEAD_INTAKE_FOOD_KEY do CRM; contrato em docs/modules/lead-intake.md do CRM). Fica no
// servidor porque a chave não pode ir para o navegador. A origem vem da configuração da LP, não
// do navegador: com ela o CRM aplica a régua do nicho e o lead entra na Matriz; abaixo da faixa
// mínima do nicho o CRM descarta (200 com status "ignored").
// A resposta do CRM é repassada: 2xx = recebido; 400 = recusado pelo filtro de segurança (não
// reenviar); 401/403 = chave; 5xx = falha (pode reenviar).
export async function POST(request: Request) {
  const baseUrl = process.env.CRM_API_URL;
  const apiKey = process.env.CRM_LEAD_INTAKE_FOOD_KEY;
  if (!baseUrl || !apiKey) {
    console.error("[api/lead] CRM_API_URL / CRM_LEAD_INTAKE_FOOD_KEY não definidas");
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
    const res = await fetch(`${baseUrl.replace(/\/+$/, "")}/external/lead-intake/food/lp`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify({ ...body, origem: LEAD_ORIGIN }),
      // O CRM pode esperar o Growth Hub (timeout de 20 s do lado dele).
      signal: AbortSignal.timeout(25_000),
    });
    const text = await res.text();
    if (!res.ok) {
      // Só status, código e motivos (nomes de campo): nunca os dados do lead.
      let detail = "";
      try {
        const data = JSON.parse(text) as { code?: unknown; reasons?: unknown };
        if (typeof data.code === "string") detail += ` (${data.code})`;
        if (Array.isArray(data.reasons)) detail += ` [${data.reasons.map(String).join("; ").slice(0, 300)}]`;
      } catch {}
      console.error(`[api/lead] CRM retornou ${res.status}${detail}`);
    }
    return new Response(text, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(`[api/lead] Erro de rede ao chamar o CRM (${err instanceof Error ? err.name : "erro"})`);
    return Response.json({ ok: false, error: "crm_unreachable" }, { status: 502 });
  }
}
