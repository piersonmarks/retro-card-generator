# Retro Pokemon Card Generator

Transform your photos into retro Pokemon-style trading cards! This application uses AI to analyze your image, determine your Pokemon type, generate a unique special ability, and create a beautiful retro 90s Pokemon card complete with custom artwork.

## Features

- **Upload Your Photo** - Simply drag and drop or select an image
- **Enter Personal Details** - Add a name and birthday to personalize your card
- **AI-Powered Type Analysis** - Automatically determines your Pokemon type based on appearance, style, and vibes
- **Custom Special Ability** - Generates a unique special ability name and description just for you
- **Retro Art Style** - Transforms your photo into authentic 90s Pokemon card artwork with soft pixel art aesthetic
- **Download & Share** - Save your generated card as a high-quality PNG

## Tech Stack

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Styling
- **OpenAI GPT-4** - Image analysis and Pokemon type determination
- **FAL AI** - Retro image style generation
- **Vercel Blob** - Card storage
- **Vercel Workflow SDK** - Multi-step workflow orchestration

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or your preferred package manager

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
```

### Getting API Keys

- **OPENAI_API_KEY** - Get from [OpenAI Platform](https://platform.openai.com/)
- **FAL_KEY** - Get from [FAL AI](https://fal.ai/)
- **BLOB_READ_WRITE_TOKEN** - Get from [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob)

## Usage

1. Navigate to `http://localhost:3000`
2. Enter a name and birthday for the card
3. Upload a photo (drag & drop or click to browse)
4. Click "Generate Card"
5. Wait for the AI to analyze and generate your retro Pokemon card
6. Download your card or create another one!

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

## License

MIT
