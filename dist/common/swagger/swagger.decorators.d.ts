import { Type } from '@nestjs/common';
export declare function ApiOkResponseBase<TModel extends Type<unknown>>(type?: TModel): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export declare function ApiCreatedResponseBase<TModel extends Type<unknown>>(type?: TModel): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export declare function ApiBadRequestBase(): MethodDecorator & ClassDecorator;
export declare function ApiUnauthorizedBase(): MethodDecorator & ClassDecorator;
export declare function ApiForbiddenBase(): MethodDecorator & ClassDecorator;
export declare function ApiNotFoundBase(): MethodDecorator & ClassDecorator;
