import decorateComponentWithProps from 'decorate-component-with-props';

import defaultSaveComponent from './SavingComponent';
import saveStyles from './SavingComponent/styles.css';

export const defaultTheme = {
   // Inline style object for saving component container
  container: saveStyles.container,
  containerSaving: saveStyles.containerSaving,
  // Inline style object for saving icon, base and saving
  saved: saveStyles.saved,
  saving: saveStyles.saving,
};

export default (config = {}) => {
  let _editorState;
  let _debounce;
  let _clean = true;

  const _getIsClean = () => _clean;

  const _save = (editorState) => {
    _clean = true;
    _editorState = editorState;
    config.saveFunction(editorState);
  };

  const onChange = (editorState) => {
    if (!editorState) return editorState;
    // Avoid setting unclean state on initial render
    if (!_editorState) {
      _editorState = editorState;
    }
    // if content has changed or save wanted on all changes
    if (config.saveAlways || editorState.getCurrentContent() !== _editorState.getCurrentContent()) {
      _clean = false;
      if (_debounce) {
        clearTimeout(_debounce);
      }
      _debounce = setTimeout(_save, config.debounceTime || 2000, editorState);
    }
    return editorState;
  };

  // Styles are overwritten instead of merged as merging causes a lot of confusion.
  //
  // Why? Because when merging a developer needs to know all of the underlying
  // styles which needs a deep dive into the code. Merging also makes it prone to
  // errors when upgrading as basically every styling change would become a major
  // breaking change. 1px of an increased padding can break a whole layout.
  const {
    theme = defaultTheme,
    savingComponent = defaultSaveComponent,
  } = config;
  return {
    SavingComponent: decorateComponentWithProps(savingComponent, { theme, getIsClean: _getIsClean }),
    onChange,
  };
};
