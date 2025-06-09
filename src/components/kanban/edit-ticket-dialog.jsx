import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function EditTicketDialog({ children, ticket }) {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Ticket</DialogTitle>
          </DialogHeader>

          <Label className={"mt-4"} htmlFor="ticketName">
            Tên ticket
          </Label>
          <Input
            type="text"
            id="ticketName"
            placeholder="Tên ticket"
            value={ticket.ticketName}
            required
          />

          <Label htmlFor="assignee">Assignee</Label>
          <Input
            type="text"
            id="assignee"
            placeholder="Người phụ trách"
            required
          />

          <Label htmlFor="labels">Labels</Label>
          <Input type="text" id="labels" placeholder="Labels" required />

          <Label htmlFor="dueDate">Due Date</Label>
          <Input type="date" id="dueDate" placeholder="Due Date" required />

          <Label htmlFor="storyPoints">Story Points</Label>
          <Input
            type="number"
            id="storyPoints"
            placeholder="Story Points"
            required
          />

          <Label htmlFor="fixVersions">Fix Versions</Label>
          <Input
            type="text"
            id="fixVersions"
            placeholder="Fix Versions"
            required
          />

          <Button className="w-full mt-4 cursor-pointer">Lưu</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
