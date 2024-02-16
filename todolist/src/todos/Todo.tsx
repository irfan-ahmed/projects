import "./todo.css";
import moment from "moment";
import * as React from "react";
import { TodoType } from "../constants";

export interface TodoProps {
  id: string;
  text: React.ReactNode;
  completed: boolean;
  timeCreated: Date;
  timeModified: Date;
  targetDate?: Date;
  type: TodoType;
  children?: TodoProps[];
}

export interface TodoDisplayOptions {
  hideCompleted?: boolean;
  intervalMins?: number;
}

export interface Props {
  todo: TodoProps;
  options: TodoDisplayOptions;
  onUpdate: (todo: TodoProps) => void;
  onDelete: (todo: TodoProps) => void;
}

export const Todo: React.FC<Props> = (props: Props) => {
  const {
    todo,
    todo: { completed, text, id, timeModified },
    options: { hideCompleted = false, intervalMins = 10 },
    onUpdate,
    onDelete,
  } = props;

  const [nonce, setNonce] = React.useState(Date.now());

  const daysPending = React.useMemo(() => {
    // calculate the days that this todo has been pending from the last modified time
    return moment(timeModified).fromNow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeModified, nonce]);

  React.useEffect(() => {
    const timer = setInterval(
      () => {
        setNonce(Date.now());
      },
      intervalMins * 60 * 1000
    );

    return () => {
      if (timer) {
        window.clearInterval(timer);
      }
    };
  }, [intervalMins]);

  // Hide this todo if completed and we are not displaying completed ones
  if (completed && hideCompleted) {
    return null;
  }

  return (
    <li className="flex pb-2 first:pt-0 last:pb-0 border-b-2 items-center justify-between">
      <div className="flex items-center grow">
        <div className="h-4 w-4 rounded-full border-slate-100  mx-3 mr-3 bg-red-400 shadow hover:shadow-lg shrink-0"></div>
        <div>
          <input
            type="checkbox"
            className="h-5 w-5 m-3"
            checked={completed}
            onChange={(e) => {
              onUpdate({
                ...todo,
                completed: e.target.checked,
                timeModified: moment().toDate(),
              });
            }}
          />
        </div>
        <div className="m-3 text-blue-900 text-xl font-bold break-words">{todo.text}</div>
      </div>

      <div className="flex items-center content-end">
        <div className="text-sm text-gray-400 whitespace-nowrap mr-3">{daysPending}</div>
        <svg
          className="fill-current h-6 w-6 text-red-500"
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          onClick={() => {
            onDelete(todo);
          }}>
          <title>Close</title>
          <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
        </svg>
      </div>
    </li>
  );

  return (
    <tr key={id} className="todo">
      <td className="done">
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => {
            onUpdate({
              ...todo,
              completed: e.target.checked,
            });
          }}
        />
      </td>
      <td className="icon">
        <i className="workIcon" />
      </td>
      <td className="text">
        <span>{text}</span>
      </td>
      <td className="date">{daysPending}</td>
    </tr>
  );
};
