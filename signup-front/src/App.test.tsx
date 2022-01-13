import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import App from './App';
import nock from 'nock';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

let container: HTMLDivElement;

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
});

it('renders without crashing', () => {
  nock(BACK_HOST as string)
    .get('/api/users/me')
    .reply(200, {
      id: 1,
      email: 'user@yopmail.com',
      given_name: 'User',
      family_name: 'User',
      phone_number: '0123456789',
      job: 'User',
      roles: [],
      organizations: [
        {
          id: 16,
          siret: '21630215800011',
        },
      ],
    });

  act(() => {
    render(<App />, container);
  });
  expect(container.textContent).toContain('À propos');
});
