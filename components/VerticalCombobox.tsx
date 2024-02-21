import {
    InlineStack,
    Tag,
    Listbox,
    EmptySearchResult,
    Combobox,
    Text,
    AutoSelection,
  } from '@shopify/polaris';
  import {useState, FC, useCallback, useMemo} from 'react';
  
  const MultiselectTagCombobox: FC<{ 
    selectedTags: string[]; 
    onChange: (selection: string) => void;
  }> = ({ 
    selectedTags,
    onChange
  }) => {
    const [value, setValue] = useState('');
    const [suggestion, setSuggestion] = useState('');
  
    const handleActiveOptionChange = useCallback(
      (activeOption: string) => {
        const activeOptionIsAction = activeOption === value;
  
        if (!activeOptionIsAction && !selectedTags.includes(activeOption)) {
          setSuggestion(activeOption);
        } else {
          setSuggestion('');
        }
      },
      [value, selectedTags],
    );
    const updateSelection = useCallback(
      (selected: string) => {
        onChange(selected);
        // const nextSelectedTags = new Set([...selectedTags]);
  
        // if (nextSelectedTags.has(selected)) {
        //   nextSelectedTags.delete(selected);
        // } else {
        //   nextSelectedTags.add(selected);
        // }
        // setSelectedTags([...Array.from(nextSelectedTags)]);
        setValue('');
        setSuggestion('');
      },
      [selectedTags],
    );
  
    const removeTag = useCallback(
      (tag: string) => () => {
        updateSelection(tag);
      },
      [updateSelection],
    );
  
    const getAllTags = useCallback(() => {
      const savedTags = ['Rustic', 'Antique', 'Vinyl', 'Vintage', 'Refurbished'];
      return [...Array.from(new Set([...savedTags, ...selectedTags].sort()))];
    }, [selectedTags]);
  
    const formatOptionText = useCallback(
      (option: string) => {
        const trimValue = value.trim().toLocaleLowerCase();
        const matchIndex = option.toLocaleLowerCase().indexOf(trimValue);
  
        if (!value || matchIndex === -1) return option;
  
        const start = option.slice(0, matchIndex);
        const highlight = option.slice(matchIndex, matchIndex + trimValue.length);
        const end = option.slice(matchIndex + trimValue.length, option.length);
  
        return (
          <p>
            {start}
            <Text fontWeight="bold" as="span">
              {highlight}
            </Text>
            {end}
          </p>
        );
      },
      [value],
    );
  
    const escapeSpecialRegExCharacters = useCallback(
      (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      [],
    );
  
    const options = useMemo(() => {
      let list;
      const allTags = getAllTags();
      const filterRegex = new RegExp(escapeSpecialRegExCharacters(value), 'i');
  
      if (value) {
        list = allTags.filter((tag) => tag.match(filterRegex));
      } else {
        list = allTags;
      }
  
      return [...list];
    }, [value, getAllTags, escapeSpecialRegExCharacters]);
  
    const verticalContentMarkup =
      selectedTags.length > 0 ? (
        <InlineStack gap="200" align="end">
          {selectedTags.map((tag) => (
            <Tag key={`option-${tag}`} onRemove={removeTag(tag)}>
              {tag}
            </Tag>
          ))}
        </InlineStack>
      ) : null;
  
    const optionMarkup =
      options.length > 0
        ? options.map((option) => {
            return (
              <Listbox.Option
                key={option}
                value={option}
                selected={selectedTags.includes(option)}
                accessibilityLabel={option}
              >
                <Listbox.TextOption selected={selectedTags.includes(option)}>
                  {formatOptionText(option)}
                </Listbox.TextOption>
              </Listbox.Option>
            );
          })
        : null;
  
    const noResults = value && !getAllTags().includes(value);
  
    const actionMarkup = noResults ? (
      <Listbox.Action value={value}>{`Add "${value}"`}</Listbox.Action>
    ) : null;
  
    const emptyStateMarkup = optionMarkup ? null : (
      <EmptySearchResult
        title=""
        description={`No tags found matching "${value}"`}
      />
    );
  
    const listboxMarkup =
      optionMarkup || actionMarkup || emptyStateMarkup ? (
        <Listbox
          autoSelection={AutoSelection.None}
          onSelect={updateSelection}
          onActiveOptionChange={handleActiveOptionChange}
        >
          {actionMarkup}
          {optionMarkup}
        </Listbox>
      ) : null;
  
    return (
      <div className="flex-1">
        <Combobox
          allowMultiple
          activator={
            <Combobox.TextField
              autoComplete="off"
              label="Search tags"
              labelHidden
              value={value}
              suggestion={suggestion}
              placeholder="Search tags"
              verticalContent={verticalContentMarkup}
              onChange={setValue}
              align="right"
            />
          }
        >
          {listboxMarkup}
        </Combobox>
      </div>
    );
  }

  export default MultiselectTagCombobox;