import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { type FC, type PropsWithChildren, useEffect } from 'react';

import ModalOverlay from '@components/modal-overlay/modal-overlay.tsx';
import { Portal } from '@components/portal/portal.tsx';

import styles from './modal.module.css';

type ModalProps = PropsWithChildren<{
  onClose: () => void;
  title?: string;
}>;

export const Modal: FC<ModalProps> = ({ onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <Portal id="modal-root">
      <section className={styles.modal_container}>
        <ModalOverlay onClose={onClose} />
        <div className={`${styles.modal} p-10`} data-cy="modal">
          <div className={styles.close_icon} data-cy="modal-close-button">
            <CloseIcon type="primary" onClick={onClose} />
          </div>

          {title && (
            <h1 className={`${styles.modal_title} text text_type_main-large`}>
              {title}
            </h1>
          )}

          {children}
        </div>
      </section>
    </Portal>
  );
};
