import { Table } from '@mantine/core';
import classes from '../scss/Table.module.scss';
import MegpButton from './MegpButton';
import TableSectionHeaderPage from './TableSectionHeader';
const elements = [
  { position: 6, mass: 12.011, symbol: 'Draft', name: 'Carbon' },
  { position: 7, mass: 14.007, symbol: 'Active', name: 'Nitrogen' },
  { position: 39, mass: 88.906, symbol: 'Active', name: 'Yttrium' },
  { position: 56, mass: 137.33, symbol: 'Submitted', name: 'Barium' },
  { position: 58, mass: 140.12, symbol: 'Submitted', name: 'Cerium' },
];
export default function TablePage() {
  const rows = elements.map((element) => (
    <tr key={element.name}>
      <td>{element.position}</td>
      <td>{element.name}</td>
      <td>{element.symbol}</td>
      <td>{element.mass}</td>
      <td>{element.mass}</td>
    </tr>
  ));

  return (
    <div className={classes.table}>
      <TableSectionHeaderPage />
      <Table>
        <thead>
          <tr>
            <th>Version</th>
            <th>Name</th>
            <th>Status</th>
            <th>Detail</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </div>
  );
}
