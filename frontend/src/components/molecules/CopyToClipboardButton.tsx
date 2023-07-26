import { useState } from 'react';
import { uniqueId } from 'lodash';
import ClipboardJS from 'clipboard';
import ContentCopyIcon from '../atoms/icons/contentCopy';

type Props = {
  textToCopy: string;
};

export const CopyToClipboardButton: React.FC<Props> = ({ textToCopy }) => {
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
      className="inline-icon-button data-tooltip-controlled"
      data-tooltip="Copié !"
    >
      <ContentCopyIcon
        color={'var(--border-action-high-blue-france)'}
        size={14}
      />
    </button>
  );
};

export default CopyToClipboardButton;
