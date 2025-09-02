import { HttpService } from "@nestjs/axios";
import { AxiosResponse } from "axios";
import { lastValueFrom } from "rxjs";
import { handleError } from "src/utils/handle-error.util";

export async function getCountryList(httpService: HttpService) {
    try {
        const url = process.env.COUNTRY_LIST_API;

        const response: AxiosResponse<
            Array<{ cca3: string; name: { common: string } }>
        > = await lastValueFrom(httpService.get(`${url}?fields=name,cca3`));

        const countries = response.data
            .map((country) => ({
                id: country.cca3,
                name: country.name.common,
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

        return countries;
    } catch (error) {
        console.error("error in get-country-list: ", error);
        handleError(error);
    }
}
