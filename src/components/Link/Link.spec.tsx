import React from 'react';
import { shallow } from 'enzyme';
import Link from './index';

describe('Link', () => {
  it('Renders link to Google', () => {
    const link = shallow(<Link href="http://google.com">Link to Google</Link>);
    expect(link).toMatchSnapshot();
  });
});
