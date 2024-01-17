function constructConditions(conditions) {
  let result = '';

  for (let i = 0; i < conditions.length; i++) {
    const joinedConditions = [];
    const joinType = '&&';

    conditions[i].forEach((condition, index) => {
      const { type, field, value, operator } = condition;

      const conditionString = `${field} ${operator} ${
        type == 'string' ? `'${value}'` : value
      }`;

      if (index > 0) {
        joinedConditions.push(conditions[i][index - 1].joinType);
      }

      joinedConditions.push(conditionString);
    });

    const joinedConditionsString = `(${joinedConditions.join(' ')})`;

    result += joinedConditionsString;

    if (i < conditions.length - 1) {
      result += ` ${joinType} `;
    }
  }
  return result;
}

export const compareCondition = (conditions, param) => {
  const comparisonResult = constructConditions(conditions);

  const geval = eval;
  for (const key in param) {
    // const value =
    //   typeof param[key] == 'string' ? param[key].toLowerCase() : param[key];
    const d = `var ${key} = '${param[key]}'`;
    geval(d);
  }

  const codeToEvaluate = ` (${comparisonResult}) ? true : false; `;

  let result = false;
  try {
    result = eval(codeToEvaluate);
  } catch (error) {}

  for (const key in param) {
    const d = `delete ${key}`;
    geval(d);
  }
  return result;
};
