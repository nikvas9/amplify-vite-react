/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateBudget = /* GraphQL */ `subscription OnCreateBudget($filter: ModelSubscriptionBudgetFilterInput) {
  onCreateBudget(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateBudgetSubscriptionVariables,
  APITypes.OnCreateBudgetSubscription
>;
export const onCreateDriver = /* GraphQL */ `subscription OnCreateDriver($filter: ModelSubscriptionDriverFilterInput) {
  onCreateDriver(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateDriverSubscriptionVariables,
  APITypes.OnCreateDriverSubscription
>;
export const onCreateTodo = /* GraphQL */ `subscription OnCreateTodo($filter: ModelSubscriptionTodoFilterInput) {
  onCreateTodo(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateTodoSubscriptionVariables,
  APITypes.OnCreateTodoSubscription
>;
export const onDeleteBudget = /* GraphQL */ `subscription OnDeleteBudget($filter: ModelSubscriptionBudgetFilterInput) {
  onDeleteBudget(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteBudgetSubscriptionVariables,
  APITypes.OnDeleteBudgetSubscription
>;
export const onDeleteDriver = /* GraphQL */ `subscription OnDeleteDriver($filter: ModelSubscriptionDriverFilterInput) {
  onDeleteDriver(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteDriverSubscriptionVariables,
  APITypes.OnDeleteDriverSubscription
>;
export const onDeleteTodo = /* GraphQL */ `subscription OnDeleteTodo($filter: ModelSubscriptionTodoFilterInput) {
  onDeleteTodo(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteTodoSubscriptionVariables,
  APITypes.OnDeleteTodoSubscription
>;
export const onUpdateBudget = /* GraphQL */ `subscription OnUpdateBudget($filter: ModelSubscriptionBudgetFilterInput) {
  onUpdateBudget(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateBudgetSubscriptionVariables,
  APITypes.OnUpdateBudgetSubscription
>;
export const onUpdateDriver = /* GraphQL */ `subscription OnUpdateDriver($filter: ModelSubscriptionDriverFilterInput) {
  onUpdateDriver(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateDriverSubscriptionVariables,
  APITypes.OnUpdateDriverSubscription
>;
export const onUpdateTodo = /* GraphQL */ `subscription OnUpdateTodo($filter: ModelSubscriptionTodoFilterInput) {
  onUpdateTodo(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateTodoSubscriptionVariables,
  APITypes.OnUpdateTodoSubscription
>;
