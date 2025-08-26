import { Request } from "express";
import { JwtPayloadInterface } from "../types/jwt-payload.interface";
import { DataSource } from "typeorm";

// Extend Express Request interface to include user property
interface AuthenticatedRequest extends Request {
    user?: JwtPayloadInterface;
}

let currentRequest: AuthenticatedRequest | null = null;
let dataSource: DataSource;

export const setRequest = (req: AuthenticatedRequest) => {
    currentRequest = req;
};

export const setDataSource = (ds: DataSource) => {
    dataSource = ds;
};

export const getRequest = (): AuthenticatedRequest => {
    if (!currentRequest) {
        throw new Error("Request is not set yet!");
    }
    return currentRequest;
};

export const getUser = (): JwtPayloadInterface | null => {
    const request = getRequest();
    return request?.user || null;
};

export const getCurrentUser = <T extends keyof JwtPayloadInterface>(
    returnKey?: T
): JwtPayloadInterface[T] | JwtPayloadInterface | null => {
    const user = getRequest().user || null;

    if (returnKey && user) {
        return user[returnKey];
    }

    return user;
};
