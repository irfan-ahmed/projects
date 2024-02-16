import "./todos.css";
import moment from "moment";
import * as React from "react";
import { v4 as uuid4 } from "uuid";
import { HelpText } from "../components/help-text/HelpText";
import { useLocalStorage } from "../components/hooks/useLocalStorage";
import { Todo, TodoProps, TodoType } from "./Todo";

export interface Props {
  hideCompleted?: boolean;
  intervalMins?: number; // interval in minutes to refresh pending calculations
}

export const Todos: React.FC<Props> = (props: Props) => {
  const { intervalMins, hideCompleted } = props;
  const [todos, setTodos] = useLocalStorage<TodoProps[]>({ key: "irfan_todos", defaultValue: [] });

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

  return (
    <>
      <button onClick={addTodo}>Click Me!</button>
      <p>Number of Todos: {todos.length}</p>
      <div>
        <table className="todoContainer">
          <tr>
            <th>Done?</th>
            <th>Type</th>
            <th>What is it?</th>
            <th>Pending</th>
          </tr>
          <tbody>
            {todos &&
              todos.map((todo) => {
                const { id } = todo;
                return <Todo todo={todo} key={id} options={{ hideCompleted, intervalMins }} />;
              })}
            {!todos ||
              (todos.length === 0 && (
                <tr>
                  <td colSpan={4}>
                    <HelpText>You have not defined any todos. Click on 'New Todo' to add one.</HelpText>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
