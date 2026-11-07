# Inscritos dos clientes

Estado em 07/11/2026: publicação autorizada pelo usuário; preparação e testes concluídos.
Worker implantado e URL configurada no GitHub Actions. O usuário cadastrou a chave
diretamente no painel como secret `YT`. O Worker aceita `YOUTUBE_API_KEY` ou `YT`.
Consulta pública real verificada: HTTP 200, MUGM 247.000 e Tae 122.000, sem cache.
Contagens de contingência atualizadas com essa data. O frontend está pronto para
publicação pelo push para `main`.

Endpoint: `https://vianna-client-stats.viannafxeditor.workers.dev/api/clients`.
Worker: `vianna-client-stats`, conta `645c2f26259019a7d0cd8ad5008d7db0`.
Repositório: `viannafxeditor-arch/portfolio`, variável Actions `CLIENTS_API_URL`.

Configuração local concluída em 31/10/2026: projeto Google Cloud `Vianna Portfolio`
(`compact-moment-513316-i0`), API ativada e chave `Vianna Portfolio - inscritos`
restrita à YouTube Data API v3. O valor está somente em `.env.local` e não deve ser
copiado para documentação ou backups. Consulta real e renderização na prévia
confirmaram MUGM 245.000 e Tae 122.000 nessa data. Os valores salvos de contingência
foram atualizados em 07/11/2026 conforme descrito acima. Após uma formatação, será necessário
configurar novamente a credencial privada; o ZIP de 21/10 não contém esta integração.

Clientes ativos: MUGM e Tae. Os IDs oficiais estão em `shared/clientChannels.js`.
A cada montagem da seção e retorno pelo histórico do navegador (bfcache), o frontend
faz GET sem cache em `/api/clients` (ou `VITE_CLIENTS_API_URL`, se configurada).
O backend faz uma única chamada `channels.list` para os dois IDs, sem cache persistente.
Os números públicos do YouTube são arredondados, e não equivalem ao contador privado
do YouTube Studio. Em erro, a página mantém os valores anteriores e sua data original.

## Prévia local

1. Criar/selecionar um projeto Google Cloud e ativar YouTube Data API v3.
2. Criar uma chave restrita à YouTube Data API v3, sem OAuth nem acesso aos canais.
3. Salvar `YOUTUBE_API_KEY=valor` em `.env.local` (ignorado pelo Git). A chave nunca
   deve ter prefixo `VITE_`, ir para o frontend, ser incluída em ZIP ou commit.
4. Usar `VITE_CLIENTS_PREVIEW=true` no build e iniciar Vite dev ou preview.
   O plugin local lê `.env.local` apenas no servidor; o navegador recebe só contagens.
5. Conferir `/api/clients`: 200 com `checkedAt` e dois objetos de contagem.
   Sem configuração retorna 503; falha do Google retorna 502 sem detalhes sensíveis.

## Publicação autorizada — procedimento

GitHub Pages é estático e não executa o endpoint. O adaptador `worker/clients.js` pode
rodar num Cloudflare Worker separado; configuração em `deploy/clients-worker.jsonc`.
Definir `YOUTUBE_API_KEY` como secret do Worker e limitar a chave à API do YouTube.
Definir `VITE_CLIENTS_API_URL` como a URL HTTPS real do Worker terminando em `/api/clients`.
O workflow já habilita `VITE_CLIENTS_PREVIEW=true` e lê a variável de repositório
`CLIENTS_API_URL`. Configurá-la com o endpoint confirmado antes de enviar para `main`.
Não usar a API key como variável pública de build ou em `vars` do arquivo Worker.

As origens CORS permitidas são www.viannafx.media e viannafx.media. CORS não é autenticação
nem impede chamadas por clientes fora do navegador. O binding `CLIENTS_RATE_LIMIT`
limita a 20 consultas por IP por minuto em cada localidade Cloudflare; sem binding,
o endpoint falha fechado. Não é um limite global estrito da cota. A modalidade sem
cache usa uma chamada por visita; falhas e esgotamento de cota preservam no site os
últimos valores disponíveis e a data correspondente. A chave deve ser instalada como
secret `YOUTUBE_API_KEY`, nunca como variável pública.

Validação pré-publicação de 06/11: 37 testes passaram, build Pages compilado,
373 arquivos públicos de mídia verificados, segredo ausente do bundle e Worker
validado com `wrangler deploy --config deploy/clients-worker.jsonc --dry-run`.

Documentação oficial:
- https://developers.google.com/youtube/data/getting-started
- https://developers.google.com/youtube/data/reference/rest/v3/channels/list
- https://developers.google.com/youtube/data/reference/rest/v3/channels

## Release 2026-11-07

The video metadata route `/api/video-details` is deployed in the existing
`vianna-client-stats` Worker, with the same CORS allowlist, rate limit and private
YouTube secret. The frontend derives its URL from `VITE_CLIENTS_API_URL`.

Cinematics now contains Minecraft only. HOME uses `minecraft-clean-transitions`;
the carousel starts with `minecraft-new-262`. Six newly imported clips, their
silent backgrounds and posters are bundled from `public/cinematic-media` into
GitHub Pages (approximately 241 MB). They do not consume additional R2 storage.
Original full-quality video streams are retained. Existing hosted media stays
in R2. The source files in `public/cinematic-media` must be preserved in backups.
