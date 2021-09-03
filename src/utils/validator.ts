interface IRuleBase {
    isNonEmpty: (value: string, rule: IRule) => string | void
    minLength: (value: string, rule: IRule) => string | void
    maxLength: (value: string, rule: IRule) => string | void
    isMobile: (value: string, rule: IRule) => string | void
}

interface IRule {
    type: keyof IRuleBase
    message?: string
    length?: number
}

interface DRule {
    validator: (value: string) => string | void
}

type Rule = IRule | DRule

interface IData {
    [propName: string]: any
}

interface IValidateRules {
    [propName: string]: Rule | Rule[]
}

interface IValidateOptions {
    rule: IValidateRules
    isThrowAllError?: boolean
}

interface IErrors {
    [field: string]: Array<string>
}

interface IValidator {
    transformTypeToArray(val: Rule): Array<Rule>
    transformTypeToArray(val: Array<Rule>): Array<Rule>
}

// 自定义校验规则库
const ruleBase: IRuleBase = {
  isNonEmpty(value, rule) {
    if (value === '') {
      return rule.message || '数据不能为空'
    }
  },
  minLength(value, rule) { // 限制最小长度
    if (value.length < (rule.length || 3)) {
      return rule.message
    }
  },
  maxLength(value, rule) {
    if (value.length > (rule.length || 5)) {
      return rule.message
    }
  },
  isMobile(value, rule) {
    if (!/^1[3456789]\d{9}$/.test(value)) {
      return rule.message || '手机号格式错误'
    }
  }
}

class Validator implements IValidator {
    isThrowAllError: boolean
    descriptor: IValidateRules
    errors: IErrors

    constructor(options: IValidateOptions) {
      this.isThrowAllError = !!options.isThrowAllError
      this.descriptor = options.rule
      this.errors = {}
    }

    addRule(filed: string, rules: Array<Rule> | Rule) {
      const fieldIValidateRules = this.descriptor[filed] || []

      this.descriptor[filed] = this.transformTypeToArray(fieldIValidateRules).concat(rules)
    }

    transformTypeToArray(val: Rule | Array<Rule>): Array<Rule> {
      if (Array.isArray(val)) {
        return val
      }
      return [val]
    }

    isDRuleType(rule: Rule): rule is DRule {
      return (<DRule>rule).validator !== undefined
    }

    hasError(): boolean {
      return !!Object.keys(this.errors).length
    }

    validate(data: IData) {
      const { transformTypeToArray, descriptor } = this
      const validKeys = Object.keys(data).filter(item => !!descriptor[item])

      for (let i = 0; i < validKeys.length; i++) {
        const key = validKeys[i]
        const value = data[key]
        const rules = transformTypeToArray(descriptor[key])
        const error:Array<string> = []

        for (let j = 0; j < rules.length; j++) {
          const rule = rules[j]
          let message

          if (this.isDRuleType(rule)) {
            message = rule.validator(value)
          } else {
            message = ruleBase[rule.type](value, rule)
          }

          // 存在message&&无需抛出所有错误 立马return
          if (message && !this.isThrowAllError) {
            return Promise.reject(message)
          }

          if (message) {
            error.push(message)
          }
        }

        if (error.length) {
          this.errors[key] = error
        }
      }

      return this.hasError() ? Promise.reject(this.errors) : Promise.resolve()
    }
}

export default Validator

