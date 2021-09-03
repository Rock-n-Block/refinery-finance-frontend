import React, { useState } from 'react';
import { Form as FormAntd, FormInstance } from 'antd';
import classNames from 'classnames';

import closeIcon from '@/assets/img/icons/cross.svg';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import throttle from '@/utils/Throttle';

interface IChoicesFormProps {
  form: FormInstance;
  inputClassName?: string;
  inputPostfixClassName?: string;
  formErrorsClassName?: string;
  buttonClassName?: string;
}

const ChoicesForm: React.FC<IChoicesFormProps> = ({
  form,
  inputClassName,
  inputPostfixClassName,
  formErrorsClassName,
  buttonClassName,
}) => {
  const [choicesFormError, setChoicesFormError] = useState(['']);
  const throttledUpdateChoicesFormFieldsError = throttle(() => {
    const formFields = form.getFieldsError();
    const hasError = formFields.some(({ errors }, index) => {
      if (errors.length || index === formFields.length - 1) {
        setChoicesFormError(errors);
      }
      return errors.length;
    });
    return hasError;
  }, 1500);
  return (
    <FormAntd
      name="choicesForm"
      form={form}
      initialValues={{
        choices: [undefined, undefined],
      }}
      validateTrigger={['onChange', 'onBlur']}
      onFieldsChange={throttledUpdateChoicesFormFieldsError}
    >
      <FormAntd.List name="choices">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <FormAntd.Item key={field.key} required={false} help={<></>}>
                <FormAntd.Item
                  {...field}
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: 'Choices must not be empty',
                    },
                  ]}
                  noStyle
                >
                  <Input
                    className={classNames(inputClassName)}
                    placeholder="Input choice text"
                    colorScheme="outline"
                    inputSize="lg"
                  />
                </FormAntd.Item>
                {fields.length > 2 && (
                  <Button
                    className={classNames(inputPostfixClassName)}
                    icon={closeIcon}
                    colorScheme="outline-purple"
                    size="md"
                    onClick={() => remove(field.name)}
                  />
                )}
              </FormAntd.Item>
            ))}
            <div className={classNames(formErrorsClassName, 'text-ssm')}>{choicesFormError}</div>
            <Button
              className={classNames(buttonClassName, 'text-bold')}
              colorScheme="purple"
              onClick={() => add()}
            >
              Add choice
            </Button>
          </>
        )}
      </FormAntd.List>
    </FormAntd>
  );
};

export default ChoicesForm;
