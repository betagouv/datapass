import { HelpIcon } from '../icons/fr-fi-icons';
import './style.css';

type Props = {
  title: string;
};

const Helper: React.FC<Props> = ({ title = '' }) => {
  let helperClass = 'helper';

  if (title.length > 140) {
    helperClass += ' helper-large';
  }
  return (
    <span title={title} className={helperClass}>
      <HelpIcon color={'var(--text-default-grey)'} />
    </span>
  );
};

export default Helper;
