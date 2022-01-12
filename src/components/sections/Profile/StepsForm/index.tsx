/* eslint-disable react/react-in-jsx-scope */
import { ChangeEvent, FC, Fragment, useState } from 'react';
import { RadioChangeEvent } from 'antd';
import { useFormik } from 'formik';

import { ReactComponent as ArrowRight } from '@/assets/img/sections/profile/arrow-right.svg';
import BlueArrow from '@/assets/img/sections/profile/blue-arrow.svg';
import CheckImg from '@/assets/img/sections/profile/checkImg.svg';
import TeamImg from '@/assets/img/sections/profile/teamImg.svg';
import { Button, Input, Switch } from '@/components/atoms';
import { StrOrUnd } from '@/types';

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
  const [canComplite, setCanComplite] = useState(false);
  const [isAgree, setAgree] = useState(false);
  const [canJumpNextStep, setCanJumpNextStep] = useState(false);
  const [nikName, setNikName] = useState<StrOrUnd>('');
  const [team, setTeam] = useState<StrOrUnd>('');
  const [, setPicture] = useState<StrOrUnd>('');
  const [userName, setUserName] = useState<StrOrUnd>('');

  const [isNikNameApprove, setNikNameApprove] = useState(false);
  const [isPictureApprove, setPictureApprove] = useState(false);

  const handleSetNextStep = () => {
    if (activeStep !== 4) {
      setActiveStep(activeStep + 1);
      setCanJumpNextStep(false);
    } else {
      stepsFormData.handleSubmit();
    }
  };

  const handleChangeNikName = (event: RadioChangeEvent) => {
    const { value } = event.target;
    stepsFormData.values.nikName = value;
    stepsFormData.handleChange(value);
    setNikName(value);
  };
  const handleChangePicture = (event: RadioChangeEvent) => {
    const { value } = event.target;
    stepsFormData.values.picture = value;
    stepsFormData.handleChange(value);
    setPicture(value);
  };

  const handleChangeTeam = (event: RadioChangeEvent) => {
    const { value } = event.target;
    stepsFormData.values.team = value;
    stepsFormData.handleChange(value);
    setTeam(value);
    setCanJumpNextStep(true);
  };
  const handleChangeUserName = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUserName(value);
    if (value.length >= 3 && value.length <= 15) {
      stepsFormData.values.userName = value;
      stepsFormData.handleChange(value);
    } else {
      stepsFormData.values.userName = '';
      stepsFormData.handleChange('');
    }
  };

  const handleChangeAgree = () => {
    setAgree(!isAgree);
  };

  const handleApproveNikName = () => {
    // TODO add approve contract method
    setNikNameApprove(true);
  };

  const handleApprovePicture = () => {
    // TODO add approve contract method
    setPictureApprove(true);
    setCanJumpNextStep(true);
  };

  const handleConfirmNikName = () => {
    // TODO add confirm contract method
    setCanJumpNextStep(true);
  };

  const handleApproveUserName = () => {
    // TODO add confirm contract method
    setCanComplite(true);
  };

  return (
    <div className="stepsForm box-f-fd-c">
      <StepsLine activeStep={activeStep} />
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
                      <>
                        <StepCardRadio
                          items={firstStepItems}
                          name={nikName}
                          formDataValue={stepsFormData.values.nikName}
                          onCnange={handleChangeNikName}
                        />
                        <div className="stepsForm__steps__one box-f-c">
                          <Button
                            colorScheme="purple"
                            className="stepsForm__steps__one-btn"
                            disabled={!stepsFormData.values.nikName || isNikNameApprove}
                            onClick={handleApproveNikName}
                          >
                            Enable
                          </Button>
                          <img src={BlueArrow} alt="arrow" />
                          <Button
                            colorScheme="purple"
                            className="stepsForm__steps__one-btn"
                            disabled={!isNikNameApprove || canJumpNextStep}
                            onClick={handleConfirmNikName}
                          >
                            Confirm
                          </Button>
                        </div>
                      </>
                    )}
                    {step.id === 2 && (
                      <div className="stepsForm__steps__two">
                        <StepCardRadio
                          items={[nikName || 'collectible']}
                          name={stepsFormData.values.picture}
                          formDataValue={stepsFormData.values.picture}
                          onCnange={handleChangePicture}
                        />
                        <div className="stepsForm__steps__two-title">
                          Allow collectible to be locked
                        </div>
                        <span>
                          The collectible you’ve chosen will be locked in a smart contract while
                          it’s being used as your profile picture. Don’t worry - you’ll be able to
                          get it back at any time.
                        </span>
                        <Button
                          colorScheme="purple"
                          className="stepsForm__steps__two-btn"
                          disabled={!stepsFormData.values.picture || isPictureApprove}
                          onClick={handleApprovePicture}
                        >
                          Enable
                        </Button>
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
                        className="stepsForm__steps__three-radio"
                      />
                    )}
                    {step.id === 4 && (
                      <div className="stepsForm__steps__four">
                        <Input
                          value={userName}
                          onChange={handleChangeUserName}
                          className="stepsForm__steps__four-input"
                          prefix={
                            stepsFormData.values.userName ? (
                              <div className="stepsForm__steps__four-input-prefix">
                                <img src={CheckImg} alt="chekImg" />
                              </div>
                            ) : (
                              <div className="stepsForm__steps__four-input-prefix" />
                            )
                          }
                        />
                        <div className="stepsForm__steps__four-switch">
                          <Switch
                            checked={isAgree}
                            onChange={handleChangeAgree}
                            colorScheme="white"
                            switchSize="sm"
                          />
                          <span>
                            I understand that people can view my wallet if they know my username.
                          </span>
                        </div>
                        <Button
                          colorScheme="purple"
                          size="md"
                          disabled={!isAgree || !stepsFormData.values.userName || canComplite}
                          onClick={handleApproveUserName}
                        >
                          Confirm Profile
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
      <Button
        onClick={handleSetNextStep}
        className="stepsForm__btn"
        disabled={!canJumpNextStep && !canComplite}
      >
        {canComplite ? 'Complete profile' : 'Next Step'}
        <ArrowRight className="stepsForm__btn-arrow" />
      </Button>
    </div>
  );
};

export default StepsForm;
