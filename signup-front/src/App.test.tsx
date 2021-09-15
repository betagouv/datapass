import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import App from './App';
import nock from 'nock';

const BACK_HOST = process.env.VITE_BACK_HOST;

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
      created_at: '2020-02-04T15:42:13.134Z',
      updated_at: '2020-07-07T12:23:26.311Z',
      roles: [],
      uid: '1',
      email_verified: true,
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
