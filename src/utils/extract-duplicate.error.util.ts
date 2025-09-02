export function extractDuplicateFieldMessage(message: string): string {
    const match = message.match(/Duplicate entry '(.+)' for key '(.+)'/);
    if (!match) return "";

    console.log('match',match);
    const [, value, key] = match;
    const keyMatch = key.match(/UQ_.+?_(\w+)/);
    const tableField = keyMatch ? keyMatch[1] : key;
    const field = tableField.split('.')[1].replace(/^composition_idx_/, "");

    
    return `for field '${field}'`;
}

export function extractForeignKeyMessage(message: string): string {
    const match = message.match(/FOREIGN KEY \(`(.+?)`\)/);
    if (match) {
        const [, field] = match;
        return `'${field}' does not exist`;
    }

    return "";
}

// interface DatabaseError {
//     errno?: number;
//     code?: string;
//     sqlMessage?: string;
//     message?: string;
//     sql?: string;
// }

// /**
//  * Extracts field name and value from duplicate entry errors
//  */
// export function extractDuplicateFieldMessage(message: string): string {
//     const match = message.match(/Duplicate entry '(.+?)' for key '(.+?)'/);
//     if (!match) return "";

//     const [, value, constraintName] = match;

//     // Try different constraint naming patterns to extract field name
//     const fieldName = extractFieldFromConstraint(constraintName);

//     return `'${value}' for field '${fieldName}'`;
// }

// /**
//  * Extracts field name from foreign key constraint errors
//  */
// export function extractForeignKeyMessage(message: string): string {
//     // Pattern: FOREIGN KEY (`field_name`) REFERENCES `table` (`id`)
//     const fullMatch = message.match(
//         /FOREIGN KEY \(`(.+?)`\) REFERENCES `(.+?)` \(`(.+?)`\)/
//     );
//     if (fullMatch) {
//         const [, fieldName, referencedTable] = fullMatch;
//         return `Invalid ${fieldName}: referenced ${referencedTable} does not exist`;
//     }

//     // Fallback pattern: FOREIGN KEY (`field_name`)
//     const simpleMatch = message.match(/FOREIGN KEY \(`(.+?)`\)/);
//     if (simpleMatch) {
//         const [, fieldName] = simpleMatch;
//         return `Invalid ${fieldName}: referenced record does not exist`;
//     }

//     return "Foreign key constraint violation";
// }

// /**
//  * Attempts to extract field name from various constraint naming patterns
//  */
// function extractFieldFromConstraint(constraintName: string): string {
//     // Pattern 1: UQ_tablename_fieldname
//     const uqMatch = constraintName.match(/^UQ_.+?_(.+)$/);
//     if (uqMatch) {
//         return uqMatch[1];
//     }

//     // Pattern 2: tablename_fieldname_unique
//     const uniqueMatch = constraintName.match(/^(.+?)_(.+?)_unique$/);
//     if (uniqueMatch) {
//         return uniqueMatch[2];
//     }

//     // Pattern 3: IDX_hash (need to extract from table context or maintain mapping)
//     if (constraintName.startsWith("IDX_")) {
//         // This is the tricky case - hash-based index names
//         // Return the constraint name as fallback
//         return `constraint_${constraintName}`;
//     }

//     // Pattern 4: Direct field name or other patterns
//     const directMatch = constraintName.match(/^[a-zA-Z_]+$/);
//     if (directMatch) {
//         return constraintName;
//     }

//     // Fallback: return the constraint name
//     return constraintName;
// }

// /**
//  * Main database error handler that returns user-friendly messages
//  */
// export function handleDatabaseError(error: DatabaseError): string {
//     const message = error.sqlMessage || error.message || "";

//     // Handle duplicate entry errors (errno 1062)
//     if (
//         error.errno === 1062 ||
//         error.code === "ER_DUP_ENTRY" ||
//         message.includes("Duplicate entry")
//     ) {
//         const duplicateMessage = extractDuplicateFieldMessage(message);
//         return duplicateMessage
//             ? `Duplicate entry ${duplicateMessage}`
//             : "Duplicate entry found";
//     }

//     // Handle foreign key constraint errors (errno 1452)
//     if (
//         error.errno === 1452 ||
//         error.code === "ER_NO_REFERENCED_ROW_2" ||
//         message.includes("foreign key constraint fails")
//     ) {
//         const fkMessage = extractForeignKeyMessage(message);
//         return fkMessage || "Referenced record does not exist";
//     }

//     // Handle foreign key constraint on delete/update (errno 1451)
//     if (
//         error.errno === 1451 ||
//         error.code === "ER_ROW_IS_REFERENCED_2" ||
//         message.includes("Cannot delete or update a parent row")
//     ) {
//         return "Cannot delete: Record is being used by other records";
//     }

//     // Handle data too long errors (errno 1406)
//     if (error.errno === 1406 || message.includes("Data too long")) {
//         const fieldMatch = message.match(/for column '(.+?)'/);
//         const fieldName = fieldMatch ? fieldMatch[1] : "field";
//         return `Data too long for ${fieldName}`;
//     }

//     // Handle null constraint violations (errno 1048)
//     if (error.errno === 1048 || message.includes("cannot be null")) {
//         const fieldMatch = message.match(/Column '(.+?)' cannot be null/);
//         const fieldName = fieldMatch ? fieldMatch[1] : "required field";
//         return `${fieldName} is required`;
//     }

//     // Handle out of range values (errno 1264)
//     if (error.errno === 1264 || message.includes("Out of range value")) {
//         const fieldMatch = message.match(/for column '(.+?)'/);
//         const fieldName = fieldMatch ? fieldMatch[1] : "field";
//         return `Value out of range for ${fieldName}`;
//     }

//     // Handle table doesn't exist (errno 1146)
//     if (error.errno === 1146 || message.includes("doesn't exist")) {
//         return "Database table not found";
//     }

//     // Default fallback
//     return "Database operation failed";
// }

// /**
//  * Enhanced error handler with context for better field name resolution
//  */
// export function handleDatabaseErrorWithContext(
//     error: DatabaseError,
//     tableName?: string,
//     fieldMapping?: Record<string, string>
// ): string {
//     const message = error.sqlMessage || error.message || "";

//     // For duplicate entry with field mapping
//     if (error.errno === 1062 || error.code === "ER_DUP_ENTRY") {
//         const match = message.match(/Duplicate entry '(.+?)' for key '(.+?)'/);
//         if (match) {
//             const [, value, constraintName] = match;

//             // Use field mapping if provided
//             const fieldName =
//                 fieldMapping?.[constraintName] ||
//                 extractFieldFromConstraint(constraintName);

//             return `Duplicate entry '${value}' for field '${fieldName}'`;
//         }
//     }

//     // Fall back to basic handler
//     return handleDatabaseError(error);
// }

// /**
//  * Utility to create field mapping from your database schema
//  * You can populate this based on your actual constraints
//  */
// export function createFieldMapping(tableName: string): Record<string, string> {
//     // Example mappings - you'll need to populate these based on your actual database schema
//     const mappings: Record<string, Record<string, string>> = {
//         master_seasons: {
//             IDX_c3c49b8d7fb2ebf252fbf761de: "season_name", // or whatever field this constraint is on
//             UQ_master_seasons_short_code: "short_code",
//             // Add more mappings as needed
//         },
//         users: {
//             IDX_user_email_unique: "email",
//             UQ_users_username: "username",
//             // Add more mappings
//         },
//         // Add more tables as needed
//     };

//     return mappings[tableName] || {};
// }

// /**
//  * Express.js middleware example for handling database errors
//  */
// export function databaseErrorMiddleware(
//     error: any,
//     req: any,
//     res: any,
//     next: any
// ) {
//     if (error.errno || error.sqlMessage) {
//         const userFriendlyMessage = handleDatabaseError(error);
//         return res.status(400).json({
//             status: 400,
//             success: false,
//             message: userFriendlyMessage,
//         });
//     }

//     next(error);
// }
