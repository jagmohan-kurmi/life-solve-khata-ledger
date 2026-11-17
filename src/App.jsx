import { useMemo, useState } from 'react';

const money = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0));

export default function App() {
  const [parties, setParties] = useState([
    { id: 1, name: 'Riya', type: 'Customer' },
    { id: 2, name: 'Harish', type: 'Vendor' },
    { id: 3, name: 'Mohan', type: 'Customer' },
  ]);
  const [partyName, setPartyName] = useState('');
  const [transactions, setTransactions] = useState([
    { id: 1, partyId: 1, kind: 'youGot', amount: 8500, note: 'Advance payment', date: '2026-11-03' },
    { id: 2, partyId: 2, kind: 'youGave', amount: 3200, note: 'Office supplies', date: '2026-11-05' },
  ]);
  const [form, setForm] = useState({ partyId: 1, kind: 'youGot', amount: '', note: '', date: '' });

  const balances = useMemo(() => {
    const result = Object.fromEntries(parties.map((party) => [party.id, 0]));
    transactions.forEach((tx) => {
      if (tx.kind === 'youGot') result[tx.partyId] += Number(tx.amount || 0);
      else result[tx.partyId] -= Number(tx.amount || 0);
    });
    return result;
  }, [parties, transactions]);

  const addParty = () => {
    const clean = partyName.trim();
    if (!clean) return;
    setParties((current) => [...current, { id: Date.now(), name: clean, type: 'Customer' }]);
    setPartyName('');
  };

  const addTransaction = () => {
    if (!form.amount) return;
    setTransactions((current) => [...current, { id: Date.now(), partyId: Number(form.partyId), kind: form.kind, amount: Number(form.amount), note: form.note, date: form.date || new Date().toISOString().slice(0, 10) }]);
    setForm({ partyId: 1, kind: 'youGot', amount: '', note: '', date: '' });
  };

  return (
    <div className="app-shell">
      <div className="panel hero-panel">
        <div>
          <p className="eyebrow">Credit and cash ledger</p>
          <h1>Local Khata Ledger</h1>
        </div>
        <div className="form-grid two-columns">
          <input value={partyName} onChange={(e) => setPartyName(e.target.value)} placeholder="Add party" />
          <button onClick={addParty}>Add</button>
        </div>
      </div>

      <div className="panel">
        <h2>Add transaction</h2>
        <div className="form-grid two-columns">
          <select value={form.partyId} onChange={(e) => setForm({ ...form, partyId: e.target.value })}>
            {parties.map((party) => <option key={party.id} value={party.id}>{party.name}</option>)}
          </select>
          <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
            <option value="youGot">You got</option>
            <option value="youGave">You gave</option>
          </select>
          <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Amount" />
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Note" className="full-width" />
        </div>
        <button className="primary" onClick={addTransaction}>Save</button>
      </div>

      <div className="panel">
        <h2>Net balances</h2>
        {parties.map((party) => (
          <div key={party.id} className="balance-row">
            <span>{party.name}</span>
            <strong className={balances[party.id] >= 0 ? 'positive' : 'negative'}>{money(balances[party.id])}</strong>
          </div>
        ))}
      </div>

      <div className="panel full-span">
        <h2>Transactions</h2>
        {transactions.map((tx) => (
          <div key={tx.id} className="transaction-row">
            <span>{parties.find((party) => party.id === tx.partyId)?.name}</span>
            <span>{tx.kind === 'youGot' ? 'You got' : 'You gave'}</span>
            <strong>{money(tx.amount)}</strong>
            <small>{tx.date}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
