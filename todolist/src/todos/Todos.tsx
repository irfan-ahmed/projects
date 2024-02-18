import './todos.css';
import moment from 'moment';
import * as React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { v4 as uuid4 } from 'uuid';
import { useLocalStorage } from '../components/hooks/useLocalStorage';
import { emitError, emitSuccess, TodoType } from '../constants';
import { AddUpdateTodoDialog } from './AddUpdateTodoDialog';
import { Todo, TodoProps } from './Todo';

const SEPARATOR = "%%%";
const DATE_FORMAT = `DD/MMM/YYYY${SEPARATOR}dddd`;

export interface Props {
  hideCompleted?: boolean;
  intervalMins?: number; // interval in minutes to refresh pending calculations
}

export const Todos: React.FC<Props> = (props: Props) => {
  const { intervalMins, hideCompleted } = props;
  const [todos = [], setTodos] = useLocalStorage<TodoProps[]>({ key: "irfan_todos", defaultValue: [] });
  const [addMode, setAddMode] = React.useState(false);

  const addTodo = React.useCallback(() => {
    setAddMode(true);
  }, []);

  useHotkeys("alt+n", addTodo);

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

    return map;
  }, [todos]);

  const handleTodoUpdate = React.useCallback(
    (updatedTodo: TodoProps) => {
      const index = todos.findIndex((todo) => todo.id === updatedTodo.id);
      if (index !== -1) {
        todos.splice(index, 1, updatedTodo);
        setTodos([...todos]);
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
      {dateTodoMap &&
        Object.keys(dateTodoMap).length > 0 &&
        Object.keys(dateTodoMap).map((date) => {
          const dateTodos = dateTodoMap[date] || [];
          // sort on date with latest modified first
          dateTodos.sort((t1, t2) => {
            const { completed: t1Completed, timeModified: t1Modified } = t1;
            const { completed: t2Completed, timeModified: t2Modified } = t2;
            if (t1Completed && t2Completed) {
              return moment(t2Modified).valueOf() - moment(t1Modified).valueOf();
            }

            if (t1Completed) {
              return 1;
            }

            if (t2Completed) {
              return -1;
            }

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
      {addMode && (
        <AddUpdateTodoDialog
          current={{
            id: uuid4(),
            text: "",
            type: TodoType.Work,
            completed: false,
            timeCreated: moment().toDate(),
            timeModified: moment().toDate(),
          }}
          onUpdate={(updatedTodo) => {
            const { text } = updatedTodo;
            if (!text || text.trim().length === 0) {
              emitError({ title: "Todo is missing text. Provide one and try again" });
            } else {
              setTodos([updatedTodo, ...todos]);
              setAddMode(false);
            }
          }}
          onCancel={() => {
            setAddMode(false);
          }}
        />
      )}
    </>
  );
};
