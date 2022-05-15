import React, { MouseEventHandler } from 'react';
import styles from './StyledExternalLink.module.css';

type StyledExternalLinkProps =
  | {
      href: string;
      openIn?: 'current-tab' | 'new-tab';
    }
  | {
      href: string;
      openIn: 'popup';
      popupSize?: {
        width?: number;
        height?: number;
      };
    };

const StyledExternalLink: React.FC<StyledExternalLinkProps> = (props) => {
  const { children, href, openIn } = props;
  if (openIn === 'popup') {
    const onClick: MouseEventHandler = (ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      const width = props.popupSize?.width ?? 500;
      const height = props.popupSize?.height ?? 600;
      const top = Math.floor((window.screen.availHeight - height) / 2);
      const left = Math.floor((window.screen.availWidth - width) / 2);
      const params = `popup=yes,width=${width},height=${height},left=${left},top=${top}`;
      window.open(href, href, params);
      return false;
    };
    return (
      <a href={href} className={styles.link} onClick={onClick}>
        {children}
      </a>
    );
  }

  if (openIn === 'new-tab') {
    return (
      <a href={href} className={styles.link} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <a href={href} className={styles.link}>
      {children}
    </a>
  );
};

export default StyledExternalLink;
