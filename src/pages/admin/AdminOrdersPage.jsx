import { useEffect, useState } from 'react'
import { fetchAdminOrder, fetchAdminOrders, updateAdminOrderStatus } from '../../utils/adminApi'

const STATUSES = ['new', 'reviewing', 'quoted', 'in_progress', 'done', 'cancelled']

function formatWhen(value) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString()
  } catch {
    return String(value)
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [total, setTotal] = useState(0)
  const [allTotal, setAllTotal] = useState(0)
  const [statusCounts, setStatusCounts] = useState({})
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const applyOrders = (data) => {
    const nextOrders = data.orders || []
    setOrders(nextOrders)
    setTotal(data.total || 0)
    setAllTotal(data.all_total || 0)
    setStatusCounts(data.status_counts || {})
    if (!selectedId && nextOrders.length) {
      setSelectedId(nextOrders[0].order_id)
      setDetailLoading(true)
    }
    if (selectedId && !nextOrders.some((o) => o.order_id === selectedId)) {
      setSelectedId(null)
      setDetail(null)
    }
  }

  const loadOrders = async (nextStatus = status, nextSearch = search) => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchAdminOrders({ status: nextStatus, search: nextSearch })
      applyOrders(data)
    } catch (err) {
      setError(err.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    fetchAdminOrders()
      .then((data) => {
        if (!cancelled) applyOrders(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load orders')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // Initial dashboard load only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!selectedId) return
    let cancelled = false
    fetchAdminOrder(selectedId)
      .then((order) => {
        if (!cancelled) setDetail(order)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load order')
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [selectedId])

  const onSearch = (event) => {
    event.preventDefault()
    loadOrders(status, search)
  }

  const filterByStatus = (nextStatus) => {
    setStatus(nextStatus)
    setSelectedId(null)
    setDetail(null)
    loadOrders(nextStatus, search)
  }

  const selectOrder = (orderId) => {
    setSelectedId(orderId)
    setDetailLoading(true)
  }

  const onStatusChange = async (nextStatus) => {
    if (!detail) return
    setSaving(true)
    setError('')
    try {
      const updated = await updateAdminOrderStatus(detail.order_id, nextStatus)
      setDetail(updated)
      setOrders((prev) => prev.map((o) => (o.order_id === updated.order_id ? updated : o)))
    } catch (err) {
      setError(err.message || 'Failed to update status')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-orders">
      <div className="admin-orders-head">
        <div>
          <h1>Orders</h1>
          <p>Queries and order forms submitted by website users</p>
        </div>
        <button type="button" className="admin-refresh" onClick={() => loadOrders()} disabled={loading}>
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      <div className="admin-stat-grid">
        <button type="button" className={!status ? 'on' : ''} onClick={() => filterByStatus('')}>
          <span>Total queries</span>
          <strong>{allTotal}</strong>
        </button>
        <button type="button" className={status === 'new' ? 'on' : ''} onClick={() => filterByStatus('new')}>
          <span>New</span>
          <strong>{statusCounts.new || 0}</strong>
        </button>
        <button
          type="button"
          className={status === 'in_progress' ? 'on' : ''}
          onClick={() => filterByStatus('in_progress')}
        >
          <span>In progress</span>
          <strong>{statusCounts.in_progress || 0}</strong>
        </button>
        <button type="button" className={status === 'done' ? 'on' : ''} onClick={() => filterByStatus('done')}>
          <span>Completed</span>
          <strong>{statusCounts.done || 0}</strong>
        </button>
      </div>

      <div className="admin-filters">
        <form onSubmit={onSearch} className="admin-search">
          <input
            type="search"
            placeholder="Search name, email, service, package…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        <div className="admin-status-pills">
          <button type="button" className={!status ? 'on' : ''} onClick={() => filterByStatus('')}>
            All
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              className={status === s ? 'on' : ''}
              onClick={() => filterByStatus(s)}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}
      {!loading && status ? (
        <p className="admin-filter-result">
          Showing {total} {status.replace('_', ' ')} order{total === 1 ? '' : 's'}
        </p>
      ) : null}

      <div className="admin-split">
        <div className="admin-list">
          {loading ? <p className="admin-muted">Loading orders…</p> : null}
          {!loading && orders.length === 0 ? <p className="admin-muted">No orders found.</p> : null}
          {orders.map((order) => (
            <button
              key={order.order_id}
              type="button"
              className={`admin-order-row ${selectedId === order.order_id ? 'on' : ''}`}
              onClick={() => selectOrder(order.order_id)}
            >
              <div className="admin-order-row-top">
                <strong>{order.name || '—'}</strong>
                <span className={`admin-badge status-${order.status || 'new'}`}>
                  {(order.status || 'new').replace('_', ' ')}
                </span>
              </div>
              <div className="admin-order-row-meta">
                <span>{order.email}</span>
                <span>{order.service || '—'}</span>
              </div>
              <div className="admin-order-row-meta">
                <span>{order.package || 'Custom'}</span>
                <span>{formatWhen(order.created_at)}</span>
              </div>
            </button>
          ))}
        </div>

        <aside className="admin-detail">
          {!selectedId ? (
            <p className="admin-muted">Select an order to see full details.</p>
          ) : detailLoading ? (
            <p className="admin-muted">Loading details…</p>
          ) : detail ? (
            <>
              <div className="admin-detail-head">
                <h2>{detail.name}</h2>
                <span className={`admin-badge status-${detail.status || 'new'}`}>
                  {(detail.status || 'new').replace('_', ' ')}
                </span>
              </div>

              <dl className="admin-dl">
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${detail.email}`}>{detail.email}</a>
                  </dd>
                </div>
                <div>
                  <dt>Service</dt>
                  <dd>{detail.service || '—'}</dd>
                </div>
                <div>
                  <dt>Package</dt>
                  <dd>{detail.package || '—'}</dd>
                </div>
                <div>
                  <dt>Price</dt>
                  <dd>{detail.price || '—'}</dd>
                </div>
                <div>
                  <dt>Budget</dt>
                  <dd>{detail.budget || '—'}</dd>
                </div>
                <div>
                  <dt>Deadline</dt>
                  <dd>{detail.deadline || '—'}</dd>
                </div>
                <div>
                  <dt>Source</dt>
                  <dd>{detail.source || '—'}</dd>
                </div>
                <div>
                  <dt>Created</dt>
                  <dd>{formatWhen(detail.created_at)}</dd>
                </div>
                <div>
                  <dt>Updated</dt>
                  <dd>{formatWhen(detail.updated_at)}</dd>
                </div>
              </dl>

              <div className="admin-block">
                <h3>Description</h3>
                <p>{detail.description || '—'}</p>
              </div>

              <div className="admin-block">
                <h3>References</h3>
                <p>{detail.references || '—'}</p>
              </div>

              <div className="admin-block">
                <h3>Update status</h3>
                <select
                  value={detail.status || 'new'}
                  disabled={saving}
                  onChange={(e) => onStatusChange(e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <p className="admin-muted">Order not found.</p>
          )}
        </aside>
      </div>
    </div>
  )
}
