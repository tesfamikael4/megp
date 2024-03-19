import { Column, Entity, PrimaryColumn, ViewColumn, ViewEntity } from 'typeorm';

// @ViewEntity({
//   expression: `
//     SELECT id, name FROM external_organizations
//   `
// })
// export class OrganizationView {
//   @ViewColumn()
//   @PrimaryColumn('uuid')
//   id: string;

//   @ViewColumn()
//   name: string;
// }

@Entity({ name: 'external_organizations', synchronize: false })
export class Organization {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;
}
