/* eslint-disable react/react-in-jsx-scope */
import { FC, Fragment, useState } from 'react';
import { RadioChangeEvent } from 'antd';
import { useFormik } from 'formik';

import { ReactComponent as ArrowRight } from '@/assets/img/sections/createProfile/arrow-right.svg';
import BlueArrow from '@/assets/img/sections/createProfile/blue-arrow.svg';
import CheckImg from '@/assets/img/sections/createProfile/checkImg.svg';
import OneImg from '@/assets/img/sections/createProfile/one-img.svg';
import TeamImg from '@/assets/img/sections/createProfile/teamImg.svg';
import TwoImg from '@/assets/img/sections/createProfile/two-img.svg';
import { Button, Input, Switch } from '@/components/atoms';
import { CompliteProfileModal } from '@/components/organisms';
import { IFormProps } from '@/types';

import StepsLine from '../StepsLine';

import StepCardRadio from './StepCard/StepCardRadio/index';
import { firstStepItems, stepsDataConfig, thirdStepItems, validationSchema } from './helpers';
import StepCard from './StepCard';

import './StepsForm.scss';

const StepsForm: FC = () => {
  const stepsFormData = useFormik({
    initialValues: {
      nikName: '',
      picture: '',
      team: '',
      userName: '',
      isAgree: false,
    } as IFormProps,
    validateOnChange: true,
    validationSchema,
    onSubmit: (values: any) => {
      setCompliteModalVisible(true);
      // eslint-disable-next-line no-console
      console.log(values);
    },
  });

  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitDisabled, setSubmitDisabled] = useState(true);

  const [isNikNameApprove, setNikNameApprove] = useState(false);
  const [isConfirmNikName, setConfirmNikName] = useState(false);
  const [isPictureApprove, setPictureApprove] = useState(false);
  const [isConfirmUserName, setConfirmUserName] = useState(false);

  const [isCompliteModalVisible, setCompliteModalVisible] = useState(false);
  const [isCompliteApprove, setCompliteApprove] = useState(false);

  const handleSetFormValue = (keyName: string, value: string | number | boolean) => {
    stepsFormData.setFieldValue(keyName, value);
  };

  const handleSetNextStep = () => {
    if (activeStep !== 4) {
      setActiveStep(activeStep + 1);
      setSubmitDisabled(true);
    } else {
      stepsFormData.handleSubmit();
    }
  };

  const handleChangeTeam = (event: RadioChangeEvent) => {
    setSubmitDisabled(false);
    stepsFormData.handleChange(event);
  };

  const handleApprove = (type: 'nikName' | 'picture' | 'userName') => {
    switch (type) {
      case 'nikName':
        setNikNameApprove(true);
        break;
      case 'picture':
        setPictureApprove(true);
        setSubmitDisabled(false);
        break;
      case 'userName':
        setSubmitDisabled(false);
        break;

      default:
        setSubmitDisabled(false);
        // eslint-disable-next-line no-console
        console.log('reject approve');
    }
  };

  const handleConfirmNikName = () => {
    // TODO  confirm
    setConfirmNikName(true);
    setSubmitDisabled(false);
  };

  const handleConfirmUserName = () => {
    handleApprove('userName');
    setConfirmUserName(true);
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
                          keyName="nikName"
                          formDataValue={stepsFormData.values.nikName}
                          onCnange={stepsFormData.handleChange}
                          disabled={isConfirmNikName}
                        />
                        <div className="stepsForm__steps__one box-f-c">
                          <Button
                            colorScheme="purple"
                            className="stepsForm__steps__one-btn"
                            icon={OneImg}
                            disabled={!stepsFormData.values.nikName || isNikNameApprove}
                            onClick={() => handleApprove('nikName')}
                          >
                            Enable
                          </Button>
                          <img src={BlueArrow} alt="arrow" />
                          <Button
                            colorScheme="purple"
                            className="stepsForm__steps__one-btn"
                            icon={TwoImg}
                            disabled={!isNikNameApprove || isConfirmNikName}
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
                          disabled={isPictureApprove}
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
                          disabled={isConfirmUserName}
                          prefix={
                            !stepsFormData.errors.userName ? (
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
                            disabled={isConfirmUserName}
                          />
                          <span>
                            I understand that people can view my wallet if they know my username.
                          </span>
                        </div>
                        <Button
                          colorScheme="purple"
                          size="md"
                          className="stepsForm__steps__four-btn"
                          disabled={
                            !stepsFormData.values.isAgree ||
                            !stepsFormData.values.userName ||
                            isConfirmUserName
                          }
                          onClick={handleConfirmUserName}
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
      <Button onClick={handleSetNextStep} className="stepsForm__btn" disabled={isSubmitDisabled}>
        {activeStep === 4 ? (
          'Complete profile'
        ) : (
          <>
            Next Step <ArrowRight className="stepsForm__btn-arrow" />
          </>
        )}
      </Button>
      {isCompliteModalVisible && (
        <CompliteProfileModal
          isVisible={isCompliteModalVisible}
          isCompliteApprove={isCompliteApprove}
          handleClose={() => setCompliteModalVisible(false)}
          handleChangeApprove={() => setCompliteApprove(!isCompliteApprove)}
        />
      )}
    </div>
  );
};

export default StepsForm;
