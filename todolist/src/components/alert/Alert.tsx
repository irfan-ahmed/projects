import * as React from "react";
import { AlertType, ApplicationEvents } from "../../constants";
import { TodoEventEmitter } from "../TodoEventEmitter";

export interface AlertDetails {
  type: AlertType;
  title: string;
  details?: React.ReactNode;
}

export interface Props {
  alert: AlertDetails;
  onClose: () => void;
}

type EmitEventHelperType = Omit<AlertDetails, "type">;

export const emitError = (data: EmitEventHelperType) => {
  TodoEventEmitter.emit(ApplicationEvents.alert, { type: AlertType.ERROR, ...data } as AlertDetails);
};

export const emitSuccess = (data: EmitEventHelperType) => {
  TodoEventEmitter.emit(ApplicationEvents.alert, { type: AlertType.SUCCESS, ...data } as AlertDetails);
};

export const emitInfo = (data: EmitEventHelperType) => {
  TodoEventEmitter.emit(ApplicationEvents.alert, { type: AlertType.INFO, ...data } as AlertDetails);
};

export const emitWarning = (data: EmitEventHelperType) => {
  TodoEventEmitter.emit(ApplicationEvents.alert, { type: AlertType.WARNING, ...data } as AlertDetails);
};

export const Alert: React.FC<Props> = (props: Props) => {
  const {
    alert: { type, title, details },
    onClose,
  } = props;

  const colorMapping = React.useRef({
    [AlertType.SUCCESS]: { bgClasses: `bg-teal-100 border-teal-500 text-teal-900`, textClasses: `text-teal-900` },
    [AlertType.INFO]: { bgClasses: `bg-blue-100 border-blue-500 text-blue-900`, textClasses: `text-blue-900` },
    [AlertType.ERROR]: { bgClasses: `bg-red-100 border-red-500 text-red-900`, textClasses: `text-red-900` },
    [AlertType.WARNING]: { bgClasses: `bg-orange-100 border-orange-500 text-orange-900`, textClasses: `text-orange-900` },
  });

  const { bgClasses, textClasses } = React.useMemo(() => {
    console.log(
      `DEBUG_CON-Alert checking color: `,
      JSON.stringify({ type }, (_, v) => (typeof v === "undefined" ? "undefined" : v), 1)
    );

    // tailwind does not work with dynamically generated classes.. hence cannot use text-${color}-500
    return colorMapping.current[type];
  }, [type]);

  return (
    <div className={`${bgClasses} border-t-4 rounded-b px-4 py-3 shadow-md my-2 w-1/3 m-auto`} role="alert">
      <span className="float-end ">
        <svg
          className={`fill-current h-6 w-6 ${textClasses}`}
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          onClick={onClose}>
          <title>Close</title>
          <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
        </svg>
      </span>
      <div className="flex">
        <div className="py-1">
          <svg className={`fill-current h-6 w-6 ${textClasses} mr-4`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
          </svg>
        </div>
        <div>
          <div className="font-bold">{title}</div>
          <div className="text-sm">{details}</div>
        </div>
      </div>
    </div>
  );
};
