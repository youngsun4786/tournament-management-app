import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/title-sponsor-3")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container m-auto p-8 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm mt-4">
      {/* Top Section: Logo + Name */}
      <div className="flex items-center gap-6 mb-6">
        <a 
          href="https://rundledental.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity"
        >
          <img
            src="/main_title_sponsors/logo/rundle-dental.svg"
            alt="Rundle Dental Logo"
            className="h-20 w-auto object-contain"
          />
        </a>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Rundle Dental</h1>
      </div>

      <hr className="border-gray-200 mb-8" />

      {/* Bottom Section: 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Column 1: Image 1 */}
        <div className="flex justify-center items-start">
          <img
            src="/main_title_sponsors/page/title-sponsor-3/rundle-dental-1.png"
            alt="Rundle Dental Feature 1"
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Column 2: Image 2 */}
        <div className="flex justify-center items-start">
          <img
            src="/main_title_sponsors/page/title-sponsor-3/rundle-dental-2.png"
            alt="Rundle Dental Feature 1"
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Column 3: Image 3 */}
        <div className="flex justify-center items-start">
          <img
            src="/main_title_sponsors/page/title-sponsor-3/rundle-dental-3.png"
            alt="Rundle Dental Feature 1"
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
}
