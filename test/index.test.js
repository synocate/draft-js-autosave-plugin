import React from 'react';
import { mount } from 'enzyme';
import test from 'ava';
import {
  convertFromRaw,
  Modifier,
  EditorState,
} from 'draft-js';
import { stub, useFakeTimers } from 'sinon';

import createAutosavePlugin from '../src';
import content from './fixtures/content';

let editorState;
let saveStub;
let defaultConfig;
const now = new Date();
let clock;

test.beforeEach(() => {
  clock = useFakeTimers(now);
  saveStub = stub();
  defaultConfig = { saveFunction: saveStub };
  const contentState = convertFromRaw(content);
  editorState = EditorState.createWithContent(contentState);
});

test.afterEach.always(() => {
  clock.restore();
  saveStub.reset();
});

test('it should create a draft-js plugin with the right exports', (t) => {
  const autosavePlugin = createAutosavePlugin(defaultConfig);
  t.truthy(autosavePlugin);
  t.truthy(autosavePlugin.SavingComponent);
  t.true(autosavePlugin._getIsClean());
});

test('it replaces SavingComponent with custom component if provided in config', (t) => {
  const SavingComponent = () => <div>test</div>;
  const autosavePlugin = createAutosavePlugin({ ...defaultConfig, savingComponent: SavingComponent });
  const Decorated = autosavePlugin.SavingComponent;
  const component = mount(<Decorated />);
  t.is(component.text(), 'test');
});

test('it replaces SavingComponent theme with custom theme if provided in config', (t) => {
  const theme = { container: 'test' };
  const autosavePlugin = createAutosavePlugin({ ...defaultConfig, theme });
  const Decorated = autosavePlugin.SavingComponent;
  const component = mount(<Decorated />);
  t.is(component.find('div').prop('className'), theme.container);
});

test('onChange does nothing if no editorState supplied', (t) => {
  const autosavePlugin = createAutosavePlugin(defaultConfig);
  t.true(autosavePlugin._getIsClean());
  autosavePlugin.onChange();
  t.true(autosavePlugin._getIsClean());
});

test('onChange doesn`t do anything on first onChange (initial render)', (t) => {
  const autosavePlugin = createAutosavePlugin(defaultConfig);
  autosavePlugin.onChange(editorState);
  t.true(autosavePlugin._getIsClean());
});

test.serial('onChange doesn`t do anything on editorState selection changes by default', (t) => {
  const autosavePlugin = createAutosavePlugin(defaultConfig);
  // sim initial render
  autosavePlugin.onChange(editorState);
  const updated = EditorState.moveFocusToEnd(editorState);
  autosavePlugin.onChange(updated);
  t.true(autosavePlugin._getIsClean());
  clock.tick(2000);
  t.is(saveStub.callCount, 0);
});

test.serial('onChange sets clean to false and calls save function when selection changes and saveAlways set', (t) => {
  const autosavePlugin = createAutosavePlugin({ ...defaultConfig, saveAlways: true });
  // sim initial render
  autosavePlugin.onChange(editorState);
  const updated = EditorState.moveFocusToEnd(editorState);
  autosavePlugin.onChange(updated);
  t.false(autosavePlugin._getIsClean());
  clock.tick(2000);
  t.is(saveStub.callCount, 1);
  t.true(autosavePlugin._getIsClean());
});

test.serial('onChange sets clean to false and calls save function when content has changed', (t) => {
  const autosavePlugin = createAutosavePlugin(defaultConfig);
  // sim initial render
  autosavePlugin.onChange(editorState);
  const newContent = Modifier.insertText(
    editorState.getCurrentContent(), editorState.getSelection(), 'new text',
  );
  const updated = EditorState.push(editorState, newContent, 'insert-characters');
  autosavePlugin.onChange(updated);
  t.false(autosavePlugin._getIsClean());
  clock.tick(2000);
  t.is(saveStub.callCount, 1);
  t.true(autosavePlugin._getIsClean());
});

test.serial('onChange uses custom debounceTime after save events if provided in config', (t) => {
  const debounceTime = 5000;
  const autosavePlugin = createAutosavePlugin({ ...defaultConfig, debounceTime });
  // sim initial render
  autosavePlugin.onChange(editorState);
  const newContent = Modifier.insertText(
    editorState.getCurrentContent(), editorState.getSelection(), 'new text',
  );
  const updated = EditorState.push(editorState, newContent, 'insert-characters');
  autosavePlugin.onChange(updated);
  clock.tick(debounceTime / 2);
  t.false(autosavePlugin._getIsClean());
  t.is(saveStub.callCount, 0);
  clock.tick(debounceTime / 2);
  t.is(saveStub.callCount, 1);
});
