import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

const Popup = ({ title, show, onConfirm, onCancel, confirmLabel, cancelLabel, confirmColor, cancelColor, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex bg-gray-600/25 items-center justify-center backdrop-blur-xs">
      <div className="bg-[#FFD600] p-6 rounded-lg text-center border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
        <p className="mb-4 text-lg font-semibold">{title}</p>
        {children}
        <div className="flex justify-center gap-4">
          <Button
            onClick={onConfirm}
            label={confirmLabel}
            color={confirmColor}
          />
          {onCancel && (
            <Button
              onClick={onCancel}
              label={cancelLabel}
              color={cancelColor}
            />
          )}
        </div>
      </div>
    </div>
  );
};

Popup.propTypes = {
  title: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  confirmColor: PropTypes.oneOf(['gray', 'blue', 'red', 'green', 'yellow', 'pink']),
  cancelColor: PropTypes.oneOf(['gray', 'blue', 'red', 'green', 'yellow', 'pink']),
  children: PropTypes.node,
};

Popup.defaultProps = {
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  confirmColor: 'green',
  cancelColor: 'pink',
};

export default Popup;