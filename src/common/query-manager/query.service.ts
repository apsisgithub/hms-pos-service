import { QueryRunner } from "typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseManager } from "src/config/db";
import { getCurrentUser } from "../utils/user.util";

type FindOptions = {
    order?: any;
    limit?: number;
    offset?: number;
};

export class TransactionService {
    constructor(private readonly queryRunner: QueryRunner) {}

    async startTransaction() {
        await this.queryRunner.startTransaction();
    }

    async commitTransaction() {
        await this.queryRunner.commitTransaction();
    }

    async rollbackTransaction() {
        await this.queryRunner.rollbackTransaction();
    }

    async release() {
        await this.queryRunner.release();
    }

    async upsert(entity: any, data: any, where: any) {
        const existingRecord = await this.queryRunner.manager.findOne(
            entity,
            where
        );
        if (existingRecord) {
            return await this.queryRunner.manager.update(entity, where, data);
        } else {
            const result = this.queryRunner.manager.create(entity, data);
            return await this.queryRunner.manager.save(result);
        }
    }

    async save(entity: any, data: any) {
        const result = this.queryRunner.manager.create(entity, data);
        return await this.queryRunner.manager.save(result);
    }

    async update(entity: any, where: any, data: any) {
        const existingData = await this.queryRunner.manager.findOne(entity, {
            where,
        });

        if (!existingData) {
            throw new NotFoundException("item not found");
        }

        const merged = this.queryRunner.manager.merge(
            entity,
            existingData,
            data
        );

        return await this.queryRunner.manager.save(merged);
    }

    async find(entity, where?: any, options?: FindOptions) {
        return await this.queryRunner.manager.find(entity, {
            where,
            order: options?.order,
            take: options?.limit,
            skip:
                options?.offset && options?.limit
                    ? (options.offset - 1) * options.limit
                    : undefined,
        });
    }

    async findAndCount(entity, where = undefined, options?: FindOptions) {
        return await this.queryRunner.manager.findAndCount(entity, {
            where,
            order: options?.order,
            take: options?.limit,
            skip:
                options?.offset && options?.limit
                    ? (options.offset - 1) * options.limit
                    : undefined,
        });
    }

    async softDelete(entity, where, dataToUpdate = {}) {
        const existingData = await this.queryRunner.manager.findOne(entity, {
            where,
        });

        if (!existingData) {
            throw new NotFoundException("item not found to be deleted");
        }

        const merged = this.queryRunner.manager.merge(entity, existingData, {
            ...dataToUpdate,
            deleted_at: new Date(),
            status: "Inactive",
        });
        return await this.queryRunner.manager.save(merged);
    }

    async hardDelete(entity, where) {
        return this.queryRunner.manager.delete(entity, where);
    }

    async bulkDeleteAndCreate(entity: any, where: any, newData: any[]) {
        await this.queryRunner.manager
            .createQueryBuilder()
            .delete()
            .from(entity)
            .where(where)
            .execute();

        const recordsToInsert = newData.map((record) => ({
            ...record,
            created_at: new Date(),
            created_by: Number(getCurrentUser("user_id")),
        }));

        const insertQuery = await this.queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(entity)
            .values(recordsToInsert)
            .execute();

        return insertQuery;
    }

    async bulkInsert(entity: any, data: any[]) {
        return await this.queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(entity)
            .values(data)
            .execute();
    }

    async bulkUpdate(entity: any, where: any, dataToUpdate = {}) {
        const updateQuery = this.queryRunner.manager
            .createQueryBuilder()
            .update(entity)
            .set(dataToUpdate)
            .where(where)
            .execute();

        return updateQuery;
    }

    async query(query: string, parameters?: any) {
        if (!parameters) {
            return await this.queryRunner.query(query);
        }
        const { modifiedQuery, modifiedParameters } = this.processRawQuery(
            query,
            parameters
        );

        // console.log('modifiedQuery:',modifiedQuery)
        // console.log('modifiedParameters:',modifiedParameters)
        return await this.queryRunner.query(modifiedQuery, modifiedParameters);
    }

    async paginatedQuery(query: string, parameters?: any) {
        if (!parameters) {
            const paginatedQuery = `
            WITH total_count AS (
                SELECT COUNT(*) AS count FROM (${query}) AS subquery
            )
            SELECT *, (SELECT count FROM total_count) AS total_count
            FROM (${query}) AS subquery
        `;
            const result = await this.queryRunner.query(paginatedQuery);
            const totalCount = result.length > 0 ? result[0].total_count : 0;
            return { totalCount, result };
        }

        const { modifiedQuery, modifiedParameters } = this.processRawQuery(
            query,
            parameters
        );

        const paginatedQuery = `
        WITH total_count AS (
            SELECT COUNT(*) AS count FROM (${modifiedQuery}) AS subquery
        )
        SELECT *, (SELECT count FROM total_count) AS total_count
        FROM (${modifiedQuery}) AS subquery
    `;

        const result = await this.queryRunner.query(
            paginatedQuery,
            modifiedParameters
        );
        const totalCount = result.length > 0 ? result[0].total_count : 0;

        return { totalCount, result };
    }

    private processRawQuery(query: string, parameters: any) {
        let modifiedQuery = query;
        let keys: string[] = [];
        for (let key in parameters) {
            if (parameters[key] !== undefined && parameters[key] !== null) {
                keys.push(key);
            }
        }

        keys.map((key, index) => {
            modifiedQuery = modifiedQuery.replaceAll(
                `:${key}`,
                `$${index + 1}`
            );
        });

        return {
            modifiedQuery,
            modifiedParameters: keys.map((key) => {
                return parameters[key];
            }),
        };
    }
}

@Injectable()
export class QueryManagerService {
    async createTransaction() {
        const dataSource = await DatabaseManager.getInstance();
        const queryRunner = dataSource.createQueryRunner();
        const transactionService = new TransactionService(queryRunner);
        await queryRunner.connect();

        return transactionService;
    }
}
