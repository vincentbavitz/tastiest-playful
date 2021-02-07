import React from 'react';
import PasswordSVG from '../../assets/svgs/lock.svg';
import { InputAbstract } from './InputAbstract';

interface Props {
  value: string;
  placeholder?: string;
  show?: boolean;
  toggleShow?: () => void;
  onValueChange?(value: string): any;
}
export function InputPassword(props: Props) {
  const {
    value,
    show = false,
    toggleShow,
    placeholder = 'Password',
    onValueChange,
  } = props;

  return (
    <InputAbstract
      size="large"
      type={show ? 'text' : 'password'}
      placeholder={placeholder}
      prefix={<PasswordSVG className="h-8 ml-2 mr-2" />}
      suffix={
        toggleShow ? (
          <a onClick={() => toggleShow()} className="text-gray-500">
            {show ? 'Hide' : 'Show'}
          </a>
        ) : null
      }
      value={value}
      onValueChange={onValueChange}
    ></InputAbstract>
  );
}
