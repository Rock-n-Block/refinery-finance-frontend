import React, { useState } from 'react';
import { Form as FormAntd, FormInstance } from 'antd';
import classNames from 'classnames';

import Input from '@/components/atoms/Input';

interface ITitleFormProps {
  form: FormInstance;
  fieldClassName?: string;
  inputClassName?: string;
  onChange?: () => void;
}

const TitleForm: React.FC<ITitleFormProps> = ({
  form,
  fieldClassName,
  inputClassName,
  onChange,
}) => {
  console.log(/* TODO: remove */ onChange);
  const [titleValue, setTitleValue] = useState('');
  const titleInputHandler = ({ target }: React.ChangeEvent<HTMLInputElement>) =>
    setTitleValue(target.value);
  return (
    <FormAntd name="titleForm" form={form} layout="vertical">
      <FormAntd.Item
        className={classNames(fieldClassName)}
        name="title"
        rules={[
          {
            required: true,
            whitespace: true,
            message: 'Title must not be empty',
          },
          {
            max: 100, // snapshot.js backend allows up to 256 chars
            message: 'Character limit exceeded',
          },
        ]}
      >
        <Input
          className={classNames(inputClassName)}
          colorScheme="outline"
          inputSize="lg"
          value={titleValue}
          onChange={titleInputHandler}
        />
      </FormAntd.Item>
    </FormAntd>
  );
};

export default TitleForm;
