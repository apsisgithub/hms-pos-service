import { DataSource, Repository } from "typeorm";
import { DatabaseManager } from "src/config/db";
import {
  MasterSbu,
  MasterSbuStatus,
} from "../src/entities/master/master_sbu.entity";
import {
  MasterBuilding,
  BuildingStatus,
} from "../src/entities/master/master_building.entity";
import {
  MasterRole,
  RoleName,
  RoleStatus,
} from "../src/entities/master/master_roles.entity";
import {
  MasterUser,
  UserStatus,
} from "../src/modules/master-users/entities/master_user.entity";
import {
  MasterBusinessSource,
  BusinessSourceStatus,
} from "../src/entities/master/master_business_sources.entity";
import {
  MasterPaymentMode,
  PaymentModeStatus,
} from "../src/entities/master/master_payment_modes.entity";
import {
  CurrencyStatus,
  MasterCurrency,
} from "../src/entities/master/master_currencies.entity";
import {
  MasterDepartment,
  DepartmentStatus,
} from "../src/entities/master/master_departments.entity";

export class DatabaseSeeder {
  private dataSource: DataSource;
  private sbuRepository: Repository<MasterSbu>;
  private buildingRepository: Repository<MasterBuilding>;
  private roleRepository: Repository<MasterRole>;
  private userRepository: Repository<MasterUser>;
  private businessSourceRepository: Repository<MasterBusinessSource>;
  private paymentModeRepository: Repository<MasterPaymentMode>;
  private currencyRepository: Repository<MasterCurrency>;
  private departmentRepository: Repository<MasterDepartment>;

  async initialize() {
    this.dataSource = await DatabaseManager.getInstance();
    this.sbuRepository = this.dataSource.getRepository(MasterSbu);
    this.buildingRepository = this.dataSource.getRepository(MasterBuilding);
    this.roleRepository = this.dataSource.getRepository(MasterRole);
    this.userRepository = this.dataSource.getRepository(MasterUser);
    this.businessSourceRepository =
      this.dataSource.getRepository(MasterBusinessSource);
    this.paymentModeRepository =
      this.dataSource.getRepository(MasterPaymentMode);
    this.currencyRepository = this.dataSource.getRepository(MasterCurrency);
    this.departmentRepository = this.dataSource.getRepository(MasterDepartment);
  }

  async seedTestData() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Seed SBU data (required for most other entities)
      const existingSbu = await this.sbuRepository.findOne({
        where: { id: 1 },
      });
      if (!existingSbu) {
        const testSbu1 = this.sbuRepository.create({
          id: 1,
          name: "Test Hotel Chain",
          address: "123 Test Street, Test City",
          email: "test@hotel.com",
          phone: "+1-555-0100",
          website: "https://testhotel.com",
          currency_code: "USD",
          timezone: "Asia/Dhaka",
          status: MasterSbuStatus.Active,
          created_by: 1,
        });

        const testSbu2 = this.sbuRepository.create({
          id: 2,
          name: "Test Resort Group",
          address: "456 Test Avenue, Resort City",
          email: "test@resort.com",
          phone: "+1-555-0200",
          website: "https://testresort.com",
          currency_code: "USD",
          timezone: "Asia/Dhaka",
          status: MasterSbuStatus.Active,
          created_by: 1,
        });

        await queryRunner.manager.save([testSbu1, testSbu2]);
        console.log("✅ SBU test data seeded");
      }

      // Seed Roles data (required for user authentication)
      const existingRole = await this.roleRepository.findOne({
        where: { id: 1 },
      });
      if (!existingRole) {
        const adminRole = this.roleRepository.create({
          id: 1,
          name: RoleName.Admin,
          status: RoleStatus.Active,
          created_by: 1,
        });

        const managerRole = this.roleRepository.create({
          id: 2,
          name: RoleName.Manager,
          status: RoleStatus.Active,
          created_by: 1,
        });

        await queryRunner.manager.save([adminRole, managerRole]);
        console.log("✅ Roles test data seeded");
      }

      // Seed test user for authentication
      const existingUser = await this.userRepository.findOne({
        where: { id: 1 },
      });
      if (!existingUser) {
        const testUser = this.userRepository.create({
          id: 1,
          user_name: "testadmin",
          password: "$2b$10$hashedpasswordfortesting",
          email: "admin@test.com",
          user_role_id: 1,
          status: UserStatus.Active,
          created_by: 1,
        });

        await queryRunner.manager.save(testUser);
        console.log("✅ User test data seeded");
      }

      // Seed Buildings data (required for floors and rooms)
      const existingBuilding = await this.buildingRepository.findOne({
        where: { id: 1 },
      });
      if (!existingBuilding) {
        const testBuilding1 = this.buildingRepository.create({
          id: 1,
          sbu_id: 1,
          name: "Test Main Building",
          description: "Main building for testing purposes",
          status: BuildingStatus.Active,
          created_by: 1,
        });

        const testBuilding2 = this.buildingRepository.create({
          id: 2,
          sbu_id: 1,
          name: "Test Annex Building",
          description: "Annex building for testing purposes",
          status: BuildingStatus.Active,
          created_by: 1,
        });

        await queryRunner.manager.save([testBuilding1, testBuilding2]);
        console.log("✅ Buildings test data seeded");
      }

      // Seed Business Sources data
      const existingBusinessSource =
        await this.businessSourceRepository.findOne({
          where: { id: 1 },
        });
      if (!existingBusinessSource) {
        const bookingSource = this.businessSourceRepository.create({
          id: 1,
          sbu_id: 1,
          name: "Test Booking Platform",
          code: "TBP",
          bin: "BIN001",
          address: "123 Booking Street, Platform City",
          color_tag: "#FF5722",
          status: BusinessSourceStatus.Active,
          created_by: 1,
        });

        await queryRunner.manager.save(bookingSource);
        console.log("✅ Business Sources test data seeded");
      }

      // Seed Payment Modes data
      const existingPaymentMode = await this.paymentModeRepository.findOne({
        where: { id: 1 },
      });
      if (!existingPaymentMode) {
        const creditCardMode = this.paymentModeRepository.create({
          id: 1,
          sbu_id: 1,
          name: "Test Credit Card",
          status: PaymentModeStatus.Active,
          created_by: 1,
        });

        const cashMode = this.paymentModeRepository.create({
          id: 2,
          sbu_id: 1,
          name: "Test Cash",
          status: PaymentModeStatus.Active,
          created_by: 1,
        });

        await queryRunner.manager.save([creditCardMode, cashMode]);
        console.log("✅ Payment Modes test data seeded");
      }

      // Seed Currencies data
      const existingCurrency = await this.currencyRepository.findOne({
        where: { id: 1 },
      });
      if (!existingCurrency) {
        const usdCurrency = this.currencyRepository.create({
          id: 1,
          sbu_id: 1,
          name: "Test US Dollar",
          code: "USD",
          symbol: "$",
          exchange_rate: 1.0,
          status: CurrencyStatus.Active,
          created_by: 1,
        });

        await queryRunner.manager.save(usdCurrency);
        console.log("✅ Currencies test data seeded");
      }

      // Seed Departments data
      const existingDepartment = await this.departmentRepository.findOne({
        where: { name: "Test Front Office" },
      });
      if (!existingDepartment) {
        const frontOffice = this.departmentRepository.create({
          sbu_id: 1,
          name: "Test Front Office",
          description: "Front office department for testing",
          status: DepartmentStatus.Active,
          created_by: 1,
        });

        const housekeeping = this.departmentRepository.create({
          sbu_id: 1,
          name: "Test Housekeeping",
          description: "Housekeeping department for testing",
          status: DepartmentStatus.Active,
          created_by: 1,
        });

        await queryRunner.manager.save([frontOffice, housekeeping]);
        console.log("✅ Departments test data seeded");
      }

      await queryRunner.commitTransaction();
      console.log("✅ All test data seeded successfully");
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("❌ Error seeding test data:", error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async cleanupTestData() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Clean up in reverse order of dependencies using ORM
      console.log("🧹 Starting test data cleanup...");

      // Clean up dependent entities first
      await queryRunner.manager.delete(MasterUser, { created_by: 1 });
      console.log("✅ Users cleaned up");

      await queryRunner.manager.delete(MasterBuilding, { created_by: 1 });
      console.log("✅ Buildings cleaned up");

      await queryRunner.manager.delete(MasterBusinessSource, {
        created_by: 1,
      });
      console.log("✅ Business Sources cleaned up");

      await queryRunner.manager.delete(MasterPaymentMode, {
        created_by: 1,
      });
      console.log("✅ Payment Modes cleaned up");

      await queryRunner.manager.delete(MasterCurrency, { created_by: 1 });
      console.log("✅ Currencies cleaned up");

      await queryRunner.manager.delete(MasterDepartment, {
        created_by: 1,
      });
      console.log("✅ Departments cleaned up");

      // Clean up roles
      await queryRunner.manager.delete(MasterRole, { created_by: 1 });
      console.log("✅ Roles cleaned up");

      // Clean up SBU last (parent entity)
      await queryRunner.manager.delete(MasterSbu, { created_by: 1 });
      console.log("✅ SBU cleaned up");

      await queryRunner.commitTransaction();
      console.log("✅ All test data cleaned up successfully");
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("❌ Error cleaning up test data:", error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Utility method to seed specific entity data
   */
  async seedSpecificEntity<T extends object>(
    repository: Repository<T>,
    entityData: Partial<T>[],
    entityName: string
  ): Promise<T[]> {
    try {
      const entities = repository.create(entityData as any[]);
      const savedEntities = await repository.save(entities);
      console.log(
        `✅ ${entityName} test data seeded (${savedEntities.length} records)`
      );
      return savedEntities;
    } catch (error) {
      console.error(`❌ Error seeding ${entityName}:`, error);
      throw error;
    }
  }

  /**
   * Utility method to cleanup specific entity data
   */
  async cleanupSpecificEntity<T extends object>(
    repository: Repository<T>,
    criteria: any,
    entityName: string
  ): Promise<void> {
    try {
      const result = await repository.delete(criteria);
      console.log(`✅ ${entityName} cleaned up (${result.affected} records)`);
    } catch (error) {
      console.error(`❌ Error cleaning up ${entityName}:`, error);
      throw error;
    }
  }

  /**
   * Check if entity exists
   */
  async checkEntityExists<T extends object>(
    repository: Repository<T>,
    criteria: any
  ): Promise<boolean> {
    const count = await repository.count({ where: criteria });
    return count > 0;
  }

  /**
   * Seed data for a specific module (useful for individual module testing)
   */
  async seedModuleData(moduleName: string, data: any[]): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      switch (moduleName.toLowerCase()) {
        case "sbu":
          await this.seedSpecificEntity(this.sbuRepository, data, "SBU");
          break;
        case "buildings":
          await this.seedSpecificEntity(
            this.buildingRepository,
            data,
            "Buildings"
          );
          break;
        case "roles":
          await this.seedSpecificEntity(this.roleRepository, data, "Roles");
          break;
        case "users":
          await this.seedSpecificEntity(this.userRepository, data, "Users");
          break;
        case "business-sources":
          await this.seedSpecificEntity(
            this.businessSourceRepository,
            data,
            "Business Sources"
          );
          break;
        case "payment-modes":
          await this.seedSpecificEntity(
            this.paymentModeRepository,
            data,
            "Payment Modes"
          );
          break;
        case "currencies":
          await this.seedSpecificEntity(
            this.currencyRepository,
            data,
            "Currencies"
          );
          break;
        case "departments":
          await this.seedSpecificEntity(
            this.departmentRepository,
            data,
            "Departments"
          );
          break;
        default:
          throw new Error(`Unknown module: ${moduleName}`);
      }

      await queryRunner.commitTransaction();
      console.log(`✅ ${moduleName} module data seeded successfully`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(`❌ Error seeding ${moduleName} module data:`, error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Get repository for a specific entity
   */
  getRepository<T extends object>(entityClass: new () => T): Repository<T> {
    return this.dataSource.getRepository(entityClass) as Repository<T>;
  }

  async close() {
    if (this.dataSource && this.dataSource.isInitialized) {
      await this.dataSource.destroy();
    }
  }
}
