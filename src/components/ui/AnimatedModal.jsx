import React from 'react';
import ReactModal from 'react-modal';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/modals.css'; 

ReactModal.setAppElement('#root');

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

// CORRIGIDO: Agora aceita e utiliza a prop 'className'
function AnimatedModal({ isOpen, onRequestClose, children, style, className }) {
  // Combina a classe padrão 'modal-overlay' com a classe customizada passada
  const overlayClasses = `modal-overlay ${className || ''}`.trim();

  return (
    <AnimatePresence>
      {isOpen && (
        <ReactModal
          isOpen={isOpen}
          onRequestClose={onRequestClose}
          className="modal-content-placeholder" 
          overlayClassName={overlayClasses} // Utiliza as classes combinadas
          closeTimeoutMS={300}
          style={style}
        >
          <motion.div
            className="modal-content"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <button className="modal-close-button" onClick={onRequestClose}>
              <span className="material-icons">close</span>
            </button>
            {children}
          </motion.div>
        </ReactModal>
      )}
    </AnimatePresence>
  );
}

export default AnimatedModal;