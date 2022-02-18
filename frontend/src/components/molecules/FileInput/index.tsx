import React, {
  ChangeEventHandler,
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import { uniqueId } from 'lodash';
import DownloadButton from './DownloadButton';
import FileInput from './FileInput';

export type DocumentToUpload = { attachment: File; type: string };

export type Document = {
  id: number;
  created_at: string;
  updated_at: string;
  attachment: {
    url: string;
  };
  type: string;
  filename: string;
};

type Props = {
  label: string;
  documentType: string;
  disabled: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  mimeTypes: string;
  meta?: string;
  documentsToUpload: [DocumentToUpload] | [];
  uploadedDocuments: [Document] | [];
};

const Index: FunctionComponent<Props> = ({
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

  const onReplaceFile = () => {
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
          onChange={onChange}
          meta={meta}
          mimeTypes={mimeTypes}
          documentsToUpload={documentsToUpload}
        />
      )}
    </div>
  );
};

export default Index;
