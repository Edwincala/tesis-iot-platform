export function parseId(param: string | string[] | undefined): number | null {
    if (typeof param !== 'string') {
        return null;
    }
    const id = parseInt(param);
    return isNaN(id) ? null : id;
}