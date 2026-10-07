function GigCard({ gig, onEdit, onDelete, busy }) {
    return (
        <article className="gig-card">
            <div className="gig-card-header">
                <div>
                    <h3>{gig.title}</h3>
                    <span className="category">{gig.category}</span>
                </div>

                <span className={gig.active ? 'status active' : 'status inactive'}>
                    {gig.active ? 'Active' : 'Inactive'}
                </span>
            </div>

            <p>{gig.description}</p>

            <div className="gig-meta">
                <strong>R{Number(gig.price).toFixed(2)}</strong>
                <span>{gig.deliveryDays} day delivery</span>
            </div>

            <div className="gig-actions">
                <button
                    type="button"
                    className="secondary-button"
                    onClick={() => onEdit(gig)}
                    disabled={busy}
                >
                    Edit
                </button>

                <button
                    type="button"
                    className="danger-button"
                    onClick={() => onDelete(gig)}
                    disabled={busy}
                >
                    Delete
                </button>
            </div>
        </article>
    )
}

export default GigCard
