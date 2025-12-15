import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/title-sponsor-2")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container m-auto p-8 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm mt-4">
      {/* Top Section: Logo + Name */}
      <div className="flex items-center gap-6 mb-6">
        <a 
          href="https://gonglaw.ca/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity"
        >
          <img
            src="/main_title_sponsors/logo/gong-law.png"
            alt="Gong Law Logo"
            className="h-20 w-auto object-contain"
          />
        </a>
      </div>
      
      <hr className="border-gray-200 mb-8" />

      {/* Bottom Section: 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-min">
        {/* Column 1: Business Card */}
        <div className="flex justify-start items-start md:col-start-1 md:row-start-1">
          <img
            src="/main_title_sponsors/side/gong-law-sponsor.png"
            alt="Gong Law Business Card"
            className="w-full max-w-sm h-auto object-contain rounded-lg shadow-md"
          />
        </div>

        {/* Row 2: Text Block (Spans 2 columns) */}
        <div className="prose max-w-none md:col-span-2 md:row-start-2 md:col-start-1">
          <p className="text-lg">
            Gong Law provides professional legal services with a focus on delivering results. Our experienced team is dedicated to guiding you through complex legal matters with clarity and confidence.
          </p>
          <p className="text-slate-400">
            Whether you need assistance with real estate, business law, or family matters, Gong Law is here to advocate for your best interests.
          </p>
        </div>

        {/* Column 3: More Pictures (Spans 2 rows) */}
        <div className="flex flex-col gap-4 md:col-start-3 md:row-start-1 md:row-span-2">
        </div>
      </div>
    </div>
  );
}
