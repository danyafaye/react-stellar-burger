import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { type FC, type ImgHTMLAttributes, useState } from 'react';

type ImageProps = ImgHTMLAttributes<HTMLImageElement>;

import styles from './image.module.css';

export const Image: FC<ImageProps> = ({
  src,
  srcSet,
  alt,
  width,
  height,
  className,
  ...restProps
}) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className={`${styles.image_wrapper} ${className}`} style={{ width, height }}>
      {loading && <Preloader />}
      <img
        {...restProps}
        src={src}
        srcSet={srcSet}
        alt={alt}
        width="100%"
        loading="lazy"
        height="100%"
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
        }}
        style={{ width: loading ? '0' : '100%', height: loading ? '0' : '100%' }}
      />
    </div>
  );
};
