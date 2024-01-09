export function addSpacesToCamelCase(input: string): string {
  const spacedString = input.replace(/([a-z])([A-Z])/g, '$1 $2');

  return spacedString.charAt(0).toUpperCase() + spacedString.slice(1);
}
