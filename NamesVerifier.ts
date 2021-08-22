/* eslint-disable camelcase */

export function extract_vars (loc: string) {
  const typed_var_re = /(\w+)\s*:\s*([A-Z]\w+)/g
  const vars = Array.from(loc.matchAll(typed_var_re), m => { return { name: m[1], type: m[2] } })

  const new_assign_var_re = /(\w+)\s*=\s*new\s*([A-Z]\w+)/g
  return vars.concat(Array.from(loc.matchAll(new_assign_var_re), m => { return { name: m[1], type: m[2] } }))

  // TODO: { name: 'foo', data: { type: 'Bar', location: 'path/to/some/file:43' } }
}

export function extract_cls_names (loc: string): Array<string> {
  const cls_re = /class\s+(\w+)/g
  return Array.from(loc.matchAll(cls_re), m => m[1])
}

export class NamesVerifier {
  private variables: { [id: string] : Array<string> }
  private classes: Set<string>
  private classes_lower: Set<string>

  constructor () {
    this.variables = new Proxy({}, {
      get: (target: { [id: string] : Array<string> }, name: string) => name in target ? target[name] : (target[name] = [])
    })
    this.classes = new Set<string>()
    this.classes_lower = new Set<string>()
  }

  add_vars (vars: any) {
    for (const v of vars) {
      this.variables[v.type].push(v.name)
    }
  }

  add_class_names (names: any) {
    for (const name of names) {
      this.classes.add(name)
      this.classes_lower.add(name.toLowerCase())
    }
  }

  verify_names () {
    console.log(`Verifying ${this.classes.size} classes... `)
    // console.log(this.classes, this.variables)
    let n = 0
    for (const cls in this.variables) {
      for (const var_name of this.variables[cls]) {
        n++
        const var_name_lower = var_name.toLowerCase()
        if (var_name_lower !== cls.toLowerCase() && this.classes_lower.has(var_name_lower)) {
          console.error(`Violation: variable name ${var_name} could be interpreted as corresponding class, but it has type ${cls}`)
        }
      }
    }
    console.log(`Checked ${n} variables.`)
  }
}
