import React, { useEffect, useState } from 'react';

import { Skeleton } from '@/components/atoms';
import { DaoPreview, DaoWrapper } from '@/components/sections/Dao';
import { DaoListItemsList } from '@/components/sections/DaoList';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import {
  IGetProposalsPreviewkResponse,
  IProposalsPreview,
  transformGetProposalsPreview,
  useGetProposalsPreview,
} from '@/services/api/snapshot.org/hooks';
import { ISnapshotSpace } from '@/services/api/snapshot.org/spaces';

import './DaoList.scss';

const ITEMS_PER_PAGE = 20;

const LoaderSkeleton = new Array(3).fill('').map((_, index) => {
  return (
    <Skeleton.Input
      key={String(index)}
      className="dao-list__list-skeleton-loader"
      style={{ height: 60 }}
      active
      size="large"
    />
  );
});

const DaoList: React.FC = () => {
  const [loadData, setLoadData] = useState(false);
  const {
    getProposalsPreview,
    options: [, { loading, data }],
  } = useGetProposalsPreview({
    fetchPolicy: 'network-only',
  });
  const { observerRef, isIntersecting } = useIntersectionObserver<HTMLDivElement>();
  const [result, setResult] = useState<IProposalsPreview>([]);

  useEffect(() => {
    if (isIntersecting) {
      setLoadData(true);
    }
  }, [isIntersecting]);

  useEffect(() => {
    if (loadData) {
      getProposalsPreview(
        ITEMS_PER_PAGE + result.length,
        result.length,
        ISnapshotSpace.CAKE_ETH_SPACE,
      );
      setLoadData(false);
    }
  }, [loadData, result.length, getProposalsPreview]);

  useEffect(() => {
    if (data) {
      setResult((prevState) => {
        return [
          ...prevState,
          ...transformGetProposalsPreview(data as IGetProposalsPreviewkResponse),
        ];
      });
    }
  }, [data]);

  const isFirstLoading = result.length === 0;
  const Loader = isFirstLoading ? (
    LoaderSkeleton
  ) : (
    <div style={{ marginTop: 12 }}>{LoaderSkeleton}</div>
  );

  return (
    <DaoWrapper>
      <DaoPreview />
      <div className="dao-list__list-wrapper">
        <DaoListItemsList items={result} />
        <div ref={observerRef} />
        {loading && Loader}
      </div>
    </DaoWrapper>
  );
};
export default DaoList;
