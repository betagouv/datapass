import { AddCircleIcon } from '../../atoms/icons/fr-fi-icons';
import './style.css';

type CardHeadProps = {
  children: React.ReactNode;
};

export const CardHead: React.FC<CardHeadProps> = ({ children }) => (
  <div className="datapass_card_head">{children}</div>
);

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`datapass_card ${className}`}>{children}</div>
);

type AddCardProps = {
  onClick: React.MouseEventHandler<HTMLDivElement>;
  label?: string;
};

export const AddCard: React.FC<AddCardProps> = ({ onClick, label = '' }) => (
  <div className="datapass_card datapass_add_card" onClick={onClick}>
    <AddCircleIcon large />
    <div>{label}</div>
  </div>
);

type CardContainerProps = {
  children: React.ReactNode;
  flex?: boolean;
};

export const CardContainer: React.FC<CardContainerProps> = ({
  flex = true,
  children,
}) => (
  <div className={`datapass_card_container${flex ? '' : '_grid'}`}>
    {children}
  </div>
);

export default Card;
