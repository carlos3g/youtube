# Vídeos do YouTube

Repositório com o **código-fonte dos vídeos do canal**, criados com
[Remotion](https://www.remotion.dev/) — vídeos feitos em React.

Cada vídeo é uma _composição_ Remotion. O código de um vídeo vive em
`src/videos/<nome-do-video>/`, e partes reaproveitáveis ficam em
`src/shared/`.

> Nomes de pastas, arquivos e código ficam em inglês. O conteúdo
> (textos exibidos, comentários, roteiros, documentação) fica em português.

## Requisitos

- Node.js 20 ou superior
- Yarn 4 (gerenciador de pacotes deste projeto)

## Como usar

```bash
yarn install      # instala as dependências
yarn studio       # abre o Remotion Studio para pré-visualizar os vídeos
yarn typecheck    # verifica os tipos do TypeScript
```

### Renderizar um vídeo

```bash
# yarn render <Composição> <arquivo de saída>
yarn render FamousFailures out/famous-failures.mp4
```

Os arquivos renderizados vão para a pasta `out/` (ignorada pelo Git).

## Estrutura

```
.
├── public/                     # Arquivos estáticos (imagens, áudios, vídeos)
├── remotion.config.ts          # Configurações de renderização
├── src/
│   ├── index.ts                # Ponto de entrada do Remotion
│   ├── Root.tsx                # Registro de todas as composições (vídeos)
│   ├── shared/                 # Código reutilizado entre vídeos
│   │   ├── constants.ts        # Formato, FPS e paleta de cores do canal
│   │   └── components/         # Componentes reutilizáveis
│   └── videos/
│       └── famous-failures/    # Um vídeo = uma pasta
│           ├── FamousFailures.tsx
│           └── script.md       # Roteiro do vídeo
```

## Como adicionar um novo vídeo

1. Crie uma pasta em `src/videos/<nome-do-video>/`.
2. Crie o componente da composição (ex.: `MyVideo.tsx`).
3. Adicione um `script.md` para anotar a ideia e a narração.
4. Registre a composição em `src/Root.tsx`, dentro da pasta `Videos`.
5. Coloque imagens, áudios e vídeos em `public/`.

## Vídeos

| Composição       | Título         | Status                        |
| ---------------- | -------------- | ----------------------------- |
| `FamousFailures` | Falhas famosas | Conteúdo recriado (sem áudio) |
