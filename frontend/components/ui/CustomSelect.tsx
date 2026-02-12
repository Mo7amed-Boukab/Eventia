import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface CustomSelectProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    className?: string;
    buttonClassName?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
    options,
    value,
    onChange,
    placeholder,
    className = "",
    buttonClassName = "",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between gap-3 px-4 py-2.5 bg-white border border-gray-200 rounded text-sm font-medium text-gray-700 w-full hover:border-[#C5A059] transition-all focus:outline-none focus:ring-1 focus:ring-[#C5A059]/20 ${buttonClassName}`}
            >
                <span className={`truncate ${value ? "text-gray-900" : "text-gray-500"}`}>
                    {value || placeholder}
                </span>
                <ChevronDown
                    size={16}
                    className={`text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-100 rounded shadow-2xl z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-300">
                    <button
                        type="button"
                        onClick={() => {
                            onChange("");
                            setIsOpen(false);
                        }}
                        className={`w-full text-left px-4 h-full flex items-center text-sm text-gray-400 hover:bg-gray-50 hover:text-[#C5A059] transition-colors italic border-b border-gray-50 mb-1 ${buttonClassName.includes('!py-3') ? 'py-3' : 'py-2.5'}`}
                    >
                        Toutes les options
                    </button>
                    {options.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 h-full flex items-center text-sm text-gray-700 hover:bg-gray-50 hover:text-[#C5A059] transition-colors ${buttonClassName.includes('!py-3') ? 'py-3' : 'py-2.5'}`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
