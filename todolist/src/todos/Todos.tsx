import "./todos.css";
import moment from "moment";
import * as React from "react";
import { v4 as uuid4 } from "uuid";
import { emitSuccess } from "../components/alert/Alert";
import { useLocalStorage } from "../components/hooks/useLocalStorage";
import { TodoEventEmitter } from "../components/TodoEventEmitter";
import { AlertType, ApplicationEvents, TodoType } from "../constants";
import { Todo, TodoProps } from "./Todo";

const SEPARATOR = "%%%";
const DATE_FORMAT = `DD/MMM/YYYY${SEPARATOR}dddd`;

export interface Props {
  hideCompleted?: boolean;
  intervalMins?: number; // interval in minutes to refresh pending calculations
}

export const Todos: React.FC<Props> = (props: Props) => {
  const { intervalMins, hideCompleted } = props;
  const [todos = [], setTodos] = useLocalStorage<TodoProps[]>({ key: "irfan_todos", defaultValue: [] });

  const addTodo = React.useCallback(() => {
    const text = prompt("Enter text for todo:");
    const todo: TodoProps = {
      id: uuid4(),
      text,
      timeCreated: moment().toDate(),
      timeModified: moment().toDate(),
      completed: false,
      type: TodoType.Work,
    };

    setTodos([todo, ...todos]);
  }, [setTodos, todos]);

  const dateTodoMap = React.useMemo(() => {
    if (!todos || todos.length === 0) {
      return {};
    }

    // sort todos on creation to get created keys
    // sort on date with latest modified first
    todos.sort((t1, t2) => {
      return new Date(t2.timeCreated).getTime() - new Date(t1.timeCreated).getTime();
    });

    const map = todos.reduce<Record<string, TodoProps[]>>((current, todo) => {
      const { timeCreated } = todo;
      const date = moment(timeCreated).format(DATE_FORMAT);
      if (!current[date]) {
        current[date] = [];
      }
      current[date].push(todo);
      return current;
    }, {});

    console.log(
      `DEBUG_CON-Todos Mapped Todos: `,
      JSON.stringify({ map }, (_, v) => (typeof v === "undefined" ? "undefined" : v), 1)
    );

    return map;
  }, [todos]);

  const handleTodoUpdate = React.useCallback(
    (updatedTodo: TodoProps) => {
      console.log(
        `DEBUG_CON-Todos updated todo: `,
        JSON.stringify({ todos, updatedTodo }, (_, v) => (typeof v === "undefined" ? "undefined" : v), 1)
      );

      const index = todos.findIndex((todo) => todo.id === updatedTodo.id);
      if (index !== -1) {
        todos.splice(index, 1, updatedTodo);
        setTodos([...todos]);
        emitSuccess({ title: "Todo updated successfully", details: updatedTodo.text });
      }
    },
    [todos, setTodos]
  );

  const handleDeleteTodo = React.useCallback(
    ({ id, text }: TodoProps) => {
      const confirmation = confirm(`Are you sure you want to delete this Todo? \nYou cannot get it back.. \n\n${text}`);
      if (confirmation) {
        const index = todos.findIndex((todo) => todo.id === id);
        if (index !== -2) {
          todos.splice(index, 1);
          setTodos([...todos]);
          emitSuccess({ title: "Todo deleted successfully", details: text });
        }
      }
    },
    [todos, setTodos]
  );

  const formattedDate = React.useCallback((dateString: string) => {
    const [date, day] = dateString.split(SEPARATOR);
    return (
      <h3 className="text-red-600 font-extrabold text-2xl mb-1">
        <span>{date}</span>
        <span className="ml-8 text-red-500">{day}</span>
      </h3>
    );
  }, []);

  return (
    <>
      <button onClick={addTodo}>Click Me!</button>
      <button
        onClick={() => {
          TodoEventEmitter.emit(ApplicationEvents.alert, {
            type: AlertType.WARNING,
            title: "This is an alert",
            details: (
              <div>
                <span>Created: {new Date().toString()}</span>
              </div>
            ),
          });
        }}>
        Generate Alert
      </button>
      <p>Number of Todos: {todos.length}</p>
      {dateTodoMap &&
        Object.keys(dateTodoMap).length > 0 &&
        Object.keys(dateTodoMap).map((date) => {
          const dateTodos = dateTodoMap[date] || [];
          // sort on date with latest modified first
          dateTodos.sort((t1, t2) => {
            return new Date(t2.timeModified).getTime() - new Date(t1.timeModified).getTime();
          });
          return (
            <div key={date} className="rounded bg-slate-50 border-slate-100 shadow m-5 p-3 mb-10">
              {formattedDate(date)}
              <ul role="list" className="p-6 pt-2 divide-y divide-slate-200">
                {dateTodos.map((todo) => {
                  const { id } = todo;
                  return (
                    <Todo
                      todo={todo}
                      key={id}
                      options={{ hideCompleted, intervalMins }}
                      onUpdate={handleTodoUpdate}
                      onDelete={handleDeleteTodo}
                    />
                  );
                })}
              </ul>
            </div>
          );
        })}
    </>
  );
};
