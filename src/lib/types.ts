import { CSSProperties } from "styled-components";

export type SelectComponentRenderItemFnProps = {
  item: any;
  selected: boolean;
  disabled: boolean;
};

export type OptionRenderPropertyFnProps = {
  item: any;
};

export type CustomCounterFnProps = {
  selectedItems: any[];
  onItemClick?: (item: any) => void;
};

export type CustomClearButtonFnProps = {
  onClick: (e: React.MouseEvent) => void;
  value: string;
};

export type CustomConfirmButtonFnProps = {
  onSubmit: (selectedItems: any[]) => void;
  isDisabled: boolean;
};

export type CustomInputFnProps = {
  onChange: (newValue: string) => void;
};

export type SelectionChangeFnProps = {
  selectedItems: any[];
  valid: boolean;
};

export type InputEventProps = {
  customClearButton?: ({
    onClick,
    value,
  }: CustomClearButtonFnProps) => JSX.Element;
};

export type InputComponentProps = InputEventProps & {
  placeholder?: string;
  onChange: (value: string) => void;
};

export type OptionEventProps = {
  renderItem?: (params: SelectComponentRenderItemFnProps) => JSX.Element;
};

export type OptionComponentProps = OptionEventProps & {
  item: any;
  isDisabled?: boolean;
  onSelected: (item: any) => void;
};

export type SelectCustomCSSProps = {
  container?: CSSProperties
  list?: CSSProperties
}

export type SelectEventProps = InputEventProps &
  OptionEventProps & {
    customInput?: ({ onChange }: CustomInputFnProps) => JSX.Element;
    customCounter?: ({
      selectedItems,
      onItemClick,
    }: CustomCounterFnProps) => JSX.Element;
    customConfirmButton?: ({
      onSubmit,
      isDisabled,
    }: CustomConfirmButtonFnProps) => JSX.Element;
    onSelectionChange?: ({
      selectedItems,
      valid,
    }: SelectionChangeFnProps) => void;
    searchFunction: (query: string) => Promise<any[]>;
    onItemSelected?: (selectedItem: any) => void;
    itemKeyFunction?: (item: any) => string;
  };

export type SelectComponentProps = SelectEventProps & {
  customCSS?: SelectCustomCSSProps;
  selectionMax?: number;
  selectionMin?: number;
  customLoader?: JSX.Element;
  showDefaultLoader?: boolean;
  searchDebounce?: number;
  inputPlaceholder?: string;
};

export type ConfirmComponentProps = {
  label?: string;
  isDisabled?: boolean;
  onSubmit: () => void;
};
