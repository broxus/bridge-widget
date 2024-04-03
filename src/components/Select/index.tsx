import * as React from 'react'
import ReactSelect, { GroupBase, Props } from 'react-select'

export function Select<
    OptionType,
    IsMulti extends boolean = false,
    GroupType extends GroupBase<OptionType> = GroupBase<OptionType>,
>(props: Props<OptionType, IsMulti, GroupType>): JSX.Element {
    return (
        <ReactSelect
            {...props}
            components={{
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
            }}
            styles={{
                control: (base, state) => ({
                    ...base,
                    minHeight: '42px',
                    height: '42px',
                    background: '#fff',
                    borderColor: state.isFocused ? '#11a97c' : '#eee',
                    borderWidth: '2px',
                    borderRadius: '4px',
                    boxShadow: undefined,
                    cursor: state.isDisabled ? 'default' : 'pointer',
                    '&:hover': {
                        borderColor: undefined,
                    },
                }),
                valueContainer: base => ({
                    ...base,
                    height: '38px',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                }),
                singleValue: base => ({
                    ...base,
                    margin: 0,
                    fontSize: '16px',
                    color: '#000',
                    fontWeight: 400,
                }),
                input: provided => ({
                    ...provided,
                    margin: '0px',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: 400,
                }),
                indicatorSeparator: () => ({
                    display: 'none',
                }),
                indicatorsContainer: provided => ({
                    ...provided,
                    height: '38px',
                }),
                placeholder: base => ({
                    ...base,
                    color: '#999',
                    fontSize: '16px',
                    fontWeight: 400,
                    marginLeft: 0,
                    marginRight: 0,
                }),
                menu: base => ({
                    ...base,
                    boxShadow: 'inset 0 0 0 2px #eee',
                    background: '#fff',
                    borderRadius: '4px',
                }),
                menuList: base => ({
                    ...base,
                    paddingTop: 0,
                    paddingBottom: 0,
                }),
                option: (base, state) => ({
                    ...base,
                    background: state.isSelected ? '#11a97c' : state.isFocused ? '#eee' : 'transparent',
                    fontSize: '16px',
                    fontWeight: 400,
                    '&:active': {
                        background: state.isSelected ? '#11a97c' : '#eee',
                    },
                    '&:first-of-type': {
                        borderRadius: '4px 4px 0 0',
                    },
                    '&:last-of-type': {
                        borderRadius: '0 0 4px 4px',
                    },
                }),
            }}
        />
    )
}
