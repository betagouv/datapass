import React, {
  ChangeEventHandler,
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import { isEmpty, uniqueId } from 'lodash';
import DownloadButton from './DownloadButton';
import FileInput, { FileInputProps } from './FileInput';

export type DocumentToUpload = { attachment: File; type: string };

interface IndexProps extends FileInputProps {
  uploadedDocuments: LocalDocument[];
  disabled?: boolean;
}

const Index: FunctionComponent<IndexProps> = ({
  label,
  meta,
  mimeTypes = '.pdf, application/pdf',
  disabled,
  uploadedDocuments = [],
  documentsToUpload = [],
  documentType,
  onChange,
}) => {
  const [id] = useState(uniqueId(documentType));
  const [showDownloadButton, setShowDownloadButton] = useState(false);

  useEffect(() => {
    setShowDownloadButton(
      uploadedDocuments.some(({ type }) => type === documentType) &&
        !documentsToUpload.some(({ type }) => type === documentType)
    );
  }, [uploadedDocuments, documentType, documentsToUpload]);

  const onFileChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { files, name },
  }) => {
    const updatedDocumentsToUpload = documentsToUpload.filter(
      ({ type }) => type !== documentType
    );

    if (!isEmpty(files)) {
      updatedDocumentsToUpload.push({
        type: name,
        // @ts-ignore
        attachment: files[0],
      });
    }

    return onChange({
      target: {
        name: 'documents_attributes',
        // @ts-ignore
        value: updatedDocumentsToUpload,
      },
    });
  };

  const onReplaceFile = () => {
    const uploadedDocumentsWithoutThisDocument = uploadedDocuments.filter(
      ({ type }) => type !== documentType
    );
    onChange({
      target: {
        name: 'documents',
        // @ts-ignore
        value: uploadedDocumentsWithoutThisDocument,
      },
    });
    const updatedDocumentsToUpload = [
      ...documentsToUpload,
      {
        type: documentType,
        id: uploadedDocuments.find(({ type }) => type === documentType)?.id,
        _destroy: '1',
      },
    ];
    onChange({
      target: {
        name: 'documents_attributes',
        // @ts-ignore
        value: updatedDocumentsToUpload,
      },
    });
    setShowDownloadButton(false);
  };

  return (
    <div className="fr-upload-group">
      {showDownloadButton ? (
        <DownloadButton
          id={id}
          label={label}
          disabled={disabled}
          onReplaceFile={onReplaceFile}
          uploadedDocuments={uploadedDocuments}
          documentType={documentType}
        />
      ) : (
        <FileInput
          id={id}
          label={label}
          documentType={documentType}
          disabled={disabled}
          onChange={onFileChange}
          meta={meta}
          mimeTypes={mimeTypes}
          documentsToUpload={documentsToUpload}
        />
      )}
    </div>
  );
};

export default Index;
