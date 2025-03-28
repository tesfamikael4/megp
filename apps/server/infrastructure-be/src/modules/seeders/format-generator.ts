import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { join } from 'path';
import { Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

const xlFile = join(__dirname, 'seedData.xlsx');

const workbook = XLSX.readFile(xlFile);

const worksheet: any = XLSX.utils.sheet_to_json(
  workbook.Sheets[workbook.SheetNames[0]],
);

const designFormattedArray: any = [];
worksheet.reduce((acc, curr) => {
  const ind = designFormattedArray.findIndex(
    (designer) => designer[0].ruleDesigner === curr.ruleDesigner,
  );
  ind == -1
    ? designFormattedArray.push([curr])
    : designFormattedArray[ind].push(curr);
  return designFormattedArray;
}, []);

designFormattedArray.forEach((design, index) => {
  const ruleFormattedArray = [];
  design.reduce((acc, curr) => {
    const ind = ruleFormattedArray.findIndex(
      (rule) => rule[0].rule == curr.rule,
    );
    ind == -1
      ? ruleFormattedArray.push([curr])
      : ruleFormattedArray[ind].push(curr);
    return ruleFormattedArray;
  }, []);
  designFormattedArray[index] = ruleFormattedArray;
});

const refactor = (arrObj, uid) => {
  const rule = {
    designerId: uid,
    key: toCamelCase(arrObj[0]['rule']),
    executionOrder: arrObj[0]['executionOrder'],
    enforcementMethod: arrObj[0]['enforcementMethod'],
    conditions: [],
    // actions: [],
    // defaultActions: []
  };

  for (const obj of arrObj) {
    if (!obj.field) continue;
    if (obj.outerConditionArray) {
      // start a new array inside the array [and condition]
      rule.conditions[rule.conditions.length] = [
        {
          field: obj.field,
          operator: obj.operator,
          value: toCamelCase(`${obj.value}`),
          type: obj.type,
          joinType: obj.joinType,
        },
      ];
    } else {
      const ands = {
        field: obj.field,
        operator: obj.operator,
        value: toCamelCase(`${obj.value}`), //.toLowerCase(),
        type: obj.type,
        joinType: obj.joinType,
      };
      rule.conditions[rule.conditions.length - 1].push(ands);
    }
  }
  return rule;
};

function toCamelCase(inputString: string): string {
  const words = inputString.split(' ');
  const camelCaseWords = words.map((word, index) =>
    index === 0
      ? word.toLowerCase()
      : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  );
  return camelCaseWords.join('');
}

const seedRules: any = [];
const seedDesigns: any = [];
const seedPossibeReasons: any = [];

designFormattedArray.forEach((designs) => {
  const uid = uuidv4();
  const name = designs[0][0]['ruleDesigner'];
  const tempDesign = {
    enforcementMethod: '',
    actions: [],
    defaultActions: [],
    name: name,
    key: toCamelCase(name),
    id: uid,
  };
  designs.forEach((rules) => {
    rules.forEach((rule) => {
      if (rule.possibleReasons) {
        seedPossibeReasons.push({
          designerId: uid,
          reason: rule.possibleReasons,
        });
      }
      if (rule.actionType)
        tempDesign.actions.push({
          type: rule.actionType,
          name: rule.actionName,
          value: rule.actionValue,
        });
      if (rule.defaultActionType)
        tempDesign.defaultActions.push({
          type: rule.defaultActionType,
          name: rule.defaultActionName,
          value: rule.defaultActionValue,
        });
      if (rule.enforcementMethod)
        tempDesign.enforcementMethod = rule.enforcementMethod;
    });
    const temp = refactor(rules, uid);
    seedRules.push(temp);
  });
  seedDesigns.push(tempDesign);
});

// console.log(JSON.stringify(seedRules));
fs.writeFileSync(
  join(__dirname, 'seed-data.ts'),
  `export const seedRules = ${JSON.stringify(
    seedRules,
  )} \nexport const seedDesigns = ${JSON.stringify(
    seedDesigns,
  )}\nexport const seedPossibleReasons = ${JSON.stringify(seedPossibeReasons)}`,
);

Logger.log('👍 Rule Seed Format Generated');
