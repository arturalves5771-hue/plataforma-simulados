export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

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
      // GET /api/dados -> Lista disciplinas e cadernos
      if (path === "/api/dados" && method === "GET") {
        const disciplinas = await env.DB.prepare("SELECT * FROM disciplinas").all();
        const cadernos = await env.DB.prepare("SELECT * FROM cadernos").all();

        return new Response(JSON.stringify({
          disciplinas: disciplinas.results || [],
          cadernos: cadernos.results || []
        }), { headers: corsHeaders });
      }

      // GET /api/questoes -> Lista questões por caderno_id
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

      // POST /api/disciplinas -> Cria nova disciplina
      if (path === "/api/disciplinas" && method === "POST") {
        const body = await request.json();
        const { nome, meta_questoes } = body;
        await env.DB.prepare(
          "INSERT INTO disciplinas (nome, meta_questoes) VALUES (?, ?)"
        ).bind(nome, meta_questoes || 200).run();
        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      }

      // POST /api/cadernos -> Cria novo caderno
      if (path === "/api/cadernos" && method === "POST") {
        const body = await request.json();
        const { disciplina_id, titulo } = body;
        await env.DB.prepare(
          "INSERT INTO cadernos (disciplina_id, titulo) VALUES (?, ?)"
        ).bind(disciplina_id, titulo).run();
        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      }

      // POST /api/questoes -> Cria nova questão (individual ou em lote)
      if (path === "/api/questoes" && method === "POST") {
        const body = await request.json();
        
        // Suporte a lote (array) ou questão única
        const questoesArray = Array.isArray(body) ? body : [body];

        for (const q of questoesArray) {
          await env.DB.prepare(
            "INSERT INTO questoes (caderno_id, enunciado, gabarito, explicacao) VALUES (?, ?, ?, ?)"
          ).bind(q.caderno_id, q.enunciado, q.gabarito, q.explicacao || "").run();
        }

        return new Response(JSON.stringify({ success: true, total: questoesArray.length }), { headers: corsHeaders });
      }

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
