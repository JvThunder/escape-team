"use client";

export default function DownloadButton({
  missionId,
  missionName,
}: {
  missionId: number;
  missionName: string;
}) {
  return (
    <a
      href={`/pdfs/mission-${missionId}.pdf`}
      download
      className="flex items-center justify-center w-6 h-6 rounded border border-gray-700 text-gray-400 hover:border-[#fb4f13]/50 hover:text-[#fb4f13] transition-colors"
      title={`Download ${missionName} PDF`}
      onClick={(e) => e.stopPropagation()}
    >
      <svg
        className="w-3 h-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
    </a>
  );
}
