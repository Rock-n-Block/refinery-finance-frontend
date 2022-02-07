/* eslint-disable react/react-in-jsx-scope */
import { useCallback, useEffect, useState, VFC } from 'react';
import { Upload } from 'antd';
import { observer } from 'mobx-react-lite';

import ChangeImg from '@/assets/img/icons/change_img.svg';
import Avatar from '@/assets/img/sections/profile/avatar.svg';
import { fetchAvatar } from '@/services/api/avatars';
import { useMst } from '@/store';

import './Preview.scss';

const Preview: VFC = observer(() => {
  const { user } = useMst();
  const [avatar, setAvatar] = useState(Avatar);

  const handleGetAvatar = useCallback(async () => {
    if (user.address.length) {
      const link = await fetchAvatar('get', user.address);
      setAvatar(link);
    }
  }, [user.address]);

  const handleUploadAvatar = (data: any) => {
    if (data.type.includes('png') || data.type.includes('jpeg')) {
      if (data.size < 5 * 1000 * 1000) {
        return `https://refinery.rocknblock.io/api/v1/image/${user.address}/`;
      }
    }
    return '';
  };

  useEffect(() => {
    handleGetAvatar();
  }, [handleGetAvatar]);

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
        {user.address && (
          <Upload
            name="avatar"
            listType="picture-card"
            showUploadList={false}
            action={handleUploadAvatar}
            onChange={handleGetAvatar}
          >
            <div className="profile-preview__content-img">
              <img src={avatar} alt="avatar" className="profile-preview__content-img-avatar" />
              <div className="profile-preview__content-img-hover">
                <img src={ChangeImg} alt="" />
              </div>
            </div>
          </Upload>
        )}

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
