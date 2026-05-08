import { useMemo, useState } from "react";
import { format, isSameDay, parseISO, addDays, startOfDay } from "date-fns";
import {
  Calendar as CalendarIcon, List, Instagram, Facebook, Twitter, Linkedin,
  MoreVertical, Pencil, Clock, Send, Trash2, Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useScheduledPosts, ScheduledPost } from "@/hooks/useScheduledPosts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PLATFORM_ICON: Record<string, any> = {
  instagram: Instagram, facebook: Facebook, x: Twitter, twitter: Twitter, linkedin: Linkedin,
};
const STATUS_STYLE: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  scheduled: "bg-primary/10 text-primary",
  published: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  failed: "bg-destructive/10 text-destructive",
};

export default function ScheduledPostsPanel() {
  const { posts, update, remove, create } = useScheduledPosts();
  const [view, setView] = useState<"list" | "calendar">("list");
  const [editing, setEditing] = useState<ScheduledPost | null>(null);
  const [creating, setCreating] = useState(false);

  const upcoming = useMemo(
    () => posts.filter((p) => p.status !== "published").slice(0, 8),
    [posts]
  );

  const next7 = useMemo(() => {
    const now = startOfDay(new Date());
    return posts.filter((p) => {
      const d = parseISO(p.scheduled_for);
      return d >= now && d <= addDays(now, 7);
    }).length;
  }, [posts]);

  const today = useMemo(
    () => posts.filter((p) => isSameDay(parseISO(p.scheduled_for), new Date())).length,
    [posts]
  );

  const nextPost = upcoming[0];

  return (
    <section className="bg-card rounded-2xl p-6 border border-border/40">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h3 className="font-semibold">Upcoming posts</h3>
          <p className="text-xs text-muted-foreground">Schedule, reschedule, and publish in one place</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex bg-secondary rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setView("list")}
              className={cn("px-2.5 py-1 rounded-md inline-flex items-center gap-1.5", view === "list" && "bg-background shadow-sm")}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
            <button
              onClick={() => setView("calendar")}
              className={cn("px-2.5 py-1 rounded-md inline-flex items-center gap-1.5", view === "calendar" && "bg-background shadow-sm")}
            >
              <CalendarIcon className="w-3.5 h-3.5" /> Calendar
            </button>
          </div>
          <Button size="sm" onClick={() => setCreating(true)} className="bg-gradient-hero text-primary-foreground">
            <Plus className="w-3.5 h-3.5" /> Schedule
          </Button>
        </div>
      </div>

      {/* Important dates rail */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <RailStat label="Today" value={today.toString()} />
        <RailStat label="Next 7 days" value={next7.toString()} />
        <RailStat
          label="Next post"
          value={nextPost ? format(parseISO(nextPost.scheduled_for), "MMM d, HH:mm") : "—"}
          sub={nextPost?.title}
        />
      </div>

      {posts.length === 0 ? (
        <EmptyState onCreate={() => setCreating(true)} />
      ) : view === "list" ? (
        <ListView posts={upcoming} onEdit={setEditing} onUpdate={update} onRemove={remove} />
      ) : (
        <CalendarView posts={posts} onEdit={setEditing} />
      )}

      <EditDialog
        post={editing}
        onClose={() => setEditing(null)}
        onSave={async (patch) => {
          if (editing) await update(editing.id, patch);
          setEditing(null);
          toast.success("Post updated");
        }}
      />
      <EditDialog
        post={creating ? ({ id: "", title: "", caption: "", image_url: "", platform: "instagram", scheduled_for: new Date().toISOString(), status: "scheduled", campaign_id: null } as ScheduledPost) : null}
        onClose={() => setCreating(false)}
        onSave={async (patch) => {
          await create({ ...patch, status: "scheduled" });
          setCreating(false);
          toast.success("Post scheduled");
        }}
        isNew
      />
    </section>
  );
}

function RailStat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-border/40 bg-secondary/40 px-4 py-3">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">{label}</p>
      <p className="text-lg font-semibold tracking-tight mt-0.5">{value}</p>
      {sub && <p className="text-[11px] text-muted-foreground truncate">{sub}</p>}
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <button
      onClick={onCreate}
      className="w-full border-2 border-dashed border-border rounded-2xl p-10 text-center hover:border-primary/40 hover:bg-secondary/30 transition-colors"
    >
      <div className="w-12 h-12 rounded-2xl bg-gradient-hero mx-auto flex items-center justify-center mb-3 shadow-glow">
        <CalendarIcon className="w-5 h-5 text-primary-foreground" />
      </div>
      <p className="text-sm font-medium">Schedule your first post</p>
      <p className="text-xs text-muted-foreground">Plan, queue, and publish from one timeline.</p>
    </button>
  );
}

function ListView({
  posts, onEdit, onUpdate, onRemove,
}: {
  posts: ScheduledPost[];
  onEdit: (p: ScheduledPost) => void;
  onUpdate: (id: string, patch: Partial<ScheduledPost>) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}) {
  return (
    <ul className="divide-y divide-border/40">
      {posts.map((p) => {
        const Icon = PLATFORM_ICON[p.platform] ?? Instagram;
        const date = parseISO(p.scheduled_for);
        return (
          <li key={p.id} className="py-3 flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-secondary overflow-hidden flex-shrink-0 flex items-center justify-center">
              {p.image_url ? (
                <img src={p.image_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <Icon className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-medium truncate">{p.title}</p>
                <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full", STATUS_STYLE[p.status])}>
                  {p.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon className="w-3 h-3" />
                <span>{format(date, "EEE, MMM d · HH:mm")}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="sm" variant="ghost" onClick={() => onEdit(p)}>
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <RescheduleQuick post={p} onUpdate={onUpdate} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost"><MoreVertical className="w-3.5 h-3.5" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => { onUpdate(p.id, { status: "published" }); toast.success("Marked as published"); }}>
                    <Send className="w-3.5 h-3.5 mr-2" /> Publish now
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { onRemove(p.id); toast.success("Removed"); }} className="text-destructive">
                    <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function RescheduleQuick({
  post, onUpdate,
}: { post: ScheduledPost; onUpdate: (id: string, patch: Partial<ScheduledPost>) => Promise<void> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost"><Clock className="w-3.5 h-3.5" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {[
          { label: "In 1 hour", ms: 60 * 60 * 1000 },
          { label: "Tomorrow 9am", date: () => { const d = addDays(new Date(), 1); d.setHours(9, 0, 0, 0); return d; } },
          { label: "Next week", date: () => addDays(new Date(), 7) },
        ].map((opt: any) => (
          <DropdownMenuItem key={opt.label} onClick={() => {
            const newDate = opt.date ? opt.date() : new Date(Date.now() + opt.ms);
            onUpdate(post.id, { scheduled_for: newDate.toISOString() });
            toast.success(`Rescheduled to ${format(newDate, "MMM d, HH:mm")}`);
          }}>
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CalendarView({ posts, onEdit }: { posts: ScheduledPost[]; onEdit: (p: ScheduledPost) => void }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-center text-[10px] font-medium text-muted-foreground py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dayPosts = posts.filter((p) => {
            const d = parseISO(p.scheduled_for);
            return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
          });
          const isToday = day === today.getDate();
          return (
            <div
              key={i}
              className={cn(
                "min-h-[64px] rounded-lg border p-1 text-left",
                isToday ? "border-primary/40 bg-primary/5" : "border-border/40"
              )}
            >
              <div className={cn("text-[10px] font-medium mb-1", isToday && "text-primary")}>{day}</div>
              <div className="space-y-0.5">
                {dayPosts.slice(0, 2).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onEdit(p)}
                    className="block w-full text-left text-[10px] truncate px-1 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    {p.title}
                  </button>
                ))}
                {dayPosts.length > 2 && (
                  <p className="text-[9px] text-muted-foreground px-1">+{dayPosts.length - 2}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EditDialog({
  post, onClose, onSave, isNew,
}: {
  post: ScheduledPost | null;
  onClose: () => void;
  onSave: (patch: Partial<ScheduledPost>) => Promise<void>;
  isNew?: boolean;
}) {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [datetime, setDatetime] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useMemo(() => {
    if (post) {
      setTitle(post.title);
      setCaption(post.caption ?? "");
      setPlatform(post.platform);
      setImageUrl(post.image_url ?? "");
      const d = parseISO(post.scheduled_for);
      const tzOffset = d.getTimezoneOffset() * 60000;
      setDatetime(new Date(d.getTime() - tzOffset).toISOString().slice(0, 16));
    }
  }, [post]);

  if (!post) return null;
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isNew ? "Schedule a post" : "Edit post"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium mb-1 block">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Launch reel" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Caption</label>
            <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">Platform</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full h-10 rounded-md border bg-background px-3 text-sm">
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="x">X / Twitter</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">When</label>
              <Input type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Image URL (optional)</label>
            <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            className="bg-gradient-hero text-primary-foreground"
            onClick={() => {
              if (!title.trim()) return toast.error("Title required");
              onSave({
                title, caption, platform,
                scheduled_for: new Date(datetime || Date.now()).toISOString(),
                image_url: imageUrl || null,
              });
            }}
          >
            {isNew ? "Schedule" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ScheduledPostsPanel };
