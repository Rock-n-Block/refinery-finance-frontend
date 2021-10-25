import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Form as FormAntd, FormInstance } from 'antd';
import { observer } from 'mobx-react-lite';

import Button from '@/components/atoms/Button';
import { errorNotification, successNotification } from '@/components/atoms/Notification';
import ReactMarkdown from '@/components/molecules/ReactMarkdown';
import EasyMde from '@/components/organisms/EasyMde';
import { DaoSection, DaoWrapper } from '@/components/sections/Dao';
import { ActionsForm, ChoicesForm, TitleForm } from '@/components/sections/DaoProposal';
import { getMomentMergedDateTime } from '@/components/sections/DaoProposal/helpers';
import { SNAPSHOT_SPACE } from '@/config/constants/dao';
import { useGetCurrentBalance } from '@/services/api/refinery-finance-pairs';
import { useSnapshotService } from '@/services/api/snapshot.org';
import { ProposalVotingSystem } from '@/services/api/snapshot.org/types';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
// import { metamaskService } from '@/services/MetamaskConnect';
import { getBlockNumber } from '@/services/web3/helpers';
import { useMst } from '@/store';
import { clog, clogData, clogError } from '@/utils/logger';
import { throttle } from '@/utils/throttle';

import 'antd/lib/form/style/css';
import 'antd/lib/time-picker/style/css';
import 'antd/lib/date-picker/style/css';

import './DaoProposal.scss';

const extractDataForProposalFromForms = (forms: Array<any>) => {
  const [
    { title }, // has empty data, so skip it
    ,
    { choices },
    { actionsForm_start_date, actionsForm_start_time, actionsForm_end_date, actionsForm_end_time },
  ] = forms;

  const start = getMomentMergedDateTime(actionsForm_start_date, actionsForm_start_time).unix();
  const end = getMomentMergedDateTime(actionsForm_end_date, actionsForm_end_time).unix();

  return {
    name: title,
    choices,
    start,
    end,
  };
};

interface ICreateProposalResult {
  id: string;
  ipfsHash: string;
  relayer: {
    address: string;
    receipt: string;
  };
}

const DaoProposal: React.FC = observer(() => {
  const history = useHistory();
  const [titleForm] = FormAntd.useForm();
  const [contentForm] = FormAntd.useForm();
  const [choicesForm] = FormAntd.useForm();
  const [actionsForm] = FormAntd.useForm();
  const forms = [titleForm, contentForm, choicesForm, actionsForm];

  const { user } = useMst();
  const { connect } = useWalletConnectorContext();

  // const [isFormValidated] = useState(false);
  const [editorPlainText, setEditorPlainText] = useState('');

  const throttledEditorValidation = throttle(() => {
    contentForm.validateFields();
  }, 1500);

  const handleEasyMdeChange = (text: string) => {
    throttledEditorValidation();
    setEditorPlainText(text);
  };

  const { snapshotClient, provider } = useSnapshotService();

  const createProposal = async ({
    formsData,
    body,
  }: {
    formsData: Array<FormInstance>;
    body: string;
  }): Promise<ICreateProposalResult> => {
    const partialProposalData = extractDataForProposalFromForms(formsData);

    const blockNumber = await getBlockNumber();
    const proposalCreationResult = (await snapshotClient.proposal(
      provider,
      user.address,
      SNAPSHOT_SPACE,
      {
        ...partialProposalData,
        snapshot: blockNumber, // 10765072,
        body,
        // metadata: {
        //   plugins: {},
        //   network: metamaskService.usedChain,
        //   strategies: [strategies.erc20WithBalance],
        // },
        type: ProposalVotingSystem.singleChoice,
      },
    )) as ICreateProposalResult;

    return proposalCreationResult;
  };

  const [pendingTx, setPendingTx] = useState(false);

  const handleCreateProposal = async (result: any[]) => {
    setPendingTx(true);
    try {
      const { ipfsHash } = await createProposal({
        formsData: result,
        body: editorPlainText,
      });

      // Redirect user to newly created proposal page
      history.push(`/dao/${ipfsHash}`);

      successNotification('Success', 'Created a new proposal!');
    } catch (error: any) {
      clogError(error);
      errorNotification('Error', new Error(error).message);
    } finally {
      setPendingTx(false);
    }
  };

  const onSubmit = async () => {
    // if (!isFormValidated) return;
    const validatePromises = Object.values(forms).map((form) => form.validateFields());

    Promise.all(validatePromises)
      .then(async (result) => {
        clogData('RESULT', result);
        clog(result[2].choices[0]);

        handleCreateProposal(result);
      })
      .catch((err) => {
        clogError('ERROR', err);
      });
  };

  // const validateForms = () => {

  // };

  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log(titleForm.isFieldsTouched());
  //     titleForm.validateFields();
  //     // короче, механизм такой:
  //     // есть Farms, вкладываем в каждую форму readonly метод validateForms(), который каждая форма дергает сама собой на каждое изменение в форме
  //     // TODO: добавить провайдер контекста или убрать в MobX (wut?)
  //   }, 2000);
  // }, [titleForm]);

  const {
    getCurrentBalance,
    options: [, { error: currentBalanceError, data: currentBalance }],
  } = useGetCurrentBalance();

  clog(currentBalance, currentBalanceError);

  useEffect(() => {
    if (user.address) {
      getCurrentBalance(user.address);
    }
  }, [getCurrentBalance, user.address]);

  const isAbleToPublish = !pendingTx;

  return (
    <DaoWrapper>
      <div className="dao-proposal__wrapper">
        <div className="dao-proposal__column">
          <DaoSection
            className="dao-proposal__section title-section"
            title="Title"
            customClasses={{ body: 'dao-proposal__section-body' }}
          >
            <TitleForm
              form={titleForm}
              fieldClassName="title-section__field"
              inputClassName="title-section__input"
              // onChange={validate}
            />
          </DaoSection>

          <DaoSection
            className="dao-proposal__section"
            title={
              <>
                <div>Content</div>
                <span className="dao-proposal__section-header-tip text-norm text-smd">
                  Tip: write in Markdown!
                </span>
              </>
            }
            customClasses={{ body: 'dao-proposal__section-body' }}
          >
            <FormAntd name="contentForm" form={contentForm} layout="vertical">
              <FormAntd.Item
                className="content-section__field"
                name="content"
                rules={[
                  {
                    validator: () => {
                      if (editorPlainText.trim().length) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Content must not be empty'));
                    },
                  },
                ]}
              >
                <EasyMde
                  id="body"
                  name="body"
                  onTextChange={handleEasyMdeChange}
                  value={editorPlainText}
                />
              </FormAntd.Item>
            </FormAntd>
          </DaoSection>

          {editorPlainText && (
            <DaoSection
              className="dao-proposal__section"
              title="Preview"
              customClasses={{ body: 'dao-proposal__section-body' }}
            >
              <ReactMarkdown className="text-purple">{editorPlainText}</ReactMarkdown>
            </DaoSection>
          )}

          <DaoSection
            className="dao-proposal__section"
            title="Choices"
            customClasses={{ body: 'dao-proposal__section-body' }}
          >
            <ChoicesForm
              form={choicesForm}
              // validateForms={}
              inputClassName="choices-section__input"
              inputPostfixClassName="choices-section__input-postfix"
              formErrorsClassName="choices-section__form-errors"
              buttonClassName="choices-section__button"
            />
          </DaoSection>
        </div>

        <div className="dao-proposal__column">
          <DaoSection className="dao-proposal__section" title="Actions">
            <ActionsForm
              form={actionsForm}
              snapshotClassName="actions-section__snapshot"
              snapshotTitleClassName="actions-section__snapshot-title"
            />
            {!user.address ? (
              <Button className="actions-section__submit" onClick={connect}>
                <span className="text-white text-smd text-bold">Connect Wallet</span>
              </Button>
            ) : (
              <Button
                className="actions-section__submit"
                // disabled={!isFormValidated}
                loading={pendingTx}
                disabled={!isAbleToPublish}
                onClick={isAbleToPublish ? onSubmit : undefined}
              >
                <span className="text-white text-smd text-bold">Publish</span>
              </Button>
            )}
          </DaoSection>
        </div>
      </div>
    </DaoWrapper>
  );
});

export default DaoProposal;
