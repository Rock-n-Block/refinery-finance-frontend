/* eslint-disable react/react-in-jsx-scope */
import { VFC } from 'react';
import { observer } from 'mobx-react-lite';
import { Upload } from 'antd';

import Avatar from '@/assets/img/sections/profile/avatar.svg';
import ChangeImg from '@/assets/img/icons/change_img.svg';
import { useMst } from '@/store';

import './Preview.scss';

const Preview: VFC = observer(() => {
  const { user } = useMst();
  return (
    <div className="profile-preview box-purple-l">
      <div className="profile-preview__back">
        <div className="profile-preview__content-params">
          <div className="text-ssm text-purple text-500">RF Balance</div>
          <div className="text-lg">0.0</div>
          <div className="text-ssmd text-gray">0.0 USD</div>
        </div>
      </div>
      <div className="profile-preview__content">
        <Upload>
          <div className="profile-preview__content-img">
            <img src={Avatar} alt="avatar" className="" />
            <div className="profile-preview__content-img-hover">
              <img src={ChangeImg} alt="" />
            </div>
          </div>
        </Upload>
        <div className="profile-preview__content-address">
          <span>
            {user.address &&
              `${user.address.substr(0, 6)}...${user.address.substr(user.address.length - 3, 3)}`}
          </span>
        </div>
      </div>
    </div>
  );
});

export default Preview;
