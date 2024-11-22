export function hashString(input: string, length: number): string {
    const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charsLength = chars.length;
    let hash = 0;

    for (let i = 0; i < input.length; i++) {
        hash = (hash << 5) - hash + input.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }

    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars[Math.abs(hash + i) % charsLength];
    }

    return result;
}
