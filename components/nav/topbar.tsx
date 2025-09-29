"use client";
export default function Topbar(){
  return (
    <header className="h-14 border-b px-4 flex items-center justify-between">
      <div className="text-sm opacity-70">MedTrack Internal</div>
      <div className="flex items-center gap-3">
        <input placeholder="Search (⌘K)" className="border rounded-md h-8 px-3 text-sm" />
      </div>
    </header>
  );
}
