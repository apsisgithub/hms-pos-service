export function flattenSeasonsData(data: any[]) {
    const flattenedData: any[] = [];

    const seasonMap = new Map();

    data.forEach((item) => {
        const {
            season_id,
            season_name,
            short_code,
            expiration_date,
            from_day,
            to_day,
            from_month,
            to_month,
            room_type_id,
            room_type_name,
            room_type_short_name,
        } = item;

        if (!seasonMap.has(season_id)) {
            seasonMap.set(season_id, {
                season_id,
                season_name,
                short_code,
                expiration_date,
                from_day,
                to_day,
                from_month,
                to_month,
                room_types: [],
            });
        }

        seasonMap.get(season_id).room_types.push({
            room_type_id,
            room_type_name,
            room_type_short_name,
        });
    });

    seasonMap.forEach((season) => flattenedData.push(season));

    return flattenedData;
}
