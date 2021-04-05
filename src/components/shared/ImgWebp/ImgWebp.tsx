import React, { useEffect, useState } from 'react';

export interface ImgWebpProps {
  loading: 'eager' | 'lazy' | undefined;
  src: string;
  alt: string;
  className?: string;
}
/**
 * This function creates webp picture component
 *
 * @param src-src to jpg/png etc img,  srcWebp-src to webp img
 * @returns Component
 * @expample
            import picture from 'src/assets/img/space.jpg';
            <ImgWebp loading="lazy" src={picture} alt="Space" />
 */

export const ImgWebp: React.FC<ImgWebpProps> = ({ loading, src, alt, className }) => {
  const [path, setPath] = useState<string>(src);
  const concatedResolution = (imgSrc: string) => {
    return imgSrc.slice(0, imgSrc.lastIndexOf('.'));
  };
  useEffect(() => {
    setPath(concatedResolution(path));
  }, []);
  return (
    <>
      <picture className={className}>
        <source type="image/webp" srcSet={`${path}.webp`} />
        <img loading={loading} src={`${src}`} alt={alt} />
      </picture>
    </>
  );
};
