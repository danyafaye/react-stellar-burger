import type { FC } from 'react';

import styles from './modal-overlay.module.css';

type ModalOverlayProps = {
  onClose: () => void;
};

const ModalOverlay: FC<ModalOverlayProps> = ({ onClose }) => {
  return <div className={styles.modal_overlay} onClick={onClose} />;
};

export default ModalOverlay;
