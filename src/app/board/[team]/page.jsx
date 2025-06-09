import { AuthGuard } from "@/components/auth-guard";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import StackedAvatars from "@/components/ui/stacked_avatar";

export const iframeHeight = "800px";

export const description = "A sidebar with a header and a search form.";

const avatars = [
  { src: "/avatars/alice.jpg", name: "Alice" },
  { src: "/avatars/bob.jpg", name: "Bob" },
  { src: "/avatars/carol.jpg", name: "Carol" },
  { src: "/avatars/dave.jpg", name: "Dave" },
  { src: "/avatars/eve.jpg", name: "Eve" },
];

export default async function Page({ params }) {
  const { team } = await params;

  return (
    <AuthGuard>
      <div className="p-4 flex flex-col gap-3">
        <h1 className="text-2xl font-bold capitalize">{team} Kanban Board</h1>
        <KanbanBoard teamName={team} />
      </div>
    </AuthGuard>
  );
}
