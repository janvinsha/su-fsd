import { SetStateAction, useEffect, useState } from "react";

interface CsvListItem {
  id: string;
  createdAt: string;
  name: string;
}

export default function Home() {
  const [csvList, setCsvList] = useState<CsvListItem[] | null>(null);
  const [sortBy, setSortBy] = useState<string>("createdAt");

  const fetchCsvList = async () => {
    const response = await fetch(`api/csv?sortBy=${sortBy}`);
    const data: CsvListItem[] = await response.json();
    setCsvList(data);
    console.log(data);
  };

  useEffect(() => {
    fetchCsvList();
  }, [sortBy]);

  const selectOnChange = (e: { target: { value: SetStateAction<string> } }) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="flex flex-col gap-[3rem] md:gap-[5rem] items-center py-[5rem] w-full">
      <select
        name="lists"
        id="lists"
        className="border p-2 rounded-lg"
        onChange={selectOnChange}
      >
        <option value="createdAt">Sort by created at</option>
        <option value="asc">Sort by ascending</option>
        <option value="desc">Sort by descending</option>
      </select>
      <div className="grid grid-cols-2 gap-5 md:gap-[4rem] ">
        {csvList?.map((list, index) => (
          <div
            className="container flex flex-col w-[10rem] border p-2 md:w-[15rem] rounded-lg"
            key={list.id + index}
          >
            <p className="text-xs">{list.createdAt}</p>
            <p className="text-sm">{list.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
