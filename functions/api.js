export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Buscar disciplinas e cadernos do D1
      if (url.pathname === "/api/dados" || url.pathname.endsWith("/api/dados")) {
        const disciplinas = await env.DB.prepare("SELECT * FROM disciplinas").all();
        const cadernos = await env.DB.prepare("SELECT * FROM cadernos").all();
        
        return new Response(JSON.stringify({
          disciplinas: disciplinas.results || [],
          cadernos: cadernos.results || []
        }), { headers: corsHeaders });
      }

      // Inserir nova questão no D1
      if ((url.pathname === "/api/questoes" || url.pathname.endsWith("/api/questoes")) && request.method === "POST") {
        const body = await request.json();
        await env.DB.prepare(
          "INSERT INTO questoes (caderno_id, enunciado, gabarito, explicacao) VALUES (?, ?, ?, ?)"
        ).bind(body.caderno_id, body.enunciado, body.gabarito, body.explicacao).run();

        return new Response(JSON.stringify({ sucesso: true }), { headers: corsHeaders });
      }

      // Caso não seja rota de API, deixa o Cloudflare entregar o HTML estático
      return env.ASSETS.fetch(request);

    } catch (err) {
      return new Response(JSON.stringify({ erro: err.message }), { status: 500, headers: corsHeaders });
    }
  }
};export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Buscar disciplinas e cadernos do D1
      if (url.pathname === "/api/dados" || url.pathname.endsWith("/api/dados")) {
        const disciplinas = await env.DB.prepare("SELECT * FROM disciplinas").all();
        const cadernos = await env.DB.prepare("SELECT * FROM cadernos").all();
        
        return new Response(JSON.stringify({
          disciplinas: disciplinas.results || [],
          cadernos: cadernos.results || []
        }), { headers: corsHeaders });
      }

      // Inserir nova questão no D1
      if ((url.pathname === "/api/questoes" || url.pathname.endsWith("/api/questoes")) && request.method === "POST") {
        const body = await request.json();
        await env.DB.prepare(
          "INSERT INTO questoes (caderno_id, enunciado, gabarito, explicacao) VALUES (?, ?, ?, ?)"
        ).bind(body.caderno_id, body.enunciado, body.gabarito, body.explicacao).run();

        return new Response(JSON.stringify({ sucesso: true }), { headers: corsHeaders });
      }

      // Caso não seja rota de API, deixa o Cloudflare entregar o HTML estático
      return env.ASSETS.fetch(request);

    } catch (err) {
      return new Response(JSON.stringify({ erro: err.message }), { status: 500, headers: corsHeaders });
    }
  }
};export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Buscar disciplinas e cadernos do D1
      if (url.pathname === "/api/dados" || url.pathname.endsWith("/api/dados")) {
        const disciplinas = await env.DB.prepare("SELECT * FROM disciplinas").all();
        const cadernos = await env.DB.prepare("SELECT * FROM cadernos").all();
        
        return new Response(JSON.stringify({
          disciplinas: disciplinas.results || [],
          cadernos: cadernos.results || []
        }), { headers: corsHeaders });
      }

      // Inserir nova questão no D1
      if ((url.pathname === "/api/questoes" || url.pathname.endsWith("/api/questoes")) && request.method === "POST") {
        const body = await request.json();
        await env.DB.prepare(
          "INSERT INTO questoes (caderno_id, enunciado, gabarito, explicacao) VALUES (?, ?, ?, ?)"
        ).bind(body.caderno_id, body.enunciado, body.gabarito, body.explicacao).run();

        return new Response(JSON.stringify({ sucesso: true }), { headers: corsHeaders });
      }

      // Caso não seja rota de API, deixa o Cloudflare entregar o HTML estático
      return env.ASSETS.fetch(request);

    } catch (err) {
      return new Response(JSON.stringify({ erro: err.message }), { status: 500, headers: corsHeaders });
    }
  }
};
