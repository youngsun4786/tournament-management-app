import { createFileRoute } from "@tanstack/react-router";
import { PageLayout } from "~/lib/components/page-layout";

export const Route = createFileRoute("/title-sponsor-1")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageLayout title="Li Yueran Insurance Consultant">
      <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-sm p-8">
      <hr className="border-gray-200 mb-8" />
      
      {/* Bottom Section: 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-min">
        {/* Column 1: Business Card */}
        <div className="flex justify-start items-start md:col-start-1 md:row-start-1">
          <img
            src="/main_title_sponsors/page/title-sponsor-1/consultant-sponsor.png"
            alt="Consultant Sponsor Feature 1"
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Row 2: Text Block (Spans 2 columns) */}
        <div className="prose max-w-none md:col-span-2 md:row-start-2 md:col-start-1">

          <p className="text-lg">
            Providing comprehensive insurance solutions tailored to your needs. With years of experience and a dedication to client satisfaction, Li Yueran Insurance Consultant is your trusted partner for securing your future.
          </p>
          <p className="text-slate-400">
            Contact us today to learn more about our services and how we can help you protect what matters most.
          </p>
        </div>

        {/* Column 3: More Pictures (Spans 2 rows) */}
        <div className="flex flex-col gap-4 md:col-start-3 md:row-start-1 md:row-span-2">
        </div>
      </div>
      </div>
    </PageLayout>
  );
}
