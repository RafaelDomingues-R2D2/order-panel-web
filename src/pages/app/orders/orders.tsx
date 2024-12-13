import { getOrders, Task } from "@/api/get-orders";
import { changeOrderStage } from "@/api/change-order-stage";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { add, format } from "date-fns";
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async'

interface Columns {
  'TODO': Task[];
  'DOING': Task[];
  'DONE': Task[];
}

const columsLabel = {
  "TODO": "A FAZER",
  "DOING": "FAZENDO",
  "DONE": "FEITO",
}

export function Orders() {
    const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  })

  
  const { mutateAsync: changeOrderStageFn } = useMutation({
    mutationFn: changeOrderStage,
    onSuccess: async () => {
      // queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })

  const [tasks, setTasks] = useState<Columns>(orders as Columns ?? {TODO: [], DOING: [], DONE: []});

  const onDragEnd = (result: DropResult): void => {
    const { draggableId, source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const startColumn = tasks[source.droppableId as keyof Columns];
    const endColumn = tasks[destination.droppableId as keyof Columns];
    const [movedTask] = startColumn.splice(source.index, 1);
    endColumn.splice(destination.index, 0, movedTask);

    setTasks({
      ...tasks,
      [source.droppableId as keyof Columns]: startColumn,
      [destination.droppableId as keyof Columns]: endColumn,
    });

    changeOrderStageFn({id: draggableId, stage: destination.droppableId})
  };


  useEffect(() => {
    if(orders){
      setTasks(orders as Columns)
    }
  }, [orders])
 
  return (
    <>
      <Helmet title="Pedidos" />
      <div className="flex flex-col gap-4">
      <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex justify-between space-x-4 p-4">
        {["TODO", "DOING", "DONE"].map((columnId) => (
          <Droppable droppableId={columnId} key={columnId}>
            {(provided) => (
              <Card
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`w-screen p-4 rounded-lg shadow-md min-h-[200px] transition-colors duration-300`}
              >
                <h2 className="text-xl font-semibold mb-4">{columsLabel[columnId as keyof Columns]}</h2>
                {tasks[columnId as keyof Columns].map((task, index) => (
                  <Draggable draggableId={task.id} index={index} key={task.id}>
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`p-4 mb-3 rounded-lg shadow-sm transition-transform ${
                          snapshot.isDragging ? "scale-105" : "scale-100"
                        }`}
                      >
                        <CardTitle className="text-center ">
                          <p>{task?.customerName}</p>
                        </CardTitle>
                        <CardContent className="flex-col justify-between items-center text-center">
                          <p className="mb-4 text-sm">{task?.customerPhone}</p>
                          <p>{format(add(task?.deliveryDate, { hours: 3 }), 'dd/MM/yyyy')}</p>
                          <p>{task?.totalItems}</p>
                          <p>{(task.totalAmount! / 100).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}</p>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Card>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
       
      </div>
    </>
  )
}
