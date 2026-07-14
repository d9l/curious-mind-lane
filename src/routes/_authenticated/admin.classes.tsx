import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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

export const Route = createFileRoute("/_authenticated/admin/classes")({
  component: ClassesPage,
});

type ClassRow = {
  id: string; board_id: string; class_number: number; title: string;
  boards?: { name: string } | null;
};

function ClassesPage() {
  const qc = useQueryClient();
  const [boardFilter, setBoardFilter] = useState<string>("all");
  const [editing, setEditing] = useState<Partial<ClassRow> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const boards = useQuery({
    queryKey: ["boards"],
    queryFn: async () => (await supabase.from("boards").select("id, name").order("name")).data ?? [],
  });

  const classes = useQuery({
    queryKey: ["classes", boardFilter],
    queryFn: async () => {
      let q = supabase.from("classes").select("*, boards(name)").order("class_number");
      if (boardFilter !== "all") q = q.eq("board_id", boardFilter);
      const { data, error } = await q;
      if (error) throw error;
      return data as ClassRow[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (c: Partial<ClassRow>) => {
      if (!c.board_id) throw new Error("Board is required");
      if (!c.title?.trim()) throw new Error("Title is required");
      if (!c.class_number) throw new Error("Class number is required");
      const payload = { board_id: c.board_id, class_number: Number(c.class_number), title: c.title };
      if (c.id) {
        const { error } = await supabase.from("classes").update(payload).eq("id", c.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("classes").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Saved");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["classes"] });
      qc.invalidateQueries({ queryKey: ["admin", "counts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("classes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      setDeleteId(null);
      qc.invalidateQueries({ queryKey: ["classes"] });
      qc.invalidateQueries({ queryKey: ["admin", "counts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight">Classes</h1>
          <p className="mt-1 text-sm text-muted-foreground">Grade levels within each board.</p>
        </div>
        <Button onClick={() => setEditing({})}>
          <Plus className="mr-2 h-4 w-4" /> Add class
        </Button>
      </div>

      <div className="flex gap-3">
        <Select value={boardFilter} onValueChange={setBoardFilter}>
          <SelectTrigger className="w-56"><SelectValue placeholder="Filter by board" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All boards</SelectItem>
            {boards.data?.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class #</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Board</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.isLoading && (
              <TableRow><TableCell colSpan={4}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
            )}
            {classes.data?.length === 0 && (
              <TableRow><TableCell colSpan={4} className="py-16 text-center text-sm text-muted-foreground">No classes yet.</TableCell></TableRow>
            )}
            {classes.data?.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.class_number}</TableCell>
                <TableCell>{c.title}</TableCell>
                <TableCell className="text-muted-foreground">{c.boards?.name}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => setEditing(c)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(c.id)}><Trash2 className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "Edit class" : "New class"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Board *</Label>
              <Select value={editing?.board_id ?? ""} onValueChange={(v) => setEditing({ ...editing, board_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select board" /></SelectTrigger>
                <SelectContent>
                  {boards.data?.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Class number *</Label>
              <Input type="number" min={1} max={12}
                value={editing?.class_number ?? ""}
                onChange={(e) => setEditing({ ...editing, class_number: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={editing?.title ?? ""} placeholder="Class 10"
                onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={() => editing && saveMutation.mutate(editing)} disabled={saveMutation.isPending}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this class?</AlertDialogTitle>
            <AlertDialogDescription>All subjects, chapters, and lessons under it will also be deleted.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && delMutation.mutate(deleteId)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
