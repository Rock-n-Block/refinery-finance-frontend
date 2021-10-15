import React, { useState } from 'react';
import { Form as FormAntd } from 'antd';

import Button from '@/components/atoms/Button';
import ReactMarkdown from '@/components/molecules/ReactMarkdown';
import EasyMde from '@/components/organisms/EasyMde';
import { DaoSection, DaoWrapper } from '@/components/sections/Dao';
import { ActionsForm, ChoicesForm, TitleForm } from '@/components/sections/DaoProposal';
import { clog, clogData, clogError } from '@/utils/logger';
import { throttle } from '@/utils/throttle';

import 'antd/lib/form/style/css';
import 'antd/lib/time-picker/style/css';
import 'antd/lib/date-picker/style/css';

import './DaoProposal.scss';

const DaoProposal: React.FC = () => {
  const [titleForm] = FormAntd.useForm();
  const [contentForm] = FormAntd.useForm();
  const [choicesForm] = FormAntd.useForm();
  const [actionsForm] = FormAntd.useForm();
  const forms = [titleForm, contentForm, choicesForm, actionsForm];

  const [editorPlainText, setEditorPlainText] = useState('');

  const throttledEditorValidation = throttle(() => {
    contentForm.validateFields();
  }, 1500);

  const handleEasyMdeChange = (text: string) => {
    throttledEditorValidation();
    setEditorPlainText(text);
  };

  const onSubmit = () => {
    const validatePromises = Object.values(forms).map((form) => form.validateFields());
    Promise.all(validatePromises)
      .then((result) => {
        clogData('RESULT', result);
        clog(result[2].choices[0]);
      })
      .catch((err) => {
        clogError('ERROR', err);
      });
  };

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
            <Button className="actions-section__submit" onClick={onSubmit}>
              <span className="text-white text-smd text-bold">Publish</span>
            </Button>
          </DaoSection>
        </div>
      </div>
    </DaoWrapper>
  );
};

export default DaoProposal;
