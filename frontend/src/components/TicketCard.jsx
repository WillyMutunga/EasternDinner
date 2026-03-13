import { QRCodeSVG } from 'qrcode.react';
import './TicketCard.css';

const TicketCard = ({ ticket }) => {
    if (!ticket) return null;

    const qrData = JSON.stringify({
        id: ticket.id,
        name: ticket.name,
        code: `TKT-${ticket.id}-${ticket.created_at.substring(0, 4)}`
    });

    return (
        <div className="ticket-card animate-fade-in">
            <div className="ticket-header">
                <h3>Official Event Ticket</h3>
                <span className={`status-badge ${ticket.status}`}>
                    {ticket.status.toUpperCase()}
                </span>
            </div>
            <div className="ticket-body">
                <div className="ticket-info">
                    <div className="info-group">
                        <label>Ticket Holder</label>
                        <p>{ticket.name}</p>
                    </div>
                    <div className="info-group">
                        <label>Ticket Number</label>
                        <p>#TKT-2026-{ticket.id.toString().padStart(4, '0')}</p>
                    </div>
                    <div className="info-group">
                        <label>Event</label>
                        <p>Eastern Region Dinner 2026</p>
                    </div>
                </div>
                <div className="ticket-qr">
                    <QRCodeSVG value={qrData} size={128} level="H" includeMargin={true} />
                </div>
            </div>
            <div className="ticket-footer">
                <p>Please present this QR code at the entrance for validation.</p>
            </div>
        </div>
    );
};

export default TicketCard;
