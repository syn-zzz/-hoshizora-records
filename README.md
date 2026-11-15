# ほしぞらレコード — ポートフォリオ用デモサイト

架空の中古レコード店「ほしぞらレコード」のウェブサイト制作デモです。  
実在する店舗のリニューアル提案を想定した制作物で、  
実際の制作プロセス（要件定義 → デザイントークン設計 → 実装 → 品質確認）を通しで体験・記録するために作りました。

**デモ URL**: https://syn-zzz.github.io/hoshizora-records/

---

## 制作の流れ

1. **要件定義・仕様書作成** — サイトマップ、コンテンツ、デザインルール、チェックリストをドキュメント化
2. **ヒーロー案の比較検討** — A・B・C 3案を `hero-lab/` に並べてビジュアル比較
3. **デザイントークン設計** — `tokens.css` に `--hr-` プレフィックスの CSS 変数を集約。カラーコード直書きなし
4. **モバイルファーストで実装** — ブレイクポイント 600px / 960px
5. **インタラクション追加** — PC ホバー時にレコード盤が出現するカードアニメーション（WebGL ライクなリング背景も含む）
6. **品質確認** — Playwright で 3 サイズのスクリーンショット確認、Lighthouse モバイル Performance 100 点達成

---

## 技術スタック

| カテゴリ | 内容 |
| --- | --- |
| マークアップ | HTML5（セマンティクス重視、ARIA 属性つき） |
| スタイリング | CSS（Custom Properties / Grid / Flexbox / アニメーション） |
| スクリプト | Vanilla JS（ES Modules なし、defer 読み込み） |
| アニメーション | GSAP（WebGL ライクなリング背景） |
| 地図 | OpenStreetMap 埋め込み（API キー不要） |
| テスト | Playwright（スクリーンショット確認）、Lighthouse |

---

## ハイライト

- **レコード盤アニメーション** — ジャケット写真からレコード盤が回転しながら出現（PC ホバー時）。`prefers-reduced-motion` 対応
- **WebGL ライクなリング背景** — Canvas + JS で描画するヒーロー背景（GSAP でアニメーション）
- **Lighthouse 100 点** — モバイル Performance スコア 100 を達成
- **アクセシビリティ** — キーボードナビゲーション、スキップリンク、ARIA ラベル対応
- **Claude Code 活用** — 仕様書との一貫性チェック・実装・デバッグ・スクリーンショット確認を AI ペアプログラミングで進行

---

## フォルダ構成

```
hoshizora-records/
  index.html             トップページ
  access/                アクセスページ
  news/                  入荷情報一覧・詳細
  buyback/               買取りページ
  calendar/              営業日カレンダー
  contact/               お問い合わせフォーム
  first-time/            はじめての方へ
  privacy-policy/        プライバシーポリシー
  hero-lab/              ヒーロー3案の比較用
  assets/css/            tokens.css（CSS変数）、style.css
  assets/js/             main.js、vendor/gsap.min.js
  images/                WebP画像
  docs/                  仕様書（サイトマップ・デザイン・コンテンツ等）
  screenshots/           Playwright 確認用スクリーンショット
```

---

## 注意事項

- すべての店舗情報（名称・住所・電話番号・地図等）は架空のものです
- 商品画像は AI 生成またはデモ用の素材です
- 実在する店舗・人物・商品とは一切関係ありません
