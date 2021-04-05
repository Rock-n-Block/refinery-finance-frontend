import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { mockActionRequest } from '@/actions/mockAction/mockAction';
import { SecondPage } from '@/components/SecondPage/SecondPage';
import { AppStateType } from '@/reducers/rootReducer';

export const SecondPageContainer: React.FC = () => {
  const dispatch = useDispatch();

  const getMockFromReducer = (state: AppStateType) => state.mockReducer.mock;
  const mockFromReducer: any = useSelector(getMockFromReducer);

  useEffect(() => {
    dispatch(mockActionRequest());
  }, [dispatch]);

  return <SecondPage mockData={mockFromReducer} />;
};
