import { Play } from "lucide-react";
import { VIDEOS } from "@/lib/academy/videos";
export default function VideoLearningHub() {
  return (
    <section className="px-6 md:px-12 pb-14">
      <div className="mb-6"><p className="text-[11px] uppercase tracking-wider text-white/50 font-semibold">Video hub</p><h2 className="text-3xl md:text-4xl font-bold tracking-tight">Short lessons. Real wins.</h2></div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {VIDEOS.map((v) => (
          <button key={v.id} className="group relative aspect-[9/12] rounded-2xl overflow-hidden border border-white/10">
            <div className={`absolute inset-0 bg-gradient-to-br ${v.gradient}`} />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/40 text-white border border-white/20 backdrop-blur">{v.tag}</span>
            <span className="absolute top-2 right-2 text-[10px] text-white/90">{v.duration}</span>
            <div className="absolute inset-0 flex items-center justify-center"><span className="text-4xl drop-shadow">{v.emoji}</span></div>
            <div className="absolute bottom-0 inset-x-0 p-3 text-left bg-gradient-to-t from-black/70 to-transparent"><p className="text-[12px] font-semibold text-white leading-tight line-clamp-2">{v.title}</p><p className="text-[10px] text-white/70 mt-0.5">{v.creator}</p></div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><span className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center"><Play className="w-4 h-4 text-black fill-black ml-0.5" /></span></div>
          </button>
        ))}
      </div>
    </section>
  );
}
