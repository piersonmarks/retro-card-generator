# Retro Pokemon Card Generator

Transform your photos into retro Pokemon-style trading cards! This application uses AI to analyze your image, determine your Pokemon type, generate a unique special ability, and create a beautiful retro 90s Pokemon card complete with custom artwork.

<img width="500" height="700" alt="pokemon-card (5)" src="https://github.com/user-attachments/assets/90355d4b-f368-4935-8ada-f10fad109245" />


## Features

- **Upload Your Photo** - Simply drag and drop or select an image
- **Enter Personal Details** - Add a name and birthday to personalize your card
- **AI-Powered Type Analysis** - Automatically determines your Pokemon type based on appearance, style, and vibes
- **Custom Special Ability** - Generates a unique special ability name and description just for you
- **Retro Art Style** - Transforms your photo into authentic 90s Pokemon card artwork with soft pixel art aesthetic
- **Download & Share** - Save your generated card as a high-quality PNG
- **💰 x402 Payment Integration** - Card generation requires a small payment via crypto ($0.01 USDC)

## Tech Stack

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Styling
- **OpenAI GPT-4** - Image analysis and Pokemon type determination
- **FAL AI** - Retro image style generation
- **Vercel Blob** - Card storage
- **Vercel Workflow SDK** - Multi-step workflow orchestration
- **x402** - Crypto payment protocol for API monetization

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or your preferred package manager
- A Web3 wallet (MetaMask, Coinbase Wallet, etc.) for payment
- Base Sepolia testnet USDC for testing

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pokemon-card-creator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see below)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
OPENAI_API_KEY=your_openai_api_key
FAL_KEY=your_fal_api_key
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
WALLET_PRIVATE_KEY=your_wallet_private_key # For server-side operations (optional)
```

**Important**: Also update `proxy.js` with your receiving wallet address for x402 payments. See [X402_SETUP.md](./X402_SETUP.md) for detailed payment setup.

### Getting API Keys

- **OPENAI_API_KEY** - Get from [OpenAI Platform](https://platform.openai.com/)
- **FAL_KEY** - Get from [FAL AI](https://fal.ai/)
- **BLOB_READ_WRITE_TOKEN** - Get from [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob)

## Usage

1. Navigate to `http://localhost:3000`
2. Connect your Web3 wallet when prompted
3. Enter a name and birthday for the card
4. Upload a photo (drag & drop or click to browse)
5. Click "Generate Card"
6. Approve the $0.01 USDC payment in your wallet
7. Wait for the AI to analyze and generate your retro Pokemon card
8. Download your card or create another one!

> **Note**: Card generation requires payment. Make sure you have USDC in your wallet on Base Sepolia (testnet) or Base (mainnet). See [X402_SETUP.md](./X402_SETUP.md) for payment setup details.

### x402 Base-Sepolia Testnet
1. If not already, install the Coinbase Wallet Extension.
2. Switch the wallet to be on the Base-Sepolia testnet to receive your coins.
3. Go to Coinbase Developer Platform faucet here to get free coins: https://portal.cdp.coinbase.com/products/faucet
4. Use the chrome extension on the website.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run linter

## How It Works

The app uses a multi-step workflow:

1. **Image Analysis** - OpenAI's GPT-4 Vision analyzes the uploaded photo to determine Pokemon type, special ability name, and description
2. **Retro Image Generation** - FAL AI transforms the photo into retro 90s Pokemon card artwork
3. **Card Creation** - Combines the generated artwork with personal details into a complete Pokemon card
4. **Storage** - Saves the final card to Vercel Blob storage and provides a download link

## Notes
We can't use the x402-next official middleware because it breaks the rules of middleware and causes the request to be consumed twice.

## License

MIT
