import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/title-sponsor-1")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container m-auto p-8 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm mt-4">
      {/* Top Section: Logo + Name */}
      <div className="flex items-center gap-6 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Li Yueran Insurance Consultant</h1>
      </div>
      
      <hr className="border-gray-200 mb-8" />

      {/* Bottom Section: 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1-2: Text Block */}
        <div className="flex flex-col justify-end items-center text-center prose max-w-none md:col-span-2">
          <p className="text-lg">
            Providing comprehensive insurance solutions tailored to your needs. With years of experience and a dedication to client satisfaction, Li Yueran Insurance Consultant is your trusted partner for securing your future.
          </p>
          <p className="text-slate-400">
            Contact us today to learn more about our services and how we can help you protect what matters most.
          </p>
        </div>

        {/* Column 3: Image 1 */}
        <div className="flex justify-center items-start">
          <img
            src="/main_title_sponsors/side/consultant-sponsor.png"
            alt="Consultant Sponsor Feature 1"
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>

      </div>
    </div>
  );
}
