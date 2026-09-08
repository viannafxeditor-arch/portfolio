# Migração para o domínio existente

Repositório confirmado: https://github.com/viannafxeditor-arch/portfolio
Domínio e CNAME confirmados: www.viannafx.media
Cópia de trabalho: ../portfolio-github-pages, branch codex/new-portfolio
Site anterior preservado no commit 83706b56ebfb4f7a05de47a33bd8c77361740737.

Preparado: aplicação nova, compilação específica para GitHub Pages, entrada direta /cinematic, workflow, manifesto de mídia e verificação antes de publicar.

Hospedagem escolhida: Cloudflare R2 Standard. Catálogo reduzido para 384 arquivos e 9.936.935.508 bytes, com 18 cenas em cada Fallout e HOME/processo preservados. A cópia de recuperação ../media-retiradas-r2 não deve ser enviada. A franquia de operações é separada da de armazenamento.

Concluído: upload R2 verificado de 384 objetos, total de 9.936.935.508 bytes, sem objetos inesperados ou uploads incompletos. CORS configurado. Os 15 registros existentes de site/e-mail foram preservados no Cloudflare. A compilação com https://media.viannafx.media e os dois testes específicos de Pages passaram.

Pendente: propagação do DNS e ativação da zona Cloudflare. A GoDaddy já confirmou blair.ns.cloudflare.com e rajeev.ns.cloudflare.com. Em seguida, conectar media.viannafx.media ao bucket e validar os 384 arquivos públicos. GitHub autorizado, MEDIA_ORIGIN configurado, código enviado em codex/new-portfolio e PR #1 aberto como rascunho. Antes de integrar à main, alterar Pages de legacy para workflow preservando CNAME e HTTPS. O site antigo permanece publicado até a validação e implantação final.

O endereço media.example.com usado no teste de compilação é fictício e não deve ser publicado. A versão final só pode ser compilada/publicada com o endereço real e com todos os arquivos de mídia verificados.
