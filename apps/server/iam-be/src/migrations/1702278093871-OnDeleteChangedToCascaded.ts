import { MigrationInterface, QueryRunner } from 'typeorm';

export class OnDeleteChangedToCascaded1702278093871
  implements MigrationInterface
{
  name = 'OnDeleteChangedToCascaded1702278093871';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_mandates" DROP CONSTRAINT "FK_e69a6b95b51c7ca82c2d3f8d608"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_mandates" DROP CONSTRAINT "FK_413c26de3e7f761c522d090e67d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mandate_permissions" DROP CONSTRAINT "FK_03cec89946eb06d9ca53571f265"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mandate_permissions" DROP CONSTRAINT "FK_ee37ce2a84baabd8d1693a445be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_units" DROP CONSTRAINT "FK_b31c5490ab8f851d1a5e56eed3a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_units" DROP CONSTRAINT "FK_eb5a24b37234fad2ed645d97b5e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "units" DROP CONSTRAINT "FK_eee0907c9271e01e416482b3528"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_06792d0c62ce6b0203c03643cdd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_b4599f8b8f548d35850afa2d12c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_472b25323af01488f1f66a06b67"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_86033897c009fcca8b6505d6be2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" DROP CONSTRAINT "FK_0933e1dfb2993d672af1a98f08e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP CONSTRAINT "FK_ecea9e8e98c195dbcdcfa59d60c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_system_permissions" DROP CONSTRAINT "FK_dc5aea8f63adb6011439166a9f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_system_permissions" DROP CONSTRAINT "FK_55b47311de22e78590e15e120bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role_systems" DROP CONSTRAINT "FK_f8d905c1bf8618ad7764a509df7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role_systems" DROP CONSTRAINT "FK_0e8a8bb517a263f399ba27ab598"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "UQ_d430a02aad006d8a70f3acd7d03" UNIQUE ("roleId", "permissionId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_mandates" ADD CONSTRAINT "FK_e69a6b95b51c7ca82c2d3f8d608" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_mandates" ADD CONSTRAINT "FK_413c26de3e7f761c522d090e67d" FOREIGN KEY ("mandateId") REFERENCES "mandates"("id") ON DELETE CASCADE ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE "mandate_permissions" ADD CONSTRAINT "FK_03cec89946eb06d9ca53571f265" FOREIGN KEY ("mandateId") REFERENCES "mandates"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "mandate_permissions" ADD CONSTRAINT "FK_ee37ce2a84baabd8d1693a445be" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_units" ADD CONSTRAINT "FK_eb5a24b37234fad2ed645d97b5e" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_units" ADD CONSTRAINT "FK_b31c5490ab8f851d1a5e56eed3a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "units" ADD CONSTRAINT "FK_eee0907c9271e01e416482b3528" FOREIGN KEY ("typeId") REFERENCES "unit_types"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_b4599f8b8f548d35850afa2d12c" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_06792d0c62ce6b0203c03643cdd" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_86033897c009fcca8b6505d6be2" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "FK_0933e1dfb2993d672af1a98f08e" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD CONSTRAINT "FK_ecea9e8e98c195dbcdcfa59d60c" FOREIGN KEY ("typeId") REFERENCES "organization_types"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_system_permissions" ADD CONSTRAINT "FK_dc5aea8f63adb6011439166a9f5" FOREIGN KEY ("roleSystemId") REFERENCES "role_systems"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_system_permissions" ADD CONSTRAINT "FK_55b47311de22e78590e15e120bd" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role_systems" ADD CONSTRAINT "FK_f8d905c1bf8618ad7764a509df7" FOREIGN KEY ("roleSystemId") REFERENCES "role_systems"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role_systems" ADD CONSTRAINT "FK_0e8a8bb517a263f399ba27ab598" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_role_systems" DROP CONSTRAINT "FK_0e8a8bb517a263f399ba27ab598"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role_systems" DROP CONSTRAINT "FK_f8d905c1bf8618ad7764a509df7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_system_permissions" DROP CONSTRAINT "FK_55b47311de22e78590e15e120bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_system_permissions" DROP CONSTRAINT "FK_dc5aea8f63adb6011439166a9f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP CONSTRAINT "FK_ecea9e8e98c195dbcdcfa59d60c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" DROP CONSTRAINT "FK_0933e1dfb2993d672af1a98f08e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_472b25323af01488f1f66a06b67"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_86033897c009fcca8b6505d6be2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_06792d0c62ce6b0203c03643cdd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_b4599f8b8f548d35850afa2d12c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "units" DROP CONSTRAINT "FK_eee0907c9271e01e416482b3528"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_units" DROP CONSTRAINT "FK_b31c5490ab8f851d1a5e56eed3a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_units" DROP CONSTRAINT "FK_eb5a24b37234fad2ed645d97b5e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mandate_permissions" DROP CONSTRAINT "FK_ee37ce2a84baabd8d1693a445be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mandate_permissions" DROP CONSTRAINT "FK_03cec89946eb06d9ca53571f265"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_mandates" DROP CONSTRAINT "FK_413c26de3e7f761c522d090e67d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_mandates" DROP CONSTRAINT "FK_e69a6b95b51c7ca82c2d3f8d608"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "UQ_d430a02aad006d8a70f3acd7d03"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role_systems" ADD CONSTRAINT "FK_0e8a8bb517a263f399ba27ab598" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role_systems" ADD CONSTRAINT "FK_f8d905c1bf8618ad7764a509df7" FOREIGN KEY ("roleSystemId") REFERENCES "role_systems"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_system_permissions" ADD CONSTRAINT "FK_55b47311de22e78590e15e120bd" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_system_permissions" ADD CONSTRAINT "FK_dc5aea8f63adb6011439166a9f5" FOREIGN KEY ("roleSystemId") REFERENCES "role_systems"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD CONSTRAINT "FK_ecea9e8e98c195dbcdcfa59d60c" FOREIGN KEY ("typeId") REFERENCES "organization_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "FK_0933e1dfb2993d672af1a98f08e" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_86033897c009fcca8b6505d6be2" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_b4599f8b8f548d35850afa2d12c" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_06792d0c62ce6b0203c03643cdd" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "units" ADD CONSTRAINT "FK_eee0907c9271e01e416482b3528" FOREIGN KEY ("typeId") REFERENCES "unit_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_units" ADD CONSTRAINT "FK_eb5a24b37234fad2ed645d97b5e" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_units" ADD CONSTRAINT "FK_b31c5490ab8f851d1a5e56eed3a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "mandate_permissions" ADD CONSTRAINT "FK_ee37ce2a84baabd8d1693a445be" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "mandate_permissions" ADD CONSTRAINT "FK_03cec89946eb06d9ca53571f265" FOREIGN KEY ("mandateId") REFERENCES "mandates"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_mandates" ADD CONSTRAINT "FK_413c26de3e7f761c522d090e67d" FOREIGN KEY ("mandateId") REFERENCES "mandates"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_mandates" ADD CONSTRAINT "FK_e69a6b95b51c7ca82c2d3f8d608" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
  }
}
