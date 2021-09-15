import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import fileDownload from 'js-file-download';
import { uniqueId } from 'lodash';
import ConfirmationModal from '../organisms/ConfirmationModal';
import httpClient from '../../lib/http-client';
import Button from '../atoms/Button';

const BACK_HOST = process.env.VITE_BACK_HOST;

// NB: please keep this limit in sync with the limit in nginx signup-back configuration
const FILE_SIZE_LIMIT_IN_MB = 10;

const FileInput = ({
  label,
  mimeTypes = '.pdf, application/pdf',
  disabled,
  uploadedDocuments,
  documentsToUpload,
  documentType,
  onChange,
}) => {
  const [id] = useState(uniqueId(documentType));
  const [documentsTooLargeError, setDocumentsTooLargeError] = useState(false);
  const [showDocumentDownloadLink, setShowDocumentDownloadLink] =
    useState(false);
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const areDocumentsTooLarge = (documentsToUpload) => {
    const documentsSizeInMB = documentsToUpload.reduce(
      (accumulator, { attachment: { size } }) =>
        accumulator + size / 1024 / 1024, // in MB
      0
    );

    return documentsSizeInMB >= FILE_SIZE_LIMIT_IN_MB;
  };

  useEffect(() => {
    setDocumentsTooLargeError(areDocumentsTooLarge(documentsToUpload));
  }, [documentsToUpload]);

  useEffect(() => {
    setUploadedDocument(
      uploadedDocuments.filter(({ type }) => type === documentType)[0]
    );
  }, [uploadedDocuments, documentType]);

  useEffect(() => {
    setShowDocumentDownloadLink(
      uploadedDocuments.some(({ type }) => type === documentType) &&
        !documentsToUpload.some(({ type }) => type === documentType)
    );
  }, [uploadedDocuments, documentType, documentsToUpload]);

  const handleChange = ({ target: { files, name } }) => {
    const documentsWithoutThisDocument = documentsToUpload.filter(
      ({ type }) => type !== documentType
    );

    const updatedDocumentsToUpload = [
      ...documentsWithoutThisDocument,
      {
        attachment: files[0],
        type: name,
      },
    ];

    // note that if files is an empty array (ie. file selection as been canceled)
    // this will result in unchanged documents_attributes
    return onChange({
      target: {
        name: 'documents_attributes',
        value: updatedDocumentsToUpload,
      },
    });
  };

  const onReplaceFile = () => {
    setShowDocumentDownloadLink(false);
  };

  const download = () => {
    setShowWarningModal(false);
    httpClient
      .get(`${BACK_HOST}${uploadedDocument.attachment.url}`, {
        responseType: 'blob',
      })
      .then((response) => {
        fileDownload(response.data, uploadedDocument.filename);
      });
  };

  return (
    <div className="form__group">
      {showDocumentDownloadLink ? (
        <>
          <div>{label}</div>
          <div>
            <Button
              style={{
                maxWidth: '300px',
              }}
              onClick={() => setShowWarningModal(true)}
              icon="download"
              title="Télécharger le document"
              aria-label="Télécharger le document"
            >
              <div
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {uploadedDocument.filename}
              </div>
            </Button>
            {!disabled && (
              <Button
                outline
                icon="close"
                onClick={onReplaceFile}
                title="Remplacer le document"
                aria-label="Remplacer le document"
              />
            )}
          </div>
        </>
      ) : (
        <>
          <label htmlFor={id}>{label}</label>
          <input
            type="file"
            accept={mimeTypes}
            onChange={handleChange}
            disabled={disabled}
            name={documentType}
            id={id}
          />
          {documentsTooLargeError && (
            <div className="notification error">
              La taille des pièces jointes dépasse la taille maximale autorisée
              ({FILE_SIZE_LIMIT_IN_MB} MO)
            </div>
          )}
        </>
      )}
      {showWarningModal && (
        <ConfirmationModal
          title="Fichier non vérifié"
          handleCancel={() => setShowWarningModal(false)}
          handleConfirm={download}
          cancelLabel={`Ne pas télécharger le fichier`}
          confirmLabel={`Télécharger ${uploadedDocument.filename}`}
          theme="warning"
        >
          <p>
            Ce fichier provient d’une source extérieure et n’a pas été vérifié.
            Merci de l’analyser avec votre antivirus avant de l’ouvrir.
          </p>
        </ConfirmationModal>
      )}
    </div>
  );
};

FileInput.propTypes = {
  disabled: PropTypes.bool.isRequired,
  uploadedDocuments: PropTypes.arrayOf(
    PropTypes.shape({ type: PropTypes.string.isRequired })
  ).isRequired,
  documentsToUpload: PropTypes.arrayOf(
    PropTypes.shape({
      attachment: PropTypes.object.isRequired,
      type: PropTypes.string.isRequired,
      filename: PropTypes.string,
    })
  ).isRequired,
  documentType: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.node.isRequired,
  mimeTypes: PropTypes.string,
};

export default FileInput;
