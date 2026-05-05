import React from "react";
import {useDroppable} from "@dnd-kit/core";
import TaskCard from "./TaskCard"; // No .tsx

export default function KanbanColumn({id, title, tasks}) {
    const {setNodeRef} = useDroppable({
        id,
    });

    return (
        <div ref={setNodeRef} className="bg-gray-100 rounded-xl p-4 shadow-md min-h-[300px]">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            <div className="space-y-4">
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task}/>
                ))}
            </div>
        </div>
    );
}
