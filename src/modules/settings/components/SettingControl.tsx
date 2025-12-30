import React from 'react';
import { SettingItem } from '../types';

interface SettingControlProps {
  setting: SettingItem;
  value: any;
  onChange: (id: string, value: any) => void;
}

export const SettingControl: React.FC<SettingControlProps> = ({ setting, value, onChange }) => {
  const currentValue = value ?? setting.defaultValue;

  switch (setting.type) {
    case 'toggle':
      return (
        <button
          onClick={() => onChange(setting.id, !currentValue)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            currentValue ? 'bg-indigo-600' : 'bg-zinc-300 dark:bg-zinc-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              currentValue ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      );

    case 'select':
      return (
        <select
          value={currentValue}
          onChange={e => onChange(setting.id, e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          {setting.options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );

    case 'text':
      return (
        <input
          type="text"
          value={currentValue}
          onChange={e => onChange(setting.id, e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-48"
          placeholder={setting.label}
        />
      );

    case 'number':
      return (
        <input
          type="number"
          value={currentValue}
          onChange={e => onChange(setting.id, parseInt(e.target.value) || 0)}
          className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-24"
        />
      );

    case 'radio':
      return (
        <div className="flex gap-4">
          {setting.options?.map(option => (
            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={setting.id}
                value={option.value}
                checked={currentValue === option.value}
                onChange={e => onChange(setting.id, e.target.value)}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      );

    default:
      return null;
  }
};
