import React from 'react';
import {
  FileText,
  Search,
  Wrench,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const STANDARD_STAGES = ['Submitted', 'Under Review', 'In Progress', 'Resolved'];

export const IssueTimeline = ({ status, statusHistory = [], adminRemark = '' }) => {
  const { t, isNepali, translateStatus } = useLanguage();
  const isRejected = status === 'Rejected';

  // Calculate current stage index for standard flow
  const currentStageIndex = STANDARD_STAGES.indexOf(status);

  const getStageIcon = (stageName) => {
    switch (stageName) {
      case 'Submitted':
        return <FileText size={16} />;
      case 'Under Review':
        return <Search size={16} />;
      case 'In Progress':
        return <Wrench size={16} />;
      case 'Resolved':
        return <CheckCircle2 size={16} />;
      case 'Rejected':
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleString(isNepali ? 'ne-NP' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="issue-timeline-wrapper">
      {/* Horizontal Lifecycle Stepper */}
      <div className="stepper-horizontal">
        <div className="stepper-track">
          <div
            className="stepper-track-fill"
            style={{
              width: isRejected
                ? '50%'
                : currentStageIndex >= 0
                ? `${(currentStageIndex / (STANDARD_STAGES.length - 1)) * 100}%`
                : '0%',
              backgroundColor: isRejected ? '#DC2626' : 'var(--primary-blue)',
            }}
          />
        </div>

        {STANDARD_STAGES.map((stage, idx) => {
          const isDone = !isRejected && currentStageIndex > idx;
          const isActive = !isRejected && currentStageIndex === idx;

          return (
            <div
              key={stage}
              className={`stepper-node ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}
            >
              <div className="stepper-circle">
                {isDone ? <CheckCircle2 size={18} /> : idx + 1}
              </div>
              <span className="stepper-label">{translateStatus(stage)}</span>
            </div>
          );
        })}

        {isRejected && (
          <div className="stepper-node rejected">
            <div className="stepper-circle">
              <XCircle size={18} />
            </div>
            <span className="stepper-label" style={{ color: '#DC2626' }}>
              {translateStatus('Rejected')}
            </span>
          </div>
        )}
      </div>

      {/* Vertical Status History Log / Timeline */}
      <h4 style={{ margin: '1.75rem 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Clock size={18} color="var(--primary-blue)" />
        {t('issueDetails.statusTimeline', 'Status & Activity Timeline')}
      </h4>

      <div className="timeline-container">
        {statusHistory && statusHistory.length > 0 ? (
          statusHistory.map((item, index) => {
            const isLast = index === statusHistory.length - 1;
            const itemRejected = item.status === 'Rejected';

            return (
              <div
                key={index}
                className={`timeline-step ${
                  itemRejected ? 'rejected' : isLast ? 'active' : 'completed'
                }`}
              >
                <div className="timeline-icon-wrapper">
                  {getStageIcon(item.status)}
                </div>

                <div className="timeline-content">
                  <div className="timeline-title-row">
                    <span className="timeline-title">
                      {translateStatus(item.status)}
                      {item.changedBy && (
                        <span
                          style={{
                            fontSize: '0.775rem',
                            fontWeight: 500,
                            color: 'var(--text-muted)',
                            marginLeft: '0.5rem',
                          }}
                        >
                          {t('issueDetails.by', 'by')} {item.changedBy}
                        </span>
                      )}
                    </span>
                    <span className="timeline-date">{formatDate(item.changedAt)}</span>
                  </div>

                  {item.remark && (
                    <div
                      className="timeline-remark"
                      style={
                        itemRejected
                          ? { borderLeftColor: '#DC2626', backgroundColor: '#FEF2F2' }
                          : item.status === 'Resolved'
                          ? { borderLeftColor: '#10B981', backgroundColor: '#ECFDF5' }
                          : {}
                      }
                    >
                      {item.remark}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="timeline-step active">
            <div className="timeline-icon-wrapper">
              <FileText size={16} />
            </div>
            <div className="timeline-content">
              <div className="timeline-title">{translateStatus(status)}</div>
              <div className="timeline-remark">{t('issueDetails.issueRegistered', 'Issue registered in portal system.')}</div>
            </div>
          </div>
        )}
      </div>

      {adminRemark && !statusHistory.some((h) => h.remark === adminRemark) && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-blue-light)',
            border: '1px solid var(--border-focus)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 700,
              color: 'var(--primary-navy)',
              fontSize: '0.9rem',
              marginBottom: '0.25rem',
            }}
          >
            <ShieldCheck size={16} color="var(--primary-blue)" />
            {t('issueDetails.officialNote', 'Official Municipal Note:')}
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{adminRemark}</p>
        </div>
      )}
    </div>
  );
};

export default IssueTimeline;
