import { createFileRoute } from "@tanstack/react-router";
import { useCurrentUser } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { formatDate } from "@/lib/admin/utils";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useCurrentUser();
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-medium tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Account and workspace.</p>
      </div>

      <Card className="p-6">
        <h2 className="font-medium">Account</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between border-b pb-3">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium">{user?.email}</dd>
          </div>
          <div className="flex justify-between border-b pb-3">
            <dt className="text-muted-foreground">User ID</dt>
            <dd className="font-mono text-xs">{user?.id}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Last sign-in</dt>
            <dd>{formatDate(user?.last_sign_in_at)}</dd>
          </div>
        </dl>
        <div className="mt-6">
          <Button variant="outline" onClick={signOut}>Sign out</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-medium">Roadmap</h2>
        <p className="mt-2 text-sm text-muted-foreground">Modules planned for future releases:</p>
        <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
          {["Quizzes", "Flashcards", "Mock Tests", "Student Progress", "Analytics", "AI Content Generator"].map((f) => (
            <li key={f} className="rounded-md border bg-muted/30 px-3 py-2 text-muted-foreground">{f}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
