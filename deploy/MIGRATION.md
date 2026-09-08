# Migração para o domínio existente

Repositório confirmado: https://github.com/viannafxeditor-arch/portfolio
Domínio e CNAME confirmados: www.viannafx.media
Cópia de trabalho: ../portfolio-github-pages, branch codex/new-portfolio
Site anterior preservado no commit 83706b56ebfb4f7a05de47a33bd8c77361740737.

Preparado: aplicação nova, compilação específica para GitHub Pages, entrada direta /cinematic, workflow, manifesto de mídia e verificação antes de publicar.

Hospedagem escolhida: Cloudflare R2 Standard. Catálogo reduzido para 384 arquivos e 9.936.935.508 bytes, com 18 cenas em cada Fallout e HOME/processo preservados. A cópia de recuperação ../media-retiradas-r2 não deve ser enviada. A franquia de operações é separada da de armazenamento.

Concluído: upload R2 verificado de 384 objetos, total de 9.936.935.508 bytes, sem objetos inesperados ou uploads incompletos. CORS configurado. Os 15 registros existentes de site/e-mail foram preservados no Cloudflare. A compilação com https://media.viannafx.media e os dois testes específicos de Pages passaram.

Cloudflare ativo e media.viannafx.media conectado ao R2. Todos os 384 arquivos públicos passaram na verificação HTTPS de tamanho. CORS e resposta parcial 206 para reprodução foram conferidos. GitHub autorizado e MEDIA_ORIGIN configurado. A publicação usa GitHub Actions, preservando CNAME e HTTPS. O workflow verifica a mídia antes de cada implantação.

O endereço media.example.com usado no teste de compilação é fictício e não deve ser publicado. A versão final só pode ser compilada/publicada com o endereço real e com todos os arquivos de mídia verificados.
