import {Column, Id, Task} from "../types";
import {SortableContext} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import {useMemo} from "react";
import {useDroppable} from "@dnd-kit/core";

interface Props {
    column: Column;
    tasks: Task[];
    deleteTask: (id: Id) => void;
}

function ColumnContainer(props: Props) {
    const {column, tasks, deleteTask} = props;

    const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

    const {setNodeRef: setDroppableRef} = useDroppable({
        id: `${column.id}`,
        data: {
            type: "Column",
            columnId: column.id,
        },
    });


    // Check if this is the first column (e.g., "To Do")
    const isFirstColumn = column.title === "To Do"; // or by ID if preferred

    return (
        <div
            ref={setDroppableRef}
            className={`flex flex-col w-1/4 min-w-[20rem] h-full bg-white 
        ${isFirstColumn ? "border-l-2 border-r-2 border-b-2" : "border-r-2 border-b-2"} 
        border-gray-300`}
        >
            <div className="bg-indigo-600 text-white text-lg font-semibold py-4 px-4">
                {column.title}
            </div>

            <div className="flex flex-grow flex-col gap-3 overflow-y-auto p-3">
                <SortableContext items={tasksIds}>
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} deleteTask={deleteTask}/>
                    ))}
                </SortableContext>
            </div>
        </div>
    );

}

export default ColumnContainer;
