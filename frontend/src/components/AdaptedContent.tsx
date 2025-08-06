/**
 * Component for displaying adapted educational content variants.
 * Shows simplified, bullet-point, and micro-task versions.
 */

import React, { useState } from 'react';
import { ContentVariant } from '../api';

interface AdaptedContentProps {
  content: ContentVariant;
}

const AdaptedContent: React.FC<AdaptedContentProps> = ({ content }) => {
  const [activeVariant, setActiveVariant] = useState<'simplified' | 'bullets' | 'micro_tasks'>('simplified');

  const variants = [
    { key: 'simplified', label: 'Simplified', icon: '📖' },
    { key: 'bullets', label: 'Bullet Points', icon: '📝' },
    { key: 'micro_tasks', label: 'Micro Tasks', icon: '✅' }
  ] as const;

  return (
    <div className="adapted-content">
      <h3>Adapted Content</h3>
      
      <div className="variant-tabs">
        {variants.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setActiveVariant(key)}
            className={`variant-tab ${activeVariant === key ? 'active' : ''}`}
          >
            <span className="tab-icon">{icon}</span>
            {label}
          </button>
        ))}
      </div>

      <div className="variant-content">
        <div className="content-card">
          {activeVariant === 'simplified' && (
            <div className="simplified-content">
              <h4>📖 Simplified Version</h4>
              <p>{content.simplified}</p>
            </div>
          )}
          
          {activeVariant === 'bullets' && (
            <div className="bullets-content">
              <h4>📝 Bullet Points</h4>
              <div dangerouslySetInnerHTML={{ __html: content.bullets.replace(/\n/g, '<br>') }} />
            </div>
          )}
          
          {activeVariant === 'micro_tasks' && (
            <div className="micro-tasks-content">
              <h4>✅ Micro Tasks</h4>
              <div dangerouslySetInnerHTML={{ __html: content.micro_tasks.replace(/\n/g, '<br>') }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdaptedContent;
