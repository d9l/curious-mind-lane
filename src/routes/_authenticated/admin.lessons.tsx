import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Copy, Eye, EyeOff, ArrowUp, ArrowDown, Save, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { slugify, formatDate } from "@/lib/admin/utils";
import { z } from "zod";

export const Route = createFileRoute("/_authenticated/admin/lessons")({
  validateSearch: (s: Record<string, unknown>) => z.object({ chapterId: z.string().optional() }).parse(s),
  component: LessonsPage,
});

type Lesson = {
  id: string; chapter_id: string; lesson_number: number; title: string; slug: string;
  summary: string | null; content: string; is_published: boolean; display_order: number; updated_at: string;
};

function LessonsPage() {
  const search = Route.useSearch();
  const qc = useQueryClient();
  const [chapterId, setChapterId] = useState<string>(search.chapterId ?? "");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [publishedF, setPublishedF] = useState("all");

  const chapters = useQuery({
    queryKey: ["chapters-picker"],
    queryFn: async () => (await supabase.from("chapters").select("id, title, subjects(name)").order("chapter_number")).data ?? [],
  });

  const lessons = useQuery({
    queryKey: ["lessons", chapterId, publishedF],
    enabled: !!chapterId,
    queryFn: async () => {
      let q = supabase.from("lessons").select("*").eq("chapter_id", chapterId).order("display_order");
      if (publishedF === "published") q = q.eq("is_published", true);
      if (publishedF === "draft") q = q.eq("is_published", false);
      const { data, error } = await q;
      if (error) throw error;
      return data as Lesson[];
    },
  });

  const editingLesson = useMemo(() => lessons.data?.find((l) => l.id === editingId) ?? null, [lessons.data, editingId]);

  const create = useMutation({
    mutationFn: async (l: Partial<Lesson>) => {
      if (!chapterId) throw new Error("Select a chapter first");
      if (!l.title?.trim()) throw new Error("Title required");
      const nextNum = (lessons.data?.length ?? 0) + 1;
      const { data, error } = await supabase.from("lessons").insert({
        chapter_id: chapterId,
        lesson_number: l.lesson_number ?? nextNum,
        title: l.title,
        slug: l.slug?.trim() || slugify(l.title),
        summary: l.summary || null,
        content: l.content ?? "",
        is_published: false,
        display_order: nextNum,
      }).select("id").single();
      if (error) throw error;
      return data.id as string;
    },
    onSuccess: (id) => {
      toast.success("Lesson created");
      setNewDialogOpen(false);
      qc.invalidateQueries({ queryKey: ["lessons"] });
      qc.invalidateQueries({ queryKey: ["admin", "counts"] });
      setEditingId(id);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("lessons").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted"); setDeleteId(null); qc.invalidateQueries({ queryKey: ["lessons"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const duplicate = useMutation({
    mutationFn: async (l: Lesson) => {
      const { error } = await supabase.from("lessons").insert({
        chapter_id: l.chapter_id,
        lesson_number: (lessons.data?.length ?? 0) + 1,
        title: `${l.title} (Copy)`,
        slug: `${l.slug}-copy-${Date.now()}`,
        summary: l.summary,
        content: l.content,
        is_published: false,
        display_order: (lessons.data?.length ?? 0) + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Duplicated"); qc.invalidateQueries({ queryKey: ["lessons"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const togglePub = useMutation({
    mutationFn: async (l: Lesson) => {
      const { error } = await supabase.from("lessons").update({ is_published: !l.is_published }).eq("id", l.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lessons"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const reorder = useMutation({
    mutationFn: async ({ id, dir }: { id: string; dir: "up" | "down" }) => {
      const list = lessons.data ?? [];
      const idx = list.findIndex((l) => l.id === id);
      const swapIdx = dir === "up" ? idx - 1 : idx + 1;
      if (idx < 0 || swapIdx < 0 || swapIdx >= list.length) return;
      const a = list[idx], b = list[swapIdx];
      await supabase.from("lessons").update({ display_order: b.display_order }).eq("id", a.id);
      await supabase.from("lessons").update({ display_order: a.display_order }).eq("id", b.id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lessons"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight">Lessons</h1>
          <p className="mt-1 text-sm text-muted-foreground">Write and organize lessons within a chapter.</p>
        </div>
        <Button onClick={() => setNewDialogOpen(true)} disabled={!chapterId}>
          <Plus className="mr-2 h-4 w-4" /> Add lesson
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={chapterId} onValueChange={setChapterId}>
          <SelectTrigger className="w-80"><SelectValue placeholder="Select a chapter" /></SelectTrigger>
          <SelectContent>
            {chapters.data?.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.subjects?.name ? `${c.subjects.name} — ` : ""}{c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={publishedF} onValueChange={setPublishedF}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!chapterId && (
        <Card className="p-16 text-center text-sm text-muted-foreground">
          Pick a chapter to view its lessons.
        </Card>
      )}

      {chapterId && (
        <Card className="divide-y">
          {lessons.isLoading && <div className="p-6"><Skeleton className="h-8 w-full" /></div>}
          {lessons.data?.length === 0 && (
            <div className="p-16 text-center text-sm text-muted-foreground">No lessons yet.</div>
          )}
          {lessons.data?.map((l, i) => (
            <div key={l.id} className="flex items-center gap-3 p-4">
              <div className="flex flex-col gap-1">
                <Button variant="ghost" size="icon" className="h-6 w-6" disabled={i === 0} onClick={() => reorder.mutate({ id: l.id, dir: "up" })}><ArrowUp className="h-3 w-3" /></Button>
                <Button variant="ghost" size="icon" className="h-6 w-6" disabled={i === (lessons.data?.length ?? 0) - 1} onClick={() => reorder.mutate({ id: l.id, dir: "down" })}><ArrowDown className="h-3 w-3" /></Button>
              </div>
              <div className="w-8 text-center text-sm text-muted-foreground">{l.lesson_number}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <button className="font-medium hover:underline truncate" onClick={() => setEditingId(l.id)}>{l.title}</button>
                  <Badge variant={l.is_published ? "default" : "secondary"} className="text-xs">{l.is_published ? "Published" : "Draft"}</Badge>
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground truncate">{l.summary ?? "No summary"} · Updated {formatDate(l.updated_at)}</div>
              </div>
              <Button variant="ghost" size="icon" title={l.is_published ? "Unpublish" : "Publish"} onClick={() => togglePub.mutate(l)}>
                {l.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" title="Duplicate" onClick={() => duplicate.mutate(l)}><Copy className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => setEditingId(l.id)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => setDeleteId(l.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
        </Card>
      )}

      <Dialog open={newDialogOpen} onOpenChange={setNewDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New lesson</DialogTitle></DialogHeader>
          <NewLessonForm onSubmit={(l) => create.mutate(l)} pending={create.isPending} />
        </DialogContent>
      </Dialog>

      {editingLesson && (
        <LessonEditor
          key={editingLesson.id}
          lesson={editingLesson}
          onClose={() => setEditingId(null)}
        />
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this lesson?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && del.mutate(deleteId)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function NewLessonForm({ onSubmit, pending }: { onSubmit: (l: Partial<Lesson>) => void; pending: boolean }) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Title *</Label>
          <Input value={title} onChange={(e) => { setTitle(e.target.value); if (!slug) setSlug(slugify(e.target.value)); }} />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Summary</Label>
          <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={() => onSubmit({ title, slug, summary })} disabled={pending}>
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create & edit
        </Button>
      </DialogFooter>
    </>
  );
}

function LessonEditor({ lesson, onClose }: { lesson: Lesson; onClose: () => void }) {
  const qc = useQueryClient();
  const [title, setTitle] = useState(lesson.title);
  const [slug, setSlug] = useState(lesson.slug);
  const [summary, setSummary] = useState(lesson.summary ?? "");
  const [content, setContent] = useState(lesson.content);
  const [isPublished, setIsPublished] = useState(lesson.is_published);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const dirtyRef = useRef(false);

  async function save() {
    if (!title.trim()) { toast.error("Title required"); return; }
    setSaving(true);
    const { error } = await supabase.from("lessons").update({
      title, slug: slug || slugify(title), summary: summary || null, content, is_published: isPublished,
    }).eq("id", lesson.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    setSavedAt(new Date());
    dirtyRef.current = false;
    qc.invalidateQueries({ queryKey: ["lessons"] });
  }

  // Autosave
  useEffect(() => { dirtyRef.current = true; }, [title, slug, summary, content, isPublished]);
  useEffect(() => {
    const t = setTimeout(() => { if (dirtyRef.current) save(); }, 3000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, slug, summary, content, isPublished]);

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0 gap-0">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <DialogTitle className="text-lg">Editing lesson</DialogTitle>
            <p className="text-xs text-muted-foreground">
              {saving ? "Saving…" : savedAt ? `Saved ${savedAt.toLocaleTimeString()}` : "Unsaved changes autosave every 3s"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <input id="editor-pub" type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
              <Label htmlFor="editor-pub" className="text-sm">Published</Label>
            </div>
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={save} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 border-b p-6 md:grid-cols-3">
          <div className="space-y-2 md:col-span-2">
            <Label>Title *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-3">
            <Label>Summary</Label>
            <Input value={summary} onChange={(e) => setSummary(e.target.value)} />
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <MarkdownEditor value={content} onChange={setContent} minHeight={500} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
