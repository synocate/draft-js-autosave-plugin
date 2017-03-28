import React, { PropTypes } from 'react';

const SavingComponent = ({ saving, getIsClean, theme }) => {
  const saved = getIsClean() && !saving;
  return (
    <div className={saved ? theme.container : `${theme.container} ${theme.containerSaving}`}>
      <span
        className={saved ? theme.textSaved : theme.textSaving}
      >
        {!saved && 'Saving...'}
        {saved && 'All Changes Saved.'}
      </span>
      <span style={{ marginLeft: '0.2em' }}>{'🖫'}</span>
    </div>
  );
};

SavingComponent.propTypes = {
  getIsClean: PropTypes.func.isRequired,
  saving: PropTypes.bool,
  theme: PropTypes.object.isRequired,
};

export default SavingComponent;
