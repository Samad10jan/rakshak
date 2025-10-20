
export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      <h1 className="text-center text-4xl font-extrabold">RAKSHAK</h1>
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Get started RakShak API{" "}
            <code className="bg-black/[.05] font-mono font-semibold px-1 py-0.5 rounded">
              rakshak/api/route..
            </code>
            
          </li>
          <li className="tracking-[-.01em]">
            Get All Data Instantly
          </li>
        </ol> 
      </main>
  
    </div>
  );
}
