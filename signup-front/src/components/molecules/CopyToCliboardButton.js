import React, { useState } from 'react';
import { uniqueId } from 'lodash';
import ClipboardJS from 'clipboard';
import ContentCopyIcon from '../atoms/icons/content-copy';

export const CopyToCliboardButton = ({ textToCopy }) => {
  const [id] = useState(uniqueId());
  const clipboard = new ClipboardJS(`#clipboard-${id}`);

  clipboard.on('success', function (e) {
    e.trigger.classList.add('tooltip-opened');
    e.clearSelection();
    setTimeout(() => e.trigger.classList.remove('tooltip-opened'), 3000);
  });

  return (
    <button
      title="Copier dans le presse papier"
      id={`clipboard-${id}`}
      data-clipboard-text={textToCopy}
      className="inline-icon-button tooltip-controlled"
      tooltip="Copié !"
    >
      <ContentCopyIcon
        color={'var(--border-action-high-blue-france)'}
        size={14}
      />
    </button>
  );
};

export default CopyToCliboardButton;
