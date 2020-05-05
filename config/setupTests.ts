import { configure, mount, render, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';

configure({ adapter: new Adapter() });

declare const global: any;
global.shallow = shallow;
global.render = render;
global.mount = mount;
global.React = React;
global.insights = { ...jest.requireMock('../src/utils/__mocks__/Insights').mockedInsight };
