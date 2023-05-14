import { type Dispatch, type SetStateAction } from "react";
import { TABS } from "~/utils/TABS";

interface Props {
  selectedTab: (typeof TABS)[number];
  setSelectedTab: Dispatch<SetStateAction<(typeof TABS)[number]>>;
}

export function Tabs({ selectedTab, setSelectedTab }: Props) {
  return (
    <div className="flex">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => setSelectedTab(tab)}
          className={`flex-grow p-2 hover:bg-gray-200 focus-visible:bg-gray-200
          ${
            tab === selectedTab ? "border-b-4 border-b-blue-500 font-bold" : ""
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
