# TanStack Router ガイド（本プロジェクト実装解説）

このプロジェクトは TanStack Router v1 の「ファイルベースルーティング」を採用し、実務で頻出する要素（データ取得、検索クエリ同期、ネスト/動的パラメータ、ガード、遅延ロード、ブロッカー、エラーハンドリング等）を盛り込んだサンプルです。

主要な実装ファイルは以下です：

- ルートレイアウト: `src/routes/__root.tsx`
- ホーム: `src/routes/index.tsx`
- Posts 一覧/詳細/コメント/編集: `src/routes/posts/index.tsx`, `src/routes/posts/$postId.tsx`, `src/routes/posts/$postId/comments.tsx`, `src/routes/posts/$postId/edit.tsx`
- Users 一覧（React Query）: `src/routes/users/index.tsx`
- 検索（search params 同期）: `src/routes/search.tsx`
- ログイン: `src/routes/login.tsx`
- Settings（ログイン必須 + ネスト）: `src/routes/settings/index.tsx`, `src/routes/settings/profile.tsx`, `src/routes/settings/account.tsx`
- Lazy ルート: `src/routes/heavy.lazy.tsx`

## セットアップ（ファイルベースルーティング）

- Vite プラグイン: `vite.config.ts` に `TanStackRouterVite()` を追加。
- 生成物: ルートツリーは `src/routeTree.gen` に生成され、`src/main.tsx` で `createRouter` に渡します。

> 補足: ローカルで `@tanstack/router-plugin` を未導入の場合は `npm i -D @tanstack/router-plugin` を実行してください。

## ルーティングの基本

- ルート定義は `createFileRoute('<path>')({...})` をエクスポートします。
- ルート階層はファイル/ディレクトリ構造で表現されます。
  - `src/routes/index.tsx` → `/`
  - `src/routes/posts/index.tsx` → `/posts`
  - `src/routes/posts/$postId.tsx` → `/posts/:postId`
  - `src/routes/settings/profile.tsx` → `/settings/profile`
- ルートレイアウトは `src/routes/__root.tsx` で `createRootRouteWithContext` を用いて作成し、`<Outlet />` で子を描画します。

## データ取得

このプロジェクトでは 2 パターンを併用しています：

- ルート `loader`: 例 `src/routes/posts/index.tsx`
  - `loader` 内で `fetch` を行い、結果は `Route.useLoaderData()` で参照。
  - `loaderDeps` により検索条件等で依存を定義し、変更時だけ再取得。
  - `pendingComponent` / `errorComponent` でロード中/エラー表示をルート単位で実装。
- React Query: 例 `src/routes/users/index.tsx`
  - `QueryClientProvider` を `src/main.tsx` に配置、`useQuery` でデータ取得。

## 検索クエリ（search params）

- `validateSearch` で型安全にクエリをパース・デフォルト化し、`Route.useSearch()` で取得。
- 例: `src/routes/posts/index.tsx` の `page`/`q`、`src/routes/search.tsx` の `q`/`sort`。
- `Route.navigate({ search: ... })` でフォーム変更をクエリに即時反映。

## 追加: 型強化（Zod）

本プロジェクトでは Zod を用いて `validateSearch`/`parseParams` の型とデフォルトを厳密化しました。

- 導入: `package.json` に `zod` を追加（`npm i zod`）。
- Posts 検索の型付けと既定値
  - `src/routes/posts/index.tsx` の `searchSchema`
  - `page` を `>=1` の整数へ強制、`q` は空文字を `undefined` にクレンジング
- Search の列挙型（`sort`）
  - `src/routes/search.tsx` の `searchSchema`
  - `sort` を `'relevance' | 'date'` に限定、未指定/不正値は `'relevance'`
- 動的パラメータ検証
  - `src/routes/posts/$postId.tsx` の `parseParams` で数値文字列のみ許可

ポイント
- `validateSearch` の戻り値型が、そのルートの `useSearch()` や `navigate({ search })` に反映されます。
- `.catch(default)` で未指定・不正値のデフォルトを一元管理。
- `.transform()` で空文字→`undefined` にして URL をクリーンに保つ設計。

## 動的パラメータ / ネスト

- `$postId.tsx` のように `$` 接頭辞でパラメータ化（`/posts/:postId`）。
- 親子関係はディレクトリで表現し、`<Outlet />` で子を描画（例: コメントページ）。

## ルートガード / リダイレクト

- `beforeLoad` で認可チェックし、未ログインなら `redirect` を投げて `/login` へ。
- 例: `src/routes/settings/index.tsx`。

## 追加: ルートガード高度化

ローカルストレージを用いた簡易認証をユーティリティに切り出し、未認証時のリダイレクトやロールチェックを強化しています。

- 認証ユーティリティ: `src/lib/auth.ts`
  - `getUser()/isAuthed()/hasRole()` と `login()/logout()` を提供
- ログイン画面: `src/routes/login.tsx`
  - `?redirect=/...` を受け取り、ログイン後に安全なパスへ遷移
  - Admin ロールを付与可能（チェックボックス）
- Settings の保護: `src/routes/settings/index.tsx`
  - `beforeLoad` で未認証を `/login?redirect=...` へ
  - `forbidden`/`back` クエリで権限不足のフィードバック表示
- Admin 専用ページ: `src/routes/settings/admin.tsx`
  - `hasRole('admin')` でロール検査し、権限不足は `/settings?forbidden=1` にリダイレクト

実務 Tips
- リダイレクト先は `/` から始まる相対パスのみ許容し、オープンリダイレクトを防止（`login.tsx` の Zod で実装）。
- 権限チェックは「グループ親の `beforeLoad`」に集約し、特定ページは追加チェックを重ねると保守性が高いです。

## ルートブロッカー（離脱確認）

- 未保存の編集がある場合に離脱をブロック。
- `useBlocker(dirty)` を利用（例: `src/routes/posts/$postId/edit.tsx`）。

## 遅延ロード（コード分割）

- `.lazy.tsx` 拡張子のルートは自動的にコード分割対象に。
- 例: `src/routes/heavy.lazy.tsx`。

## エラーハンドリング / 404 / Pending

- ルート毎に `errorComponent` / `pendingComponent` を設定可能。
- ルート全体の 404 は `__root.tsx` の `notFoundComponent` で実装。

## Devtools / スクロール復元

- ルートレイアウトに `<TanStackRouterDevtools />` を配置。
- `createRouter` オプションで `scrollRestoration: true` を有効化。

## 実務での使い所メモ

- ページングやフィルタは `validateSearch` + `loaderDeps` で安定運用。
- SSR しない SPA でも `loader` によるプリロードと `pendingComponent` で UX 向上。
- 認可が必要なセクションは `beforeLoad` で一括ガード。
- 大規模画面は `.lazy.tsx` で初期ロードを削減。

## 参考

- TanStack Router Docs: https://tanstack.com/router/latest/docs/framework/react/overview
- File Based Routing: https://tanstack.com/router/latest/docs/framework/react/guide/file-based-routing
- Code Based Routing: https://tanstack.com/router/latest/docs/framework/react/guide/code-based-routing
