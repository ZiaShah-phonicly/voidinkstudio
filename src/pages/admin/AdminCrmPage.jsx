import { useEffect, useState } from 'react'
import { fetchAdminCrm, fetchAdminCrmDeal, updateAdminCrmDealStage } from '../../utils/adminApi'

const PIPELINE_STAGES = [
  { id: 'new', label: 'New', tone: 'cyan' },
  { id: 'reviewing', label: 'Reviewing', tone: 'violet' },
  { id: 'quoted', label: 'Quoted', tone: 'pink' },
  { id: 'in_progress', label: 'In progress', tone: 'amber' },
  { id: 'done', label: 'Done', tone: 'green' },
]

const STAGE_ORDER = PIPELINE_STAGES.map((s) => s.id)

function formatWhen(value) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString()
  } catch {
    return String(value)
  }
}

function shortWhen(value) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  } catch {
    return String(value)
  }
}

function neighborStage(stage, dir) {
  const i = STAGE_ORDER.indexOf(stage)
  if (i < 0) return null
  const next = i + dir
  if (next < 0 || next >= STAGE_ORDER.length) return null
  return STAGE_ORDER[next]
}

export default function AdminCrmPage() {
  const [tab, setTab] = useState('pipeline')
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [pipeline, setPipeline] = useState({})
  const [contacts, setContacts] = useState([])
  const [statusCounts, setStatusCounts] = useState({})
  const [openTotal, setOpenTotal] = useState(0)
  const [contactTotal, setContactTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [draggingId, setDraggingId] = useState(null)
  const [dropStage, setDropStage] = useState(null)

  const load = async (nextSearch = query, { quiet } = {}) => {
    if (!quiet) setLoading(true)
    setError('')
    try {
      const data = await fetchAdminCrm({ search: nextSearch })
      setPipeline(data.pipeline || {})
      setContacts(data.contacts || [])
      setStatusCounts(data.status_counts || {})
      setOpenTotal(data.open_total || 0)
      setContactTotal(data.contact_total || 0)
    } catch (err) {
      setError(err.message || 'Failed to load CRM')
    } finally {
      if (!quiet) setLoading(false)
    }
  }

  useEffect(() => {
    load('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!selectedId) {
      setDetail(null)
      return
    }
    let cancelled = false
    setDetailLoading(true)
    fetchAdminCrmDeal(selectedId)
      .then((data) => {
        if (!cancelled) setDetail(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load deal')
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [selectedId])

  const moveDealOptimistic = (dealId, fromStage, toStage) => {
    setPipeline((prev) => {
      const next = { ...prev }
      for (const key of Object.keys(next)) {
        next[key] = [...(next[key] || [])]
      }
      const fromList = next[fromStage] || []
      const idx = fromList.findIndex((d) => d.deal_id === dealId)
      if (idx < 0) return prev
      const [card] = fromList.splice(idx, 1)
      const updated = { ...card, stage: toStage }
      next[fromStage] = fromList
      next[toStage] = [updated, ...(next[toStage] || [])]
      return next
    })
    setStatusCounts((prev) => ({
      ...prev,
      [fromStage]: Math.max(0, (prev[fromStage] || 0) - 1),
      [toStage]: (prev[toStage] || 0) + 1,
    }))
  }

  const changeStage = async (deal, toStage) => {
    if (!deal?.deal_id || !toStage || deal.stage === toStage) return
    const fromStage = deal.stage
    setSavingId(deal.deal_id)
    setError('')
    moveDealOptimistic(deal.deal_id, fromStage, toStage)
    try {
      await updateAdminCrmDealStage(deal.deal_id, toStage)
      await load(query, { quiet: true })
      if (selectedId === deal.deal_id) {
        const data = await fetchAdminCrmDeal(deal.deal_id)
        setDetail(data)
      }
    } catch (err) {
      setError(err.message || 'Failed to update deal')
      await load(query, { quiet: true })
    } finally {
      setSavingId('')
    }
  }

  const onSearch = (e) => {
    e.preventDefault()
    const next = search.trim()
    setQuery(next)
    load(next)
  }

  const onDragStart = (e, deal) => {
    e.dataTransfer.setData('text/deal-id', deal.deal_id)
    e.dataTransfer.setData('text/from-stage', deal.stage)
    e.dataTransfer.effectAllowed = 'move'
    setDraggingId(deal.deal_id)
  }

  const onDragEnd = () => {
    setDraggingId(null)
    setDropStage(null)
  }

  const onColumnDragOver = (e, stageId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDropStage(stageId)
  }

  const onColumnDrop = async (e, toStage) => {
    e.preventDefault()
    const dealId = e.dataTransfer.getData('text/deal-id')
    const fromStage = e.dataTransfer.getData('text/from-stage')
    setDropStage(null)
    setDraggingId(null)
    if (!dealId || !toStage || fromStage === toStage) return
    const deal =
      (pipeline[fromStage] || []).find((d) => d.deal_id === dealId) ||
      Object.values(pipeline)
        .flat()
        .find((d) => d.deal_id === dealId)
    if (!deal) return
    await changeStage(deal, toStage)
  }

  const deal = detail?.deal
  const activities = detail?.activities || []

  return (
    <div className="admin-crm">
      <div className="admin-orders-head">
        <div>
          <h1>CRM</h1>
          <p>Drag cards left or right across columns to change status. Click a card for notes.</p>
        </div>
        <button type="button" className="admin-refresh" onClick={() => load(query)} disabled={loading}>
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      <div className="admin-crm-tabs">
        <button type="button" className={tab === 'pipeline' ? 'on' : undefined} onClick={() => setTab('pipeline')}>
          Pipeline <em>{openTotal}</em>
        </button>
        <button type="button" className={tab === 'contacts' ? 'on' : undefined} onClick={() => setTab('contacts')}>
          Contacts <em>{contactTotal}</em>
        </button>
      </div>

      <div className="admin-crm-stats">
        {PIPELINE_STAGES.map((s) => (
          <div key={s.id} className={`admin-crm-pill tone-${s.tone}`}>
            <span>{s.label}</span>
            <strong>{statusCounts[s.id] || 0}</strong>
          </div>
        ))}
      </div>

      <form className="admin-search" onSubmit={onSearch}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, service, tracking ID…"
        />
        <button type="submit">Search</button>
      </form>

      {error ? <p className="admin-error">{error}</p> : null}
      {loading ? <p className="admin-muted">Loading CRM…</p> : null}

      {!loading && tab === 'pipeline' ? (
        <div className="admin-crm-layout">
          <div className="admin-crm-board" role="list">
            {PIPELINE_STAGES.map((stage) => {
              const deals = pipeline[stage.id] || []
              const isDrop = dropStage === stage.id
              return (
                <section
                  key={stage.id}
                  className={`admin-crm-column tone-${stage.tone}${isDrop ? ' drop-on' : ''}`}
                  onDragOver={(e) => onColumnDragOver(e, stage.id)}
                  onDragLeave={() => setDropStage((cur) => (cur === stage.id ? null : cur))}
                  onDrop={(e) => onColumnDrop(e, stage.id)}
                >
                  <header>
                    <h2>{stage.label}</h2>
                    <span>{deals.length}</span>
                  </header>
                  <div className="admin-crm-cards">
                    {deals.length === 0 ? (
                      <p className="admin-crm-empty">Drop deals here</p>
                    ) : null}
                    {deals.map((item) => {
                      const left = neighborStage(item.stage, -1)
                      const right = neighborStage(item.stage, 1)
                      const busy = savingId === item.deal_id
                      return (
                        <article
                          key={item.deal_id}
                          className={`admin-crm-card${selectedId === item.deal_id ? ' on' : ''}${
                            draggingId === item.deal_id ? ' dragging' : ''
                          }${busy ? ' saving' : ''}`}
                          draggable={!busy}
                          onDragStart={(e) => onDragStart(e, item)}
                          onDragEnd={onDragEnd}
                          onClick={() => setSelectedId(item.deal_id)}
                          role="listitem"
                        >
                          <div className="admin-crm-card-grip" aria-hidden="true">
                            ⋮⋮
                          </div>
                          <div className="admin-crm-card-body">
                            <div className="admin-order-row-top">
                              <strong>{item.contact_name || '—'}</strong>
                              <span className={`admin-badge status-${item.stage}`}>{item.stage}</span>
                            </div>
                            <p className="admin-crm-card-email">{item.contact_email}</p>
                            <p className="admin-crm-card-meta">{item.title || item.service || '—'}</p>
                            <p className="admin-crm-card-meta">
                              {item.tracking_id || 'No ID'} · {shortWhen(item.created_at)}
                              {item.amount ? ` · ${item.amount}` : ''}
                            </p>
                          </div>
                          <div className="admin-crm-card-moves">
                            <button
                              type="button"
                              className="admin-crm-move"
                              disabled={!left || busy}
                              title={left ? `Move to ${left}` : 'Already first'}
                              onClick={(e) => {
                                e.stopPropagation()
                                if (left) changeStage(item, left)
                              }}
                            >
                              ←
                            </button>
                            <button
                              type="button"
                              className="admin-crm-move"
                              disabled={!right || busy}
                              title={right ? `Move to ${right}` : 'Already last'}
                              onClick={(e) => {
                                e.stopPropagation()
                                if (right) changeStage(item, right)
                              }}
                            >
                              →
                            </button>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>

          <aside className="admin-detail admin-crm-detail">
            {!selectedId ? (
              <div className="admin-crm-detail-empty">
                <p className="admin-muted">Select a deal to see brief and research notes.</p>
                <p className="admin-crm-hint">Tip: drag cards between columns, or use ← →</p>
              </div>
            ) : detailLoading ? (
              <p className="admin-muted">Loading deal…</p>
            ) : !deal ? (
              <p className="admin-muted">Deal not found.</p>
            ) : (
              <>
                <div className="admin-detail-head">
                  <h2>{deal.contact_name || 'Deal'}</h2>
                  <span className={`admin-badge status-${deal.stage}`}>{deal.stage}</span>
                </div>
                <dl className="admin-dl">
                  <div>
                    <dt>Email</dt>
                    <dd>{deal.contact_email || '—'}</dd>
                  </div>
                  <div>
                    <dt>Title</dt>
                    <dd>{deal.title || '—'}</dd>
                  </div>
                  <div>
                    <dt>Amount</dt>
                    <dd>{deal.amount || '—'}</dd>
                  </div>
                  <div>
                    <dt>Tracking</dt>
                    <dd>{deal.tracking_id || '—'}</dd>
                  </div>
                  <div>
                    <dt>Created</dt>
                    <dd>{formatWhen(deal.created_at)}</dd>
                  </div>
                </dl>
                <div className="admin-crm-stage-row">
                  {PIPELINE_STAGES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`admin-crm-stage-chip${deal.stage === s.id ? ' on' : ''}`}
                      disabled={savingId === deal.deal_id}
                      onClick={() => changeStage(deal, s.id)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                {deal.description ? (
                  <div className="admin-block">
                    <h3>Brief</h3>
                    <p>{deal.description}</p>
                  </div>
                ) : null}
                <div className="admin-block">
                  <h3>Activity / research</h3>
                  {activities.length === 0 ? (
                    <p className="admin-muted">No notes yet.</p>
                  ) : (
                    <div className="admin-crm-activity-list">
                      {activities.map((a) => (
                        <article key={a.activity_id} className="admin-crm-activity">
                          <header>
                            <span className="admin-badge">{a.type}</span>
                            <span>{formatWhen(a.created_at)}</span>
                          </header>
                          <p>{a.summary}</p>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </aside>
        </div>
      ) : null}

      {!loading && tab === 'contacts' ? (
        <div className="admin-users-table-wrap">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>Contact</th>
                <th>Orders</th>
                <th>Open</th>
                <th>Latest</th>
                <th>Last seen</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="admin-muted">
                    No contacts yet. New API form submissions create CRM contacts automatically.
                  </td>
                </tr>
              ) : (
                contacts.map((c) => (
                  <tr key={c.contact_id || c.email}>
                    <td>
                      <div className="admin-user-cell">
                        <strong>{c.name || '—'}</strong>
                        <span>{c.email}</span>
                      </div>
                    </td>
                    <td>{c.order_count}</td>
                    <td>{c.open_count}</td>
                    <td>
                      <div className="admin-user-cell">
                        <span>
                          {c.latest_service || '—'}
                          {c.latest_tracking_id ? ` · ${c.latest_tracking_id}` : ''}
                        </span>
                      </div>
                    </td>
                    <td>{formatWhen(c.last_seen_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}
