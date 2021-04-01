import React from 'react';

export interface ImgWebpProps {
  loading: 'eager' | 'lazy' | undefined;
  src: string;
  srcWebp: string;
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
            import pictureWebp from 'src/assets/img/space.webp';
            <ImgWebp loading="lazy" src={picture} srcWebp={pictureWebp} alt="Space" />
 */

export const ImgWebp: React.FC<ImgWebpProps> = ({ loading, src, srcWebp, alt, className }) => {
  return (
    <>
      <picture className={className}>
        <source type="image/webp" srcSet={`${srcWebp}`} />
        <img loading={loading} src={`${src}`} alt={alt} />
      </picture>
    </>
  );
};
