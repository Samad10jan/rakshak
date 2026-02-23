"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  onFilter: (date: string | null) => void;
};

export default function DateFilter({ onFilter }: Props) {
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    if (selectedDate) {
      onFilter(selectedDate);
    } else {
      onFilter(null);
    }
  }, [selectedDate, onFilter]);

  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-4 sm:items-end">
      <div className="flex flex-col w-full sm:w-auto">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Search by Date
        </label>
        <input
        title="date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <Button
        variant="outline"
        onClick={() => {
          setSelectedDate("");
          onFilter(null);
        }}
        className="w-full sm:w-auto"
      >
        Clear Filter
      </Button>
    </div>
  );
}