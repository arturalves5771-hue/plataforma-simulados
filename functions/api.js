export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Cabeçalhos CORS para permitir requisições
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };

    if (method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Rota GET /api/dados -> Lista disciplinas e cadernos
      if (path === "/api/dados" && method === "GET") {
        const disciplinas = await env.DB.prepare("SELECT * FROM disciplinas").all();
        const cadernos = await env.DB.prepare("SELECT * FROM cadernos").all();

        return new Response(JSON.stringify({
          disciplinas: disciplinas.results || [],
          cadernos: cadernos.results || []
        }), { headers: corsHeaders });
      }

      // Rota GET /api/questoes -> Lista questões por caderno_id
      if (path === "/api/questoes" && method === "GET") {
        const caderno_id = url.searchParams.get("caderno_id");
        let query = "SELECT * FROM questoes";
        let stmt;

        if (caderno_id) {
          query += " WHERE caderno_id = ?";
          stmt = env.DB.prepare(query).bind(caderno_id);
        } else {
          stmt = env.DB.prepare(query);
        }

        const questoes = await stmt.all();
        return new Response(JSON.stringify(questoes.results || []), { headers: corsHeaders });
      }

      // Rota POST /api/questoes -> Cria uma nova questão
      if (path === "/api/questoes" && method === "POST") {
        const body = await request.json();
        const { caderno_id, enunciado, gabarito, explicacao } = body;

        await env.DB.prepare(
          "INSERT INTO questoes (caderno_id, enunciado, gabarito, explicacao) VALUES (?, ?, ?, ?)"
        ).bind(caderno_id, enunciado, gabarito, explicacao).run();

        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      }

      // Rota padrão caso não encontre o endpoint
      return new Response(JSON.stringify({ error: "Endpoint não encontrado" }), {
        status: 404,
        headers: corsHeaders
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};
