import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AutoComplete, Button, Space } from "antd";

import { AppDispatch, RootState } from "../../store";
import { clearMap, searchLocation, setLocation } from "../../store/mapSlice";

const Search = () => {
  const { options } = useSelector((state: RootState) => state.map);
  const [value, setValue] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();

  const debouncedSearch = useRef(
    debounce((q) => {
      dispatch(searchLocation(q));
    }, 300)
  ).current;

  useEffect(() => {
    if (value.length >= 3) {
      debouncedSearch(value);
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [value]);

  const onSearchChange = (e: string) => {
    setValue(e);
  };

  const onReset = () => {
    setValue("");
    dispatch(clearMap());
  };

  const onSelect = (e: string) => {
    const parsedLocValue = JSON.parse(e);
    setValue(parsedLocValue.label);
    dispatch(
      setLocation({
        latitude: parsedLocValue.latitude,
        longitude: parsedLocValue.longitude,
      })
    );
  };

  return (
    <Space className="searchcomponent">
      <AutoComplete
        value={value}
        options={options}
        style={{ width: 240 }}
        onSelect={onSelect}
        onSearch={onSearchChange}
        className="dropdown"
        placeholder="Enter Location... (3 character min.)"
      />
      <Button type="primary" onClick={onReset}>
        Reset
      </Button>
    </Space>
  );
};

export default Search;
