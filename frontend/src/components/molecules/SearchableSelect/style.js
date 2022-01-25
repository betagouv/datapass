const style = {
  container: (provided) => ({
    ...provided,
    // add margin between label and input
    marginTop: '0.5rem',
  }),
  control: (provided, { isDisabled }) => ({
    // replace provided style with fr-select from DSFR
    display: 'block',
    appearance: 'none',
    width: '100%',
    borderRadius: '0.25rem 0.25rem 0 0',
    fontSize: '1rem',
    lineHeight: '1.5rem',
    padding: '0.5rem 2.5rem 0.5rem 1rem',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'calc(100% - 0.5rem) 50%',
    backgroundSize: '1.5rem 1.5rem',
    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 24 24' ><path fill='%23161616' d='M12,13.1l5-4.9l1.4,1.4L12,15.9L5.6,9.5l1.4-1.4L12,13.1z'/></svg>")`,
    color: isDisabled ? 'var(--text-disabled-grey)' : 'var(--text-title-grey)',
    '--blend': 'var(--background-contrast-grey-blend)',
    backgroundColor: 'var(--background-contrast-grey)',
    boxShadow: isDisabled
      ? 'inset 0 -2px 0 0 var(--border-disabled-grey)'
      : 'inset 0 -2px 0 0 var(--border-plain-grey)',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.7 : 1,
  }),
  valueContainer: (provided) => ({
    ...provided,
    // remove provided spacing
    padding: '0',
  }),
  input: (provided) => ({
    ...provided,
    // remove provided spacing
    margin: '0',
    padding: '0',
  }),
  singleValue: (provided) => ({
    ...provided,
    // remove provided spacing
    margin: '0',
  }),
  menu: (provided) => ({
    ...provided,
    // remove provided spacing
    marginTop: 0,
    borderRadius: '0',
  }),
  menuList: (provided) => ({
    ...provided,
    // remove provided spacing
    paddingTop: 0,
    paddingBottom: 0,
  }),
  option: (provided, { isSelected, isFocused }) => ({
    ...provided,
    // override blue color theme on interactions
    backgroundColor: isSelected
      ? 'var(--background-flat-grey)'
      : isFocused
      ? '#eee'
      : '#fff',
    ':active': {
      backgroundColor: '#eee',
    },
  }),
};

export default style;
