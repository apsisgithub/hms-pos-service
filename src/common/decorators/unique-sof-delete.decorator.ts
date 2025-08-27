import { Index, IndexOptions } from "typeorm";

export function UniqueSoftDelete(columns: string[], name?: string) {
    const indexColumns = [...columns, "status"]; ///removed deleted_at -_- doesnt work
    const options: IndexOptions = { unique: true };

    if (name) {
        return Index(name, indexColumns, options);
    }
    return Index(indexColumns, options);
}
