# 工程2のプロンプト集：ほしぞらレコード デモサイト

あなたのパソコンの Claude Code で、上から順番に進める。各プロンプトは「」の中をそのまま貼り付ければよい。

## 準備（最初に1回だけ）

### 1. フォルダを作る

```
hoshizora-records/
  CLAUDE.md          … このプロジェクトの CLAUDE.md を置く
  docs/              … Design.md、CONTENTS.md、CONTENTS_PAGES.md、SITEMAP.md、PLAN.md、CHECKLIST.md を置く
```

### 2. Git を始める（ターミナルで）

```
cd hoshizora-records
git init
```

### 3. Claude Code を起動して、スキルと MCP を入れる

ターミナルで（Playwright MCP）：

```
claude mcp add playwright npx @playwright/mcp@latest
```

Claude Code を起動（`claude`）して、中で次を実行：

```
/plugin install frontend-design@claude-plugins-official
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

Claude Code を一度終了して起動し直し、`/plugin` と `/mcp` で3つとも有効になっているか確認する。
ヒーロー3案を作る間は `/model` で最上位のモデルを選ぶ。

---

## プロンプト1：土台を作る

「CLAUDE.md と docs/ の仕様書をすべて読んでください。そのうえで、トップページの土台を作ってください。

- assets/css/tokens.css に Design.md 8章の CSS変数をそのまま書く
- assets/css/style.css にリセット、本文の文字設定（Design.md 3章）、ボタン（主要・副・紺の上）、セクション見出しの型（英字ラベル＋h2）を書く
- index.html にヘッダーだけを作る（文字ロゴ＋星、ナビ、副ボタン「買取を相談する」、ナビの下に営業時間）。文章は CONTENTS.md 1章
- assets/js/main.js に営業中バッジの判定を書く（Design.md 5章。Asia/Tokyo の曜日と時刻で判定、判定できないときは出さない）
- Google Fonts は Design.md 3章の2書体・ウェイトだけ

作り終えたら、Playwright で3つの画面幅のスクリーンショットを撮って見せてください。」

確認すること：色・フォントが Design.md どおりか、ヘッダーのボタンが枠線だけ（副）になっているか。OKなら commit。

---

## プロンプト2：ヒーロー3案を作る

「docs/PLAN.md の『3. ヒーロー3案』に沿って、hero-lab/ にヒーローだけのページを3つ作ってください（hero-a.html、hero-b.html、hero-c.html）。

- 3案とも、プロンプト1のヘッダーと tokens.css・style.css を読み込む
- 文章は CONTENTS.md 2章（メインコピー、サブコピー、営業中バッジ、主要ボタン『行き方を見る』、副ボタン『新着入荷を見る』）
- 『全案に共通の条件』をすべて守る。特に、375×667 の画面でキャッチ・営業中バッジ・『行き方を見る』が最初に見えること、重さの上限、prefers-reduced-motion のときは止まった完成状態で表示すること
- 写真は使わないか、使う場合は Design.md のプレースホルダーにする
- 案A・Bは GSAP か CSS だけ。案Cは素の WebGL（three.js は使わない）で、非対応のときは静止した SVG に切り替える
- GSAP は npm で入れて、gsap.min.js を assets/js/vendor/ にコピーして使う

作り終えたら、案ごとに何KBになったか（HTML・CSS・JS・画像）を表にしてください。」

---

## プロンプト3：3案を比べる

「hero-lab/ の3案を比べる材料を作ってください。

1. ローカルサーバーを立てる（npx serve など）
2. Playwright で、3案それぞれ 375×667／768×1024／1280×800 のスクリーンショットを screenshots/hero/ に保存する。prefers-reduced-motion: reduce の状態の 375×667 も撮る
3. Lighthouse（npx lighthouse）のモバイル計測で、3案の Performance・LCP・CLS・合計転送量を表にする
4. docs/PLAN.md の目標（Performance 90以上、LCP 2.5秒以内、CLS 0.1以下）を満たしているか、案ごとに書く

どの案がいいかの意見も、理由つきで1つ挙げてください。」

確認すること：スクリーンショットを自分の目で見て、実際にスマホでも開いてみる（同じ Wi-Fi なら、ローカルサーバーのURLをスマホで開ける）。案を1つ決める。気に入った部分を組み合わせてもよい。

---

## プロンプト4A：ヒーローJを index.html に組み込む（2026-11-08 更新）

※ プロンプト2・3（ヒーロー案の比較）は終了。ヒーローは hero-lab/hero-j.html に決定。

「ヒーローは hero-lab/hero-j.html に決定しました。docs/Design.md（2章の色、4章の背景リズム、5章のヒーロー・ヘッダー）と docs/CONTENTS.md（1章・2章）を読み直してください。色は白が基本になり、生成りは要所だけ、アクセントは朱だけに変わりました。

1. assets/css/tokens.css を Design.md 8章の CSS変数に合わせて更新する（--hr-bg を白に、--hr-bg-kinari と --hr-footer を追加）
2. index.html のヘッダーを hero-j.html と同じにする（メニュー6項目、ロゴ横の猫アイコン、今いるページを朱色に）。ヘッダーの部品は style.css に移し、hero-j.html の中だけの書き方（--hr-bg の上書きなど）は不要になったら消す
3. index.html の仮のヒーローを、hero-j.html のヒーロー（白背景、波打つリング、キャッチ「欲しい1枚に／ここで出会う。」、説明文2行）に置き換える。リングの JS は assets/js/hero-rings.js、CSS は style.css に分ける
4. hero-j.html と index.html の見た目と動きが同じか、375px・768px・1280px のスクリーンショットで確認する
5. 問題なければコミットする」

## プロンプト4B：中身を作る（ABOUT〜フッター）

「index.html のヒーローの下に、docs/CONTENTS.md の 3〜13章を順番に作ってください。

- 背景のリズムは docs/Design.md 4章（白と生成りが交互、フッターは墨）。アクセントの色は朱だけ
- 入荷カード・タグ・行き方ステップ・スマホ固定バーは Design.md 5章どおり
- 画像はすべてプレースホルダー（あとで入れる）
- ヘッダーのメニューは「ホーム・はじめての方へ・入荷情報・営業日・アクセス・お問い合わせ」。買取へはヘッダーのボタンとフッターから行けるようにする
- 1章ずつ作り、章ごとに 375px と 1280px のスクリーンショットで確認する

全部できたら、docs/CHECKLIST.md の『表示・レスポンシブ』『デザイン』『アクセシビリティ』『内容』を確認して、できていない項目を一覧にしてください。」

## プロンプト4C：スクロール演出

「docs/Design.md 5章『ヒーロー』のスクロール演出のルールに沿って、トップページにスクロール演出を入れてください。

- ヒーローのリングとつながる動きにする（例：スクロールするとリングが少しずつ小さく・薄くなる、セクションの区切りにリングと同じ細い線を使う、見出しの英字ラベルと日本語の見出しがすっと現れる）
- スクロールを乗っ取らない。CSS の animation-timeline を優先し、対応していないブラウザ・reduced-motion では完成状態で表示
- 動かすのは transform と opacity だけ
- 作る前に、セクションごとの動きを短く説明してから作り始める」

## プロンプト5：画像を入れる

自分で Pexels・Pixabay から写真を選んでダウンロードし、images/original/ に入れてから：

「images/original/ の写真を WebP に変換して images/ に置いてください（長辺1600px、スマホ用に長辺800pxも作る）。
CONTENTS.md の画像パスに合わせたファイル名にして、プレースホルダーと差し替えてください。

- img に width・height・srcset を付け、ファーストビュー以外は loading="lazy"
- alt は写っているものを具体的に書く。フリー素材なので『ほしぞらレコードの店内』とは書かない
- images/credits.md に、ファイル名・出典サイト・撮影者・URLの表を作る（出典はわたしが伝えます）

差し替えたら Lighthouse のモバイル計測をもう一度して、プロンプト3の数値と比べてください。」

---

## 工程2が終わったら

* docs/CHECKLIST.md の該当項目がすべてOKになったら commit
* 工程3（Local で WordPress を作り、自作テーマに変換）へ進む
