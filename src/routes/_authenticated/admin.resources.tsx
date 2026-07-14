import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
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

export const Route = createFileRoute("/_authenticated/admin/resources")({
  component: ResourcesPage,
});

const RESOURCE_TYPES = ["youtube", "pdf", "image", "external_link", "download"] as const;
type ResourceType = typeof RESOURCE_TYPES[number];

type Resource = {
  id: string; chapter_id: string; title: string; type: ResourceType;
  url: string; description: string | null; thumbnail: string | null; display_order: number;
  chapters?: { title: string } | null;
};

function ResourcesPage() {
  const qc = useQueryClient();
  const [chapterId, setChapterId] = useState<string>("");
  const [editing, setEditing] = useState<Partial<Resource> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const chapters = useQuery({
    queryKey: ["chapters-picker"],
    queryFn: async () => (await supabase.from("chapters").select("id, title, subjects(name)").order("chapter_number")).data ?? [],
  });

  const resources = useQuery({
    queryKey: ["resources", chapterId],
    enabled: !!chapterId,
    queryFn: async () => {
      const { data, error } = await supabase.from("resources").select("*, chapters(title)").eq("chapter_id", chapterId).order("display_order");
      if (error) throw error;
      return data as Resource[];
    },
  });

  const save = useMutation({
    mutationFn: async (r: Partial<Resource>) => {
      if (!chapterId && !r.chapter_id) throw new Error("Chapter required");
      if (!r.title?.trim()) throw new Error("Title required");
      if (!r.url?.trim()) throw new Error("URL required");
      if (!r.type) throw new Error("Type required");
      const payload = {
        chapter_id: r.chapter_id ?? chapterId,
        title: r.title, type: r.type, url: r.url,
        description: r.description || null, thumbnail: r.thumbnail || null,
        display_order: Number(r.display_order ?? 0),
      };
      if (r.id) {
        const { error } = await supabase.from("resources").update(payload).eq("id", r.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("resources").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Saved");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["resources"] });
      qc.invalidateQueries({ queryKey: ["admin", "counts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("resources").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted"); setDeleteId(null); qc.invalidateQueries({ queryKey: ["resources"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tight">Resources</h1>
          <p className="mt-1 text-sm text-muted-foreground">Videos, PDFs, and external links attached to chapters.</p>
        </div>
        <Button onClick={() => setEditing({ display_order: 0, type: "youtube", chapter_id: chapterId })} disabled={!chapterId}>
          <Plus className="mr-2 h-4 w-4" /> Add resource
        </Button>
      </div>

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

      {!chapterId ? (
        <Card className="p-16 text-center text-sm text-muted-foreground">Pick a chapter to view resources.</Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.isLoading && (<TableRow><TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell></TableRow>)}
              {resources.data?.length === 0 && (
                <TableRow><TableCell colSpan={5} className="py-16 text-center text-sm text-muted-foreground">No resources yet.</TableCell></TableRow>
              )}
              {resources.data?.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.display_order}</TableCell>
                  <TableCell className="font-medium">{r.title}</TableCell>
                  <TableCell><Badge variant="outline">{r.type}</Badge></TableCell>
                  <TableCell className="max-w-xs truncate">
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                      {r.url}<ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setEditing(r)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(r.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "Edit resource" : "New resource"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={editing?.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select value={editing?.type ?? ""} onValueChange={(v) => setEditing({ ...editing, type: v as ResourceType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {RESOURCE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Display order</Label>
                <Input type="number" value={editing?.display_order ?? 0}
                  onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>URL *</Label>
              <Input value={editing?.url ?? ""} onChange={(e) => setEditing({ ...editing, url: e.target.value })} placeholder="https://…" />
            </div>
            <div className="space-y-2">
              <Label>Thumbnail URL</Label>
              <Input value={editing?.thumbnail ?? ""} onChange={(e) => setEditing({ ...editing, thumbnail: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={editing?.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
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
            <AlertDialogTitle>Delete this resource?</AlertDialogTitle>
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
