import './helpText.css';
import classNames from 'classnames';
import * as React from 'react';

export interface Props {
  children: React.ReactNode;
  inline?: boolean;
}

export const HelpText: React.FC<Props> = (props: Props) => {
  const { children, inline = false } = props;

  return <div className={classNames("helpText", { inline: inline })}>{children}</div>;
};
