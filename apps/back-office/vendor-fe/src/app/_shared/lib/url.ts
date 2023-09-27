import { useSearchParams } from 'next/navigation';
export function SearchParamsToObject(key = '') {
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);
    // Use Array.from to convert the entries to an array of key-value pairs
    const paramEntries = Array.from(params.entries());

    // Use Array.prototype.reduce to construct the paramsObject
    const paramsObject = paramEntries.reduce((acc, [paramKey, value]) => {
        acc[paramKey] = value;
        return acc;
    }, {});

    return key ? paramsObject[key] || '' : paramsObject;
}