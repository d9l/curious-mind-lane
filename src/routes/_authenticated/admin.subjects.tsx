import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { slugify } from "@/lib/admin/utils";

export const Route = createFileRoute("/_authenticated/admin/subjects")({
  component: SubjectsPage,
});

type Subject = {
  id: string; class_id: string; name: string; slug: string;
  icon: string | null; color: string | null; display_order: number;
  classes?: { class_number: number; title: string; board_id: string; boards?: { name: string } | null } | null;
};

function SubjectsPage() {
  const qc = useQueryClient();
  const [boardFilter, setBoardFilter] = useState<string>("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [editing, setEditing] = useState<Partial<Subject> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const boards = useQuery({
    queryKey: ["boards"],
    queryFn: async () => (await supabase.from("boards").select("id, name").order("name")).data ?? [],
  });

  const classes = useQuery({
    queryKey: ["classes-all"],
    queryFn: async () =>
      (await supabase.from("classes").select("id, class_number, title, board_id").order("class_number")).data ?? [],
  });

  const filteredClasses = useMemo(() => {
    if (boardFilter === "all") return classes.data ?? [];
    return (classes.data ?? []).filter((c) => c.board_id === boardFilter);
  }, [classes.data, boardFilter]);

  const subjects = useQuery({
    queryKey: ["subjects", boardFilter, classFilter],
    queryFn: async () => {
      let q = supabase
        .from("subjects")
        .select("*, classes(class_number, title, board_id, boards(name))")
        .order("display_order");
      if (classFilter !== "all") q = q.eq("class_id", classFilter);
      const { data, error } = await q;
      if (error) throw error;
      let rows = data as Subject[];
      if (boardFilter !== "all") rows = rows.filter((r) => r.classes?.board_id === boardFilter);
      return rows;
    },
  });

  const save = useMutation({
    mutationFn: async (s: Partial<Subject>) => {
      if (!s.class_id) throw new Error("Class is required");
      if (!s.name?.trim()) throw new Error("Name is required");
      const payload = {
        class_id: s.class_id,
        name: s.name,
        slug: s.slug?.trim() || slugify(s.name),
        icon: s.icon || null,
        color: s.color || null,
        display_order: Number(s.display_order ?? 0),
      };
      if (s.id) {
        const { error } = await supabase.from("subjects").update(payload).eq("id", s.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("subjects").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Saved");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["subjects"] });
      qc.invalidateQueries({ queryKey: ["admin", "counts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("subjects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      setDeleteId(null);
      qc.invalidateQueries({ queryKey: ["subjects"] });
      qc.invalidateQueries({ queryKey: ["admin", "counts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const editClassOptions = classes.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight">Subjects</h1>
          <p className="mt-1 text-sm text-muted-foreground">Subjects offered per class.</p>
        </div>
        <Button onClick={() => setEditing({ display_order: 0 })}>
          <Plus className="mr-2 h-4 w-4" /> Add subject
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={boardFilter} onValueChange={(v) => { setBoardFilter(v); setClassFilter("all"); }}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All boards</SelectItem>
            {boards.data?.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All classes</SelectItem>
            {filteredClasses.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Board</TableHead>
              <TableHead>Color</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.isLoading && (
              <TableRow><TableCell colSpan={7}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
            )}
            {subjects.data?.length === 0 && (
              <TableRow><TableCell colSpan={7} className="py-16 text-center text-sm text-muted-foreground">No subjects.</TableCell></TableRow>
            )}
            {subjects.data?.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.display_order}</TableCell>
                <TableCell className="font-medium">
                  <span className="mr-2">{s.icon}</span>{s.name}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{s.slug}</TableCell>
                <TableCell>{s.classes?.title}</TableCell>
                <TableCell className="text-muted-foreground">{s.classes?.boards?.name}</TableCell>
                <TableCell>
                  {s.color && <span className="inline-block h-4 w-4 rounded" style={{ background: s.color }} />}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => setEditing(s)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(s.id)}><Trash2 className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "Edit subject" : "New subject"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Class *</Label>
              <Select value={editing?.class_id ?? ""} onValueChange={(v) => setEditing({ ...editing, class_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  {editClassOptions.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input value={editing?.name ?? ""} onChange={(e) => setEditing({
                  ...editing, name: e.target.value,
                  slug: editing?.slug && editing.id ? editing.slug : slugify(e.target.value),
                })} />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={editing?.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Icon (emoji)</Label>
                <Input value={editing?.icon ?? ""} placeholder="🧮" onChange={(e) => setEditing({ ...editing, icon: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <Input type="color" value={editing?.color ?? "#000000"} onChange={(e) => setEditing({ ...editing, color: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Display order</Label>
                <Input type="number" value={editing?.display_order ?? 0}
                  onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} />
              </div>
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
            <AlertDialogTitle>Delete this subject?</AlertDialogTitle>
            <AlertDialogDescription>All chapters and lessons under it will be deleted.</AlertDialogDescription>
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
