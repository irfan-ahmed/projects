import './todo.css';
import DOMPurify from 'dompurify';
import moment from 'moment';
import * as React from 'react';
import { TodoType } from '../constants';
import { AddUpdateTodoDialog } from './AddUpdateTodoDialog';

export interface TodoProps {
  id: string;
  text: string;
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
    todo: { completed, text, timeModified, type },
    options: { hideCompleted = false, intervalMins = 10 },
    onUpdate,
    onDelete,
  } = props;

  const [nonce, setNonce] = React.useState(Date.now());
  const [editMode, setEditMode] = React.useState(false);

  const daysPending = React.useMemo(() => {
    // calculate the days that this todo has been pending from the last modified time
    return moment(timeModified).fromNow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeModified, nonce]);

  const sanitizedHtml = React.useMemo(() => {
    return DOMPurify.sanitize(text);
  }, [text]);

  const editTodo = React.useCallback(() => {
    setEditMode(true);
  }, []);

  const icon = React.useMemo(() => {
    switch (type) {
      case TodoType.Personal:
        return <img src="../src/assets/personal.JPG" alt="Personal" />;
      case TodoType.Work:
        return <img src="../src/assets/work.JPG" alt="Work" />;
      case TodoType.Weekend:
        return <img src="../src/assets/weekend.JPG" alt="Weekend" />;
      default:
        return <img src="../src/assets/work.JPG" alt="Work" />;
    }
  }, [type]);

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
    <li className="flex pb-1 first:pt-0 last:pb-0 border-b-1 items-center justify-between">
      <div className="flex items-center grow peer">
        <div className="shrink-0 h-7 w-7 shadow-none hover:shadow-xl hover:cursor-pointer" role="button" onClick={editTodo}>
          {icon}
        </div>
        <div className="flex items-center">
          <input
            id="completed"
            type="checkbox"
            className="h-5 w-5 m-2 mx-3 peer/completed"
            checked={completed}
            onChange={(e) => {
              onUpdate({
                ...todo,
                completed: e.target.checked,
                timeModified: moment().toDate(),
              });
            }}
          />
          <div
            className="m-1 mx-3 text-blue-900 text-md font-bold break-words peer-checked/completed:text-gray-500 peer-checked/completed:font-light peer-checked/completed:text-base"
            role="input"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            onClick={editTodo}
          />
        </div>
      </div>

      <div className="flex items-center content-end">
        <div className="text-sm text-gray-400 whitespace-nowrap mr-3">{daysPending}</div>
        <svg
          className="fill-current h-6 w-6 text-red-500 hover:text-red-800"
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

      {editMode && (
        <AddUpdateTodoDialog
          edit={true}
          current={todo}
          onCancel={() => {
            setEditMode(false);
          }}
          onUpdate={(edited) => {
            onUpdate(edited);
            setEditMode(false);
          }}
        />
      )}
    </li>
  );
};
