# Symbol と Ethereum ブロックチェーン統合

このプロジェクトは、Symbol ブロックチェーン（KnowledgeCardToken で使用）と Ethereum ブロックチェーン（KnowledgeLockdownBreakers で使用）の間の統合を提供します。

## 概要

この統合により、以下のことが可能になります：

1. Symbol ブロックチェーンからナレッジカードを取得する
2. Symbol カードを Ethereum NFT に変換する
3. プラットフォーム間でユーザーデータを同期する

## 技術的な詳細

### フロントエンド統合

フロントエンド統合は以下のコンポーネントで構成されています：

- `SymbolBridge.ts`: Symbol ブロックチェーンとの通信を処理するクラス
- `SymbolCardComponent.tsx`: Symbol カードを表示し、NFT への変換を可能にするコンポーネント
- `SymbolIntegration.tsx`: 統合 UI を提供するメインコンポーネント

### バックエンド統合

バックエンド統合は以下のコンポーネントで構成されています：

- `symbol_integration.py`: Symbol ブロックチェーンと通信するための API エンドポイント

## セットアップ手順

### 環境構築

1. 必要なパッケージをインストールする

```bash
# フロントエンド
cd KnowledgeLockdownBreakers
npm install axios

# バックエンド
cd backend
pip install -r requirements.txt
```

2. 環境変数を設定する

```bash
# バックエンド用の .env ファイルを作成
cd KnowledgeLockdownBreakers/backend
cp .env.example .env
```

`.env` ファイルに以下の変数を追加：

```
SYMBOL_API_URL=http://localhost:3000
SYMBOL_NODE=https://sym-test.opening-line.jp:3001
SYMBOL_NETWORK=152
SYMBOL_METADATA_KEY=knowledge_card
```

## 使用方法

1. バックエンドを起動する

```bash
cd KnowledgeLockdownBreakers/backend
uvicorn main:app --reload
```

2. フロントエンドを起動する

```bash
cd KnowledgeLockdownBreakers
npm run dev
```

3. ブラウザで `http://localhost:5173` にアクセスする

4. UI の右下にある Symbol 統合ボタン（🔄）をクリックして、Symbol カードを表示・NFT に変換する

## Technical Details

### Symbol to Ethereum Bridge

The integration creates a bridge between Symbol and Ethereum blockchains by:

1. Fetching knowledge cards from Symbol blockchain
2. Converting card data to a format suitable for Ethereum NFTs
3. Minting NFTs on Ethereum blockchain

### Data Flow

1. User requests Symbol cards via the UI
2. Frontend calls backend API to fetch cards from Symbol blockchain
3. User selects a card to convert to NFT
4. Frontend calls backend API to convert the card to NFT
5. Backend mints an NFT on Ethereum blockchain
6. Frontend displays the newly minted NFT

### Security Considerations

- User authentication is required for both platforms
- Private keys are never exposed in the frontend
- All blockchain transactions are signed securely
