import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/title-sponsor-3")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container m-auto p-8 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm mt-4">
      {/* Top Section: Logo + Name */}
      {/* Top Section: Logos + Names */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-8 mb-8">
        {/* Rundle Dental */}
        <div className="flex items-center gap-6">
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

        {/* Chinook Village Dental */}
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Chinook Village Dental</h1>
          <a 
            href="https://chinookvillagedental.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <img
              src="/main_title_sponsors/logo/chinook-village.svg"
              alt="Chinook Village Dental Logo"
              className="h-20 w-28 object-contain"
            />
          </a>
        </div>
      </div>

      <hr className="border-gray-200 mb-8" />

      {/* Bottom Section: 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Column 1: Image 1 Card */}
        <div className="group relative flex flex-col items-start bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
          <div className="w-full relative">
            <img
              src="/main_title_sponsors/page/title-sponsor-3/rundle-dental-1.png"
              alt="Rundle Dental Feature 1"
              className="w-full h-auto object-cover"
            />
            {/* Gradient Overlay for visual sheen */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
          
          <div className="p-4 w-full bg-white space-y-1">
             <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
               <span className="w-2 h-2 rounded-full bg-green-500" />
               Service in Chinese provided
             </div>
             <div className="flex items-center gap-2 text-sm text-slate-500">
               <span className="w-2 h-2 rounded-full bg-blue-500" />
               Contact us: 587-317-9903
             </div>
          </div>
        </div>

        {/* Column 2: Image 2 Card (Center) */}
        <div className="flex justify-center items-start">
          <img
            src="/main_title_sponsors/page/title-sponsor-3/rundle-dental-2.png"
            alt="Rundle Dental Feature 2"
            className="w-full h-auto object-cover rounded-2xl shadow-md hover:scale-[1.02] transition-transform duration-300"
          />
        </div>

        {/* Column 3: Image 3 Card */}
        <div className="group relative flex flex-col items-start bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
          <div className="w-full relative">
             <img
              src="/main_title_sponsors/page/title-sponsor-3/rundle-dental-3.png"
              alt="Rundle Dental Feature 3"
              className="w-full h-auto object-cover"
            />
             {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>

          <div className="p-4 w-full bg-white space-y-1">
             <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
               <span className="w-2 h-2 rounded-full bg-green-500" />
               Service in Chinese provided
             </div>
             <div className="flex items-center gap-2 text-sm text-slate-500">
               <span className="w-2 h-2 rounded-full bg-blue-500" />
               Contact us: 587-328-1298
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
