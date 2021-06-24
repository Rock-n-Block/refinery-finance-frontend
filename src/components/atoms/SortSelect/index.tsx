import React from 'react';
import { Select as AntdSelect } from 'antd';
import { SelectProps, SelectValue } from 'antd/lib/select';

import 'antd/lib/select/style/css';
import './SortSelect.scss';

import { ReactComponent as ArrowImg } from '../../../assets/img/icons/arrow-btn.svg';

const { Option } = AntdSelect;

interface ISortSelect extends SelectProps<SelectValue> {
  label?: string;
}

const SortSelect: React.FC<ISortSelect> = (props) => {
  const items = ['Hot', 'APR', 'Multiplier', 'Earned', 'Liquidity'];
  const { label, ...otherProps } = props;
  const [activeValue, setActiveValue] = React.useState<any>(items[0]);
  return (
    <AntdSelect
      labelInValue
      onChange={(value: any) => setActiveValue(value.value)}
      suffixIcon={<ArrowImg />}
      value={{
        value: '',
        label: `${label} ${activeValue}`,
      }}
      {...otherProps}
      className="s-sort"
    >
      {items
        .filter((item) => item !== activeValue)
        .map((item) => (
          <Option value={item} key={item}>
            <div>{item}</div>
          </Option>
        ))}
    </AntdSelect>
  );
};

export default SortSelect;
