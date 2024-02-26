import {Listbox, Combobox, Icon} from '@shopify/polaris';
import {SearchIcon} from '@shopify/polaris-icons';
import {useState, useCallback, useMemo, useEffect} from 'react';

function ThemeAutocomplete({
    label = "Tags",
    optionType = "color",
    optionList = [],
    onChangeOption = (selected: string) => {}
}) {
  const deselectedOptions = useMemo(
    () => {
        switch(optionType) {
            case "color":
                return optionList.filter((option) => {
                    if(option.value.charAt(0) === "#") return option;
                });
            default:
                return [...optionList];
        } 
    },
    [optionList],
  );

  const [selectedOption, setSelectedOption] = useState<string | undefined>();
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState(deselectedOptions);

  useEffect(() => {
    const selectedColor = selectedOption?.split("::")[1] || "";
    onChangeOption(selectedColor);
  }, [selectedOption]);

  const escapeSpecialRegExCharacters = useCallback(
    (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    [],
  );

  const updateText = useCallback(
    (value: string) => {
      setInputValue(value);

      if (value === '') {
        setOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(escapeSpecialRegExCharacters(value), 'i');
      const resultOptions = deselectedOptions.filter((option) =>
        option.label.match(filterRegex),
      );
      setOptions(resultOptions);
    },
    [deselectedOptions, escapeSpecialRegExCharacters],
  );

  const updateSelection = useCallback(
    (selected: string) => {
      const matchedOption = options.find((option) => {
        const selectedOptionLabel = selected.split("::")[0];
        const selectedOptionValue = selected.split("::")[1];
        return option.value.match(selectedOptionValue) && 
                option.label.match(selectedOptionLabel);
      });
      console.log("selected", selected);
      setSelectedOption(selected);
      setInputValue((matchedOption && matchedOption.label) || '');
    },
    [options],
  );

  const optionsMarkup =
    options.length > 0
      ? options.map((option) => {
          const {label, value} = option;

          return (
            <Listbox.Option
              key={`${label}`}
              value={`${label}::${value}`}
              selected={selectedOption === `${label}::${value}`}
              accessibilityLabel={label}
            >
              {label}
            </Listbox.Option>
          );
        })
      : null;

  return (
    <div>
      <Combobox
        activator={
          <Combobox.TextField
            prefix={<Icon source={SearchIcon} />}
            onChange={updateText}
            label={label}
            labelHidden
            value={inputValue}
            placeholder="Search tags"
            autoComplete="off"
          />
        }
      >
        {options.length > 0 ? (
          <Listbox onSelect={updateSelection}>{optionsMarkup}</Listbox>
        ) : null}
      </Combobox>
    </div>
  );
}

export default ThemeAutocomplete;