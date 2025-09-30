/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getBudget = /* GraphQL */ `query GetBudget($id: ID!) {
  getBudget(id: $id) {
    budget
    createdAt
    id
    month
    partner
    updatedAt
    year
    __typename
  }
}
` as GeneratedQuery<APITypes.GetBudgetQueryVariables, APITypes.GetBudgetQuery>;
export const getDriver = /* GraphQL */ `query GetDriver($id: ID!) {
  getDriver(id: $id) {
    aadharNumber
    createdAt
    id
    isActive
    licenseNumber
    maxLoad
    name
    partner
    phoneNumber
    updatedAt
    vehicleNumber
    vehicleSize
    __typename
  }
}
` as GeneratedQuery<APITypes.GetDriverQueryVariables, APITypes.GetDriverQuery>;
export const getTodo = /* GraphQL */ `query GetTodo($id: ID!) {
  getTodo(id: $id) {
    createdAt
    customId
    customerName
    driverName
    expense
    fromLocation
    id
    maxLoad
    notes
    partner
    startDate
    status
    toLocation
    updatedAt
    vehicleNumber
    vehicleSize
    __typename
  }
}
` as GeneratedQuery<APITypes.GetTodoQueryVariables, APITypes.GetTodoQuery>;
export const listBudgets = /* GraphQL */ `query ListBudgets(
  $filter: ModelBudgetFilterInput
  $limit: Int
  $nextToken: String
) {
  listBudgets(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      budget
      createdAt
      id
      month
      partner
      updatedAt
      year
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBudgetsQueryVariables,
  APITypes.ListBudgetsQuery
>;
export const listDrivers = /* GraphQL */ `query ListDrivers(
  $filter: ModelDriverFilterInput
  $limit: Int
  $nextToken: String
) {
  listDrivers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      aadharNumber
      createdAt
      id
      isActive
      licenseNumber
      maxLoad
      name
      partner
      phoneNumber
      updatedAt
      vehicleNumber
      vehicleSize
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListDriversQueryVariables,
  APITypes.ListDriversQuery
>;
export const listTodos = /* GraphQL */ `query ListTodos(
  $filter: ModelTodoFilterInput
  $limit: Int
  $nextToken: String
) {
  listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      customId
      customerName
      driverName
      expense
      fromLocation
      id
      maxLoad
      notes
      partner
      startDate
      status
      toLocation
      updatedAt
      vehicleNumber
      vehicleSize
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListTodosQueryVariables, APITypes.ListTodosQuery>;
