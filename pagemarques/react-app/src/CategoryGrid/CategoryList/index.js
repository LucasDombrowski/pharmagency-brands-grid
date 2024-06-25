import React from 'react';
import { useMediaQuery } from 'react-responsive';
import CategoryListItem from './CategoryListItem';
import clsx from 'clsx';
import ReactSelect from 'react-select';

export default function CategoryList(props) {
    const { params, categories, category, setCategory } = props;
    const isMobile = useMediaQuery({
        query: '(max-width: 800px)'
    });

    const options = categories.map(v => ({
        value: v.id,
        label: v.name
    }));

    function handleChange(selectedOption) {
        const selectedCategory = categories.find(v => v.id === selectedOption.value);
        setCategory(selectedCategory);
    }

    return (
        <div className={clsx(
            'w-full mb-8',
            !params.displayCategories && 'hidden'
        )} id='pagemarques-category-list'>
            {isMobile ? 
                <div className='w-full flex justify-center items-center'>
                    <ReactSelect 
                        id='pagemarques-category-select' 
                        options={options}
                        defaultValue={options.find(option => option.value === category.id)}
                        onChange={handleChange}
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                backgroundColor: params.secondaryColor,
                                color: params.primaryColor,
                                borderColor: params.primaryColor,
                                minWidth: '200px',
                                textAlign: 'center',
                            }),
                            singleValue: (provided) => ({
                                ...provided,
                                color: params.primaryColor
                            }),
                            menu: (provided) => ({
                                ...provided,
                                backgroundColor: "#F7F7F7",
                            }),
                            option: (provided, state) => ({
                                ...provided,
                                backgroundColor: state.isSelected ? "#4b4b4b20" : "#F7F7F7",
                                color: "black",
                                '&:hover': {
                                    backgroundColor: "#4b4b4b20",
                                }
                            }),
                            dropdownIndicator: (provided) => ({
                                ...provided,
                                color: params.primaryColor
                            }),
                            indicatorSeparator: (provided) => ({
                                ...provided,
                                backgroundColor: params.primaryColor
                            })
                        }}
                        className='text-base'
                    />
                </div> :
                <div className='w-full flex justify-center items-center flex-wrap'>
                    {categories.map(
                        v => <CategoryListItem 
                                key={v.id} 
                                {...v} 
                                active={v.id === category.id} 
                                onClick={() => setCategory(v)} 
                                {...params} 
                             />
                    )}
                </div>}
        </div>
    );
}
