/* eslint-disable consistent-return */
import axios from 'axios';

import Avatar from '@/assets/img/sections/profile/avatar.svg';

const baseUrl = 'https://refinery.rocknblock.io/api/v1/image';

export const fetchAvatar = async (
  fetchMetod: 'get' | 'post',
  userAddress: string,
  image?: string,
): Promise<any> => {
  try {
    const response = await axios[fetchMetod](
      `${baseUrl}/${userAddress}/`,
      fetchMetod === 'post' && { image },
    );
    if (fetchMetod === 'get') {
      return response.data.image;
    }
    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    if (fetchMetod === 'get') {
      return Avatar;
    }
  }
};
