/* eslint-disable react/react-in-jsx-scope */
import { useCallback, useEffect, useState, VFC } from 'react';
import { Upload } from 'antd';
import { observer } from 'mobx-react-lite';

import ChangeImg from '@/assets/img/icons/change_img.svg';
import Avatar from '@/assets/img/sections/profile/avatar.svg';
import { contracts, IS_PRODUCTION } from '@/config';
import { onGetAvatar, onSetAvatar } from '@/services/api/avatars';
import { useWalletConnectorContext } from '@/services/MetamaskConnect';
import MetamaskService from '@/services/web3';
import { useMst } from '@/store';

import './Preview.scss';

const Preview: VFC = observer(() => {
  const { user } = useMst();
  const { metamaskService } = useWalletConnectorContext();
  const [avatar, setAvatar] = useState(Avatar);
  const [tokenBalance, setTokenBalance] = useState(0);

  const handleGetAvatar = useCallback(async () => {
    const link = await onGetAvatar(user.address);
    setAvatar(link);
  }, [user.address]);

  const handleUploadAvatar = (data: any) => {
    return onSetAvatar(user.address, data);
  };

  const handleGetTokenBalance = useCallback(async () => {
    const balance = await metamaskService.callContractMethodFromNewContract(
      IS_PRODUCTION
        ? '0x46D47456454dA7f5F2f3a831D0fdF264D940AaB3'
        : '0x46D47456454dA7f5F2f3a831D0fdF264D940AaB3', // TODO change for current mainnet address
      contracts.ERC20.ABI,
      'balanceOf',
      [user.address],
    );

    setTokenBalance(+MetamaskService.amountFromGwei(balance, 18));
  }, [metamaskService, user.address]);

  useEffect(() => {
    if (user.address.length) {
      handleGetAvatar();
      handleGetTokenBalance();
    }
  }, [handleGetAvatar, handleGetTokenBalance, user.address.length]);

  return (
    <div className="profile-preview box-purple-l">
      <div className="profile-preview__back">
        <div className="profile-preview__back-params">
          <div className="text-ssm text-purple text-500">RF Balance</div>
          <div className="profile-preview__back-params-balance text-lg">
            <span>{tokenBalance}</span>RF
          </div>
          {/* <div className="text-ssmd text-gray">0.0 USD</div> */}
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
