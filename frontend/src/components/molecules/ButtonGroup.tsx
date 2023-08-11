type Props = {
  align: string;
  children: React.ReactNode;
  className?: string;
};

export const ButtonGroup: React.FC<Props> = ({
  align = '',
  children,
  className = '',
}) => {
  className +=
    ' fr-btns-group fr-btns-group--inline-lg fr-btns-group--icon-left';

  if (align) {
    className += ` fr-btns-group--${align}`;
  }
  return <div className={className}>{children}</div>;
};

export default ButtonGroup;
