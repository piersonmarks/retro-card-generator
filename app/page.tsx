import ImageUpload from "./components/image-upload";
import { WalletButton } from "./components/wallet-button";

export default function Home() {
  return (
    <div className="min-h-screen font-sans dark:bg-black">
      {/* Wallet button in top right */}
      <div className="flex justify-end p-4">
        <WalletButton />
      </div>

      {/* Main content */}
      <div className="flex items-center justify-center px-8">
        <div className="w-full max-w-2xl">
          <h1 className="mb-8 text-center font-semibold text-3xl text-black leading-10 tracking-tight dark:text-zinc-50">
            Retro Card Generator
          </h1>
          <ImageUpload />
        </div>
      </div>
    </div>
  );
}
