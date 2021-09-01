import React, { useState } from 'react';
import { Select as AntdSelect } from 'antd';
import { SelectProps, SelectValue } from 'antd/lib/select';

interface IDropdownSelectorProps extends SelectProps<SelectValue> {
  label?: string;
  items: string[];
}

const DropdownSelector: React.FC<IDropdownSelectorProps> = React.memo((props) => {
  const { className, items, children, defaultValue, onChange = () => {}, ...otherProps } = props;
  const [activeValue, setActiveValue] = useState(defaultValue);
  return (
    <div style={{ position: 'relative' }}>
      <AntdSelect
        className={className}
        onChange={(selectedValue, selectedOption) => {
          onChange(selectedValue, selectedOption);
          setActiveValue(selectedValue as string);
        }}
        value={activeValue}
        {...otherProps}
      >
        {items
          .filter((item) => {
            return item !== activeValue;
          })
          .map((item) => {
            return (
              <AntdSelect.Option value={item} key={item}>
                {item}
              </AntdSelect.Option>
            );
          })}
      </AntdSelect>
      {children}
    </div>
  );
});

export default DropdownSelector;
