import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { AuthProvider } from '../auth';
import { LanguageProvider } from '../i18n';
import { resetMockApi } from '../mockApi';

function renderWorkspace(initialRoute = '/login', { lang = 'en' } = {}) {
  localStorage.setItem('site-lang', lang);
  return render(
    <LanguageProvider>
      <AuthProvider>
        <MemoryRouter
          initialEntries={[initialRoute]}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <App />
        </MemoryRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

describe('An Roastery POS, KDS, Floor & Shift Operations Suite', () => {
  beforeEach(() => {
    resetMockApi({ shiftOpen: true });
  });

  it('authenticates via demo login and renders the Executive Shift & Rush Dashboard + quick search', async () => {
    const user = userEvent.setup();
    renderWorkspace('/login', { lang: 'en' });

    expect(await screen.findByRole('heading', { name: /Staff Shift Sign-In/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Enter Operations Workspace/i }));

    expect(
      await screen.findByRole('heading', { name: /Executive Shift & Rush Pulse/i })
    ).toBeInTheDocument();
    expect(await screen.findByText(/Net Sales Today/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('topbar-shift-pill')).toHaveTextContent(/Active Shift/i);
    });

    // Press '/' shortcut to open command search modal
    await user.keyboard('/');
    expect(
      await screen.findByRole('dialog', {
        name: /Jump to an operations screen, floor table, or live ticket/i
      })
    ).toBeInTheDocument();
  });

  it('builds a POS order with drink modifiers and fires it directly to the Barista KDS board', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem('an-roastery-demo-session', 'newadmin@coffee.com');
    renderWorkspace('/orders/new', { lang: 'en' });

    expect(
      await screen.findByRole('heading', { name: /POS Counter & Beverage Builder/i })
    ).toBeInTheDocument();

    const saltedCard = await screen.findByTestId('pos-item-1');
    await user.click(within(saltedCard).getByRole('button', { name: /Modifiers/i }));

    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: /Oatside Barista Oat \(\+10k\)/i }));
    await user.click(within(dialog).getByRole('button', { name: /Hario V60 Cone/i }));
    await user.click(within(dialog).getByRole('button', { name: /Save Modifiers to Ticket/i }));

    // Base price 52,000 + 10,000 oat milk = 62,000 inside Running Counter Ticket
    const ticketRail = screen.getByLabelText(/Running Counter Ticket/i);
    expect((await within(ticketRail).findAllByText('₫62,000')).length).toBeGreaterThan(0);

    const guestInput = screen.getByPlaceholderText(/Guest or call name/i);
    await user.type(guestInput, 'Elena Tran');

    await user.click(screen.getByRole('button', { name: /Send to Bar \(KDS\)/i }));

    expect(
      await screen.findByRole('heading', { name: /Barista KDS & Orders Ledger/i })
    ).toBeInTheDocument();
    const queuedCol = screen.getByTestId('kds-col-New');
    expect(await within(queuedCol).findByText(/Elena Tran/i)).toBeInTheDocument();
  });

  it('transitions a live ticket across all 4 Barista KDS Kanban stages', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem('an-roastery-demo-session', 'newadmin@coffee.com');
    renderWorkspace('/orders', { lang: 'en' });

    expect(
      await screen.findByRole('heading', { name: /Barista KDS & Orders Ledger/i })
    ).toBeInTheDocument();

    // Ticket #1044 starts in Queued ('New')
    const queuedCol = screen.getByTestId('kds-col-New');
    const ticketNew = await within(queuedCol).findByTestId('kds-ticket-1044');
    await user.click(within(ticketNew).getByRole('button', { name: /Start Pulling Shot/i }));

    // Moves to Pulling Shot / Steaming ('Processing')
    await waitFor(() => {
      const pullingCol = screen.getByTestId('kds-col-Processing');
      expect(within(pullingCol).getByTestId('kds-ticket-1044')).toBeInTheDocument();
    });

    const pullingTicket = within(screen.getByTestId('kds-col-Processing')).getByTestId(
      'kds-ticket-1044'
    );
    await user.click(within(pullingTicket).getByRole('button', { name: /Bump Ready at Pass/i }));

    // Moves to Ready at Pass ('Ready')
    await waitFor(() => {
      const readyCol = screen.getByTestId('kds-col-Ready');
      expect(within(readyCol).getByTestId('kds-ticket-1044')).toBeInTheDocument();
    });

    const readyTicket = within(screen.getByTestId('kds-col-Ready')).getByTestId('kds-ticket-1044');
    await user.click(within(readyTicket).getByRole('button', { name: /Mark Served/i }));

    // Moves to Served ('Completed')
    await waitFor(() => {
      const servedCol = screen.getByTestId('kds-col-Completed');
      expect(within(servedCol).getByTestId('kds-ticket-1044')).toBeInTheDocument();
    });
  });

  it('opens a Cash Shift, records petty cash Paid-Out, computes blind variance, and closes shift', async () => {
    const user = userEvent.setup();
    resetMockApi({ shiftOpen: false });
    sessionStorage.setItem('an-roastery-demo-session', 'newadmin@coffee.com');
    renderWorkspace('/shift', { lang: 'en' });

    expect(
      await screen.findByRole('heading', { name: /Cashier Shift & Drawer Reconciliation/i })
    ).toBeInTheDocument();
    expect(await screen.findByText(/Cash Drawer Closed/i)).toBeInTheDocument();

    const floatInput = screen.getByLabelText(/Opening Float Amount/i);
    await user.clear(floatInput);
    await user.type(floatInput, '2000000');
    await user.click(screen.getByRole('button', { name: /Open Shift & Unlock Drawer/i }));

    // Expected drawer cash starts at 2,000,000
    expect(await screen.findByTestId('expected-drawer-cash')).toHaveTextContent('₫2,000,000');

    // Record Paid-Out petty cash of 85,000
    await user.type(screen.getByLabelText(/Amount \(VND\)/i), '85000');
    await user.type(screen.getByLabelText(/Event Reason/i), 'Crystal bar ice delivery');
    await user.click(screen.getByRole('button', { name: /Record Drawer Event/i }));

    // Expected drawer cash drops to 1,915,000
    await waitFor(() => {
      expect(screen.getByTestId('expected-drawer-cash')).toHaveTextContent('₫1,915,000');
    });

    // Enter blind count of 1,900,000 -> variance -15,000 (Drawer Shortage)
    const blindInput = screen.getByLabelText(/Actual Counted Cash in Drawer/i);
    await user.clear(blindInput);
    await user.type(blindInput, '1900000');

    expect(screen.getByTestId('drawer-variance')).toHaveTextContent('₫-15,000');
    expect(screen.getByText(/Drawer Shortage/i)).toBeInTheDocument();

    // Close & reconcile shift
    await user.click(screen.getByRole('button', { name: /Close & Reconcile Shift/i }));

    await waitFor(() => {
      expect(screen.getByText(/Cash Drawer Closed/i)).toBeInTheDocument();
    });
  });

  it('switches seamlessly between Vietnamese (VI) and English (EN) across Floor Studio & settles an 80mm receipt', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem('an-roastery-demo-session', 'newadmin@coffee.com');
    renderWorkspace('/tables', { lang: 'vi' });

    // Starts in Vietnamese
    expect(
      await screen.findByRole('heading', { name: /Sơ đồ sàn & Điều phối bàn/i })
    ).toBeInTheDocument();
    expect((await screen.findAllByText(/Quầy Bar Espresso/i)).length).toBeGreaterThan(0);

    // Switch to English via topbar language toggle
    const langGroup = screen.getByRole('group', { name: /Switch language/i });
    await user.click(within(langGroup).getByRole('button', { name: 'EN' }));

    expect(
      await screen.findByRole('heading', { name: /Floor Plan & Table Occupancy Studio/i })
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Espresso Bar Counter/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Main Courtyard/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Roastery Window/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Quiet Mezzanine/i).length).toBeGreaterThan(0);

    // Inspect table R-01 (ticket #1042 Ready) and settle check -> 80mm thermal receipt
    await user.click(screen.getByRole('button', { name: /R-01/i }));
    await user.click(await screen.findByRole('link', { name: /Settle & Print Check/i }));

    expect(await screen.findByRole('heading', { name: /Settle Ticket #1042/i })).toBeInTheDocument();
    await user.click(
      await screen.findByRole('button', { name: /Complete Payment & Print 80mm Receipt/i })
    );

    const paper = await screen.findByTestId('thermal-receipt-80mm');
    expect(within(paper).getByText(/OFFICIAL THERMAL RECEIPT/i)).toBeInTheDocument();
    expect(within(paper).getByLabelText(/Receipt QR Code/i)).toBeInTheDocument();
  });
});
