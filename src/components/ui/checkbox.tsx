import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, ...props }) => {
  return (
    <label style={{ display: 'flex', alignItems: 'center' }}>
      <input type="checkbox" {...props} />
      {label && <span style={{ marginLeft: '8px' }}>{label}</span>}
    </label>
  );
};

export default Checkbox;
