import {
  Z3_ast,
  Z3_ast_map,
  Z3_ast_vector,
  Z3_context,
  Z3_decl_kind,
  Z3_func_decl,
  Z3_func_interp,
  Z3_model,
  Z3_probe,
  Z3_solver,
  Z3_sort,
  Z3_sort_kind,
  Z3_symbol,
  Z3_tactic,
} from '../low-level';

/** @hidden */
export type AnySort<Name extends string = any> =
  | Sort<Name>
  | BoolSort<Name>
  | ArithSort<Name>
  | BitVecSort<number, Name>;
/** @hidden */
export type AnyExpr<Name extends string = any> =
  | Expr<Name>
  | Bool<Name>
  | Arith<Name>
  | IntNum<Name>
  | RatNum<Name>
  | BitVec<number, Name>
  | BitVecNum<number, Name>;
/** @hidden */
export type AnyAst<Name extends string = any> = AnyExpr<Name> | AnySort<Name> | FuncDecl<Name>;

/** @hidden */
export type SortToExprMap<S extends AnySort<Name>, Name extends string = any> = S extends BoolSort
  ? Bool<Name>
  : S extends ArithSort<Name>
  ? Arith<Name>
  : S extends BitVecSort<infer Size, Name>
  ? BitVec<Size, Name>
  : S extends Sort<Name>
  ? Expr<Name>
  : never;

/** @hidden */
export type CoercibleToExprMap<S extends CoercibleToExpr<Name>, Name extends string = any> = S extends bigint
  ? IntNum<Name>
  : S extends number | CoercibleRational
  ? RatNum<Name>
  : S extends boolean
  ? Bool<Name>
  : S extends Expr<Name>
  ? S
  : never;

/**
 * Used to create a Real constant
 *
 * ```typescript
 * const x = from({ numerator: 1, denominator: 3 })
 *
 * x
 * // 1/3
 * isReal(x)
 * // true
 * isRealVal(x)
 * // true
 * x.asNumber()
 * // 0.3333333333333333
 * ```
 * @see {@link Context.from}
 * @category Global
 */
export type CoercibleRational = { numerator: bigint | number; denominator: bigint | number };

/** @hidden */
export type CoercibleToExpr<Name extends string = any> = number | bigint | boolean | CoercibleRational | Expr<Name>;

export class Z3Error extends Error {}
export class Z3AssertionError extends Z3Error {}

/**
 * Returned by {@link Solver.check} when Z3 could find a solution
 * @category Global
 */
export const sat = Symbol('Solver found a solution');
/**
 * Returned by {@link Solver.check} when Z3 couldn't find a solution
 * @category Global
 */
export const unsat = Symbol("Solver didn't find a solution");
/**
 * Returned by {@link Solver.check} when Z3 couldn't reason about the assumptions
 * @category Global
 */
export const unknown = Symbol("Solver couldn't reason about the assumptions");
/** @category Global */
export type CheckSatResult = typeof sat | typeof unsat | typeof unknown;

/** @hidden */
export interface ContextCtor {
  new <Name extends string>(name: Name, options?: Record<string, any>): Context<Name>;
}

export interface Context<Name extends string = any> {
  /** @hidden */
  readonly __typename: 'Context';

  /** @hidden */
  readonly ptr: Z3_context;
  /**
   * Name of the current Context
   *
   * ```typescript
   * const c = new Context('main')
   *
   * c.name
   * // 'main'
   * ```
   */
  readonly name: Name;

  ///////////////
  // Functions //
  ///////////////
  /** @category Functions */
  interrupt(): void;
  /** @category Functions */
  isModel(obj: unknown): obj is Model<Name>;
  /** @category Functions */
  isAst(obj: unknown): obj is Ast<Name>;
  /** @category Functions */
  isSort(obj: unknown): obj is Sort<Name>;
  /** @category Functions */
  isFuncDecl(obj: unknown): obj is FuncDecl<Name>;
  /** @category Functions */
  isApp(obj: unknown): boolean;
  /** @category Functions */
  isConst(obj: unknown): boolean;
  /** @category Functions */
  isExpr(obj: unknown): obj is Expr<Name>;
  /** @category Functions */
  isVar(obj: unknown): boolean;
  /** @category Functions */
  isAppOf(obj: unknown, kind: Z3_decl_kind): boolean;
  /** @category Functions */
  isBool(obj: unknown): obj is Bool<Name>;
  /** @category Functions */
  isTrue(obj: unknown): boolean;
  /** @category Functions */
  isFalse(obj: unknown): boolean;
  /** @category Functions */
  isAnd(obj: unknown): boolean;
  /** @category Functions */
  isOr(obj: unknown): boolean;
  /** @category Functions */
  isImplies(obj: unknown): boolean;
  /** @category Functions */
  isNot(obj: unknown): boolean;
  /** @category Functions */
  isEq(obj: unknown): boolean;
  /** @category Functions */
  isDistinct(obj: unknown): boolean;
  /** @category Functions */
  isArith(obj: unknown): obj is Arith<Name>;
  /** @category Functions */
  isArithSort(obj: unknown): obj is ArithSort<Name>;
  /** @category Functions */
  isInt(obj: unknown): boolean;
  /** @category Functions */
  isIntVal(obj: unknown): obj is IntNum<Name>;
  /** @category Functions */
  isIntSort(obj: unknown): boolean;
  /** @category Functions */
  isReal(obj: unknown): boolean;
  /** @category Functions */
  isRealVal(obj: unknown): obj is RatNum<Name>;
  /** @category Functions */
  isRealSort(obj: unknown): boolean;
  /** @category Functions */
  isBitVecSort(obj: unknown): obj is BitVecSort<number, Name>;
  /** @category Functions */
  isBitVec(obj: unknown): obj is BitVec<number, Name>;
  /** @category Functions */
  isBitVecVal(obj: unknown): obj is BitVecNum<number, Name>;
  /** @category Functions */
  isProbe(obj: unknown): obj is Probe<Name>;
  /** @category Functions */
  isTactic(obj: unknown): obj is Tactic<Name>;
  /** @category Functions */
  isAstVector(obj: unknown): obj is AstVector<AnyAst<Name>, Name>;
  /**
   * Returns whether two Asts are the same thing
   * @category Functions */
  eqIdentity(a: Ast<Name>, b: Ast<Name>): boolean;
  /** @category Functions */
  getVarIndex(obj: Expr<Name>): number;
  /**
   * Coerce a boolean into a Bool expression
   * @category Functions */
  from(primitive: boolean): Bool<Name>;
  /**
   * Coerce a number or rational into a Real expression
   * @category Functions */
  from(primitive: number | CoercibleRational): RatNum<Name>;
  /**
   * Coerce a big number into a Integer expression
   * @category Functions */
  from(primitive: bigint): IntNum<Name>;
  /**
   * Returns whatever expression was given
   * @category Functions */
  from<E extends Expr<Name>>(expr: E): E;
  /** @hidden */
  from(value: CoercibleToExpr<Name>): AnyExpr<Name>;
  /**
   * Sugar function for getting a model for given assertions
   *
   * ```typescript
   * const x = Int.const('x');
   * const y = Int.const('y');
   * const result = await solve(x.le(y));
   * if (isModel(result)) {
   *   console.log('Z3 found a solution');
   *   console.log(`x=${result.get(x)}, y=${result.get(y)}`);
   * } else {
   *   console.error('No solution found');
   * }
   * ```
   *
   * @see {@link Solver}
   * @category Functions */
  solve(...assertions: Bool[]): Promise<Model | typeof unsat | typeof unknown>;

  /////////////
  // Classes //
  /////////////
  /**
   * Creates a Solver
   * @param logic - Optional logic which the solver will use. Creates a general Solver otherwise
   * @category Classes
   */
  readonly Solver: new (logic?: string) => Solver<Name>;
  /**
   * Creates an empty Model
   * @see {@link Solver.model} for common usage of Model
   * @category Classes
   */
  readonly Model: new () => Model<Name>;
  /** @category Classes */
  readonly AstVector: new <Item extends Ast<Name> = AnyAst<Name>>() => AstVector<Item, Name>;
  /** @category Classes */
  readonly AstMap: new <Key extends Ast = AnyAst, Value extends Ast = AnyAst>() => AstMap<Key, Value, Name>;
  /** @category Classes */
  readonly Tactic: new (name: string) => Tactic<Name>;

  /////////////
  // Objects //
  /////////////
  /** @category Expressions */
  readonly Sort: SortCreation<Name>;
  /** @category Expressions */
  readonly Function: FuncDeclCreation<Name>;
  /** @category Expressions */
  readonly RecFunc: RecFuncCreation<Name>;
  /** @category Expressions */
  readonly Bool: BoolCreation<Name>;
  /** @category Expressions */
  readonly Int: IntCreation<Name>;
  /** @category Expressions */
  readonly Real: RealCreation<Name>;
  /** @category Expressions */
  readonly BitVec: BitVecCreation<Name>;

  ////////////////
  // Operations //
  ////////////////
  /** @category Operations */
  Const<S extends Sort<Name>>(name: string, sort: S): SortToExprMap<S, Name>;
  /** @category Operations */
  Consts<S extends Sort<Name>>(name: string | string[], sort: S): SortToExprMap<S, Name>[];
  /** @category Operations */
  FreshConst<S extends Sort<Name>>(sort: S, prefix?: string): SortToExprMap<S, Name>;
  /** @category Operations */
  Var<S extends Sort<Name>>(idx: number, sort: S): SortToExprMap<S, Name>;
  // Booleans
  /** @category Operations */
  If(condition: Probe<Name>, onTrue: Tactic<Name>, onFalse: Tactic<Name>): Tactic<Name>;
  /** @category Operations */
  If<OnTrueRef extends CoercibleToExpr<Name>, OnFalseRef extends CoercibleToExpr<Name>>(
    condition: Bool<Name> | boolean,
    onTrue: OnTrueRef,
    onFalse: OnFalseRef,
  ): CoercibleToExprMap<OnTrueRef | OnFalseRef, Name>;
  /** @category Operations */
  Distinct(...args: CoercibleToExpr<Name>[]): Bool<Name>;
  /** @category Operations */
  Implies(a: Bool<Name> | boolean, b: Bool<Name> | boolean): Bool<Name>;
  /** @category Operations */
  Eq(a: CoercibleToExpr<Name>, b: CoercibleToExpr<Name>): Bool<Name>;
  /** @category Operations */
  Xor(a: Bool<Name> | boolean, b: Bool<Name> | boolean): Bool<Name>;
  /** @category Operations */
  Not(a: Probe<Name>): Probe<Name>;
  /** @category Operations */
  Not(a: Bool<Name> | boolean): Bool<Name>;
  /** @category Operations */
  And(): Bool<Name>;
  /** @category Operations */
  And(vector: AstVector<Bool<Name>, Name>): Bool<Name>;
  /** @category Operations */
  And(...args: (Bool<Name> | boolean)[]): Bool<Name>;
  /** @category Operations */
  And(...args: Probe<Name>[]): Probe<Name>;
  /** @category Operations */
  Or(): Bool<Name>;
  /** @category Operations */
  Or(vector: AstVector<Bool<Name>, Name>): Bool<Name>;
  /** @category Operations */
  Or(...args: (Bool<Name> | boolean)[]): Bool<Name>;
  /** @category Operations */
  Or(...args: Probe<Name>[]): Probe<Name>;
  // Arithmetic
  /** @category Operations */
  ToReal(expr: Arith<Name> | bigint): Arith<Name>;
  /** @category Operations */
  ToInt(expr: Arith<Name> | number | CoercibleRational | string): Arith<Name>;
  /**
   * Create an IsInt Z3 predicate
   *
   * ```typescript
   * const x = Real.const('x');
   * await solve(IsInt(x.add("1/2")), x.gt(0), x.lt(1))
   * // x = 1/2
   * await solve(IsInt(x.add("1/2")), x.gt(0), x.lt(1), x.neq("1/2"))
   * // unsat
   * ```
   * @category Operations */
  IsInt(expr: Arith<Name> | number | CoercibleRational | string): Bool<Name>;
  /**
   * Returns a Z3 expression representing square root of a
   *
   * ```typescript
   * const a = Real.const('a');
   *
   * Sqrt(a);
   * // a**(1/2)
   * ```
   * @category Operations */
  Sqrt(a: Arith<Name> | number | bigint | string | CoercibleRational): Arith<Name>;
  /**
   * Returns a Z3 expression representing cubic root of a
   *
   * ```typescript
   * const a = Real.const('a');
   *
   * Cbrt(a);
   * // a**(1/3)
   * ```
   * @category Operations */
  Cbrt(a: Arith<Name> | number | bigint | string | CoercibleRational): Arith<Name>;
  // Bit Vectors
  /** @category Operations */
  BV2Int(a: BitVec<number, Name>, isSigned: boolean): Arith<Name>;
  /** @category Operations */
  Int2BV<Bits extends number>(a: Arith<Name> | bigint | number, bits: Bits): BitVec<Bits, Name>;
  /** @category Operations */
  Concat(...bitvecs: BitVec<number, Name>[]): BitVec<number, Name>;
}

export interface Ast<Name extends string = any, Ptr = unknown> {
  /** @hidden */
  readonly __typename: 'Ast' | Sort['__typename'] | FuncDecl['__typename'] | Expr['__typename'];

  readonly ctx: Context<Name>;
  /** @hidden */
  readonly ptr: Ptr;
  /** @virtual */
  get ast(): Z3_ast;
  /** @virtual */
  get id(): number;

  eqIdentity(other: Ast<Name>): boolean;
  neqIdentity(other: Ast<Name>): boolean;
  sexpr(): string;
  hash(): number;
}

/** @hidden */
export interface SolverCtor<Name extends string> {
  new (): Solver<Name>;
}
export interface Solver<Name extends string = any> {
  /** @hidden */
  readonly __typename: 'Solver';

  readonly ctx: Context<Name>;
  readonly ptr: Z3_solver;

  /* TODO(ritave): Decide on how to discern between integer and float parameters
  set(key: string, value: any): void;
  set(params: Record<string, any>): void;
  */
  push(): void;
  pop(num?: number): void;
  numScopes(): number;
  reset(): void;
  add(...exprs: (Bool<Name> | AstVector<Bool<Name>, Name>)[]): void;
  addAndTrack(expr: Bool<Name>, constant: Bool<Name> | string): void;
  assertions(): AstVector<Bool<Name>, Name>;
  check(...exprs: (Bool<Name> | AstVector<Bool<Name>, Name>)[]): Promise<CheckSatResult>;
  model(): Model<Name>;
}

/** @hidden */
export interface ModelCtor<Name extends string> {
  new (): Model<Name>;
}
export interface Model<Name extends string = any> extends Iterable<FuncDecl<Name>> {
  /** @hidden */
  readonly __typename: 'Model';

  readonly ctx: Context<Name>;
  readonly ptr: Z3_model;

  get length(): number;

  entries(): IterableIterator<[number, FuncDecl<Name>]>;
  keys(): IterableIterator<number>;
  values(): IterableIterator<FuncDecl<Name>>;
  decls(): FuncDecl<Name>[];
  sexpr(): string;
  eval(expr: Bool<Name>, modelCompletion?: boolean): Bool<Name>;
  eval(expr: Arith<Name>, modelCompletion?: boolean): Arith<Name>;
  eval(expr: Expr<Name>, modelCompletion?: boolean): Expr<Name>;
  get(i: number): FuncDecl<Name>;
  get(from: number, to: number): FuncDecl[];
  get(declaration: FuncDecl<Name>): FuncInterp<Name> | Expr<Name>;
  get(constant: Expr<Name>): Expr<Name>;
  get(sort: Sort<Name>): AstVector<AnyExpr<Name>, Name>;
}

/**
 * Part of {@link Context}. Used to declare uninterpreted sorts
 *
 * ```typescript
 * const A = context.Sort.declare('A');
 * const a = context.Const('a', A);
 * const b = context.const('b', A);
 *
 * a.sort.eqIdentity(A)
 * // true
 * b.sort.eqIdentity(A)
 * // true
 * a.eq(b)
 * // a == b
 * ```
 */
export interface SortCreation<Name extends string> {
  declare(name: string): Sort<Name>;
}
export interface Sort<Name extends string = any> extends Ast<Name, Z3_sort> {
  /** @hidden */
  readonly __typename: 'Sort' | BoolSort['__typename'] | ArithSort['__typename'] | BitVecSort['__typename'];

  kind(): Z3_sort_kind;
  /** @virtual */
  subsort(other: Sort<Name>): boolean;
  /** @virtual */
  cast(expr: CoercibleToExpr<Name>): Expr<Name>;
  name(): string | number;
}

/**
 * @category Functions
 */
export interface FuncInterp<Name extends string = any> {
  /** @hidden */
  readonly __typename: 'FuncInterp';

  readonly ctx: Context<Name>;
  readonly ptr: Z3_func_interp;
}

/** @hidden */
export type FuncDeclSignature<Name extends string> = [Sort<Name>, Sort<Name>, ...Sort<Name>[]];
/**
 * Part of {@link Context}. Used to declare functions
 * @category Functions
 */
export interface FuncDeclCreation<Name extends string> {
  /**
   * Declare a new function
   *
   * ```typescript
   * const f = ctx.Function.declare('f', ctx.Bool.sort(), ctx.Real.sort(), ctx.Int.sort())
   *
   * f.call(true, "1/3").eq(5)
   * // f(true, 1/3) == 5
   * ```
   * @param name Name of the function
   * @param signature The domains, and last parameter - the range of the function
   */
  declare(name: string, ...signature: FuncDeclSignature<Name>): FuncDecl<Name>;
  fresh(...signature: FuncDeclSignature<Name>): FuncDecl<Name>;
}
/**
 * @category Functions
 */
export interface RecFuncCreation<Name extends string> {
  declare(name: string, ...signature: FuncDeclSignature<Name>): FuncDecl<Name>;
  addDefinition(f: FuncDecl<Name>, args: Expr<Name>[], body: Expr<Name>): void;
}
/**
 * @category Functions
 */
export interface FuncDecl<Name extends string = any> extends Ast<Name, Z3_func_decl> {
  /** @hidden */
  readonly __typename: 'FuncDecl';

  name(): string | number;
  arity(): number;
  domain(i: number): Sort<Name>;
  range(): Sort<Name>;
  kind(): Z3_decl_kind;
  params(): (number | string | Z3_symbol | Sort<Name> | Expr<Name> | FuncDecl<Name>)[];
  call(...args: CoercibleToExpr<Name>[]): AnyExpr<Name>;
}

export interface Expr<Name extends string = any, S extends Sort<Name> = AnySort<Name>, Ptr = unknown>
  extends Ast<Name, Ptr> {
  /** @hidden */
  readonly __typename: 'Expr' | Bool['__typename'] | Arith['__typename'] | BitVec['__typename'];

  get sort(): S;

  eq(other: CoercibleToExpr<Name>): Bool<Name>;
  neq(other: CoercibleToExpr<Name>): Bool<Name>;
  params(): ReturnType<FuncDecl<Name>['params']>;
  decl(): FuncDecl<Name>;
  numArgs(): number;
  arg(i: number): AnyExpr<Name>;
  children(): AnyExpr<Name>[];
}

/** @category Booleans */
export interface BoolSort<Name extends string = any> extends Sort<Name> {
  /** @hidden */
  readonly __typename: 'BoolSort';

  cast(expr: Bool<Name> | boolean): Bool<Name>;
  cast(expr: CoercibleToExpr<Name>): never;
}
/** @category Booleans */
export interface BoolCreation<Name extends string = any> {
  sort(): BoolSort<Name>;

  const(name: string): Bool<Name>;
  consts(names: string | string[]): Bool<Name>[];
  vector(prefix: string, count: number): Bool<Name>[];
  fresh(prefix?: string): Bool<Name>;

  val(value: boolean): Bool<Name>;
}
/** @category Booleans */
export interface Bool<Name extends string = any> extends Expr<Name, BoolSort<Name>, Z3_ast> {
  /** @hidden */
  readonly __typename: 'Bool';

  not(): Bool<Name>;
  and(other: Bool<Name> | boolean): Bool<Name>;
  or(other: Bool<Name> | boolean): Bool<Name>;
  xor(other: Bool<Name> | boolean): Bool<Name>;
}

/**
 * A Sort that represents Integers or Real numbers
 * @category Arithmetic
 */
export interface ArithSort<Name extends string = any> extends Sort<Name> {
  /** @hidden */
  readonly __typename: 'ArithSort';

  cast(other: bigint | number | string): IntNum<Name> | RatNum<Name>;
  cast(other: CoercibleRational | RatNum<Name>): RatNum<Name>;
  cast(other: IntNum<Name>): IntNum<Name>;
  cast(other: bigint | number | string | Bool<Name> | Arith<Name> | CoercibleRational): Arith<Name>;
  cast(other: CoercibleToExpr<Name> | string): never;
}
/** @category Arithmetic */
export interface IntCreation<Name extends string> {
  sort(): ArithSort<Name>;

  const(name: string): Arith<Name>;
  consts(names: string | string[]): Arith<Name>[];
  vector(prefix: string, count: number): Arith<Name>[];
  fresh(prefix?: string): Arith<Name>;

  val(value: bigint | number | string): IntNum<Name>;
}
/** @category Arithmetic */
export interface RealCreation<Name extends string> {
  sort(): ArithSort<Name>;

  const(name: string): Arith<Name>;
  consts(names: string | string[]): Arith<Name>[];
  vector(prefix: string, count: number): Arith<Name>[];
  fresh(prefix?: string): Arith<Name>;

  val(value: number | string | bigint | CoercibleRational): RatNum<Name>;
}
/**
 * Represents Integer or Real number expression
 * @category Arithmetic
 */
export interface Arith<Name extends string = any> extends Expr<Name, ArithSort<Name>, Z3_ast> {
  /** @hidden */
  readonly __typename: 'Arith' | IntNum['__typename'] | RatNum['__typename'];

  /**
   * Adds two numbers together
   */
  add(other: Arith<Name> | number | bigint | string): Arith<Name>;
  /**
   * Multiplies two numbers together
   */
  mul(other: Arith<Name> | number | bigint | string): Arith<Name>;
  /**
   * Substract second number from the first one
   */
  sub(other: Arith<Name> | number | bigint | string): Arith<Name>;
  /**
   * Applies power to the number
   *
   * ```typescript
   * const x = Int.const('x');
   *
   * await solve(x.pow(2).eq(4), x.lt(0)); // x**2 == 4, x < 0
   * // x=-2
   * ```
   */
  pow(exponent: Arith<Name> | number | bigint | string): Arith<Name>;
  /**
   * Divides the number by the second one
   */
  div(other: Arith<Name> | number | bigint | string): Arith<Name>;
  /**
   * Returns a number modulo second one
   *
   * ```typescript
   * const x = Int.const('x');
   *
   * await solve(x.mod(7).eq(1), x.gt(7)) // x % 7 == 1, x > 7
   * // x=8
   * ```
   */
  mod(other: Arith<Name> | number | bigint | string): Arith<Name>;
  /**
   * Returns a negation of the number
   */
  neg(): Arith<Name>;
  /**
   * Return whether the number is less or equal than the second one (`<=`)
   */
  le(other: Arith<Name> | number | bigint | string): Bool<Name>;
  /**
   * Returns whether the number is less than the second one (`<`)
   */
  lt(other: Arith<Name> | number | bigint | string): Bool<Name>;
  /**
   * Returns whether the number is greater than the second one (`>`)
   */
  gt(other: Arith<Name> | number | bigint | string): Bool<Name>;
  /**
   * Returns whether the number is greater or equal than the second one (`>=`)
   */
  ge(other: Arith<Name> | number | bigint | string): Bool<Name>;
}

/**
 * A constant Integer value expression
 * @category Arithmetic
 */
export interface IntNum<Name extends string = any> extends Arith<Name> {
  /** @hidden */
  readonly __typename: 'IntNum';

  get value(): bigint;
  asString(): string;
  asBinary(): string;
}

/**
 * A constant Rational value expression
 *
 * ```typescript
 * const num = Real.val('1/3');
 *
 * num.asString()
 * // '1/3'
 * num.value
 * // { numerator: 1n, denominator: 3n }
 * num.asNumber()
 * // 0.3333333333333333
 * ```
 * @category Arithmetic
 */
export interface RatNum<Name extends string = any> extends Arith<Name> {
  /** @hidden */
  readonly __typename: 'RatNum';

  get value(): { numerator: bigint; denominator: bigint };
  numerator(): IntNum<Name>;
  denominator(): IntNum<Name>;
  asNumber(): number;
  asDecimal(prec?: number): string;
  asString(): string;
}

/**
 * A Sort represting Bit Vector numbers of specified {@link BitVecSort.size size}
 *
 * @typeParam Bits - A number representing amount of bits for this sort
 * @category Bit Vectors
 */
export interface BitVecSort<Bits extends number = number, Name extends string = any> extends Sort<Name> {
  /** @hidden */
  readonly __typename: 'BitVecSort';

  /**
   * The amount of bits inside the sort
   *
   * ```typescript
   * const x = BitVec.const('x', 32);
   *
   * console.log(x.sort.size)
   * // 32
   * ```
   */
  get size(): Bits;

  cast(other: CoercibleToBitVec<Bits, Name>): BitVec<Bits, Name>;
  cast(other: CoercibleToExpr<Name>): Expr<Name>;
}

/** @hidden */
export type CoercibleToBitVec<Bits extends number = number, Name extends string = any> =
  | bigint
  | number
  | BitVec<Bits, Name>;
/** @category Bit Vectors */
export interface BitVecCreation<Name extends string> {
  sort<Bits extends number = number>(bits: Bits): BitVecSort<Bits, Name>;

  const<Bits extends number = number>(name: string, bits: Bits | BitVecSort<Bits, Name>): BitVec<Bits, Name>;
  consts<Bits extends number = number>(
    names: string | string[],
    bits: Bits | BitVecSort<Bits, Name>,
  ): BitVec<Bits, Name>[];

  val<Bits extends number = number>(
    value: bigint | number | boolean,
    bits: Bits | BitVecSort<Bits, Name>,
  ): BitVecNum<Bits, Name>;
}
/**
 * Represents Bit Vector expression
 * @category Bit Vectors
 */
export interface BitVec<Bits extends number = number, Name extends string = any>
  extends Expr<Name, BitVecSort<Bits, Name>, Z3_ast> {
  /** @hidden */
  readonly __typename: 'BitVec' | BitVecNum['__typename'];

  /**
   * The amount of bits of this BitVectors sort
   *
   * ```typescript
   * const x = BitVec.const('x', 32);
   *
   * x.size
   * // 32
   *
   * const Y = BitVec.sort(8);
   * const y = BitVec.const('y', Y);
   *
   * y.size
   * // 8
   * ```
   */
  get size(): Bits;

  /** @category Arithmetic */
  add(other: CoercibleToBitVec<Bits, Name>): BitVec<Bits, Name>;
  /** @category Arithmetic */
  mul(other: CoercibleToBitVec<Bits, Name>): BitVec<Bits, Name>;
  /** @category Arithmetic */
  sub(other: CoercibleToBitVec<Bits, Name>): BitVec<Bits, Name>;
  /** @category Arithmetic */
  sdiv(other: CoercibleToBitVec<Bits, Name>): BitVec<Bits, Name>;
  /** @category Arithmetic */
  udiv(other: CoercibleToBitVec<Bits, Name>): BitVec<Bits, Name>;
  /** @category Arithmetic */
  smod(other: CoercibleToBitVec<Bits, Name>): BitVec<Bits, Name>;
  /** @category Arithmetic */
  urem(other: CoercibleToBitVec<Bits, Name>): BitVec<Bits, Name>;
  /** @category Arithmetic */
  srem(other: CoercibleToBitVec<Bits, Name>): BitVec<Bits, Name>;
  /** @category Arithmetic */
  neg(): BitVec<Bits, Name>;

  /**
   * Creates a bitwise-or between two bitvectors
   * @category4 Bitwise
   */
  or(other: CoercibleToBitVec<Bits, Name>): BitVec<Bits, Name>;
  /**
   * Creates a bitwise-and between two bitvectors
   * @category Bitwise
   */
  and(other: CoercibleToBitVec<Bits, Name>): BitVec<Bits, Name>;
  /**
   * Creates a bitwise-not-and between two bitvectors
   * @category Bitwise
   */
  nand(other: CoercibleToBitVec<Bits, Name>): BitVec<Bits, Name>;
  /**
   * Creates a bitwise-exclusive-or between two bitvectors
   * @category Bitwise
   */
  xor(other: CoercibleToBitVec<Bits, Name>): BitVec<Bits, Name>;
  /**
   * Creates a bitwise-exclusive-not-or between two bitvectors
   * @category Bitwise
   */
  xnor(other: CoercibleToBitVec<Bits, Name>): BitVec<Bits, Name>;
  /**
   * Creates an arithmetic shift right operation
   * @category Bitwise
   */
  shr(count: CoercibleToBitVec<Bits, Name>): BitVec<Bits, Name>;
  /**
   * Creates a logical shift right operation
   * @category Bitwise
   */
  lshr(count: CoercibleToBitVec<Bits, Name>): BitVec<Bits, Name>;
  /**
   * Creates a shift left operation
   * @category Bitwise
   */
  shl(count: CoercibleToBitVec<Bits, Name>): BitVec<Bits, Name>;
  /**
   * Creates a rotate right operation
   * @category Bitwise
   */
  rotateRight(count: CoercibleToBitVec<number, Name>): BitVec<Bits, Name>;
  /**
   * Creates a rotate left operation
   * @category Bitwise
   */
  rotateLeft(count: CoercibleToBitVec<number, Name>): BitVec<Bits, Name>;
  /**
   * Creates a bitwise not operation
   * @category Bitwise
   */
  not(): BitVec<Bits, Name>;

  /**
   * Creates an extraction operation.
   * Bits are indexed starting from 1 from the most right one (least significant) increasing to left (most significant)
   *
   * ```typescript
   * const x = BitVec.const('x', 8);
   *
   * x.extract(6, 2)
   * // Extract(6, 2, x)
   * x.extract(6, 2).sort
   * // BitVec(5)
   * ```
   * @param high The most significant bit to be extracted
   * @param low  The least significant bit to be extracted
   */
  extract(high: number, low: number): BitVec<number, Name>;
  signExt(count: number): BitVec<number, Name>;
  zeroExt(count: number): BitVec<number, Name>;
  repeat(count: number): BitVec<number, Name>;

  /**
   * Creates a signed less-or-equal operation (`<=`)
   * @category Comparision
   */
  sle(other: CoercibleToBitVec<Bits, Name>): Bool<Name>;
  /**
   * Creates an unsigned less-or-equal operation (`<=`)
   * @category Comparision
   */
  ule(other: CoercibleToBitVec<Bits, Name>): Bool<Name>;
  /**
   * Creates a signed less-than operation (`<`)
   * @category Comparision
   */
  slt(other: CoercibleToBitVec<Bits, Name>): Bool<Name>;
  /**
   * Creates an unsigned less-than operation (`<`)
   * @category Comparision
   */
  ult(other: CoercibleToBitVec<Bits, Name>): Bool<Name>;
  /**
   * Creates a signed greater-or-equal operation (`>=`)
   * @category Comparision
   */
  sge(other: CoercibleToBitVec<Bits, Name>): Bool<Name>;
  /**
   * Creates an unsigned greater-or-equal operation (`>=`)
   * @category Comparision
   */
  uge(other: CoercibleToBitVec<Bits, Name>): Bool<Name>;
  /**
   * Creates a signed greater-than operation (`>`)
   * @category Comparision
   */
  sgt(other: CoercibleToBitVec<Bits, Name>): Bool<Name>;
  /**
   * Creates an unsigned greater-than operation (`>`)
   * @category Comparision
   */
  ugt(other: CoercibleToBitVec<Bits, Name>): Bool<Name>;

  /**
   * Creates a reduction-and operation
   */
  redAnd(): BitVec<number, Name>;
  /**
   * Creates a reduction-or operation
   */
  redOr(): BitVec<number, Name>;

  /** @category Boolean */
  addNoOverflow(other: CoercibleToBitVec<Bits, Name>, isSigned: boolean): Bool<Name>;
  /** @category Boolean */
  addNoUnderflow(other: CoercibleToBitVec<Bits, Name>): Bool<Name>;
  /** @category Boolean */
  subNoOverflow(other: CoercibleToBitVec<Bits, Name>): Bool<Name>;
  /** @category Boolean */
  subNoUndeflow(other: CoercibleToBitVec<Bits, Name>, isSigned: boolean): Bool<Name>;
  /** @category Boolean */
  sdivNoOverflow(other: CoercibleToBitVec<Bits, Name>): Bool<Name>;
  /** @category Boolean */
  mulNoOverflow(other: CoercibleToBitVec<Bits, Name>, isSigned: boolean): Bool<Name>;
  /** @category Boolean */
  mulNoUndeflow(other: CoercibleToBitVec<Bits, Name>): Bool<Name>;
  /** @category Boolean */
  negNoOverflow(): Bool<Name>;
}

/**
 * Represents Bit Vector constant value
 * @category Bit Vectors
 */
export interface BitVecNum<Bits extends number = number, Name extends string = any> extends BitVec<Bits, Name> {
  /** @hidden */
  readonly __typename: 'BitVecNum';

  get value(): bigint;
  asSignedValue(): bigint;
  asString(): string;
  asBinaryString(): string;
}

export interface Probe<Name extends string = any> {
  /** @hidden */
  readonly __typename: 'Probe';

  readonly ctx: Context<Name>;
  readonly ptr: Z3_probe;
}

/** @hidden */
export interface TacticCtor<Name extends string> {
  new (name: string): Tactic<Name>;
}
export interface Tactic<Name extends string = any> {
  /** @hidden */
  readonly __typename: 'Tactic';

  readonly ctx: Context<Name>;
  readonly ptr: Z3_tactic;
}

/** @hidden */
export interface AstVectorCtor<Name extends string> {
  new <Item extends Ast<Name> = AnyAst<Name>>(): AstVector<Item, Name>;
}
/**
 * Stores multiple {@link Ast} objects
 *
 * ```typescript
 * const vector = new AstVector<Bool>();
 * vector.push(Bool.val(5));
 * vector.push(Bool.const('x'))
 *
 * vector.length
 * // 2
 * vector.get(1)
 * // x
 * [...vector.values()]
 * // [2, x]
 * ```
 */
export interface AstVector<Item extends Ast<Name> = AnyAst, Name extends string = any> extends Iterable<Item> {
  /** @hidden */
  readonly __typename: 'AstVector';

  readonly ctx: Context<Name>;
  readonly ptr: Z3_ast_vector;
  get length(): number;

  entries(): IterableIterator<[number, Item]>;
  keys(): IterableIterator<number>;
  values(): IterableIterator<Item>;
  get(i: number): Item;
  get(from: number, to: number): Item[];
  set(i: number, v: Item): void;
  push(v: Item): void;
  resize(size: number): void;
  has(v: Item): boolean;
  sexpr(): string;
}

/** @hidden */
export interface AstMapCtor<Name extends string> {
  new <Key extends Ast = AnyAst, Value extends Ast = AnyAst>(): AstMap<Key, Value, Name>;
}
/**
 * Stores a mapping between different {@link Ast} objects
 *
 * ```typescript
 * const map = new Map<Arith, Bool>();
 * const x = Int.const('x')
 * const y = Int.const('y')
 * map.set(x, Bool.val(true))
 * map.Set(y, Bool.val(false))
 *
 * map.size
 * // 2
 * map.has(x)
 * // true
 * [...map.entries()]
 * // [[x, true], [y, false]]
 * map.clear()
 * map.size
 * // 0
 * ```
 */
export interface AstMap<Key extends Ast<Name> = AnyAst, Value extends Ast = AnyAst, Name extends string = any>
  extends Iterable<[Key, Value]> {
  /** @hidden */
  readonly __typename: 'AstMap';

  readonly ctx: Context<Name>;
  readonly ptr: Z3_ast_map;
  get size(): number;

  entries(): IterableIterator<[Key, Value]>;
  keys(): AstVector<Key, Name>;
  values(): IterableIterator<Value>;
  get(key: Key): Value | undefined;
  set(key: Key, value: Value): void;
  delete(key: Key): void;
  clear(): void;
  has(key: Key): boolean;
  sexpr(): string;
}

/**
 * @category Global
 */
export interface Z3HighLevel {
  // Global functions
  enableTrace(tag: string): void;
  disableTrace(tag: string): void;
  getVersion(): {
    major: number;
    minor: number;
    build_number: number;
    revision_number: number;
  };
  getVersionString(): string;
  getFullVersion(): string;
  openLog(filename: string): boolean;
  appendLog(s: string): void;
  /**
   * Set a Z3 parameter
   *
   * ```typescript
   * setParam('pp.decimal', true);
   * ```
   */
  setParam(key: string, value: any): void;
  /**
   * Set multiple Z3 parameters at once
   *
   * ```typescript
   * setParam({
   *   'pp.decimal': true,
   *   'pp.decimal_precision': 20
   * });
   * ```
   */
  setParam(key: Record<string, any>): void;
  /**
   * Resets all Z3 parameters
   */
  resetParams(): void;
  /**
   * Returns a global Z3 parameter
   */
  getParam(name: string): string | null;

  /**
   * Returns whether the given object is a {@link Context}
   */
  isContext(obj: unknown): obj is Context;

  /**
   * Use this to create new contexts
   * @see {@link Context}
   */
  readonly Context: ContextCtor;
}
