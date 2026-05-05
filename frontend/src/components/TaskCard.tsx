import {Id, Task} from "../types";
import TrashIcon from "../icons/TrashIcon";
import {useState} from "react";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

interface Props {
    task: Task;
    deleteTask: (id: Id) => void;
}

function TaskCard({task, deleteTask}: Props) {
    const [mouseIsOver, setMouseIsOver] = useState(false);

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        }
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="h-14 rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-100"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onMouseEnter={() => setMouseIsOver(true)}
            onMouseLeave={() => setMouseIsOver(false)}
            className="bg-white text-gray-800 px-4 py-3 h-14 flex items-center rounded-xl shadow-sm border border-gray-300 hover:ring-2 hover:ring-indigo-400 transition relative"
        >
            <span className="truncate">{task.content}</span>

            {task.columnId === 3 && mouseIsOver && (
                <button
                    onClick={() => deleteTask(task.id)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition-opacity opacity-70 hover:opacity-100"
                >
                    <TrashIcon/>
                </button>
            )}
        </div>
    );
}


export default TaskCard;
