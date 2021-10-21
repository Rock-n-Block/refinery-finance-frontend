import React, { useEffect, useState } from 'react';
import {
  DatePicker as DatePickerAntd,
  Form as FormAntd,
  FormInstance,
  TimePicker as TimePickerAntd,
} from 'antd';
import classNames from 'classnames';
import moment, { Moment } from 'moment';
import { Rule } from 'rc-field-form/lib/interface';

import OpenLink from '@/components/atoms/OpenLink';
import { useScannerUrl } from '@/hooks/useScannerUrl';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';

import { getMomentDate, getMomentMergedDateTime } from '../helpers';

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
          required: true,
          validator: (_, value: Moment) => {
            const formFieldsValues: { [key: string]: Moment } = form.getFieldsValue();
            if (!value) {
              return Promise.reject(new Error('Please select date'));
            }

            const startDate = getMomentDate(value);
            if (startDate < getMomentDate(moment())) {
              return Promise.reject(new Error('Start date cannot be earlier than today'));
            }

            // If some of the values is empty then skip validating
            if (Object.values(formFieldsValues).some((fieldValue) => !fieldValue)) {
              return Promise.resolve();
            }

            return Promise.resolve();
          },
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
          validator: (_, value: Moment) => {
            const formFieldsValues: { [key: string]: Moment } = form.getFieldsValue();
            if (!value) {
              return Promise.reject(new Error('Please select date'));
            }

            console.log('TEST', value, moment(), value === formFieldsValues.actionsForm_end_date);

            const endDate = getMomentDate(value);
            if (endDate < getMomentDate(moment())) {
              return Promise.reject(new Error('End date cannot be earlier than today'));
            }

            // If some of the values is empty then skip validating
            if (Object.values(formFieldsValues).some((fieldValue) => !fieldValue)) {
              return Promise.resolve();
            }

            const { actionsForm_start_date } = formFieldsValues;
            const startDate = getMomentDate(actionsForm_start_date);

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
            const startDate = getMomentMergedDateTime(
              actionsForm_start_date,
              actionsForm_start_time,
            );

            const endDate = getMomentMergedDateTime(actionsForm_end_date, actionsForm_end_time);

            if (startDate > endDate) {
              return Promise.reject(new Error('End date must be after the start date'));
            }

            if (startDate.unix() === endDate.unix()) {
              return Promise.reject(new Error('The start and end times must not be the same'));
            }

            return Promise.resolve();
          },
        },
      ],
      child: <TimePickerAntd className="actions-section__input" name="end_time" format="HH:mm" />,
    },
  ];

  const [latestBlock, setLatestBlock] = useState(0);
  const { metamaskService } = useWalletConnectorContext();

  useEffect(() => {
    const getBlock = async () => {
      const currentBlock = await metamaskService.web3Provider.eth.getBlockNumber();
      setLatestBlock(currentBlock);
    };
    getBlock();
  }, [metamaskService.web3Provider.eth]);

  const latestBlockUrl = useScannerUrl(`block/${latestBlock}`);

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
        <OpenLink
          href={latestBlockUrl}
          text={<span className={snapshotTitleClassName}>Snapshot {latestBlock}</span>}
        />
      </FormAntd.Item>
    </FormAntd>
  );
};

export default ActionsForm;
