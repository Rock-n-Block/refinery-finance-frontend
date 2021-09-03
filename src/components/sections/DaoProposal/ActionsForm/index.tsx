import React from 'react';
import {
  DatePicker as DatePickerAntd,
  Form as FormAntd,
  FormInstance,
  TimePicker as TimePickerAntd,
} from 'antd';
import classNames from 'classnames';
import { Moment } from 'moment';
import { Rule } from 'rc-field-form/lib/interface';

import openLinkIcon from '@/assets/img/icons/open-link.svg';

interface IActionsFormProps {
  form: FormInstance;
  snapshotClassName?: string;
  snapshotTitleClassName?: string;
}

const ActionsForm: React.FC<IActionsFormProps> = ({
  form,
  snapshotClassName,
  snapshotTitleClassName,
}) => {
  const actionsFormItems: Array<{
    key: string;
    labelClassName: string;
    labelContent: JSX.Element | string;
    rules: Rule[];
    child: JSX.Element;
  }> = [
    {
      key: 'start_date',
      labelClassName: 'actions-section__input-label',
      labelContent: 'Start date',
      rules: [
        {
          type: 'object',
          required: true,
          message: 'Please select date',
        },
      ],
      child: (
        <DatePickerAntd
          className="actions-section__input"
          name="start_date"
          format="YYYY-MM-DD"
          placeholder="yyyy.mm.dd"
          dropdownClassName="actions-section__input-dropdown"
        />
      ),
    },
    {
      key: 'start_time',
      labelClassName: 'actions-section__input-label',
      labelContent: 'Start time',
      rules: [
        {
          type: 'object',
          required: true,
          message: 'Please select time',
        },
      ],
      child: (
        <TimePickerAntd
          className="actions-section__input"
          name="start_time"
          format="HH:mm"
          popupClassName="actions-section__input-popup"
        />
      ),
    },
    {
      key: 'end_date',
      labelClassName: 'actions-section__input-label',
      labelContent: 'End date',
      rules: [
        {
          required: true,
          validator: (_, value) => {
            const formFieldsValues: { [key: string]: Moment } = form.getFieldsValue();
            if (!value) {
              return Promise.reject(new Error('Please select date'));
            }

            if (Object.values(formFieldsValues).some((fieldValue) => !fieldValue)) {
              return Promise.resolve();
            }

            const { actionsForm_start_date, actionsForm_end_date } = formFieldsValues;

            // Note: if you chain multiple actions to construct a date, you should start from a year, then a month, then a day etc. Otherwise you may get unexpected results, like when day=31 and current month has only 30 days
            const startDate = actionsForm_start_date
              .clone()
              .hours(0)
              .minutes(0)
              .seconds(0)
              .milliseconds(0);

            const endDate = actionsForm_end_date
              .clone()
              .hours(0)
              .minutes(0)
              .seconds(0)
              .milliseconds(0);

            if (startDate > endDate) {
              return Promise.reject(new Error('End date must be after the start date'));
            }

            return Promise.resolve();
          },
        },
      ],
      child: (
        <DatePickerAntd
          className="actions-section__input"
          name="end_date"
          format="YYYY-MM-DD"
          placeholder="yyyy.mm.dd"
        />
      ),
    },
    {
      key: 'end_time',
      labelClassName: 'actions-section__input-label',
      labelContent: 'End time',
      rules: [
        {
          required: true,
          validator: (_, value) => {
            const formFieldsValues: { [key: string]: Moment } = form.getFieldsValue();
            if (!value) {
              return Promise.reject(new Error('Please select time'));
            }

            if (Object.values(formFieldsValues).some((fieldValue) => !fieldValue)) {
              return Promise.resolve();
            }

            const {
              actionsForm_start_date,
              actionsForm_start_time,
              actionsForm_end_date,
              actionsForm_end_time,
            } = formFieldsValues;

            // Note: if you chain multiple actions to construct a date, you should start from a year, then a month, then a day etc. Otherwise you may get unexpected results, like when day=31 and current month has only 30 days
            const startDate = actionsForm_start_date
              .clone()
              .hours(actionsForm_start_time.hours())
              .minutes(actionsForm_start_time.minutes())
              .seconds(0)
              .milliseconds(0);

            const endDate = actionsForm_end_date
              .clone()
              .hours(actionsForm_end_time.hours())
              .minutes(actionsForm_end_time.minutes())
              .seconds(0)
              .milliseconds(0);

            if (startDate > endDate) {
              return Promise.reject(new Error('End date must be after the start date'));
            }

            return Promise.resolve();
          },
        },
      ],
      child: <TimePickerAntd className="actions-section__input" name="end_time" format="HH:mm" />,
    },
  ];
  return (
    <FormAntd name="actionsForm" form={form} layout="vertical">
      {actionsFormItems.map(({ key, labelClassName, labelContent, rules, child }) => {
        return (
          <FormAntd.Item
            key={key}
            name={`actionsForm_${key}`}
            label={
              <span className={classNames(labelClassName, 'text-ssm text-purple')}>
                {labelContent}
              </span>
            }
            rules={rules}
          >
            {child}
          </FormAntd.Item>
        );
      })}
      <FormAntd.Item className={snapshotClassName}>
        <a href="/" className="text-ssm text-purple box-f-ai-c">
          <span className={snapshotTitleClassName}>Snapshot 0</span>
          <img src={openLinkIcon} alt="external link" />
        </a>
      </FormAntd.Item>
    </FormAntd>
  );
};

export default ActionsForm;
