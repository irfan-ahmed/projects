import "./todo.css";
import moment from "moment";
import * as React from "react";

export enum TodoType {
  Work = "Work",
  Personal = "Personal",
  Weekend = "Weekend",
}

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
}

export const Todo: React.FC<Props> = (props: Props) => {
  const {
    todo: { completed, text, id, timeModified },
    options: { hideCompleted = false, intervalMins = 10 },
  } = props;

  const [nonce, setNonce] = React.useState(Date.now());

  const daysPending = React.useMemo(() => {
    // calculate the days that this todo has been pending from the last modified time
    console.log(
      `DEBUG_CON-Todo checking pending: `,
      JSON.stringify({ nonce }, (_, v) => (typeof v === "undefined" ? "undefined" : v), 1)
    );
    let pending = moment().diff(moment(timeModified), "days");
    if (pending) {
      return `${pending} Days`;
    }

    pending = moment().diff(moment(timeModified), "hours");
    if (pending) {
      return `${pending} Hours`;
    }

    pending = moment().diff(moment(timeModified), "minutes");
    if (pending) {
      return `${pending} Mins`;
    }

    return `${moment().diff(moment(timeModified), "seconds")} Secs`;
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
    <tr key={id} className="todo">
      <td className="done">
        <input type="checkbox" checked={completed} />
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
