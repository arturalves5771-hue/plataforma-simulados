export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Buscar disciplinas e cadernos do D1
    if (url.pathname.endsWith("/api/dados")) {
      const disciplinas = await env.DB.prepare("SELECT * FROM disciplinas").all();
      const cadernos = await env.DB.prepare("SELECT * FROM cadernos").all();
      
      return Response.json({
        disciplinas: disciplinas.results,
        cadernos: cadernos.results
      }, { headers: corsHeaders });
    }

    // Inserir nova questão no D1
    if (url.pathname.endsWith("/api/questoes") && request.method === "POST") {
      const body = await request.json();
      await env.DB.prepare(
        "INSERT INTO questoes (caderno_id, enunciado, gabarito, explicacao) VALUES (?, ?, ?, ?)"
      ).bind(body.caderno_id, body.enunciado, body.gabarito, body.explicacao).run();

      return Response.json({ sucesso: true }, { headers: corsHeaders });
    }

    return new Response("Rota não encontrada", { status: 404, headers: corsHeaders });

  } catch (err) {
    return Response.json({ erro: err.message }, { status: 500, headers: corsHeaders });
  }
}
