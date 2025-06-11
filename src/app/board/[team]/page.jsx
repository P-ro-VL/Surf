import { AuthGuard } from "@/components/auth-guard";
import CreateTicketDialog from "@/components/kanban/create-ticket-dialog";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { Button } from "@/components/ui/button";
import { TicketPlus } from "lucide-react";

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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold capitalize">{team} Kanban Board</h1>
          <CreateTicketDialog teamName={team}>
            <Button className="cursor-pointer">
              <TicketPlus className="w-4 h-4" /> Tạo ticket
            </Button>
          </CreateTicketDialog>
        </div>

        <KanbanBoard teamName={team} />
      </div>
    </AuthGuard>
  );
}
