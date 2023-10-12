import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TurningSheet from '../components/TurningSheet';
import { MemoryRouter } from 'react-router-dom';

// Mock useLocation
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockReturnValue({
    state: { recentlyDistributed: [] },
  }),
}));

const mockFetch = jest.spyOn(global, 'fetch');
mockFetch.mockImplementation(() => 
  Promise.resolve({
    json: jest.fn().mockResolvedValue([]),
    headers: new Headers(),
    ok: true,
    redirected: false,
    status: 200,
    statusText: "OK",
    type: "default",
    url: "",
    clone: jest.fn(),
    arrayBuffer: jest.fn(),
    blob: jest.fn(),
    formData: jest.fn(),
    text: jest.fn(),
  } as unknown as Response)
);

describe('<TurningSheet />', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <TurningSheet />
      </MemoryRouter>
    );
  });

  it('displays technician names', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: jest.fn().mockResolvedValue([
          {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            currentPoints: 0,
            WorkingDays: ['Monday']
          },
        ]),
        headers: new Headers(),
        ok: true,
        redirected: false,
        status: 200,
        statusText: "OK",
        type: "default",
        url: "",
        clone: jest.fn(),
        arrayBuffer: jest.fn(),
        blob: jest.fn(),
        formData: jest.fn(),
        text: jest.fn(),
      } as unknown as Response)
    );

    render(
      <MemoryRouter>
        <TurningSheet />
      </MemoryRouter>
    );
    expect(await screen.findByText('John Doe')).toBeInTheDocument();
  });
});
