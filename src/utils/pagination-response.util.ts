interface PaginationOptions<T> {
    data: T[];
    total: number;
    page?: number;
    limit?: number;
}

export function paginationResponse<T>({
    data,
    total,
    page = 1,
    limit,
}: PaginationOptions<T>) {
    if (!limit) {
        return {
            data,
            pagination: null,
        };
    }

    const pageCount = Math.ceil(total / (limit || 1));

    return {
        data,
        pagination: {
            total,
            page,
            page_count: pageCount,
            next_page: page < pageCount ? page + 1 : null,
            previous_page: page > 1 ? page - 1 : null,
            limit,
        },
    };
}
