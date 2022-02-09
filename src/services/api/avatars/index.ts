/* eslint-disable consistent-return */
import axios from 'axios';

import Avatar from '@/assets/img/sections/profile/avatar.svg';

const baseUrl = 'https://refinery.rocknblock.io/api/v1/image';

export const onGetAvatar = async (userAddress: string): Promise<any> => {
  try {
    const response = await axios.get(`${baseUrl}/${userAddress}/`);
    return response.data.image;
  } catch (error) {
    return Avatar;
  }
};

export const onSetAvatar = (userAddress: string, data: any): any => {
  const isPng = data.type.includes('png');
  const isJpeg = data.type.includes('jpeg');
  const maxSize = 5 * 1000 * 1000;

  if (isPng || isJpeg) {
    if (data.size < maxSize) {
      return `${baseUrl}/${userAddress}/`;
    }
  }
  return '';
};
