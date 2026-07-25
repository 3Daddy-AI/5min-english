# Fluent Path

目的別に英語学習メニューを作る静的Webアプリです。初心者が「成長を実感しながら、楽しく続ける」ための設計になっています。

GitHubの `main` ブランチへのpushで、Vercelが自動的に本番デプロイします。

## Features

### 学習コンテンツ
- 3分診断（再診断可）でCEFRレベルと目的を判定。レベルは診断でのみ変わります
- 目的（旅行 / 仕事 / 留学 / 試験 / 日常会話）× 難度（基礎 / 応用）× 4技能の課題プール120問
- 課題は日替わりローテーション。全課題に模範解答とキーフレーズ付き
- 単語デッキ80語 + SRS（間隔反復）方式の「今日の単語」1日10枚
- Listening: ブラウザTTSによる音声再生（通常 / ゆっくり）+ ディクテーション採点
- Speaking: 音声入力（Web Speech API）対応、エラー時のガイダンス付き

### 成長の見える化
- ★1〜3の課題採点 + 技能別XPレーダーチャート
- 診断スコアの推移グラフ
- 回答履歴と「過去のあなた vs いまのあなた」の成長比較
- バッジ10種 + レベルアップ / バッジ獲得時の紙吹雪演出

### 継続の仕掛け
- 課題か単語を1つ終えると、その日が自動で学習記録される
- 連続学習日数 + 月1回の「おまもり」（1日休んでも連続記録が守られる）
- 週の目標日数（3 / 5 / 7日）設定
- 今日の達成リング（5メニュー中いくつ完了したか）
- Googleカレンダーへの毎日のリマインダー登録リンク
- 進捗データのJSONエクスポート / インポート

進捗は各ユーザーのブラウザ内 `localStorage` に保存されます（`fluentPathState`、schema v2。旧v1データは自動移行）。ログインすると、この進捗はSupabase経由でクラウドにも同期され、他の端末からも続きが見られます（後述）。

## クラウド同期（ログイン機能）のセットアップ

ログイン機能（メールのマジックリンク + Googleログイン）とクラウド同期は、無料のSupabaseプロジェクトを作成しないと有効になりません。未作成の間は `cloud.js` が自動的に無効化され、アプリはこれまで通り `localStorage` だけで問題なく動作します。

- [x] Supabaseプロジェクト作成、**Project URL** と **Publishable key**（Project Settings > API Keys。旧名称の「anon key」に相当）を取得
- [x] [`supabase/schema.sql`](supabase/schema.sql) を SQL Editor で実行（`profiles` / `progress` テーブル・RLS・トリガーを作成済み）
- [x] Authentication > URL Configuration に本番URLとローカル確認用URLを登録済み
- [x] Authentication > Sign In / Providers で **Email** は有効化済み（メールのマジックリンクは動作します）
- [ ] **Google** ログインは未設定。有効化するには、Google Cloud ConsoleでOAuthクライアントIDを作成し、SupabaseのSign In / Providers画面が示すコールバックURLを承認済みリダイレクトURIに登録してから、同画面でGoogleプロバイダーを有効にしてください
- [x] [`cloud.js`](cloud.js) 冒頭の `SUPABASE_URL` と `SUPABASE_ANON_KEY` に実際の値を設定済み

Publishable keyはRLS（行レベルセキュリティ）で保護される前提の公開鍵なので、フロントエンドのコードにそのまま埋め込んで問題ありません。同じ画面にある `secret key`（旧 service_role key）は絶対に使わないでください。

登録されたメールアドレスと、お知らせメールの同意状況は、Supabaseダッシュボードの `profiles` テーブル（Table Editor）または Authentication > Users でいつでも確認できます。

## Local Preview

```bash
python3 -m http.server 4173
```

Open:

```text
http://127.0.0.1:4173/
```

## Deploy

This app is fully static. Deploy these files to any static hosting service:

- `index.html`
- `styles.css`
- `app.js`
- `cloud.js`

Recommended options:

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages

※ `styles.css` と `app.js` はクエリパラメータ（`?v=N`）でキャッシュバスティングしています。ファイルを更新したら `index.html` 内のバージョン番号も上げてください。
