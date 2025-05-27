interface Option {
  id: string;
  name: string;
}

interface PrimarySelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  isCategory?: boolean;
}

const PrimarySelect = ({ label, value, onChange, options, isCategory }: PrimarySelectProps) => {
  return (
    <div className="relative w-full max-w-xs">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-4 pr-10 text-gray-700 bg-white border border-gray-300 appearance-none focus:outline-none"
      >
        <option value="">{label}</option>
        {options.map((opt) =>
          isCategory ? (
            <option key={opt.id} value={opt.name}>
              {opt.name}
            </option>
          ) : (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          )
        )}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default PrimarySelect;
