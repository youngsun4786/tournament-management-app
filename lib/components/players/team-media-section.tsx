import { Loader2, Upload, UploadCloud, User } from "lucide-react";
import { Button } from "~/lib/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/lib/components/ui/card";
import { useImageUpload } from "~/lib/hooks/use-image-upload";
import { Team } from "~/src/types/team";

interface TeamMediaSectionProps {
  teamId: string;
  team?: Team;
}

export const TeamMediaSection = ({ teamId, team }: TeamMediaSectionProps) => {
  const logo = useImageUpload({
    teamId,
    field: "logoUrl",
    label: "Team logo",
    folder: "teams",
  });

  const photo = useImageUpload({
    teamId,
    field: "imageUrl",
    label: "Team photo",
    folder: "teams",
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Logo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-white shadow-md relative group shrink-0">
              {logo.preview ? (
                <img
                  src={logo.preview}
                  alt="Team logo preview"
                  className="w-full h-full object-contain p-2"
                />
              ) : team?.logoUrl ? (
                <img
                  src={
                    team.logoUrl.startsWith("http")
                      ? team.logoUrl
                      : `/team_logos/${team.logoUrl}`
                  }
                  alt={`${team?.name} logo`}
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              )}

              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-white hover:bg-white/20"
                  onClick={() => logo.inputRef.current?.click()}
                >
                  <Upload className="h-6 w-6" />
                </Button>
              </div>
              <input
                type="file"
                ref={logo.inputRef}
                className="hidden"
                accept="image/*"
                onChange={logo.handleChange}
              />
            </div>
            {logo.file && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={logo.handleUpload}
                >
                  {logo.isUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <UploadCloud className="mr-2 h-4 w-4" />
                  )}
                  Save Logo
                </Button>
                <Button variant="ghost" size="sm" onClick={logo.cancel}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Photo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden group">
            {photo.preview ? (
              <img
                src={photo.preview}
                alt="Team Photo Preview"
                className="w-full h-full object-cover"
              />
            ) : team?.imageUrl ? (
              <img
                src={team?.imageUrl}
                alt="Team Photo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Upload className="h-12 w-12 mb-2" />
                <span>Upload Team Photo</span>
              </div>
            )}

            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                onClick={() => photo.inputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" /> Change Photo
              </Button>
            </div>
            <input
              type="file"
              ref={photo.inputRef}
              className="hidden"
              accept="image/*"
              onChange={photo.handleChange}
            />
          </div>
          {photo.file && (
            <div className="mt-4 flex gap-2">
              <Button onClick={photo.handleUpload}>
                {photo.isUploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UploadCloud className="mr-2 h-4 w-4" />
                )}
                Save Photo
              </Button>
              <Button variant="ghost" onClick={photo.cancel}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
