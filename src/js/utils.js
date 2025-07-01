export function toObject(obj) {
    return obj instanceof Map ? Object.fromEntries(
        Array.from(obj, ([key, value]) => [
            key,
            value instanceof Map ? toObject(value) :
            Array.isArray(value) ? value.map(v => v instanceof Map ? toObject(v) : v) :
            value
        ])
    ) : obj;
}
