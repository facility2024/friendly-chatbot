

# Plano de Implementacao -- Nutrivision Completo

## Resumo

O app ja tem as telas basicas criadas com dados estaticos. Este plano transforma tudo em um sistema real com banco de dados, painel admin e funcionalidades completas.

## O que ja existe
- Splash screen, Login, Dashboard, IMC, Gordura Corporal, Camera, Treinos, Caminhada, Meta de Agua, Receitas, Lojas, Dicas
- Autenticacao com Supabase (email/senha)
- Todos os modulos usam dados hardcoded (sem banco)

## O que falta construir

### Fase 1 -- Banco de Dados (Tabelas Supabase)

Criar as seguintes tabelas com RLS:

- **training_videos**: id, title, description, video_url, thumbnail_url, category, duration, published, created_at
- **recipes**: id, title, description, video_url, thumbnail_url, category, prep_time, published, created_at
- **stores**: id, name, photo_url, address, phone, whatsapp, maps_link, published, created_at
- **tips_pdf**: id, title, description, file_url, published, created_at
- **water_logs**: id, user_id, date, cups, goal_ml, created_at
- **walk_logs**: id, user_id, steps, distance_km, duration_seconds, calories, created_at

Politicas RLS:
- Videos, receitas, lojas, PDFs: SELECT publico (published = true), ALL para admins
- water_logs e walk_logs: usuarios leem/escrevem apenas seus proprios dados

Storage bucket: `content-uploads` (publico) para thumbnails, fotos de lojas e PDFs.

### Fase 2 -- Treinos com Categorias e Videos Reais

Reescrever `Treinos.tsx`:
- Buscar dados da tabela `training_videos`
- Filtro por categoria (Alongamento, Mobilidade, Caminhada, Exercicios leves, Terceira idade, Postura, Bem-estar)
- Cards com thumbnail, titulo, categoria, duracao, botao assistir
- Player de video embutido (YouTube/Vimeo embed)

### Fase 3 -- Meta de Agua Inteligente

Reescrever `MetaAgua.tsx`:
- Calcular meta baseada no peso do usuario (35ml x peso)
- Input de peso na primeira vez
- Salvar progresso diario no banco (water_logs)
- Barra de progresso
- Sistema de alerta sonoro via Web Audio API + Speech Synthesis
- Botao ativar/desativar lembretes
- Mensagem em audio: "Voce ainda nao cumpriu sua meta de agua de hoje"

### Fase 4 -- Receitas Light com Video

Reescrever `Receitas.tsx`:
- Buscar da tabela `recipes`
- Cards com thumbnail, nome, tempo, categoria, botao assistir
- Filtro por categoria
- Player de video embutido

### Fase 5 -- Lojas de Produtos Naturais

Reescrever `Lojas.tsx`:
- Buscar da tabela `stores`
- Cards com foto, nome, endereco, telefone/WhatsApp
- Botao "Ver localizacao" abrindo Google Maps
- Botao WhatsApp direto

### Fase 6 -- Dicas em PDF

Reescrever `Dicas.tsx`:
- Buscar da tabela `tips_pdf`
- Botao visualizar (abre PDF no navegador)
- Botao baixar

### Fase 7 -- Caminhada com Persistencia

Atualizar `Caminhada.tsx`:
- Salvar sessoes no banco (walk_logs)
- Historico de caminhadas anteriores

### Fase 8 -- Painel Administrativo

Criar rota `/admin` protegida (verificacao de role `admin` via `has_role`):

- **Admin Dashboard**: visao geral com contadores
- **Gerenciar Treinos**: CRUD completo com upload de thumbnail e link de video
- **Gerenciar Receitas**: CRUD com upload e categorias
- **Gerenciar Lojas**: CRUD com foto, endereco, telefone, maps
- **Gerenciar PDFs**: CRUD com upload de arquivo PDF
- **Usuarios**: lista com nome, email, WhatsApp, data de cadastro
- **Publicar/Despublicar** conteudos

Componentes do admin: AdminLayout (sidebar), DataTable reutilizavel, FormDialog para CRUD.

### Fase 9 -- PWA

Adicionar `manifest.json` com icones e `display: standalone` (sem service worker para evitar problemas no preview). App instalavel via "Adicionar a tela inicial".

## Detalhes Tecnicos

- 6 novas tabelas Supabase + 1 storage bucket
- ~15 novos arquivos (paginas admin + componentes)
- ~10 arquivos atualizados (modulos existentes para usar dados reais)
- Usar `has_role(auth.uid(), 'admin')` para proteger o painel admin
- Web Audio API / Speech Synthesis para alerta de agua

## Ordem de Execucao

1. Migracoes SQL (tabelas + RLS + storage)
2. Modulos atualizados (Treinos, Receitas, Lojas, Dicas, Agua, Caminhada)
3. Painel Admin completo
4. PWA manifest

