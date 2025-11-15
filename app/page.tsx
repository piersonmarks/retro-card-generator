import ImageUpload from "./components/image-upload";

export default function Home() {
  return (
    <div className="flex items-center justify-center font-sans dark:bg-black m-8">
        <div className="w-full max-w-2xl">
          <h1 className="mb-8 text-center text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Upload an Image
          </h1>
          <ImageUpload />
        </div>
    </div>
  );
}
