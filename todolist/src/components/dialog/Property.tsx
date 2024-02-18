import * as React from 'react';

export interface Props {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

export const Property: React.FC<Props> = (props: Props) => {
  const { label, required = false, children } = props;
  return (
    <div className="mt-3">
      <label className="text-sm font-bold text-blue-800 block">
        {label}
        {required && <span className="ml-2 text-red-700">*</span>}
      </label>
      <div className="mt-2 [&>*]:pr-1 [&>*]:text-sm [&>*]:border-blue-200 [&>*]:border-2 [&>*]:px-2 [&>*]:rounded-md [&>*]:py-2">
        {children}
      </div>
    </div>
  );
};
