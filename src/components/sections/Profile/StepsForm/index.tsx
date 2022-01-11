/* eslint-disable react/react-in-jsx-scope */
import { FC, useState } from 'react';
import { RadioChangeEvent } from 'antd';

import StepsRadio from '../StepsRadio';

import './StepsForm.scss';

const StepsForm: FC = () => {
  const [activeStep, setActiveStep] = useState(1);

  const handleChangeActiveStep = (event: RadioChangeEvent) => {
    const { value } = event.target;
    setActiveStep(+value);
  };

  return (
    <div className="stepsForm box-f-fd-c">
      <StepsRadio activeStep={activeStep} onChange={handleChangeActiveStep} />

      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore in nihil totam officiis!
        Nam beatae pariatur expedita cupiditate quas aut harum dignissimos! Repudiandae consequatur
        nostrum et magni facere maiores similique labore. Ad architecto aliquid reprehenderit, esse
        expedita nam culpa maxime nulla officia sint ipsa, laudantium ullam maiores deserunt ea quo
        non? Distinctio minima voluptatibus neque ipsam dicta nisi accusamus fugit. Ipsam fugiat
        repellendus quas ab saepe aliquam fugit, velit consectetur! Veniam cupiditate deserunt
        nesciunt omnis porro animi vitae dolorum! Ab tempore aut possimus distinctio dicta expedita?
        Voluptatum saepe aliquam laborum, quaerat odit quibusdam distinctio fugit, omnis ipsa quo
        unde praesentium.
      </div>
    </div>
  );
};

export default StepsForm;
