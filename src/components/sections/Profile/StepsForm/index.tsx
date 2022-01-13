/* eslint-disable react/react-in-jsx-scope */
import { FC, Fragment, useState } from 'react';
import { RadioChangeEvent } from 'antd';
import { useFormik } from 'formik';

import { ReactComponent as ArrowRight } from '@/assets/img/sections/profile/arrow-right.svg';
import BlueArrow from '@/assets/img/sections/profile/blue-arrow.svg';
import CheckImg from '@/assets/img/sections/profile/checkImg.svg';
import TeamImg from '@/assets/img/sections/profile/teamImg.svg';
import { Button, Input, Switch } from '@/components/atoms';
import { IFormProps } from '@/types';

import StepsLine from '../StepsLine';

import StepCardRadio from './StepCard/StepCardRadio/index';
import { firstStepItems, stepsDataConfig, thirdStepItems, validationSchema } from './helpers';
import StepCard from './StepCard';

import './StepsForm.scss';

const StepsForm: FC = () => {
  const stepsFormData = useFormik({
    initialValues: {
      activeStep: 1,
      nikName: '',
      picture: '',
      team: '',
      userName: '',
      isAgree: false,
      isBtnDisabled: true,
    } as IFormProps,
    validateOnChange: true,
    validationSchema,
    onSubmit: (values: any) => {
      // eslint-disable-next-line no-console
      console.log(values);
    },
  });

  const [isNikNameApprove, setNikNameApprove] = useState(false);
  const [isPictureApprove, setPictureApprove] = useState(false);

  const handleSetFormValue = (keyName: string, value: string | number | boolean) => {
    stepsFormData.setFieldValue(keyName, value);
  };

  const handleSetNextStep = () => {
    if (stepsFormData.values.activeStep !== 4) {
      handleSetFormValue('activeStep', stepsFormData.values.activeStep + 1);
      handleSetFormValue('isBtnDisabled', true);
    } else {
      stepsFormData.handleSubmit();
    }
  };

  const handleChangeTeam = (event: RadioChangeEvent) => {
    handleSetFormValue('isBtnDisabled', false);
    stepsFormData.handleChange(event);
  };

  const handleApprove = (type: 'nikName' | 'picture' | 'userName') => {
    switch (type) {
      case 'nikName':
        setNikNameApprove(true);
        break;
      case 'picture':
        setPictureApprove(true);
        handleSetFormValue('isBtnDisabled', false);
        break;
      case 'userName':
        handleSetFormValue('isBtnDisabled', false);
        break;

      default:
        handleSetFormValue('isBtnDisabled', true);
        // eslint-disable-next-line no-console
        console.log('reject approve');
    }
  };

  const handleConfirmNikName = () => {
    // TODO  confirm
    handleSetFormValue('isBtnDisabled', false);
  };

  return (
    <div className="stepsForm box-f-fd-c">
      <StepsLine activeStep={stepsFormData.values.activeStep} />
      <div className="stepsForm__steps">
        {stepsDataConfig.map((step) => {
          return (
            <Fragment key={step.id}>
              {stepsFormData.values.activeStep === step.id && (
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
                          keyName="nikName"
                          formDataValue={stepsFormData.values.nikName}
                          onCnange={stepsFormData.handleChange}
                        />
                        <div className="stepsForm__steps__one box-f-c">
                          <Button
                            colorScheme="purple"
                            className="stepsForm__steps__one-btn"
                            disabled={!stepsFormData.values.nikName || isNikNameApprove}
                            onClick={() => handleApprove('nikName')}
                          >
                            Enable
                          </Button>
                          <img src={BlueArrow} alt="arrow" />
                          <Button
                            colorScheme="purple"
                            className="stepsForm__steps__one-btn"
                            disabled={!isNikNameApprove}
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
                          items={[stepsFormData.values.nikName || 'collectible']}
                          keyName="picture"
                          formDataValue={stepsFormData.values.picture}
                          onCnange={stepsFormData.handleChange}
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
                          onClick={() => handleApprove('picture')}
                        >
                          Enable
                        </Button>
                      </div>
                    )}
                    {step.id === 3 && (
                      <StepCardRadio
                        items={thirdStepItems}
                        keyName="team"
                        formDataValue={stepsFormData.values.team}
                        onCnange={handleChangeTeam}
                        postfixImg={TeamImg}
                        postfixValue={15305}
                        className="stepsForm__steps__three-radio"
                      />
                    )}
                    {step.id === 4 && (
                      <div className="stepsForm__steps__four">
                        <div className="stepsForm__error">{stepsFormData.errors.userName}</div>
                        <Input
                          name="userName"
                          value={stepsFormData.values.userName}
                          onChange={stepsFormData.handleChange}
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
                            checked={stepsFormData.values.isAgree}
                            onChange={(value) => {
                              handleSetFormValue('isAgree', value);
                            }}
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
                          disabled={!stepsFormData.values.isAgree || !stepsFormData.values.userName}
                          onClick={() => handleApprove('userName')}
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
        disabled={stepsFormData.values.isBtnDisabled}
      >
        {stepsFormData.values.activeStep === 4 ? (
          'Complete profile'
        ) : (
          <>
            Next Step <ArrowRight className="stepsForm__btn-arrow" />
          </>
        )}
      </Button>
    </div>
  );
};

export default StepsForm;
