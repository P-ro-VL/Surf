"use client";

import { useState, useEffect } from "react";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  rectIntersection,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

const initialTasksData = {
  "task-1": {
    id: "task-1",
    content: "Lên kế hoạch cho buổi họp team sắp tới",
    overdue: false,
    duedate: "10/06/2025",
    labels: ["Vốn Hoá", "Test"],
    description: "Lên kế hoạch cho buổi họp team sắp tới",
    assignee: "Alice",
    storyPoints: 3,
    status: "In Progress",
    createdAt: "2025-06-01",
    updatedAt: "2025-06-01",
    createdBy: "Alice",
    fixVersions: {
      name: "1.0.0",
      releaseDate: "2025-06-01",
      status: "RELEASED",
    },
    links: {
      design: "https://www.figma.com/design/1234567890/Design-Name",
      prd: "https://www.figma.com/design/1234567890/Design-Name",
      apiDoc: "https://www.figma.com/design/1234567890/Design-Name",
    },
    comments: [
      {
        id: "comment-1",
        content: "Comment 1",
        createdAt: "23:52:19 2025-06-01",
        createdBy: "Alice",
      },
    ],
  },
  "task-2": { id: "task-2", content: "Review PR #123 của đồng nghiệp" },
  "task-3": { id: "task-3", content: "Nghiên cứu thư viện X cho dự án Y" },
  "task-4": { id: "task-4", content: "Viết tài liệu cho API Z" },
};

export const initialColumnsData = {
  "column-1": {
    id: "column-1",
    title: "BACKLOG",
    description: "Các task chưa được lên lịch",
    taskIds: ["task-1", "task-2", "task-3", "task-4"],
    backgroundColor: "bg-gray-50",
    textColor: "text-gray-700",
    borderColor: "border-gray-500",
  },
  "column-2": {
    id: "column-2",
    title: "TODO",
    description: "Các task đang chờ thực hiện",
    taskIds: [],
    backgroundColor: "bg-gray-50",
    textColor: "text-gray-700",
    borderColor: "border-gray-500",
  },
  "column-3": {
    id: "column-3",
    title: "IN PROGRESS",
    description: "Các task đang được thực hiện",
    taskIds: [],
    backgroundColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-500",
  },
  "column-4": {
    id: "column-4",
    title: "READY FOR TESTING",
    description: "Các task đã hoàn thành và sẵn sàng để test",
    taskIds: [],
    backgroundColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-500",
  },
  "column-5": {
    id: "column-5",
    title: "IN TESTING",
    description: "Các task đang được test",
    taskIds: [],
    backgroundColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-500",
  },
  "column-6": {
    id: "column-6",
    title: "DONE",
    description: "Các task đã hoàn thành",
    taskIds: [],
    backgroundColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-500",
  },
};

const initialColumnOrderData = [
  "column-1",
  "column-2",
  "column-3",
  "column-4",
  "column-5",
  "column-6",
];

export function KanbanBoard() {
  const [tasks, setTasks] = useState({});
  const [columns, setColumns] = useState({});
  const [columnOrder, setColumnOrder] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [activeItemData, setActiveItemData] = useState(null);

  useEffect(() => {
    // Đảm bảo rằng state chỉ được khởi tạo ở client-side
    // để tránh hydration mismatch, đặc biệt quan trọng khi dùng DND.
    setTasks(initialTasksData);
    setColumns(initialColumnsData);
    setColumnOrder(initialColumnOrderData);
    setIsClient(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const findColumnContainingTask = (taskId) => {
    if (!taskId) return null;
    return Object.values(columns).find((col) => col.taskIds.includes(taskId));
  };

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    if (active.data.current?.type === "Task") {
      setActiveItemData({ type: "Task", task: active.data.current.task });
    } else {
      setActiveItemData(null); // Nếu không phải task thì không set active item
    }
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (
      !over ||
      !activeId ||
      active.id === over.id ||
      !activeItemData ||
      activeItemData.type !== "Task"
    )
      return;

    const activeTaskId = active.id;
    const sourceColumn = findColumnContainingTask(activeTaskId);

    const overId = over.id;
    const overData = over.data.current;
    const overIsColumn = overData?.type === "Column";
    const overIsTask = overData?.type === "Task";

    if (!sourceColumn) return;

    // Kéo Task qua một Column (vùng droppable của column)
    if (overIsColumn) {
      const destinationColumn = columns[overId]; // overId là columnId
      if (destinationColumn && sourceColumn.id !== destinationColumn.id) {
        setColumns((prev) => {
          const sourceTaskIds = prev[sourceColumn.id].taskIds.filter(
            (id) => id !== activeTaskId
          );
          // Kiểm tra task đã tồn tại trong cột đích chưa để tránh trùng lặp khi drag qua lại nhanh
          const destinationTaskIds = prev[
            destinationColumn.id
          ].taskIds.includes(activeTaskId)
            ? prev[destinationColumn.id].taskIds
            : [...prev[destinationColumn.id].taskIds, activeTaskId];
          return {
            ...prev,
            [sourceColumn.id]: {
              ...prev[sourceColumn.id],
              taskIds: sourceTaskIds,
            },
            [destinationColumn.id]: {
              ...prev[destinationColumn.id],
              taskIds: destinationTaskIds,
            },
          };
        });
      }
    }
    // Kéo Task qua một Task khác
    else if (overIsTask) {
      const destinationColumn = findColumnContainingTask(overId); // overId là taskId
      if (destinationColumn && sourceColumn.id !== destinationColumn.id) {
        // Di chuyển Task sang cột khác, vào vị trí của Task 'over'
        setColumns((prev) => {
          const sourceTaskIds = prev[sourceColumn.id].taskIds.filter(
            (id) => id !== activeTaskId
          );
          let destinationTaskIds = [...prev[destinationColumn.id].taskIds];
          const overTaskIndex = destinationTaskIds.indexOf(overId);

          // Loại bỏ activeTaskId nếu nó đã tồn tại trong destinationTaskIds (do dragOver nhanh)
          destinationTaskIds = destinationTaskIds.filter(
            (id) => id !== activeTaskId
          );

          if (overTaskIndex !== -1) {
            destinationTaskIds.splice(overTaskIndex, 0, activeTaskId);
          } else {
            destinationTaskIds.push(activeTaskId); // Fallback
          }
          return {
            ...prev,
            [sourceColumn.id]: {
              ...prev[sourceColumn.id],
              taskIds: sourceTaskIds,
            },
            [destinationColumn.id]: {
              ...prev[destinationColumn.id],
              taskIds: destinationTaskIds,
            },
          };
        });
      } else if (
        destinationColumn &&
        sourceColumn.id === destinationColumn.id
      ) {
        // Sắp xếp Task trong cùng một Column
        if (activeTaskId !== overId) {
          setColumns((prev) => {
            const taskIds = prev[sourceColumn.id].taskIds;
            const oldIndex = taskIds.indexOf(activeTaskId);
            const newIndex = taskIds.indexOf(overId);
            if (oldIndex === -1 || newIndex === -1) return prev;
            return {
              ...prev,
              [sourceColumn.id]: {
                ...prev[sourceColumn.id],
                taskIds: arrayMove(taskIds, oldIndex, newIndex),
              },
            };
          });
        }
      }
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveItemData(null);

    if (!over || !activeItemData || activeItemData.type !== "Task") return;

    const activeTaskId = active.id;
    const sourceColumn = findColumnContainingTask(activeTaskId);

    const overId = over.id;
    const overData = over.data.current;
    const overIsColumn = overData?.type === "Column";
    const overIsTask = overData?.type === "Task";

    if (!sourceColumn) return;

    // TH1: Thả Task vào một Column (vùng droppable của column)
    if (overIsColumn) {
      const destinationColumn = columns[overId]; // overId là columnId
      if (destinationColumn && sourceColumn.id !== destinationColumn.id) {
        // Logic này đã được xử lý bởi onDragOver, onDragEnd chỉ là finalize
        // Đảm bảo task đã được chuyển đúng
        setColumns((prev) => {
          const sourceTaskIds = prev[sourceColumn.id].taskIds.filter(
            (id) => id !== activeTaskId
          );
          let destinationTaskIds = prev[destinationColumn.id].taskIds;
          if (!destinationTaskIds.includes(activeTaskId)) {
            destinationTaskIds = [...destinationTaskIds, activeTaskId];
          }
          return {
            ...prev,
            [sourceColumn.id]: {
              ...prev[sourceColumn.id],
              taskIds: sourceTaskIds,
            },
            [destinationColumn.id]: {
              ...prev[destinationColumn.id],
              taskIds: destinationTaskIds,
            },
          };
        });
      }
      // Nếu thả vào cùng cột thì không làm gì vì onDragOver đã xử lý sắp xếp nội bộ
    }
    // TH2: Thả Task lên một Task khác
    else if (overIsTask) {
      const destinationColumn = findColumnContainingTask(overId); // overId là taskId
      if (destinationColumn) {
        if (sourceColumn.id === destinationColumn.id) {
          // Sắp xếp Task trong cùng một Column (final)
          if (activeTaskId !== overId) {
            setColumns((prev) => {
              const taskIds = prev[sourceColumn.id].taskIds;
              const oldIndex = taskIds.indexOf(activeTaskId);
              const newIndex = taskIds.indexOf(overId);
              if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex)
                return prev;
              const newTaskIds = arrayMove(taskIds, oldIndex, newIndex);
              return {
                ...prev,
                [sourceColumn.id]: {
                  ...prev[sourceColumn.id],
                  taskIds: newTaskIds,
                },
              };
            });
          }
        } else {
          // Di chuyển Task sang Column khác, vào vị trí của Task 'over' (final)
          setColumns((prev) => {
            const sourceTaskIds = prev[sourceColumn.id].taskIds.filter(
              (id) => id !== activeTaskId
            );
            let destinationTaskIds = [...prev[destinationColumn.id].taskIds];
            // Loại bỏ activeTaskId nếu nó đã tồn tại trong destinationTaskIds (do dragOver nhanh)
            destinationTaskIds = destinationTaskIds.filter(
              (id) => id !== activeTaskId
            );
            const overTaskIndex = destinationTaskIds.indexOf(overId);

            if (overTaskIndex !== -1) {
              destinationTaskIds.splice(overTaskIndex, 0, activeTaskId);
            } else {
              destinationTaskIds.push(activeTaskId); // Fallback nếu overId không tìm thấy, hoặc thả vào cuối
            }
            return {
              ...prev,
              [sourceColumn.id]: {
                ...prev[sourceColumn.id],
                taskIds: sourceTaskIds,
              },
              [destinationColumn.id]: {
                ...prev[destinationColumn.id],
                taskIds: destinationTaskIds,
              },
            };
          });
        }
      }
    }
  };

  if (!isClient) {
    // Render placeholder hoặc null nếu ở server-side để chờ client mount
    return null;
  }

  const collisionDetectionStrategy = closestCorners; // Chỉ kéo task nên closestCorners là đủ

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex space-x-4 overflow-x-auto h-[calc(100vh-150px)] items-start">
        <SortableContext
          items={columnOrder}
          strategy={horizontalListSortingStrategy}
        >
          {columnOrder.map((columnId) => {
            const column = columns[columnId];
            if (!column) return null;
            const columnTasks = column.taskIds
              .map((taskId) => tasks[taskId])
              .filter((task) => task);
            return (
              <KanbanColumn
                key={column.id}
                columnId={column.id}
                title={column.title}
                tasks={columnTasks}
                description={column.description}
              />
            );
          })}
        </SortableContext>
      </div>
      <DragOverlay dropAnimation={null}>
        {activeId && activeItemData && activeItemData.type === "Task" && (
          <KanbanCard task={activeItemData.task} isDraggable={true} />
        )}
      </DragOverlay>
    </DndContext>
  );
}
