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
            src="/main_title_sponsors/logo/gong-law.webp"
            alt="Gong Law Logo"
            className="h-20 w-auto object-contain"
          />
        </a>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gong Law</h1>
      </div>
      
      <hr className="border-gray-200 mb-8" />

      {/* Bottom Section: 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: Text Block */}
        <div className="prose max-w-none">
          <p className="text-lg">
            Gong Law provides professional legal services with a focus on delivering results. Our experienced team is dedicated to guiding you through complex legal matters with clarity and confidence.
          </p>
          <p>
            Whether you need assistance with real estate, business law, or family matters, Gong Law is here to advocate for your best interests.
          </p>
        </div>

        {/* Column 2: Image 1 */}
        <div className="flex justify-center items-start">
          <img
            src="/main_title_sponsors/side/gong-law-sponsor.png"
            alt="Gong Law Feature 1"
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Column 3: Image 2 */}
        <div className="flex justify-center items-start">
          <div className="w-full aspect-2/3 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 shadow-md">
            <span>Image 2 Placeholder</span>
          </div>
        </div>
      </div>
    </div>
  );
}
