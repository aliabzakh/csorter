import CodeBackground from "@/components/CodeBackground";
import RankingApp from "@/components/RankingApp";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-slate-900 overflow-hidden">
      <CodeBackground />
      {/* Turner & Townsend Logo - replace /turner-townsend-logo.png with your actual logo PNG file */}
      <div className="fixed top-4 right-4 z-20 opacity-75">
        <Image
          src="/turner-townsend-logo.png"
          alt="Turner & Townsend Logo"
          width={200}
          height={141}
          className="object-contain"
        />
      </div>
      <RankingApp />
    </div>
  );
}
