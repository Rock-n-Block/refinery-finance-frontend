/* eslint-disable react/react-in-jsx-scope */
import { FC, useState } from 'react';
import { RadioChangeEvent } from 'antd';
import { useFormik } from 'formik';

import { Button } from '@/components/atoms';

import StepsRadio from '../StepsRadio';

import { stepsCardsData } from './StepCard/helpers';
import StepCard from './StepCard';

import './StepsForm.scss';

const StepsForm: FC = () => {
  const stepsFormData = useFormik({
    initialValues: {
      name: '',
      picture: '',
      team: '',
      settingName: false,
    },
    onSubmit: (values: any) => {
      console.log(values);
    },
  });

  const [activeStep, setActiveStep] = useState(1);

  const handleChangeActiveStep = (event: RadioChangeEvent) => {
    const { value } = event.target;
    setActiveStep(+value);
  };

  return (
    <div className="stepsForm box-f-fd-c">
      <StepsRadio activeStep={activeStep} onChange={handleChangeActiveStep} />
      <div className="stepsForm__steps">
        {stepsCardsData.map((step) => {
          return (
            <>
              {activeStep === step.id && (
                <StepCard
                  id={step.id}
                  mainTitle={step.mainTitle}
                  mainSubtitle={step.mainSubtitle}
                  secondTitle={step.secondTitle}
                  secondSubtitle={step.secondSubtitle}
                >
                  {step.children}
                </StepCard>
              )}
            </>
          );
        })}
      </div>
      <Button onClick={stepsFormData.handleSubmit}>Submit</Button>
    </div>
  );
};

export default StepsForm;
