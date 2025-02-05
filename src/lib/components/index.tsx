import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { SelectComponentProps } from "../types";
import { getItemIndex, isItemInList } from "../utils";
import AutocompleteMultiselectInput from "./AutocompleteMultiselectInput";
import AutocompleteMultiselectLoader from "./AutocompleteMultiselectLoader";
import AutocompleteMultiselectOption from "./AutocompleteMultiselectOption";
import * as S from "./styles";

const onSearch$ = new Subject();

const AutocompleteMultiselect: React.FC<SelectComponentProps> = ({
  customCSS,
  customLoader,
  showDefaultLoader,
  searchDebounce,
  selectionMin = -1,
  selectionMax = -1,
  inputPlaceholder,
  customInput,
  customCounter,
  customClearButton,
  onSelectionChange,
  searchFunction,
  itemKeyFunction,
  renderItem,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSelectingDisabled, setSelectingDisabled] = useState<boolean>(false);

  const [showingItems, setShowingItems] = useState<any[]>([]);
  const [availableItems, setAvailableItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  const getItemKey = useCallback(
    (item: any) =>
      itemKeyFunction ? itemKeyFunction(item) : JSON.stringify(item),
    [itemKeyFunction]
  );

  const doSearch = useCallback(
    async (searchValue: string) => {
      if (!searchValue) {
        setAvailableItems([]);
      } else {
        setIsLoading(true);
        try {
          const _remap = (el: any) => ({ ...el, _key: getItemKey(el) });
          const httpList = await searchFunction(searchValue).then(
            (list: any[]) => list.map(_remap)
          );
          setAvailableItems(httpList);
        } catch (e) {
          console.error(e);
          setAvailableItems([]);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [searchFunction, setIsLoading, getItemKey]
  );

  useEffect(() => {
    const debounceMs = searchDebounce || 300;
    const searchSubscription = onSearch$
      .pipe(debounceTime(debounceMs))
      .subscribe((value) => doSearch(value as string));

    return () => {
      searchSubscription.unsubscribe();
    };
  }, [searchDebounce, doSearch]);

  useEffect(() => {
    const mappedItems = availableItems.map((item: any) => {
      const alreadySelected = isItemInList(selectedItems, item);
      return {
        ...item,
        _selected: alreadySelected,
      };
    });
    setShowingItems(mappedItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableItems]);

  useEffect(() => {
    const howManySelected = selectedItems.length;
    let isSelectionValid = false;
    if (selectionMax === -1) {
      isSelectionValid = howManySelected >= selectionMin;
    } else if (selectionMin === -1) {
      isSelectionValid = howManySelected > 0;
    } else if (selectionMin > -1 && selectionMax > -1) {
      isSelectionValid =
        howManySelected >= selectionMin && howManySelected <= selectionMax;
    }

    const disableSelect = selectionMax > -1 && howManySelected === selectionMax;
    setSelectingDisabled(disableSelect);
    if (onSelectionChange && typeof onSelectionChange === "function")
      onSelectionChange({ selectedItems, valid: isSelectionValid });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems, selectionMax, selectionMin]);

  const onInputChange = (value: string) => onSearch$.next(value);

  const updateSelectedItems = (itemIndex: number) => {
    const newSelectedItems = selectedItems.slice();
    const targetItem = showingItems[itemIndex];
    targetItem._selected = !targetItem._selected;
    if (targetItem._selected) {
      setSelectedItems([...newSelectedItems, targetItem]);
    } else {
      const indexOfSelectedItem = newSelectedItems.indexOf(targetItem);
      newSelectedItems.splice(indexOfSelectedItem, 1);
      setSelectedItems(newSelectedItems);
    }
  };

  const onItemSelected = (item: any) => {
    const newItems = showingItems.slice();
    const itemIndex = getItemIndex(newItems, item);
    updateSelectedItems(itemIndex);
  };

  const itemsList = !showingItems.length
    ? null
    : showingItems.map((item: any) => (
        <AutocompleteMultiselectOption
          key={item._key}
          item={item}
          isDisabled={isSelectingDisabled}
          renderItem={renderItem}
          onSelected={onItemSelected}
        />
      ));

  const selectCounter = useMemo(() => {
    if (customCounter && typeof customCounter === "function")
      return customCounter({ selectedItems, onItemClick: onItemSelected });
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems, customCounter]);

  const selectLoader: JSX.Element | null = useMemo(() => {
    if (!customLoader && !showDefaultLoader) return null;
    return customLoader ? customLoader : null;
  }, [customLoader, showDefaultLoader]);

  // customInput

  const defaultInput: JSX.Element = useMemo(() => {
    return (
      <AutocompleteMultiselectInput
        onChange={onInputChange}
        customClearButton={customClearButton}
        placeholder={inputPlaceholder}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customClearButton]);

  const selectInput: JSX.Element = useMemo(() => {
    if (customInput && typeof customInput === "function")
      return customInput({ onChange: onInputChange });
    return defaultInput;
  }, [defaultInput, customInput]);

  const selectOptions = isLoading ? (
    selectLoader
  ) : (
    <S.OptionsWrapper style={customCSS?.list || {}}>
      {itemsList}
    </S.OptionsWrapper>
  );

  return (
    <S.Wrapper style={customCSS?.container || {}}>
      {selectInput}
      {selectCounter}
      {selectOptions}
    </S.Wrapper>
  );
};

AutocompleteMultiselect.defaultProps = {
  customCSS: {
    container: {},
    list: {},
  },
  customLoader: <AutocompleteMultiselectLoader />,
  showDefaultLoader: true,
  searchDebounce: 300,
  selectionMin: -1,
  selectionMax: -1,
  inputPlaceholder: "Write something here...",
};

export default AutocompleteMultiselect;
