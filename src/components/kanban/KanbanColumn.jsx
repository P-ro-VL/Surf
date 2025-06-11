import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { KanbanCard } from "./KanbanCard";

export function KanbanColumn({ title, tasks, columnId, description }) {
  const { setNodeRef: columnDroppableRef, isOver } = useDroppable({
    id: columnId,
    data: {
      type: "Column",
      column: { id: columnId, title, taskIds: tasks.map((t) => t.uuid) }, // Truyền dữ liệu cột
    },
  });

  const taskIds = tasks.map((task) => task.uuid);

  return (
    <div
      ref={columnDroppableRef}
      className={`flex-1 min-w-[250px] shrink-0 p-1 ${
        isOver ? "bg-slate-200 dark:bg-slate-700" : ""
      }`}
    >
      <Card
        className={`flex flex-col max-h-full bg-muted/50 rounded-sm shadow-none border-none p-0`}
      >
        <CardHeader className="px-4 py-4 border-b m-0">
          <CardTitle className="text-sm font-semibold p-0 text-gray-500">
            {title}
          </CardTitle>
          <CardDescription className="text-sm font-normal p-0 text-gray-500">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2 flex-grow overflow-y-auto min-h-[100px]">
          <SortableContext
            items={taskIds}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task) => {
              return <KanbanCard key={task.uuid} task={task} />;
            })}
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
}
