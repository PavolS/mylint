/* eslint-disable camelcase */
export function verify_names<T> (vars: Set<T>, classes: Set<T>): number {
  console.log(classes, vars)
  return 7
}

export function extract_var_name (loc: string): string {
  return 'foo'
}

export function extract_cls_name (loc: string): string {
  return 'Bar'
}
