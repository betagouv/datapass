import React, { FunctionComponent, useEffect, useState } from 'react';
import Label from '../../atoms/inputs/Label';
import Button from '../../atoms/hyperTexts/Button';
import ConfirmationModal from '../../organisms/ConfirmationModal';
import { Document } from './index';
import useFileDownloader from '../../templates/hooks/use-file-downloader';

type Props = {
  id: string;
  label: string;
  disabled: boolean;
  onReplaceFile: () => void;
  uploadedDocuments: Document[];
  documentType: string;
};

export const DownloadButton: FunctionComponent<Props> = ({
  id,
  label,
  disabled,
  onReplaceFile,
  uploadedDocuments,
  documentType,
}) => {
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState<Document | null>(
    null
  );

  useEffect(() => {
    setUploadedDocument(
      uploadedDocuments.filter(({ type }) => type === documentType)[0]
    );
  }, [uploadedDocuments, documentType]);
  const { download } = useFileDownloader();

  return (
    <>
      <Label id={id} label={label} />
      <div>
        <Button
          onClick={() => setShowWarningModal(true)}
          icon="download"
          aria-label="Télécharger le document"
        >
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '300px',
            }}
          >
            {uploadedDocument?.filename}
          </div>
        </Button>
        {!disabled && (
          <Button
            secondary
            icon="close"
            onClick={onReplaceFile}
            aria-label="Remplacer le document"
          />
        )}
      </div>

      {showWarningModal && (
        <ConfirmationModal
          title="Fichier non vérifié"
          handleCancel={() => setShowWarningModal(false)}
          handleConfirm={() => {
            setShowWarningModal(false);
            download(uploadedDocument?.attachment.url);
          }}
          confirmLabel="Télécharger le fichier"
        >
          <p>
            Ce fichier provient d’une source extérieure et n’a pas été vérifié.
            Merci de l’analyser avec votre antivirus avant de l’ouvrir.
          </p>
        </ConfirmationModal>
      )}
    </>
  );
};

export default DownloadButton;
