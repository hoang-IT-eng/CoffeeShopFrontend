import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { useLang } from '../i18n';
import OpsIcon from '../components/OpsIcons';

export default function CustomerFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { t } = useLang();

  const [form, setForm] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    membershipLevel: 'Bronze',
    address: ''
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    api(`/api/customers/${id}`)
      .then((res) => {
        setForm({
          name: res.name || '',
          phoneNumber: res.phoneNumber || '',
          email: res.email || '',
          membershipLevel: res.membershipLevel || 'Bronze',
          address: res.address || ''
        });
      })
      .catch((err) => setError(err.message));
  }, [id, isEdit]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (isEdit) {
        await api(`/api/customers/${id}`, { method: 'PUT', body: form });
      } else {
        await api('/api/customers', { method: 'POST', body: form });
      }
      navigate('/customers');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ops-page">
      <header className="ops-header">
        <div>
          <h1>{isEdit ? t('ops.customers.formEditTitle') : t('ops.customers.formNewTitle')}</h1>
        </div>
        <div className="ops-actions">
          <Link to="/customers" className="ops-btn">
            <OpsIcon name="arrowLeft" size={15} />
            <span>{t('ops.common.cancel')}</span>
          </Link>
        </div>
      </header>

      {error && <div className="ops-alert">{error}</div>}

      <form
        onSubmit={handleSubmit}
        className="ops-panel"
        style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 14 }}
      >
        <div className="ops-field">
          <label htmlFor="cust-name">{t('ops.customers.nameLabel')}</label>
          <input
            id="cust-name"
            className="ops-input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="ops-field">
            <label htmlFor="cust-phone">{t('ops.customers.phoneLabel')}</label>
            <input
              id="cust-phone"
              className="ops-input ops-mono"
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              required
            />
          </div>

          <div className="ops-field">
            <label htmlFor="cust-tier">{t('ops.customers.tierLabel')}</label>
            <select
              id="cust-tier"
              className="ops-select"
              value={form.membershipLevel}
              onChange={(e) => setForm({ ...form, membershipLevel: e.target.value })}
            >
              {['Bronze', 'Silver', 'Gold', 'Diamond'].map((lv) => (
                <option key={lv} value={lv}>
                  {lv}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="ops-field">
          <label htmlFor="cust-email">{t('ops.customers.emailLabel')}</label>
          <input
            id="cust-email"
            type="email"
            className="ops-input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="ops-field">
          <label htmlFor="cust-notes">{t('ops.customers.notesLabel')}</label>
          <textarea
            id="cust-notes"
            rows={3}
            className="ops-textarea"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>

        <div>
          <button type="submit" disabled={busy} className="ops-btn ops-btn--espresso">
            <OpsIcon name="check" size={15} />
            <span>{t('ops.customers.saveCustomer')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
