import React from 'react';

import './Preview.scss';

import { ReactComponent as OpenLinkImg } from '../../../../assets/img/icons/open-link.svg';

const Preview: React.FC = () => {
  return (
    <div className="lottery-preview">
      <div className="row">
        <div className="lottery-preview__content">
          <h1 className="lottery-preview__title h1 text-bold text-white">
            The Lottery Is Changing!
          </h1>
          <div className="box-f-ai-c">
            <h2 className="h2 text-orange">Come back soon!</h2>
            <a href="/" target="_blank" className="lottery-preview__link box-f-ai-c">
              <div className="text-green">Learn more</div>
              <OpenLinkImg />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
