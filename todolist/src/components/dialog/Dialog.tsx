import classNames from 'classnames';
import * as React from 'react';

export enum DialogType {
  Confirmation,
  Normal,
}

export enum DialogWidth {
  Small,
  Medium,
  Large,
}

export interface Props {
  children: React.ReactNode;
  title: string;
  type?: DialogType;
  width?: DialogWidth;
  errorMessage?: React.ReactNode;
  okButtonLabel?: React.ReactNode;
  cancelButtonLabel?: React.ReactNode;
  onSubmit: () => void;
  onCancel: () => void;
}

export const Dialog: React.FC<Props> = (props: Props) => {
  const {
    type = DialogType.Normal,
    width = DialogWidth.Small,
    children,
    title,
    onSubmit,
    onCancel,
    errorMessage,
    okButtonLabel = "Save",
    cancelButtonLabel = "Cancel",
  } = props;

  return (
    <div className="overlay absolute top-0 bottom-0 left-0 right-0 bg-slate-400/75">
      <div
        className={classNames("dialog m-auto bg-white p-5 relative top-20 rounded-lg shadow-xl", {
          "w-1/2": width === DialogWidth.Medium,
          "w-1/3": width === DialogWidth.Small,
          "w-2/3": width === DialogWidth.Large,
        })}>
        <div className="text-blue-900 font-semibold border-b-2 mb-3 pb-1">
          <span className="pl-1">
            {type === DialogType.Confirmation && "Confirm: "}
            {title}
          </span>
        </div>
        <div className="p-3 text-base">{children}</div>
        {errorMessage && (
          <div className="p-2 text-red-800 bg-red-100 text-sm mt-3 mx-3 rounded-md pl-3 border-red-400">{errorMessage}</div>
        )}
        <div className="flex items-center justify-end py-2 px-1 border-t-2 mt-6">
          <button
            className="px-4 py-1 text-sm text-blue-600 font-semibold rounded-lg border border-blue-200 hover:text-white hover:bg-blue-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 mr-1"
            onClick={onSubmit}>
            {okButtonLabel}
          </button>
          <button
            className="px-4 py-1 text-sm text-red-600 font-semibold rounded-lg border border-red-200 hover:text-white hover:bg-red-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
            onClick={onCancel}>
            {cancelButtonLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
