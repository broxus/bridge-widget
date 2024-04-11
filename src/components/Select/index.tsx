import { Loader } from '@/components/Loader'
import * as React from 'react'
import ReactSelect, { GroupBase } from 'react-select'
import ReactSelectCreatable, { CreatableProps } from 'react-select/creatable'

export function Select<
    OptionType,
    IsMulti extends boolean = false,
    GroupType extends GroupBase<OptionType> = GroupBase<OptionType>,
>(props: CreatableProps<OptionType, IsMulti, GroupType>): JSX.Element {
    const SelectElement = props.onCreateOption ? ReactSelectCreatable : ReactSelect
    return (
        <SelectElement
            {...props}
            components={{
                ...props.components,
                IndicatorSeparator: null,
                DropdownIndicator: ({ isFocused, innerProps }) => (
                    <div
                        {...innerProps}
                        style={{ paddingRight: '12px' }}
                    >
                        <svg
                            width='12'
                            height='12'
                            viewBox='0 0 12 12'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path
                                d='M2 4.5L6 8.5L10 4.5'
                                stroke={isFocused ? '#11a97c' : '#999'}
                                strokeLinejoin='round'
                                strokeLinecap='round'
                            />
                        </svg>
                    </div>
                ),
                LoadingIndicator: () => <Loader size={16} />,
            }}
            styles={{
                control: (base, state) => ({
                    ...base,
                    minHeight: '36px',
                    height: '36px',
                    background: '#fff',
                    borderWidth: 0,
                    borderRadius: '4px',
                    boxShadow: state.isFocused ? '0 0 0 2px #11a97c' : 'inset 0 0 0 1px #eee',
                    cursor: state.isDisabled ? 'default' : 'pointer',
                    opacity: state.isDisabled ? 0.4 : 1,
                    '&:hover': {
                        borderColor: undefined,
                    },
                }),
                valueContainer: base => ({
                    ...base,
                    height: '32px',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                }),
                singleValue: base => ({
                    ...base,
                    margin: 0,
                    fontSize: '14px',
                    color: '#000',
                    fontWeight: 400,
                }),
                input: provided => ({
                    ...provided,
                    margin: '0px',
                    color: '#000',
                    fontSize: '14px',
                    fontWeight: 400,
                }),
                indicatorSeparator: () => ({
                    display: 'none',
                }),
                indicatorsContainer: provided => ({
                    ...provided,
                    height: '34px',
                    gap: '12px',
                }),
                placeholder: base => ({
                    ...base,
                    color: '#999',
                    fontSize: '14px',
                    fontWeight: 400,
                    marginLeft: 0,
                    marginRight: 0,
                }),
                menu: base => ({
                    ...base,
                    boxShadow: 'inset 0 0 0 1px #eee',
                    background: '#fff',
                    borderRadius: '4px',
                    overflow: "hidden",
                }),
                menuList: base => ({
                    ...base,
                    paddingTop: 0,
                    paddingBottom: 0,
                }),
                option: (base, state) => ({
                    ...base,
                    background: state.isSelected ? '#11a97c' : state.isFocused ? '#eee' : 'transparent',
                    fontSize: '14px',
                    fontWeight: 400,
                    padding: '9px 12px',
                    lineHeight: '20px',
                    wordBreak: 'break-word',
                    display: "inline-flex",
                    alignItems: "center",
                    width: "auto",
                    borderRadius: "2px",
                    '&:active': {
                        background: state.isSelected ? '#11a97c' : '#eee',
                    },
                }),
                noOptionsMessage: (base) => ({
                    ...base,
                    fontSize: '14px',
                }),
            }}
        />
    )
}
