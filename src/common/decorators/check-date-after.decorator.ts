// custom-validators.ts (or similar file)
import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from "class-validator";

export function IsDateAfter(
    property: string,
    validationOptions?: ValidationOptions
) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isDateAfter",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[
                        relatedPropertyName
                    ];
                    if (!relatedValue || !value) {
                        return true;
                    }
                    return new Date(value) > new Date(relatedValue);
                },
                defaultMessage(args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    return `${args.property} must be after ${relatedPropertyName}`;
                },
            },
        });
    };
}
