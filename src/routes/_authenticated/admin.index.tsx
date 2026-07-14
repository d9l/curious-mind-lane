import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Library, GraduationCap, BookOpen, FileText, ScrollText, Paperclip } from "lucide-react";
import { formatDate } from "@/lib/admin/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: DashboardHome,
});

function useCounts() {
  return useQuery({
    queryKey: ["admin", "counts"],
    queryFn: async () => {
      const tables = ["boards", "classes", "subjects", "chapters", "lessons", "resources"] as const;
      const results = await Promise.all(
        tables.map((t) => supabase.from(t).select("*", { count: "exact", head: true }))
      );
      const out: Record<string, number> = {};
      tables.forEach((t, i) => (out[t] = results[i].count ?? 0));
      return out;
    },
  });
}

function useRecentLessons() {
  return useQuery({
    queryKey: ["admin", "recent-lessons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("id, title, slug, is_published, updated_at, chapters(title, subjects(name))")
        .order("updated_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return data;
    },
  });
}

function DashboardHome() {
  const counts = useCounts();
  const recent = useRecentLessons();

  const cards = [
    { label: "Boards", key: "boards", icon: Library, to: "/admin/boards" },
    { label: "Classes", key: "classes", icon: GraduationCap, to: "/admin/classes" },
    { label: "Subjects", key: "subjects", icon: BookOpen, to: "/admin/subjects" },
    { label: "Chapters", key: "chapters", icon: FileText, to: "/admin/chapters" },
    { label: "Lessons", key: "lessons", icon: ScrollText, to: "/admin/lessons" },
    { label: "Resources", key: "resources", icon: Paperclip, to: "/admin/resources" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-medium tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Overview of your content library.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {cards.map((c) => (
          <Link key={c.key} to={c.to}>
            <Card className="p-5 transition-shadow hover:shadow-md">
              <c.icon className="h-5 w-5 text-muted-foreground" />
              <div className="mt-4 text-3xl font-semibold tracking-tight">
                {counts.isLoading ? <Skeleton className="h-8 w-12" /> : counts.data?.[c.key] ?? 0}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{c.label}</div>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <div className="border-b p-5">
          <h2 className="font-medium">Recently updated lessons</h2>
          <p className="text-xs text-muted-foreground">Latest edits across your library.</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Chapter</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recent.isLoading && (
              <TableRow><TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
            )}
            {recent.data?.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">No lessons yet.</TableCell></TableRow>
            )}
            {recent.data?.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.title}</TableCell>
                <TableCell className="text-muted-foreground">{l.chapters?.title ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{l.chapters?.subjects?.name ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={l.is_published ? "default" : "secondary"}>
                    {l.is_published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(l.updated_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
