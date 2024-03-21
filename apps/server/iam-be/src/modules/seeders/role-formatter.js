const fs = require('fs');
const XLSX = require('xlsx');
const path = require('path');

// read csv file
const xlFile = path.join(__dirname, 'GuarnteeServiceRoleAndPermission.csv');

const workbook = XLSX.readFile(xlFile);

const worksheet = XLSX.utils.sheet_to_json(
  workbook.Sheets[workbook.SheetNames[0]],
);

// read js file and initialize variables
const x = fs.readFileSync('./seed-data.ts', 'utf-8');
const cleanedString = x.replace(/export\s*/g, '').replace(/\r?\n/g, '');
const formattedString = cleanedString.replace(/,(?=\s*}]|\s*\])/g, '');
const vars = formattedString.replace(/\bconst\b/g, 'var').split(';');
const geval = eval;
// store the variable names that were parsed from the document
const variables = [];

vars.forEach((vr) => {
  const regex = /var\s+([a-zA-Z_$][a-zA-Z_$0-9]*)\s*=/;
  const match = vr.match(regex);
  const vrName = match ? match[1] : undefined;
  vrName ? vrName && variables.push(vrName) : '';
  geval(vr);
});

const systemRoleFormattedArray = [];
worksheet.reduce((acc, curr) => {
  const ind = systemRoleFormattedArray.findIndex(
    (role) => role[0].role === curr.role,
  );
  ind == -1
    ? systemRoleFormattedArray.push([curr])
    : systemRoleFormattedArray[ind].push(curr);
  return systemRoleFormattedArray;
}, []);

systemRoleFormattedArray.forEach((systemRole) => {
  const roleSystemId = roleSystems.length + 1;
  roleSystems[roleSystems.length] = {
    id: roleSystemId,
    name: systemRole[0].role,
    description: systemRole[0].role,
    key: systemRole[0].role.toUpperCase().replace(/\s/g, '_'),
  };
  for (const permission of systemRole) {
    if (permission.duplication) continue;
    const permissionId = permissions.length + 1;
    permissions.push({
      id: permissionId,
      name: permission.permission,
      description: permission.permission,
      key: `planning:${permission.key}`,
      applicationId: 3,
    });
    roleSystemPermissions.push({
      roleSystemId,
      permissionId,
    });
  }
});

let st = '';
variables.forEach((vr) => {
  st += `export const ${vr} = `;
  st += geval(`JSON.stringify(${vr})`);
  st += ';  \n';
});

fs.writeFileSync(path.join(__dirname, 'seed-data.ts'), st);
console.log('👍 Seed Formatting completed');
