import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Copy, Eye, EyeOff, ScrollText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { slugify, formatDate } from "@/lib/admin/utils";

export const Route = createFileRoute("/_authenticated/admin/chapters")({
  component: ChaptersPage,
});

type Chapter = {
  id: string; subject_id: string; chapter_number: number; title: string; slug: string;
  short_description: string | null; difficulty: string | null; estimated_read_time: number | null;
  is_published: boolean; display_order: number; updated_at: string;
  subjects?: { name: string; class_id: string; classes?: { title: string; board_id: string } | null } | null;
};

function ChaptersPage() {
  const qc = useQueryClient();
  const [boardF, setBoardF] = useState("all");
  const [classF, setClassF] = useState("all");
  const [subjectF, setSubjectF] = useState("all");
  const [publishedF, setPublishedF] = useState("all");
  const [editing, setEditing] = useState<Partial<Chapter> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const boards = useQuery({ queryKey: ["boards"], queryFn: async () => (await supabase.from("boards").select("id,name").order("name")).data ?? [] });
  const classes = useQuery({ queryKey: ["classes-all"], queryFn: async () => (await supabase.from("classes").select("id,title,board_id").order("class_number")).data ?? [] });
  const subjects = useQuery({ queryKey: ["subjects-all"], queryFn: async () => (await supabase.from("subjects").select("id,name,class_id").order("display_order")).data ?? [] });

  const filteredClasses = useMemo(() => (boardF === "all" ? classes.data : classes.data?.filter((c) => c.board_id === boardF)) ?? [], [boardF, classes.data]);
  const filteredSubjects = useMemo(() => (classF === "all" ? subjects.data : subjects.data?.filter((s) => s.class_id === classF)) ?? [], [classF, subjects.data]);

  const chapters = useQuery({
    queryKey: ["chapters", boardF, classF, subjectF, publishedF],
    queryFn: async () => {
      let q = supabase.from("chapters").select("*, subjects(name, class_id, classes(title, board_id))").order("display_order");
      if (subjectF !== "all") q = q.eq("subject_id", subjectF);
      if (publishedF === "published") q = q.eq("is_published", true);
      if (publishedF === "draft") q = q.eq("is_published", false);
      const { data, error } = await q;
      if (error) throw error;
      let rows = data as Chapter[];
      if (classF !== "all") rows = rows.filter((r) => r.subjects?.class_id === classF);
      if (boardF !== "all") rows = rows.filter((r) => r.subjects?.classes?.board_id === boardF);
      return rows;
    },
  });

  const save = useMutation({
    mutationFn: async (c: Partial<Chapter>) => {
      if (!c.subject_id) throw new Error("Subject required");
      if (!c.title?.trim()) throw new Error("Title required");
      if (!c.chapter_number) throw new Error("Chapter number required");
      const payload = {
        subject_id: c.subject_id,
        chapter_number: Number(c.chapter_number),
        title: c.title,
        slug: c.slug?.trim() || slugify(c.title),
        short_description: c.short_description || null,
        difficulty: c.difficulty || null,
        estimated_read_time: c.estimated_read_time ? Number(c.estimated_read_time) : null,
        is_published: !!c.is_published,
        display_order: Number(c.display_order ?? 0),
      };
      if (c.id) {
        const { error } = await supabase.from("chapters").update(payload).eq("id", c.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("chapters").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Saved");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["chapters"] });
      qc.invalidateQueries({ queryKey: ["admin", "counts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("chapters").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted"); setDeleteId(null); qc.invalidateQueries({ queryKey: ["chapters"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const togglePublish = useMutation({
    mutationFn: async (c: Chapter) => {
      const { error } = await supabase.from("chapters").update({ is_published: !c.is_published }).eq("id", c.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chapters"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const duplicate = useMutation({
    mutationFn: async (c: Chapter) => {
      const { error } = await supabase.from("chapters").insert({
        subject_id: c.subject_id,
        chapter_number: c.chapter_number + 100,
        title: `${c.title} (Copy)`,
        slug: `${c.slug}-copy-${Date.now()}`,
        short_description: c.short_description,
        difficulty: c.difficulty,
        estimated_read_time: c.estimated_read_time,
        is_published: false,
        display_order: c.display_order + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Duplicated"); qc.invalidateQueries({ queryKey: ["chapters"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight">Chapters</h1>
          <p className="mt-1 text-sm text-muted-foreground">Chapters organize lessons within a subject.</p>
        </div>
        <Button onClick={() => setEditing({ display_order: 0, is_published: false })}>
          <Plus className="mr-2 h-4 w-4" /> Add chapter
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={boardF} onValueChange={(v) => { setBoardF(v); setClassF("all"); setSubjectF("all"); }}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All boards</SelectItem>
            {boards.data?.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={classF} onValueChange={(v) => { setClassF(v); setSubjectF("all"); }}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All classes</SelectItem>
            {filteredClasses.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={subjectF} onValueChange={setSubjectF}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All subjects</SelectItem>
            {filteredSubjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
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

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Read time</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {chapters.isLoading && (<TableRow><TableCell colSpan={8}><Skeleton className="h-8 w-full" /></TableCell></TableRow>)}
            {chapters.data?.length === 0 && (
              <TableRow><TableCell colSpan={8} className="py-16 text-center text-sm text-muted-foreground">No chapters match filters.</TableCell></TableRow>
            )}
            {chapters.data?.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.chapter_number}</TableCell>
                <TableCell className="font-medium">{c.title}</TableCell>
                <TableCell className="text-muted-foreground">{c.subjects?.name}</TableCell>
                <TableCell className="text-muted-foreground">{c.estimated_read_time ? `${c.estimated_read_time} min` : "—"}</TableCell>
                <TableCell className="text-muted-foreground capitalize">{c.difficulty ?? "—"}</TableCell>
                <TableCell><Badge variant={c.is_published ? "default" : "secondary"}>{c.is_published ? "Published" : "Draft"}</Badge></TableCell>
                <TableCell className="text-muted-foreground text-xs">{formatDate(c.updated_at)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" title="Lessons" asChild>
                    <Link to="/admin/lessons" search={{ chapterId: c.id }}><ScrollText className="h-4 w-4" /></Link>
                  </Button>
                  <Button variant="ghost" size="icon" title={c.is_published ? "Unpublish" : "Publish"} onClick={() => togglePublish.mutate(c)}>
                    {c.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" title="Duplicate" onClick={() => duplicate.mutate(c)}><Copy className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => setEditing(c)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(c.id)}><Trash2 className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit chapter" : "New chapter"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Subject *</Label>
              <Select value={editing?.subject_id ?? ""} onValueChange={(v) => setEditing({ ...editing, subject_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                <SelectContent>
                  {subjects.data?.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Chapter number *</Label>
                <Input type="number" value={editing?.chapter_number ?? ""}
                  onChange={(e) => setEditing({ ...editing, chapter_number: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Display order</Label>
                <Input type="number" value={editing?.display_order ?? 0}
                  onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={editing?.title ?? ""}
                onChange={(e) => setEditing({
                  ...editing, title: e.target.value,
                  slug: editing?.slug && editing.id ? editing.slug : slugify(e.target.value),
                })} />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={editing?.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Short description</Label>
              <Textarea value={editing?.short_description ?? ""} onChange={(e) => setEditing({ ...editing, short_description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select value={editing?.difficulty ?? ""} onValueChange={(v) => setEditing({ ...editing, difficulty: v })}>
                  <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Estimated read time (min)</Label>
                <Input type="number" value={editing?.estimated_read_time ?? ""}
                  onChange={(e) => setEditing({ ...editing, estimated_read_time: Number(e.target.value) })} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input id="pub" type="checkbox" checked={!!editing?.is_published}
                onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })} />
              <Label htmlFor="pub">Published</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={() => editing && save.mutate(editing)} disabled={save.isPending}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this chapter?</AlertDialogTitle>
            <AlertDialogDescription>All lessons and resources under this chapter will also be removed.</AlertDialogDescription>
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
