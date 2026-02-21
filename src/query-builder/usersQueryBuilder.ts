import { BaseQueryBuilder } from "./baseQueryBuilder";
import { USER_FILTERS, USER_SORT_FIELDS } from "../types/filters";

export type UserFilterField = keyof typeof USER_FILTERS;
export type UserSortField = (typeof USER_SORT_FIELDS)[number];
type UserTextOperator = "eq" | "neq" | "contains" | "ncontains" | "starts" | "nstarts" | "ends" | "nends";
type UserBooleanOperator = "eq" | "neq";
type UserRolesOperator = "any" | "nany" | "all";

export class UsersQueryBuilder extends BaseQueryBuilder<UserSortField> {
  public constructor() {
    super();
  }

  public firstName(value: string, operator: UserTextOperator = "eq"): this {
    return this.filter("firstName", operator, value);
  }

  public lastName(value: string, operator: UserTextOperator = "eq"): this {
    return this.filter("lastName", operator, value);
  }

  public username(value: string, operator: UserTextOperator = "eq"): this {
    return this.filter("username", operator, value);
  }

  public email(value: string, operator: UserTextOperator = "eq"): this {
    return this.filter("email", operator, value);
  }

  public mobilePhone(value: string, operator: UserTextOperator = "eq"): this {
    return this.filter("mobilePhone", operator, value);
  }

  public isActive(value: boolean, operator: UserBooleanOperator = "eq"): this {
    return this.filter("isActive", operator, value);
  }

  public roles(value: string | string[], operator: UserRolesOperator = "any"): this {
    return this.filter("roles", operator, value);
  }
}

export function usersQuery(): UsersQueryBuilder {
  return new UsersQueryBuilder();
}
