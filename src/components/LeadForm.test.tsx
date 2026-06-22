import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LeadForm } from './LeadForm';
import { siteConfigs, type Locale } from '../siteConfig';

function renderForm(locale: Locale = 'uk') { return render(<MemoryRouter><LeadForm config={siteConfigs[locale]} locale={locale} /></MemoryRouter>); }

describe('LeadForm', () => {
  beforeEach(() => vi.stubGlobal('fetch', vi.fn()));
  it('announces localized validation errors', async () => {
    renderForm(); await userEvent.click(screen.getByRole('button', { name: 'Надіслати запит' }));
    expect(await screen.findByText('Вкажіть ім’я')).toBeInTheDocument();
    expect(screen.getByLabelText('Ім’я')).toHaveAttribute('aria-invalid', 'true');
    expect(fetch).not.toHaveBeenCalled();
  });
  it('renders the English form copy', () => {
    renderForm('en');
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send enquiry' })).toBeInTheDocument();
  });
  it('submits valid lead data and shows success state', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response('{}', { status: 202 })); const user = userEvent.setup(); renderForm();
    await user.type(screen.getByLabelText('Ім’я'), 'Олена'); await user.type(screen.getByLabelText('Телефон або месенджер'), '+380501234567'); await user.selectOptions(screen.getByLabelText('Тип проєкту'), 'apartment'); await user.type(screen.getByLabelText('Орієнтовна площа, м²'), '84'); await user.click(screen.getByRole('button', { name: 'Надіслати запит' }));
    expect(await screen.findByText(/Дякуємо/)).toBeInTheDocument(); expect(fetch).toHaveBeenCalledOnce();
  });
  it('shows a recoverable server error', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response('{}', { status: 500 })); const user = userEvent.setup(); renderForm('en');
    await user.type(screen.getByLabelText('Name'), 'Ivan'); await user.type(screen.getByLabelText('Phone or messenger'), '@ivan'); await user.selectOptions(screen.getByLabelText('Project type'), 'other'); await user.type(screen.getByLabelText('Approximate area, m²'), '45'); await user.click(screen.getByRole('button', { name: 'Send enquiry' }));
    expect(await screen.findByText(/could not be sent/)).toBeInTheDocument();
  });
});
