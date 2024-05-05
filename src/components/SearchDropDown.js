import * as React from 'react';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';

export  function SearchDropDown({ options, onChange }) {
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onChange(newValue);
  };

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleRemoveOption = (option) => () => {
    const newValue = value.filter((val) => val !== option);
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <Autocomplete
      multiple
      id="tags-outlined"
      options={options}
      value={value}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            key={index}
            label={option}
            onDelete={handleRemoveOption(option)}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
         
          placeholder="Role"
        />
      )}
    />
  );
}


