import React from 'react';

interface SecondPageProps {
  mockData: Record<string, unknown>;
}
export const SecondPage: React.FC<SecondPageProps> = ({ mockData }) => {
  console.log(mockData);
  return <div>Second page works</div>;
};
