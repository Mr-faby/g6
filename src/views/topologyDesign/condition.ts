import { BindVarType, Ecalculation, IIfElse } from "./type";

/**
 *  返回条件判断
 *  @params e
 */
export function returnCondition(
  condition: IIfElse[],
  expression?: boolean,
  extraData?: any
): boolean | string {
  const mainCondition = condition && condition[0];
  if (!mainCondition) return true; // 兼容旧版本
  if (expression) {
    return parseCondition(mainCondition, expression, extraData);
  }
  return new Function(
    `return ${parseCondition(mainCondition, expression, extraData)}`
  )();
}

export function parseCondition(
  { children, title }: IIfElse,
  expression?: boolean,
  extraData?: any
) {
  let compareCondition = "";
  const len = children && children.length && children.length - 1;
  const compareList = children ? children.slice(0, len) : []; // 添加条件的子节点不需要
  compareList.forEach((compare, index) => {
    if (compare.type === "compare") {
      compareCondition += `${conditionMethodMap(
        compare.comparator as string,
        getVarValue(compare.leftVar!, extraData),
        getVarValue(compare.rightVar!, extraData),
        expression
      )}`;
    } else if (compare.type === "condition") {
      const condi = parseCondition(compare, expression, extraData);
      compareCondition += condi ? `( ${condi})` : "";
    }
    if (index < compareList.length - 1) {
      compareCondition += ` ${title} `;
    }
  });
  return compareCondition || "true";
}

/**
 * 方法映射
 * @param methodName 方法名称
 * @param leftVar 左侧变量
 * @param rightVar 右侧变量
 * @param expression 全局判断输出表达式或者局部输出结果
 */
export function conditionMethodMap(
  methodName: string,
  leftVar: unknown,
  rightVar: unknown,
  expression?: boolean
) {
  let method: string | boolean = false;
  switch (methodName) {
    case "大于等于":
    case "小于等于":
    case "不等于":
    case "等于":
    case "小于":
    case "大于":
      method = !expression
        ? thanOrEqual(leftVar, rightVar, Ecalculation[methodName])
        : `${leftVar} ${Ecalculation[methodName]} ${rightVar}`;
      break;
    case "为空":
      method = !expression ? !leftVar : `!${leftVar}`;
      break;
    case "不为空":
      method = !expression ? !!leftVar : `!!${leftVar}`;
      break;
    case "包含":
      method = !expression
        ? (leftVar + "").includes(rightVar + "")
        : `${leftVar}?.includes(${rightVar})`;
      break;
    case "不包含":
      method = !expression
        ? !(leftVar + "").includes(rightVar + "")
        : `!${leftVar}?.includes(${rightVar})`;
      break;
    case "开始于":
      method = !expression
        ? (leftVar + "").startsWith(rightVar + "")
        : `${leftVar}?.startsWith(${rightVar})`;
      break;
    case "结束于":
      method = !expression
        ? (leftVar + "").endsWith(rightVar + "")
        : `${leftVar}?.endsWith(${rightVar})`;
      break;
    default:
      break;
  }
  return method;
}

export function thanOrEqual(
  leftVar: number | any,
  rightVar: number | any,
  condition: string
) {
  // 有一个不是数字，该咋比较就咋比较
  if (isNaN(leftVar) || isNaN(rightVar)) {
    return eval(
      `${JSON.stringify(leftVar)}${condition}${JSON.stringify(rightVar)}`
    );
  }
  // 避免出现 '132' 这种情况
  return eval(
    `${JSON.stringify(leftVar)}${condition}${JSON.stringify(rightVar)}`
  );
}

function getVarValue(
  param: BindVarType,
  extra: { attributeInstanceId: string; attributeInstanceValue: string }[]
) {
  if (param.type === "var") {
    const value = extra.find(item => item.attributeInstanceId === param.title.attributeInstanceId);
    return value?.attributeInstanceValue || param.title.attributeName;
  }
  return param.title;
}
