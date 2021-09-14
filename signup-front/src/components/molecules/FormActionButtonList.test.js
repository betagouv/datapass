import { listAuthorizedActions } from './FormActionButtonList';

describe('FormActionButtonList', () => {
  it('lists button to display from enrollment acl', () => {
    const acl = {
      create: false,
      delete: true,
      destroy: false,
      edit: true,
      index: false,
      new: false,
      notify: true,
      refuse_application: true,
      review_application: false,
      send_application: true,
      show: true,
      update: true,
      update_owner: false,
      update_rgpd_contact: false,
      validate_application: false,
    };

    expect(listAuthorizedActions(acl)).toMatchSnapshot();
  });
});
