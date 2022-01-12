/* eslint-disable react/react-in-jsx-scope */
import { ChangeEvent, FC, Fragment, useState } from 'react';
import { RadioChangeEvent } from 'antd';
import { useFormik } from 'formik';

import { Button, Input, Switch } from '@/components/atoms';
import { StrOrUnd } from '@/types';

import CheckImg from '../../../../assets/img/sections/profile/checkImg.svg';
import TeamImg from '../../../../assets/img/sections/profile/teamImg.svg';
import StepsLine from '../StepsLine';

import StepCardRadio from './StepCard/StepCardRadio/index';
import { firstStepItems, stepsDataConfig, thirdStepItems } from './helpers';
import StepCard from './StepCard';

import './StepsForm.scss';

const StepsForm: FC = () => {
  const stepsFormData = useFormik({
    initialValues: {
      nikName: '',
      picture: '',
      team: '',
      userName: '',
    },
    onSubmit: (values: any) => {
      // eslint-disable-next-line no-console
      console.log(values);
    },
  });

  const [activeStep, setActiveStep] = useState(1);
  const [nikName, setNikName] = useState<StrOrUnd>('');
  const [team, setTeam] = useState<StrOrUnd>('');
  const [userName, setUserName] = useState<StrOrUnd>('');

  const handleChangeActiveStep = (event: RadioChangeEvent) => {
    const { value } = event.target;
    setActiveStep(+value);
  };

  const handleChangeNikName = (event: RadioChangeEvent) => {
    const { value } = event.target;
    stepsFormData.values.nikName = value;
    stepsFormData.handleChange(value);
    setNikName(value);
  };
  // const handleChangePicture = () => {};
  const handleChangeTeam = (event: RadioChangeEvent) => {
    const { value } = event.target;
    stepsFormData.values.team = value;
    stepsFormData.handleChange(value);
    setTeam(value);
  };
  const handleChangeUserName = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    stepsFormData.values.userName = value;
    stepsFormData.handleChange(value);
    setUserName(value);
  };

  return (
    <div className="stepsForm box-f-fd-c">
      <StepsLine activeStep={activeStep} onChange={handleChangeActiveStep} />
      <div className="stepsForm__steps">
        {stepsDataConfig.map((step) => {
          return (
            <Fragment key={step.id}>
              {activeStep === step.id && (
                <StepCard
                  id={step.id}
                  mainTitle={step.mainTitle}
                  mainSubtitle={step.mainSubtitle}
                  secondTitle={step.secondTitle}
                  secondSubtitle={step.secondSubtitle}
                >
                  <>
                    {step.id === 1 && (
                      <StepCardRadio
                        items={firstStepItems}
                        name={nikName}
                        formDataValue={stepsFormData.values.nikName}
                        onCnange={handleChangeNikName}
                      />
                    )}
                    {step.id === 2 && (
                      <div>
                        <span>Name</span>
                        <span>Allow collectible to be locked</span>
                        <span>
                          The collectible you’ve chosen will be locked in a smart contract while
                          it’s being used as your profile picture. Don’t worry - you’ll be able to
                          get it back at any time.
                        </span>
                      </div>
                    )}
                    {step.id === 3 && (
                      <StepCardRadio
                        items={thirdStepItems}
                        name={team}
                        formDataValue={stepsFormData.values.team}
                        onCnange={handleChangeTeam}
                        postfixImg={TeamImg}
                        postfixValue={15305}
                        className="stepsForm__steps__third-radio"
                      />
                    )}
                    {step.id === 4 && (
                      <div className="stepCard-body__four">
                        <Input
                          value={userName}
                          onChange={handleChangeUserName}
                          className="stepCard-body__four-input"
                          prefix={<img src={CheckImg} alt="chekImg" />}
                        />
                        <div className="stepCard-body__four-switch">
                          <Switch colorScheme="white" switchSize="sm" />
                          <span>
                            I understand that people can view my wallet if they know my username.
                          </span>
                        </div>
                        <Button colorScheme="purple" size="md" disabled>
                          Confirm Profole
                        </Button>
                      </div>
                    )}
                  </>
                </StepCard>
              )}
            </Fragment>
          );
        })}
      </div>
      <Button onClick={stepsFormData.handleSubmit}>Submit</Button>
    </div>
  );
};

export default StepsForm;
