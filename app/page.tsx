import ImageUpload from "./components/image-upload";

export default function Home() {
  return (
    <div className="m-8 flex items-center justify-center font-sans dark:bg-black">
      <div className="w-full max-w-2xl">
        <h1 className="mb-8 text-center font-semibold text-3xl text-black leading-10 tracking-tight dark:text-zinc-50">
          Retro Card Generator
        </h1>
        <ImageUpload />
      </div>
    </div>
  );
}
