import React from 'react';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export default function Table({ headers, children }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead className="sticky top-0 z-10 bg-surface-container-low">
          <tr className="border-b border-outline-variant/60">
            {headers.map((label) => (
              <th
                key={label}
                className={`text-on-surface-variant py-3 px-3 font-semibold uppercase tracking-wider text-[10px] ${label === 'Actions' ? 'text-right' : ''}`}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/30">{children}</tbody>
      </table>
    </div>
  );
}
