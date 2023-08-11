import { listAuthorizedEvents } from './StickyActions';

describe('StickyActions', () => {
  it('lists button to display from enrollment acl', () => {
    const acl = {
      create: false,
      destroy: false,
      index: false,
      notify: true,
      refuse: true,
      request_changes: false,
      submit: true,
      archive: true,
      show: true,
      update: true,
      validate: false,
    };

    expect(listAuthorizedEvents(acl)).toMatchSnapshot();
  });
});
