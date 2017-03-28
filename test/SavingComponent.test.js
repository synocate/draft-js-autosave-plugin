import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import { stub } from 'sinon';
import SavingComponent from '../src/SavingComponent';

const theme = {
  container: 'container',
  containerSaving: 'containerSaving',
  textSaving: 'textSaving',
  textSaved: 'textSaved',
};

let cleanStub;

test.before(() => {
  cleanStub = stub();
});

test('renders okay?', (t) => {
  const component = shallow(
    <SavingComponent getIsClean={cleanStub} theme={theme} />,
  );
  t.truthy(component);
});

test('applies saving classes and displays saving text when not clean', (t) => {
  const component = shallow(
    <SavingComponent getIsClean={cleanStub.returns(false)} theme={theme} />,
  );
  t.is(component.prop('className'), `${theme.container} ${theme.containerSaving}`);
  t.is(component.find('span').first().prop('className'), theme.textSaving);
  t.is(component.find('span').first().text(), 'Saving...');
});

test('applies saving classes and displays saving text when saving', (t) => {
  const component = shallow(
    <SavingComponent getIsClean={cleanStub.returns(true)} theme={theme} saving />,
  );
  t.is(component.prop('className'), `${theme.container} ${theme.containerSaving}`);
  t.is(component.find('span').first().prop('className'), theme.textSaving);
  t.is(component.find('span').first().text(), 'Saving...');
});

test('applies base classes and displays saved text when clean and not saving', (t) => {
  const component = shallow(
    <SavingComponent getIsClean={cleanStub.returns(true)} theme={theme} />,
  );
  t.is(component.prop('className'), theme.container);
  t.is(component.find('span').first().prop('className'), theme.textSaved);
  t.is(component.find('span').first().text(), 'All Changes Saved.');
});
