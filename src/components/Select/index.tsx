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
                DropdownIndicator: ({ innerProps, isDisabled }) => (
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
                                stroke={isDisabled ? '#CBDEF433' :'#CBDEF4'}
                                strokeLinejoin='round'
                                strokeLinecap='round'
                            />
                        </svg>
                    </div>
                ),
                LoadingIndicator: () => <Loader size={16} color='#CBDEF433' />,
            }}
            styles={{
                control: (base, state) => ({
                    ...base,
                    minHeight: '36px',
                    height: '36px',
                    background: state.isDisabled ? '#3E8CCA1F' : '#3E8CCA33',
                    borderWidth: 0,
                    borderRadius: '4px',
                    boxShadow: state.isFocused ? '0 0 0 1px #CBDEF4' : 'none',
                    cursor: state.isDisabled ? 'default' : 'pointer',
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
                singleValue: (base, state) => ({
                    ...base,
                    margin: 0,
                    fontSize: '14px',
                    color: state.isDisabled ? '#CBDEF433' : '#CBDEF4',
                    fontWeight: 400,
                }),
                input: (provided, state) => ({
                    ...provided,
                    margin: '0px',
                    color: state.isDisabled ? '#CBDEF433' : '#CBDEF4',
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
                    color: '#CBDEF433',
                    fontSize: '14px',
                    fontWeight: 400,
                    marginLeft: 0,
                    marginRight: 0,
                }),
                menu: base => ({
                    ...base,
                    boxShadow: '2px 2px 10px rgba(0,0,0,0.2)',
                    background: '#153e5f',
                    borderRadius: '4px',
                    overflow: 'hidden',
                }),
                menuList: base => ({
                    ...base,
                    paddingTop: 0,
                    paddingBottom: 0,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '2px',
                    padding: '3px',
                }),
                option: (base, state) => ({
                    ...base,
                    background: state.isSelected ? '#FFFFFF' : state.isFocused ? '#3E8CCA33' : 'transparent',
                    fontSize: '14px',
                    fontWeight: 400,
                    padding: '6px 12px',
                    lineHeight: '20px',
                    wordBreak: 'break-word',
                    display: 'inline-flex',
                    alignItems: 'center',
                    width: 'auto',
                    borderRadius: '4px',
                    color: state.isSelected ? '#051C2E' : '#CBDEF4',
                    '&:active': {
                        background: '#FFFFFF',
                        color: '#051C2E',
                    },
                }),
                noOptionsMessage: (base) => ({
                    ...base,
                    fontSize: '14px',
                    color: '#CBDEF4',
                }),
            }}
        />
    )
}
