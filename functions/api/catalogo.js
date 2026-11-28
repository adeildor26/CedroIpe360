export async function onRequestGet({ request, env }) {
  const supabaseUrl = env.SUPABASE_URL || 'https://wrumtnnumqnchbrjagil.supabase.co';
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    console.error('CI360_CONFIG: SUPABASE_SERVICE_ROLE_KEY ausente');
    return Response.json(
      { erro: 'Catalogo indisponivel: configuracao do servidor ausente.', codigo: 'CI360_CONFIG' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  let imovelId = null;
  try {
    imovelId = new URL(request.url).searchParams.get('id');
  } catch {
    return Response.json({ erro: 'URL invalida.', codigo: 'CI360_URL' }, { status: 400 });
  }

  if (imovelId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(imovelId)) {
    return Response.json({ erro: 'ID invalido.', codigo: 'CI360_ID' }, { status: 400 });
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/ci360_site_catalogo_v36`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ p_imovel: imovelId })
    });

    if (!response.ok) {
      const detail = (await response.text()).slice(0, 300);
      console.error('CI360_RPC_ERROR', response.status, detail);
      return Response.json(
        { erro: 'Falha ao consultar o catalogo no Supabase.', codigo: 'CI360_RPC', status: response.status },
        { status: 502, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const result = await response.json();
    if (!Array.isArray(result)) {
      console.error('CI360_RPC_FORMAT', JSON.stringify(result).slice(0, 300));
      return Response.json(
        { erro: 'A funcao do catalogo nao retornou uma lista.', codigo: 'CI360_RPC_FORMAT' },
        { status: 502, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    return Response.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
        'X-Catalog-Count': String(result.length)
      }
    });
  } catch (error) {
    console.error('CI360_API_ERROR', String(error?.message || error).slice(0, 300));
    return Response.json(
      { erro: 'Erro de comunicacao com o catalogo.', codigo: 'CI360_API_ERROR' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
