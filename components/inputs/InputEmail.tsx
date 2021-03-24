import EmailSVG from '@svg/email.svg';
import { Input } from '@tastiest-io/tastiest-components';
import React from 'react';

interface Props {
  value: string;
  onValueChange?(value: string): any;
}
export function InputEmail(props: Props) {
  const { value, onValueChange } = props;

  return (
    <Input
      size="large"
      type="email"
      placeholder="Email address"
      prefix={<EmailSVG className="h-6" />}
      maxLength={50}
      value={value}
      onValueChange={onValueChange}
    ></Input>
  );
}
